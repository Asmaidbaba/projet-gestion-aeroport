from app import create_app, db
from app.models.booking import Booking
from app.models.flight import Flight
from flask import request, jsonify
from datetime import datetime
import json
from sqlalchemy import or_, func
from flask_cors import CORS

# Create the Flask app first!
app = create_app()


cors = CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})


# ===== FLIGHT SEARCH & SELECTION =====

@app.route('/api/flights/search', methods=['GET'])
def search_flights():
    """Search for flights based on criteria"""
    try:
        departure = request.args.get('from', '')
        arrival = request.args.get('to', '')
        date = request.args.get('date')
        passengers = int(request.args.get('passengers', 1))
        
        if not all([departure, arrival, date]):
            return jsonify({'error': 'Missing required parameters: from, to, date'}), 400
        
        # Convert date string to datetime
        search_date = datetime.strptime(date, '%Y-%m-%d')
        
        # Search flights in database - using your actual column names
        flights = Flight.query.filter(
            db.or_(
                Flight.departure_airport.ilike(f'%{departure}%')
            ),
            db.or_(
                Flight.arrival_airport.ilike(f'%{arrival}%')
            ),
            db.func.date(Flight.departure_time) == search_date.date(),
            Flight.available_seats >= passengers,
            Flight.flight_status == 'SCHEDULED'  # Only show scheduled flights
        ).order_by(Flight.departure_time).all()
        
        return jsonify({
            'success': True,
            'flights': [flight.to_dict() for flight in flights],
            'search_params': {
                'from': departure,
                'to': arrival,
                'date': date,
                'passengers': passengers
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/flights/<int:flight_id>', methods=['GET'])
def get_flight_details(flight_id):
    """Get detailed information about a specific flight"""
    try:
        flight = Flight.query.get(flight_id)
        if not flight:
            return jsonify({'error': 'Flight not found'}), 404
        
        # Mapping aéroport -> ville
        airport_to_city = {
            'CMN': 'Casablanca', 'RAK': 'Marrakech', 'AGA': 'Agadir',
            'FEZ': 'Fès', 'TNG': 'Tanger', 'CDG': 'Paris', 
            'ORY': 'Paris', 'MAD': 'Madrid', 'BCN': 'Barcelone'
        }
        
        # Formater la réponse
        flight_data = flight.to_dict()
        flight_data['departure_city'] = airport_to_city.get(flight.departure_airport, flight.departure_airport)
        flight_data['arrival_city'] = airport_to_city.get(flight.arrival_airport, flight.arrival_airport)
        
        return jsonify({
            'success': True,
            'flight': flight_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ===== BAGGAGE OPTIONS =====

@app.route('/api/flights/<int:flight_id>/baggage', methods=['GET'])
def get_baggage_options(flight_id):
    """Get baggage options for a flight"""
    try:
        flight = Flight.query.get(flight_id)
        if not flight:
            return jsonify({'error': 'Flight not found'}), 404
        
        baggage_options = [
            {
                'type': 'hand_baggage',
                'name': 'Bagage à main',
                'weight': '7kg',
                'dimensions': '55x40x20cm',
                'included': True,
                'price': 0
            },
            {
                'type': 'checked_baggage_23kg',
                'name': 'Bagage en soute - 23kg',
                'weight': '23kg',
                'dimensions': '158cm linéaire',
                'included': False,
                'price': 200.00
            },
            {
                'type': 'checked_baggage_32kg',
                'name': 'Bagage en soute - 32kg',
                'weight': '32kg',
                'dimensions': '158cm linéaire',
                'included': False,
                'price': 350.00
            },
            {
                'type': 'extra_baggage',
                'name': 'Bagage supplémentaire',
                'weight': '23kg',
                'dimensions': '158cm linéaire',
                'included': False,
                'price': 400.00
            }
        ]
        
        return jsonify({
            'success': True,
            'baggage_options': baggage_options,
            'flight': flight.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ===== BOOKING CREATION =====

@app.route('/api/flights/book', methods=['POST'])
def create_flight_booking():
    """Create a flight booking with passenger details"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['flight_id', 'passengers', 'contact_info', 'baggage_selection']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        flight = Flight.query.get(data['flight_id'])
        if not flight:
            return jsonify({'error': 'Flight not found'}), 404
        
        # Check seat availability
        passengers_count = len(data['passengers'])
        if flight.available_seats < passengers_count:
            return jsonify({'error': 'Not enough seats available'}), 400
        
        # Calculate total price
        base_price = flight.price * passengers_count
        baggage_price = calculate_baggage_price(data['baggage_selection'])
        total_price = base_price + baggage_price
        
        # Create booking
        booking = Booking(
            customer_name=data['contact_info']['full_name'],
            customer_email=data['contact_info']['email'],
            customer_phone=data['contact_info']['phone'],
            service_type='flight',
            service_details=json.dumps({
                'flight_details': flight.to_dict(),
                'passengers': data['passengers'],
                'baggage_selection': data['baggage_selection'],
                'booking_class': data.get('class', 'economy')
            }),
            booking_date=flight.departure_time,
            number_of_people=passengers_count,
            total_price=total_price
        )
        
        # Update available seats
        flight.available_seats -= passengers_count
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Flight booking created successfully',
            'booking': booking.to_dict(),
            'booking_reference': booking.booking_reference
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def calculate_baggage_price(baggage_selection):
    """Calculate total baggage price"""
    baggage_prices = {
        'hand_baggage': 0,
        'checked_baggage_23kg': 200,
        'checked_baggage_32kg': 350,
        'extra_baggage': 400
    }
    
    total = 0
    for baggage_type, count in baggage_selection.items():
        if count > 0:
            total += baggage_prices.get(baggage_type, 0) * count
    
    return total

# ===== CITIES & AIRPORTS =====

@app.route('/api/airports', methods=['GET'])
def get_airports():
    """Get list of available airports"""
    airports = [
        {'code': 'CMN', 'name': 'Aéroport Mohammed V', 'city': 'Casablanca', 'country': 'Maroc'},
        {'code': 'RAK', 'name': 'Aéroport Marrakech-Ménara', 'city': 'Marrakech', 'country': 'Maroc'},
        {'code': 'FEZ', 'name': 'Aéroport Fès-Saïss', 'city': 'Fès', 'country': 'Maroc'},
        {'code': 'TNG', 'name': 'Aéroport Tanger-Ibn Battouta', 'city': 'Tanger', 'country': 'Maroc'},
        {'code': 'CDG', 'name': 'Aéroport Charles de Gaulle', 'city': 'Paris', 'country': 'France'},
        {'code': 'ORY', 'name': 'Aéroport Paris-Orly', 'city': 'Paris', 'country': 'France'},
        {'code': 'MAD', 'name': 'Aéroport Madrid-Barajas', 'city': 'Madrid', 'country': 'Espagne'},
        {'code': 'BCN', 'name': 'Aéroport Barcelone-El Prat', 'city': 'Barcelone', 'country': 'Espagne'}
    ]
    
    return jsonify({
        'success': True,
        'airports': airports
    }), 200

# ===== SAMPLE DATA GENERATION =====

@app.route('/api/flights/populate', methods=['POST'])
def populate_sample_flights():
    """Populate sample flights for testing"""
    try:
        from datetime import datetime, timedelta
        import random
        
        # Clear existing flights
        Flight.query.delete()
        
        airlines = ['Royal Air Maroc', 'Air France', 'Air Arabia', 'Emirates', 'Turkish Airlines']
        routes = [
            ('Casablanca', 'CMN', 'Paris', 'CDG'),
            ('Casablanca', 'CMN', 'Marrakech', 'RAK'),
            ('Casablanca', 'CMN', 'Fès', 'FEZ'),
            ('Casablanca', 'CMN', 'Madrid', 'MAD'),
            ('Marrakech', 'RAK', 'Paris', 'CDG'),
            ('Marrakech', 'RAK', 'Casablanca', 'CMN'),
            ('Fès', 'FEZ', 'Paris', 'ORY'),
            ('Paris', 'CDG', 'Casablanca', 'CMN')
        ]
        
        for i in range(20):
            departure_city, departure_airport, arrival_city, arrival_airport = random.choice(routes)
            
            # Random dates in next 30 days
            departure_time = datetime.now() + timedelta(
                days=random.randint(1, 30),
                hours=random.randint(6, 22)
            )
            
            # Flight duration 1-4 hours
            duration = random.randint(60, 240)
            arrival_time = departure_time + timedelta(minutes=duration)
            
            flight = Flight(
                flight_number=f"{random.choice(['AT', 'AF', '3O', 'EK', 'TK'])}{random.randint(100, 999)}",
                airline=random.choice(airlines),
                departure_city=departure_city,
                departure_airport=departure_airport,
                arrival_city=arrival_city,
                arrival_airport=arrival_airport,
                departure_time=departure_time,
                arrival_time=arrival_time,
                duration=duration,
                price=round(random.uniform(400, 2000), 2),
                available_seats=random.randint(5, 50),
                aircraft_type=random.choice(['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A330'])
            )
            
            db.session.add(flight)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sample flights populated successfully'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# ===== BASIC BOOKING ENDPOINTS =====

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['customer_name', 'customer_email', 'service_type', 'booking_date', 'total_price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        booking = Booking(
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data.get('customer_phone'),
            service_type=data['service_type'],
            service_details=json.dumps(data.get('service_details', {})),
            booking_date=datetime.fromisoformat(data['booking_date'].replace('Z', '+00:00')),
            number_of_people=data.get('number_of_people', 1),
            total_price=float(data['total_price'])
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Booking created successfully',
            'booking': booking.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/bookings', methods=['GET'])
def get_all_bookings():
    """Get all bookings"""
    try:
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'bookings': [booking.to_dict() for booking in bookings],
            'count': len(bookings)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/bookings/<string:booking_reference>', methods=['GET'])
def get_booking(booking_reference):
    """Get a specific booking by reference"""
    try:
        booking = Booking.query.filter_by(booking_reference=booking_reference).first()
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        return jsonify({
            'success': True,
            'booking': booking.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'AeroSmart API is running'})

if __name__ == '__main__':
    print("🚀 AeroSmart Flight Booking API Running...")
    app.run(debug=True, host='0.0.0.0', port=5000)
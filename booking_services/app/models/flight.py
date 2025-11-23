from app import db
from datetime import datetime

class Flight(db.Model):
    __tablename__ = 'flights'
    
    # Vos colonnes existantes
    id = db.Column(db.BigInteger, primary_key=True)
    flight_number = db.Column(db.String(10))
    departure_airport = db.Column(db.String(50))
    arrival_airport = db.Column(db.String(50))
    departure_time = db.Column(db.DateTime)
    arrival_time = db.Column(db.DateTime)
    price = db.Column(db.Float)
    available_seats = db.Column(db.Integer)
    capacity = db.Column(db.Integer)
    flight_status = db.Column(db.String(20))
    boarding_gate = db.Column(db.String(10))
    boarding_start = db.Column(db.DateTime)
    boarding_end = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'flight_number': self.flight_number,
            'departure_airport': self.departure_airport,
            'arrival_airport': self.arrival_airport,
            'departure_time': self.departure_time.isoformat() if self.departure_time else None,
            'arrival_time': self.arrival_time.isoformat() if self.arrival_time else None,
            'price': self.price,
            'available_seats': self.available_seats,
            'capacity': self.capacity,
            'flight_status': self.flight_status,
            'boarding_gate': self.boarding_gate,
            'boarding_start': self.boarding_start.isoformat() if self.boarding_start else None,
            'boarding_end': self.boarding_end.isoformat() if self.boarding_end else None
        }
    
    def __repr__(self):
        return f'<Flight {self.flight_number} {self.departure_airport}->{self.arrival_airport}>'
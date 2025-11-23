from app import db
from datetime import datetime
import random
import string
import json

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_reference = db.Column(db.String(10), unique=True, nullable=False)
    
    # Customer information - EXACTEMENT CE QUE VOUS AVEZ
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(20))
    
    # Service information - EXACTEMENT CE QUE VOUS AVEZ
    service_type = db.Column(db.String(50), nullable=False)
    service_details = db.Column(db.Text)  # JSON string
    
    # Booking details - EXACTEMENT CE QUE VOUS AVEZ
    booking_date = db.Column(db.DateTime, nullable=False)
    number_of_people = db.Column(db.Integer, nullable=False, default=1)
    total_price = db.Column(db.Float, nullable=False)
    
    # Status - EXACTEMENT CE QUE VOUS AVEZ
    status = db.Column(db.String(20), default='confirmed')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.booking_reference:
            self.booking_reference = self.generate_booking_reference()
    
    def generate_booking_reference(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    
    def get_service_details_dict(self):
        """Parse service_details JSON string to dict"""
        try:
            return json.loads(self.service_details) if self.service_details else {}
        except:
            return {}
    
    # NOUVELLES MÉTHODES UTILITAIRES POUR LES VOLS
    def get_flight_info(self):
        """Récupère les infos du vol depuis service_details"""
        details = self.get_service_details_dict()
        return details.get('flight_info', {})
    
    def get_passengers_list(self):
        """Récupère la liste des passagers"""
        details = self.get_service_details_dict()
        return details.get('passengers', [])
    
    def get_baggage_info(self):
        """Récupère la sélection des bagages"""
        details = self.get_service_details_dict()
        return details.get('baggage_selection', {})
    
    def get_search_params(self):
        """Récupère les paramètres de recherche initiaux"""
        details = self.get_service_details_dict()
        return details.get('search_info', {})
    
    def get_price_details(self):
        """Récupère le détail des prix"""
        details = self.get_service_details_dict()
        return details.get('price_breakdown', {})
    
    def get_travel_class(self):
        """Récupère la classe de voyage"""
        details = self.get_service_details_dict()
        return details.get('travel_class', 'economy')
    
    def is_flight_booking(self):
        """Vérifie si c'est une réservation de vol"""
        return self.service_type == 'flight'
    
    def get_contact_passenger(self):
        """Récupère le passager principal/contact"""
        passengers = self.get_passengers_list()
        if passengers:
            return passengers[0]  # Premier passager = contact
        return {
            'first_name': self.customer_name.split(' ')[0] if self.customer_name else '',
            'last_name': ' '.join(self.customer_name.split(' ')[1:]) if self.customer_name else '',
            'email': self.customer_email,
            'phone': self.customer_phone
        }
    
    def to_dict(self):
        """VERSION ORIGINALE - EXACTEMENT CE QUE VOUS AVEZ"""
        return {
            'id': self.id,
            'booking_reference': self.booking_reference,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'service_type': self.service_type,
            'service_details': self.get_service_details_dict(),
            'booking_date': self.booking_date.isoformat() if self.booking_date else None,
            'number_of_people': self.number_of_people,
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def to_extended_dict(self):
        """Version étendue avec les données structurées (optionnel)"""
        base_data = self.to_dict()
        
        if self.is_flight_booking():
            base_data.update({
                'flight_info': self.get_flight_info(),
                'passengers': self.get_passengers_list(),
                'baggage_selection': self.get_baggage_info(),
                'search_info': self.get_search_params(),
                'price_breakdown': self.get_price_details(),
                'travel_class': self.get_travel_class(),
                'contact_passenger': self.get_contact_passenger()
            })
        
        return base_data
    
    def __repr__(self):
        return f'<Booking {self.booking_reference} - {self.customer_name}>'
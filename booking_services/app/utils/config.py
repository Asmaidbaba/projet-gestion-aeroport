import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'aer0smart-s3cr3t-k3y'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-s3cr3t-k3y'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Aiven MySQL Configuration from environment variables
    MYSQL_HOST = os.environ.get('DB_HOST')
    MYSQL_PORT = os.environ.get('DB_PORT', '28391')
    MYSQL_USER = os.environ.get('DB_USER')
    MYSQL_PASSWORD = os.environ.get('DB_PASSWORD')
    MYSQL_DATABASE = os.environ.get('DB_NAME')
    
    # SSL Configuration for Aiven (you'll need to download these from Aiven console)
    MYSQL_SSL_CA = os.environ.get('MYSQL_SSL_CA', 'ssl/ca.pem')
    
    def get_db_uri(self):
        if not all([self.MYSQL_HOST, self.MYSQL_USER, self.MYSQL_PASSWORD, self.MYSQL_DATABASE]):
            raise ValueError("Missing required database configuration")
        
        base_uri = f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        
        # Add SSL parameters for Aiven
        if self.MYSQL_SSL_CA:
            base_uri += f"?ssl_ca={self.MYSQL_SSL_CA}&ssl_verify_cert=true"
        
        return base_uri
    
    SQLALCHEMY_DATABASE_URI = property(get_db_uri)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True,
        'connect_args': {
            'charset': 'utf8mb4'
        }
    }
    
    # CORS
    CORS_ORIGINS = ["http://localhost:3000"]

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if all required environment variables are set"""
    load_dotenv()
    
    required_vars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease add them to your .env file")
        return False
    
    print("✅ Environment variables loaded successfully")
    print(f"   Host: {os.getenv('DB_HOST')}")
    print(f"   Database: {os.getenv('DB_NAME')}")
    print(f"   User: {os.getenv('DB_USER')}")
    return True

def check_ssl_certificate():
    """Check if SSL certificate exists"""
    if os.path.exists('ca.pem'):
        print("✅ SSL certificate found: ca.pem")
        return True
    else:
        print("❌ SSL certificate not found: ca.pem")
        print("   Download it from Aiven console and save it as ca.pem")
        return False

def setup_database():
    """Create the booking table"""
    try:
        from app import create_app, db
        
        app = create_app()
        with app.app_context():
            print("📦 Creating booking table...")
            db.create_all()
            print("✅ Booking table created successfully!")
            print("✅ Database connection successful!")
            
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🚀 AeroSmart Database Setup")
    print("=" * 40)
    
    if not check_environment():
        sys.exit(1)
    
    if not check_ssl_certificate():
        sys.exit(1)
    
    print("\n📊 Setting up database...")
    if setup_database():
        print("\n🎉 Database setup completed successfully!")
        print("   Booking table is ready to use!")
    else:
        print("\n💥 Setup failed!")
        sys.exit(1)
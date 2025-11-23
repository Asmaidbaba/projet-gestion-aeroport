from app import create_app, db
from sqlalchemy import text

def check_flights_table():
    app = create_app()
    
    with app.app_context():
        try:
            print("🔍 Checking database connection...")
            
            # Test connection
            db.session.execute(text('SELECT 1'))
            print("✅ Database connection successful!")
            
            # Check if flights table exists
            result = db.session.execute(text("SHOW TABLES LIKE 'flights'"))
            table_exists = result.fetchone() is not None
            
            if table_exists:
                print("✅ Flights table exists!")
                
                # Check flights table structure
                result = db.session.execute(text("DESCRIBE flights"))
                columns = [(row[0], row[1]) for row in result]
                print("📋 Flights table structure:")
                for column_name, column_type in columns:
                    print(f"   - {column_name}: {column_type}")
                    
                # Check if there's any data
                result = db.session.execute(text("SELECT COUNT(*) FROM flights"))
                row_count = result.scalar()
                print(f"📊 Number of rows in flights table: {row_count}")
                
                # Show first few rows to see data structure
                if row_count > 0:
                    result = db.session.execute(text("SELECT * FROM flights LIMIT 3"))
                    print("📝 Sample data (first 3 rows):")
                    for i, row in enumerate(result):
                        print(f"   Row {i+1}: {dict(row._mapping)}")
            else:
                print("❌ Flights table does not exist")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    check_flights_table()
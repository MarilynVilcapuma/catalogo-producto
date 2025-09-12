# app/utils.py
#Este archivo puede contener funciones auxiliares como la prueba directa con oracledb:
import oracledb
from .config import DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_SERVICE

# Construir el DSN dinámicamente
dsn = f"{DB_HOST}:{DB_PORT}/{DB_SERVICE}"

def test_oracle_connection():
    try:
        conn = oracledb.connect(
            user=DB_USER,
            password=DB_PASS,
            dsn=dsn
        )
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM FICHAS")
            rows = cursor.fetchall()
            print("📚 Fichas encontradas:" if rows else "⚠️ No hay registros.")
    except oracledb.DatabaseError as e:
        error, = e.args
        print(f"❌ Error: {error.message}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

import sqlite3
from models import Libro, Inventario

DB_NAME = 'biblioteca.db'

def crear_tabla():
    """Crea la tabla libros si no existe."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS libros (
            id INTEGER PRIMARY KEY,
            titulo TEXT NOT NULL,
            autor TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            precio REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    print("📁 Base de datos lista.")

def guardar_inventario(inventario):
    """Guarda todos los libros del inventario en la BD (sobrescribe)."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM libros')  # limpia la tabla
    for libro in inventario.libros.values():
        cursor.execute('''
            INSERT INTO libros (id, titulo, autor, cantidad, precio)
            VALUES (?, ?, ?, ?, ?)
        ''', (libro.id, libro.titulo, libro.autor, libro.cantidad, libro.precio))
    conn.commit()
    conn.close()
    print("💾 Inventario guardado en base de datos.")

def cargar_inventario():
    """Carga los libros desde la BD y devuelve un objeto Inventario."""
    inventario = Inventario()
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT id, titulo, autor, cantidad, precio FROM libros')
    rows = cursor.fetchall()
    for row in rows:
        libro = Libro(row[0], row[1], row[2], row[3], row[4])
        inventario.agregar(libro)  # usa el método agregar de Inventario
    conn.close()
    print(f"📚 Se cargaron {len(inventario.libros)} libros desde la BD.")
    return inventario
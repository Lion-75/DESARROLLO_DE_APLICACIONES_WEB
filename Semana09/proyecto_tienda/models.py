# models.py - Contiene las clases Libro e Inventario

class Libro:
    """Clase que representa un libro en la biblioteca."""
    def __init__(self, id_libro, titulo, autor, cantidad, precio):
        self.id = id_libro
        self.titulo = titulo
        self.autor = autor
        self.cantidad = cantidad
        self.precio = precio

    # Métodos getter/setter (opcional)
    def obtener_titulo(self):
        return self.titulo

    def actualizar_cantidad(self, nueva_cantidad):
        self.cantidad = nueva_cantidad

    def actualizar_precio(self, nuevo_precio):
        self.precio = nuevo_precio

    def __str__(self):
        return f"ID: {self.id} | {self.titulo} - {self.autor} | Cant: {self.cantidad} | Precio: ${self.precio:.2f}"


class Inventario:
    """Gestiona los libros usando un diccionario (colección)."""
    def __init__(self):
        self.libros = {}  # diccionario {id: objeto Libro}

    def agregar(self, libro):
        if libro.id in self.libros:
            print(f"⚠️ Ya existe un libro con ID {libro.id}. No se agregó.")
            return False
        self.libros[libro.id] = libro
        print(f"✅ Libro '{libro.titulo}' agregado.")
        return True

    def eliminar(self, id_libro):
        if id_libro in self.libros:
            titulo = self.libros[id_libro].titulo
            del self.libros[id_libro]
            print(f"🗑️ Libro '{titulo}' eliminado.")
            return True
        else:
            print(f"❌ No se encontró libro con ID {id_libro}.")
            return False

    def actualizar_cantidad(self, id_libro, nueva_cantidad):
        if id_libro in self.libros:
            self.libros[id_libro].cantidad = nueva_cantidad
            print(f"📚 Cantidad actualizada a {nueva_cantidad}.")
            return True
        else:
            print(f"❌ ID {id_libro} no encontrado.")
            return False

    def actualizar_precio(self, id_libro, nuevo_precio):
        if id_libro in self.libros:
            self.libros[id_libro].precio = nuevo_precio
            print(f"💰 Precio actualizado a ${nuevo_precio:.2f}.")
            return True
        else:
            print(f"❌ ID {id_libro} no encontrado.")
            return False

    def buscar_por_titulo(self, titulo):
        resultados = []
        titulo_lower = titulo.lower()
        for libro in self.libros.values():
            if titulo_lower in libro.titulo.lower():
                resultados.append(libro)
        return resultados

    def mostrar_todos(self):
        if not self.libros:
            print("📭 Inventario vacío.")
        else:
            print("\n📖 LISTA DE LIBROS:")
            for libro in self.libros.values():
                print(libro)

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Usuario(UserMixin):
    def __init__(self, id_usuario, nombre, email, password):
        self.id = id_usuario
        self.nombre = nombre
        self.email = email
        self.password_hash = password

    @staticmethod
    def obtener_por_id(id_usuario):
        from conexion.conexion import get_db_connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_usuario, nombre, email, password FROM usuarios WHERE id_usuario = %s", (id_usuario,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return Usuario(row['id_usuario'], row['nombre'], row['email'], row['password'])
        return None

    @staticmethod
    def obtener_por_email(email):
        from conexion.conexion import get_db_connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_usuario, nombre, email, password FROM usuarios WHERE email = %s", (email,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return Usuario(row['id_usuario'], row['nombre'], row['email'], row['password'])
        return None

    def verificar_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def crear_usuario(nombre, email, password):
        from conexion.conexion import get_db_connection
        hashed = generate_password_hash(password)
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)",
                (nombre, email, hashed)
            )
            conn.commit()
            user_id = cursor.lastrowid
            conn.close()
            return Usuario(user_id, nombre, email, hashed)
        except Exception as e:
            conn.close()
            print(f"Error al crear usuario: {e}")
            return None
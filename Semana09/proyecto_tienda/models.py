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
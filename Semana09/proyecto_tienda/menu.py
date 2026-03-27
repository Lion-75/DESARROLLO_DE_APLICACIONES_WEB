from models import Libro, Inventario
from database import crear_tabla, guardar_inventario, cargar_inventario

def mostrar_menu():
    print("\n===== GESTIÓN DE BIBLIOTECA =====")
    print("1. Agregar libro")
    print("2. Eliminar libro")
    print("3. Actualizar cantidad")
    print("4. Actualizar precio")
    print("5. Buscar por título")
    print("6. Mostrar todos los libros")
    print("7. Salir")
    return input("Opción: ")

def main():
    crear_tabla()
    inventario = cargar_inventario()

    while True:
        opcion = mostrar_menu()
        if opcion == '1':
            try:
                id_libro = int(input("ID: "))
                titulo = input("Título: ")
                autor = input("Autor: ")
                cantidad = int(input("Cantidad: "))
                precio = float(input("Precio: "))
                libro = Libro(id_libro, titulo, autor, cantidad, precio)
                inventario.agregar(libro)
                guardar_inventario(inventario)
            except ValueError:
                print("❌ Datos inválidos. Reintente.")
        elif opcion == '2':
            try:
                id_libro = int(input("ID del libro a eliminar: "))
                if inventario.eliminar(id_libro):
                    guardar_inventario(inventario)
            except ValueError:
                print("ID inválido.")
        elif opcion == '3':
            try:
                id_libro = int(input("ID: "))
                nueva_cant = int(input("Nueva cantidad: "))
                if inventario.actualizar_cantidad(id_libro, nueva_cant):
                    guardar_inventario(inventario)
            except ValueError:
                print("Datos inválidos.")
        elif opcion == '4':
            try:
                id_libro = int(input("ID: "))
                nuevo_precio = float(input("Nuevo precio: "))
                if inventario.actualizar_precio(id_libro, nuevo_precio):
                    guardar_inventario(inventario)
            except ValueError:
                print("Datos inválidos.")
        elif opcion == '5':
            titulo = input("Título a buscar: ")
            resultados = inventario.buscar_por_titulo(titulo)
            if resultados:
                print("\n📖 RESULTADOS:")
                for libro in resultados:
                    print(libro)
            else:
                print("No se encontraron libros con ese título.")
        elif opcion == '6':
            inventario.mostrar_todos()
        elif opcion == '7':
            print("👋 ¡Hasta luego!")
            break
        else:
            print("Opción no válida.")

if __name__ == "__main__":
    main()
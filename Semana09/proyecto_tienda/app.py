from flask import Flask

app = Flask(__name__)

# Ruta principal - Página de inicio
@app.route('/')
def inicio():
    return "Bienvenido a la Biblioteca Virtual - Consulta de libros disponibles"

# Ruta dinámica para buscar libros por título
@app.route('/libro/<titulo>')
def libro(titulo):
    return f"Libro: '{titulo}' - Disponible en nuestra biblioteca"

# Esta línea permite ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, render_template

app = Flask(__name__)

# Ruta principal - página de inicio
@app.route('/')
def inicio():
    return render_template('index.html')

# Ruta "Acerca de"
@app.route('/about')
def acerca():
    return render_template('about.html')

# Ruta "Catálogo"
@app.route('/libros')
def libros():
    return render_template('libros.html')

# Ruta "Contacto"
@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

# Ruta dinámica que ya teníamos (para buscar un libro por título)
@app.route('/libro/<titulo>')
def libro(titulo):
    # Puedes devolver un texto simple o también renderizar una plantilla
    return f"Libro: '{titulo}' - Disponible en nuestra biblioteca"

if __name__ == '__main__':
    app.run(debug=True)
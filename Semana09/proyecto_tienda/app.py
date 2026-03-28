from flask import Flask, render_template, request, redirect, url_for
from inventario.inventario import (
    guardar_txt, leer_txt,
    guardar_json, leer_json,
    guardar_csv, leer_csv
)
from inventario.bd import init_db
from inventario.productos import db, Libro

app = Flask(__name__)
app.config['SECRET_KEY'] = 'clave-secreta-para-formularios'  # necesario para Flask-WTF

# Inicializar base de datos SQLAlchemy
init_db(app)

# Rutas existentes
@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/about')
def acerca():
    return render_template('about.html')

@app.route('/libros')
def libros():
    return render_template('libros.html')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

# Ruta dinámica original (texto plano)
@app.route('/libro/<titulo>')
def libro(titulo):
    return f"Libro: '{titulo}' - Disponible en nuestra biblioteca"

# ---------- NUEVAS RUTAS PARA PERSISTENCIA ----------
@app.route('/agregar', methods=['GET', 'POST'])
def agregar():
    if request.method == 'POST':
        # Obtener datos del formulario
        titulo = request.form['titulo']
        autor = request.form['autor']
        cantidad = int(request.form['cantidad'])
        precio = float(request.form['precio'])
        formato = request.form['formato']

        datos = {
            'titulo': titulo,
            'autor': autor,
            'cantidad': cantidad,
            'precio': precio
        }

        # Guardar según el formato elegido
        if formato == 'txt':
            guardar_txt(datos)
        elif formato == 'json':
            guardar_json(datos)
        elif formato == 'csv':
            guardar_csv(datos)
        elif formato == 'sqlite':
            nuevo_libro = Libro(titulo=titulo, autor=autor, cantidad=cantidad, precio=precio)
            db.session.add(nuevo_libro)
            db.session.commit()

        # Redirigir a la página de visualización del formato correspondiente
        return redirect(url_for('ver_datos', formato=formato))
    else:
        # GET: mostrar el formulario
        return render_template('producto_form.html')

@app.route('/ver/<formato>')
def ver_datos(formato):
    """Muestra los datos guardados en el formato indicado."""
    if formato == 'txt':
        datos = leer_txt()
    elif formato == 'json':
        datos = leer_json()
    elif formato == 'csv':
        datos = leer_csv()
    elif formato == 'sqlite':
        # Obtener todos los libros de la base de datos
        datos = Libro.query.all()
        # Convertir los objetos a diccionarios para que la plantilla los muestre igual
        datos = [{'titulo': d.titulo, 'autor': d.autor, 'cantidad': d.cantidad, 'precio': d.precio} for d in datos]
    else:
        datos = []
    return render_template('datos.html', datos=datos, formato=formato)

if __name__ == '__main__':
    app.run(debug=True)
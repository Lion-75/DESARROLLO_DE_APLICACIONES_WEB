from conexion.conexion import get_db_connection
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

# ---------- RUTAS PARA MYSQL ----------
@app.route('/mysql/agregar', methods=['GET', 'POST'])
def mysql_agregar():
    if request.method == 'POST':
        titulo = request.form['titulo']          # sin tilde
        autor = request.form['autor']
        cantidad = int(request.form['cantidad'])
        precio = float(request.form['precio'])

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO libros (titulo, autor, cantidad, precio) VALUES (%s, %s, %s, %s)",
            (titulo, autor, cantidad, precio)
        )
        conn.commit()
        conn.close()
        return redirect(url_for('mysql_ver'))
    return render_template('mysql_form.html')

@app.route('/mysql/ver')
def mysql_ver():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM libros")
    libros = cursor.fetchall()
    conn.close()
    return render_template('mysql_lista.html', libros=libros)

@app.route('/mysql/editar/<int:id>', methods=['GET', 'POST'])
def mysql_editar(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    if request.method == 'POST':
        titulo = request.form['titulo']
        autor = request.form['autor']
        cantidad = int(request.form['cantidad'])
        precio = float(request.form['precio'])
        cursor.execute(
            "UPDATE libros SET titulo=%s, autor=%s, cantidad=%s, precio=%s WHERE id=%s",
            (titulo, autor, cantidad, precio, id)
        )
        conn.commit()
        conn.close()
        return redirect(url_for('mysql_ver'))
    else:
        cursor.execute("SELECT * FROM libros WHERE id = %s", (id,))
        libro = cursor.fetchone()
        conn.close()
        return render_template('mysql_editar.html', libro=libro)

@app.route('/mysql/eliminar/<int:id>')
def mysql_eliminar(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM libros WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('mysql_ver'))

if __name__ == '__main__':
    app.run(debug=True)
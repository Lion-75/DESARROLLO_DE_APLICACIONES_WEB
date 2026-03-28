from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from inventario.inventario import (
    guardar_txt, leer_txt,
    guardar_json, leer_json,
    guardar_csv, leer_csv
)
from inventario.bd import init_db
from inventario.productos import db, Libro
from models import Usuario  

# ---------- DETECCIÓN DE MYSQL ----------
mysql_disponible = False
try:
    from conexion.conexion import get_db_connection
    conn = get_db_connection()
    conn.close()
    mysql_disponible = True
    print("✅ MySQL disponible")
except Exception as e:
    print(f"⚠️ MySQL no disponible: {e}")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'clave-secreta-para-formularios'

# ---------- CONFIGURACIÓN FLASK-LOGIN ----------
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'          # redirigir a login si no autenticado
login_manager.login_message = "Por favor, inicia sesión para acceder."

@login_manager.user_loader
def load_user(user_id):
    return Usuario.obtener_por_id(int(user_id))

# Inicializar base de datos SQLAlchemy
init_db(app)

# ---------- RUTAS EXISTENTES ----------
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

@app.route('/libro/<titulo>')
def libro(titulo):
    return f"Libro: '{titulo}' - Disponible en nuestra biblioteca"

# ---------- PERSISTENCIA (archivos, SQLite) ----------
@app.route('/agregar', methods=['GET', 'POST'])
@login_required          # protegemos esta ruta
def agregar():
    if request.method == 'POST':
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

        return redirect(url_for('ver_datos', formato=formato))
    else:
        return render_template('producto_form.html')

@app.route('/ver/<formato>')
def ver_datos(formato):
    if formato == 'txt':
        datos = leer_txt()
    elif formato == 'json':
        datos = leer_json()
    elif formato == 'csv':
        datos = leer_csv()
    elif formato == 'sqlite':
        datos = Libro.query.all()
        datos = [{'titulo': d.titulo, 'autor': d.autor, 'cantidad': d.cantidad, 'precio': d.precio} for d in datos]
    else:
        datos = []
    return render_template('datos.html', datos=datos, formato=formato)

# ---------- RUTAS PARA MYSQL (con verificación y protección) ----------
@app.route('/mysql/agregar', methods=['GET', 'POST'])
@login_required
def mysql_agregar():
    if not mysql_disponible:
        return render_template('error_mysql.html', mensaje="MySQL no está disponible en este entorno.")
    if request.method == 'POST':
        titulo = request.form['titulo']
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
@login_required
def mysql_ver():
    if not mysql_disponible:
        return render_template('error_mysql.html', mensaje="MySQL no está disponible en este entorno.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM libros")
    libros = cursor.fetchall()
    conn.close()
    return render_template('mysql_lista.html', libros=libros)

@app.route('/mysql/editar/<int:id>', methods=['GET', 'POST'])
@login_required
def mysql_editar(id):
    if not mysql_disponible:
        return render_template('error_mysql.html', mensaje="MySQL no está disponible en este entorno.")
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
@login_required
def mysql_eliminar(id):
    if not mysql_disponible:
        return render_template('error_mysql.html', mensaje="MySQL no está disponible en este entorno.")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM libros WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('mysql_ver'))

# ---------- AUTENTICACIÓN ----------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        usuario = Usuario.obtener_por_email(email)
        if usuario and usuario.verificar_password(password):
            login_user(usuario)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('inicio'))
        else:
            flash('Email o contraseña incorrectos.')
    return render_template('login.html')

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        password = request.form['password']
        if Usuario.obtener_por_email(email):
            flash('El email ya está registrado.')
        else:
            nuevo = Usuario.crear_usuario(nombre, email, password)
            if nuevo:
                flash('Registro exitoso. Ahora puedes iniciar sesión.')
                return redirect(url_for('login'))
            else:
                flash('Error al registrar. Intenta de nuevo.')
    return render_template('registro.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Has cerrado sesión.')
    return redirect(url_for('inicio'))

if __name__ == '__main__':
    app.run(debug=True)
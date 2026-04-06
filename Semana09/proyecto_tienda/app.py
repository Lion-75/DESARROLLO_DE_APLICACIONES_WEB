from flask import Flask, render_template, request, redirect, url_for, flash, send_file
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from inventario.inventario import (
    guardar_txt, leer_txt,
    guardar_json, leer_json,
    guardar_csv, leer_csv
)
from inventario.bd import init_db
from inventario.productos import db, Usuario, Categoria, Libro
from fpdf import FPDF
from io import BytesIO

# ---------- DETECCIÓN DE MYSQL (opcional, solo para las rutas antiguas) ----------
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
login_manager.login_view = 'login'
login_manager.login_message = "Por favor, inicia sesión para acceder."

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

# Inicializar base de datos SQLAlchemy (crea las tablas si no existen)
init_db(app)

# ---------- RUTAS PÚBLICAS ----------
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

# ---------- AUTENTICACIÓN (con SQLAlchemy) ----------
@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        password = request.form['password']
        if Usuario.query.filter_by(email=email).first():
            flash('El email ya está registrado.')
        else:
            nuevo = Usuario(nombre=nombre, email=email)
            nuevo.set_password(password)
            db.session.add(nuevo)
            db.session.commit()
            flash('Registro exitoso. Ahora puedes iniciar sesión.')
            return redirect(url_for('login'))
    return render_template('registro.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        usuario = Usuario.query.filter_by(email=email).first()
        if usuario and usuario.check_password(password):
            login_user(usuario)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('inicio'))
        else:
            flash('Email o contraseña incorrectos.')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Sesión cerrada.')
    return redirect(url_for('inicio'))

# ---------- CRUD DE LIBROS (protegido) ----------
@app.route('/libros/listado')
@login_required
def listado_libros():
    libros = Libro.query.all()
    return render_template('libros_lista.html', libros=libros)

@app.route('/libros/nuevo', methods=['GET', 'POST'])
@login_required
def nuevo_libro():
    categorias = Categoria.query.all()
    if request.method == 'POST':
        titulo = request.form['titulo']
        autor = request.form['autor']
        cantidad = int(request.form['cantidad'])
        precio = float(request.form['precio'])
        categoria_id = int(request.form['categoria_id'])
        libro = Libro(titulo=titulo, autor=autor, cantidad=cantidad, precio=precio, categoria_id=categoria_id)
        db.session.add(libro)
        db.session.commit()
        flash('Libro agregado correctamente.')
        return redirect(url_for('listado_libros'))
    return render_template('libro_form.html', categorias=categorias)

@app.route('/libros/editar/<int:id>', methods=['GET', 'POST'])
@login_required
def editar_libro(id):
    libro = Libro.query.get_or_404(id)
    categorias = Categoria.query.all()
    if request.method == 'POST':
        libro.titulo = request.form['titulo']
        libro.autor = request.form['autor']
        libro.cantidad = int(request.form['cantidad'])
        libro.precio = float(request.form['precio'])
        libro.categoria_id = int(request.form['categoria_id'])
        db.session.commit()
        flash('Libro actualizado.')
        return redirect(url_for('listado_libros'))
    return render_template('libro_editar.html', libro=libro, categorias=categorias)

@app.route('/libros/eliminar/<int:id>')
@login_required
def eliminar_libro(id):
    libro = Libro.query.get_or_404(id)
    db.session.delete(libro)
    db.session.commit()
    flash('Libro eliminado.')
    return redirect(url_for('listado_libros'))

# ---------- CRUD DE CATEGORÍAS (protegido) ----------
@app.route('/categorias')
@login_required
def listado_categorias():
    categorias = Categoria.query.all()
    return render_template('categorias_lista.html', categorias=categorias)

@app.route('/categorias/nueva', methods=['GET', 'POST'])
@login_required
def nueva_categoria():
    if request.method == 'POST':
        nombre = request.form['nombre']
        cat = Categoria(nombre=nombre)
        db.session.add(cat)
        db.session.commit()
        flash('Categoría agregada.')
        return redirect(url_for('listado_categorias'))
    return render_template('categoria_form.html')

# ---------- REPORTE PDF ----------
@app.route('/reporte/libros')
@login_required
def reporte_libros():
    libros = Libro.query.all()
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Reporte de Libros", ln=1, align='C')
    pdf.ln(10)
    pdf.set_font("Arial", size=10)
    for libro in libros:
        pdf.cell(0, 8, txt=f"{libro.id} - {libro.titulo} - {libro.autor} - ${libro.precio} - Stock: {libro.cantidad} - Categoría: {libro.categoria.nombre}", ln=1)
    pdf_output = pdf.output(dest='S').encode('latin-1')
    return send_file(BytesIO(pdf_output), download_name='reporte_libros.pdf', as_attachment=True)

# ---------- RUTAS ANTIGUAS (PERSISTENCIA CON ARCHIVOS Y MYSQL) ----------
# Se mantienen por compatibilidad, pero no son necesarias para la entrega final.
@app.route('/agregar', methods=['GET', 'POST'])
@login_required
def agregar():
    if request.method == 'POST':
        titulo = request.form['titulo']
        autor = request.form['autor']
        cantidad = int(request.form['cantidad'])
        precio = float(request.form['precio'])
        formato = request.form['formato']
        datos = {'titulo': titulo, 'autor': autor, 'cantidad': cantidad, 'precio': precio}
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
        cursor.execute("INSERT INTO libros (titulo, autor, cantidad, precio) VALUES (%s, %s, %s, %s)", (titulo, autor, cantidad, precio))
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
        cursor.execute("UPDATE libros SET titulo=%s, autor=%s, cantidad=%s, precio=%s WHERE id=%s", (titulo, autor, cantidad, precio, id))
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

if __name__ == '__main__':
    app.run(debug=True)
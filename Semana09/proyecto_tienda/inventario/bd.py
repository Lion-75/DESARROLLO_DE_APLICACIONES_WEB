from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .productos import db, Usuario, Categoria, Libro

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///biblioteca.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
        # Crear categorías por defecto si no existen
        if Categoria.query.count() == 0:
            categorias = ['Ficción', 'Ciencia', 'Historia', 'Aventura']
            for cat in categorias:
                db.session.add(Categoria(nombre=cat))
            db.session.commit()
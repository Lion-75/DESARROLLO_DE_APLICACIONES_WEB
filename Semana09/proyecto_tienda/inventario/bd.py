from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .productos import db, Libro  # importa la instancia db y el modelo

def init_db(app):
    """Configura la base de datos SQLite con SQLAlchemy."""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///biblioteca_web.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()  # crea las tablas si no existen
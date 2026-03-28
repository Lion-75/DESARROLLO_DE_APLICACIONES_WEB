import os
import json
import csv

# Rutas a los archivos dentro de la carpeta data
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, 'data')

TXT_FILE = os.path.join(DATA_DIR, 'datos.txt')
JSON_FILE = os.path.join(DATA_DIR, 'datos.json')
CSV_FILE = os.path.join(DATA_DIR, 'datos.csv')

def guardar_txt(datos):
    """Recibe una lista de diccionarios y los guarda en TXT (cada campo separado por |)."""
    with open(TXT_FILE, 'a', encoding='utf-8') as f:
        f.write(f"{datos['titulo']}|{datos['autor']}|{datos['cantidad']}|{datos['precio']}\n")

def leer_txt():
    """Lee el archivo TXT y devuelve una lista de diccionarios."""
    lista = []
    if not os.path.exists(TXT_FILE):
        return lista
    with open(TXT_FILE, 'r', encoding='utf-8') as f:
        for linea in f:
            linea = linea.strip()
            if linea:
                partes = linea.split('|')
                if len(partes) == 4:
                    lista.append({
                        'titulo': partes[0],
                        'autor': partes[1],
                        'cantidad': int(partes[2]),
                        'precio': float(partes[3])
                    })
    return lista

def guardar_json(datos):
    """Agrega un nuevo registro al archivo JSON."""
    # Leer existentes
    existentes = []
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            try:
                existentes = json.load(f)
            except json.JSONDecodeError:
                existentes = []
    existentes.append(datos)
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(existentes, f, indent=4, ensure_ascii=False)

def leer_json():
    """Lee el archivo JSON y devuelve la lista de registros."""
    if not os.path.exists(JSON_FILE):
        return []
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def guardar_csv(datos):
    """Agrega un nuevo registro al archivo CSV."""
    # Si el archivo no existe, escribir cabeceras
    file_exists = os.path.exists(CSV_FILE)
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['titulo', 'autor', 'cantidad', 'precio'])
        if not file_exists:
            writer.writeheader()
        writer.writerow(datos)

def leer_csv():
    """Lee el archivo CSV y devuelve una lista de diccionarios."""
    if not os.path.exists(CSV_FILE):
        return []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)
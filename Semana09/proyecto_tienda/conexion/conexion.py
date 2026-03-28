import pymysql

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='123456',          
        database='biblioteca_db',
        cursorclass=pymysql.cursors.DictCursor
    )
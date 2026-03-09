import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="yajithBM@966310",   # use the password you created
        database="crop_trading"
    )
    return connection
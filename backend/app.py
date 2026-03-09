# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def home():
#     return "Crop Trading API Running"

# if __name__ == "__main__":
#     app.run(debug=True)
from flask import Flask
from database import get_connection

app = Flask(__name__)

@app.route("/")
def home():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    return f"Database connected! Tables: {tables}"

if __name__ == "__main__":
    app.run(debug=True)
# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def home():
#     return "Crop Trading API Running"

# if __name__ == "__main__":
#     app.run(debug=True)
# from flask import Flask
# from database import get_connection

# app = Flask(__name__)

# @app.route("/")
# def home():
#     conn = get_connection()
#     cursor = conn.cursor()
#     cursor.execute("SHOW TABLES")
#     tables = cursor.fetchall()

#     return f"Database connected! Tables: {tables}"

# if __name__ == "__main__":
    # app.run(debug=True)

from flask import Flask, request, jsonify
from database import get_connection

app = Flask(__name__)

@app.route("/")
def home():
    return "Crop Trading API Running"


@app.route("/register_farmer", methods=["POST"])
def register_farmer():
    data = request.json

    name = data["name"]
    phone = data["phone"]
    location = data["location"]
    password = data["password"]

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO farmers (name, phone, location, password)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (name, phone, location, password))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Farmer registered successfully"})

@app.route("/add_crop", methods=["POST"])
def add_crop():
    data = request.json

    farmer_id = data["farmer_id"]
    crop_name = data["crop_name"]
    quantity = data["quantity"]
    price = data["price"]
    location = data["location"]

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO crops (farmer_id, crop_name, quantity, price, location)
    VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (farmer_id, crop_name, quantity, price, location))
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Crop added successfully"}

@app.route("/crops", methods=["GET"])
def get_crops():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT crops.crop_id, crops.crop_name, crops.quantity, crops.price, crops.location,
           farmers.name AS farmer_name
    FROM crops
    JOIN farmers ON crops.farmer_id = farmers.farmer_id
    """

    cursor.execute(query)
    crops = cursor.fetchall()

    cursor.close()
    conn.close()

    return {"crops": crops}

if __name__ == "__main__":
    app.run(debug=True)
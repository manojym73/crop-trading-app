from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Crop Trading API Running"


# ---------------------------
# Register Farmer
# ---------------------------
@app.route("/register_farmer", methods=["POST"])
def register_farmer():

    try:
        data = request.json

        email = data["email"]
        name = data["name"]
        phone = data["phone"]
        location = data["location"]
        password = data["password"]

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if email already exists
        cursor.execute(
            "SELECT * FROM farmers WHERE email=%s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"message": "Email already registered"}), 400

        # Insert new farmer
        query = """
        INSERT INTO farmers (email, name, phone, location, password)
        VALUES (%s,%s,%s,%s,%s)
        """

        cursor.execute(query,(email,name,phone,location,password))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message":"Farmer registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Salesman Register API
@app.route("/register_salesman", methods=["POST"])
def register_salesman():

    try:
        data = request.json

        email = data["email"]
        name = data["name"]
        phone = data["phone"]
        company = data["company"]
        password = data["password"]

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # check existing email
        cursor.execute(
            "SELECT * FROM salesmen WHERE email=%s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"message":"Email already registered"}),400

        query = """
        INSERT INTO salesmen (email,name,phone,company,password)
        VALUES (%s,%s,%s,%s,%s)
        """

        cursor.execute(query,(email,name,phone,company,password))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message":"Salesman registered successfully"})

    except Exception as e:
        return jsonify({"error":str(e)}),500
    
# Login API (Both Farmer & Salesman)
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # check farmer
    cursor.execute(
        "SELECT * FROM farmers WHERE email=%s AND password=%s",
        (email,password)
    )

    farmer = cursor.fetchone()

    if farmer:
        return jsonify({
            "role":"farmer",
            "user":farmer
        })

    # check salesman
    cursor.execute(
        "SELECT * FROM salesmen WHERE email=%s AND password=%s",
        (email,password)
    )

    salesman = cursor.fetchone()

    if salesman:
        return jsonify({
            "role":"salesman",
            "user":salesman
        })

    return jsonify({"message":"Invalid email or password"}),401

# ---------------------------
# Add Crop
# ---------------------------
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

    return jsonify({"message": "Crop added successfully"})


# ---------------------------
# Get All Crops
# ---------------------------
@app.route("/crops", methods=["GET"])
def get_crops():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        crops.crop_id,
        crops.crop_name,
        crops.quantity,
        crops.price,
        crops.location,
        farmers.name AS farmer_name
    FROM crops
    JOIN farmers ON crops.farmer_id = farmers.farmer_id
    """

    cursor.execute(query)
    crops = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"crops": crops})


# ---------------------------
# Place Order
# ---------------------------
@app.route("/place_order", methods=["POST"])
def place_order():

    data = request.json

    salesman_id = data["salesman_id"]
    crop_id = data["crop_id"]
    quantity = data["quantity"]

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO orders (salesman_id, crop_id, quantity, status)
    VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (salesman_id, crop_id, quantity, "Pending"))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Order placed successfully"})


# ---------------------------
# View Orders
# ---------------------------
@app.route("/orders", methods=["GET"])
def get_orders():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        orders.order_id,
        farmers.name AS farmer_name,
        salesmen.name AS salesman_name,
        crops.crop_name,
        orders.quantity,
        orders.status,
        orders.order_date
    FROM orders
    JOIN crops ON orders.crop_id = crops.crop_id
    JOIN farmers ON crops.farmer_id = farmers.farmer_id
    JOIN salesmen ON orders.salesman_id = salesmen.salesman_id
    """

    cursor.execute(query)
    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"orders": orders})

# API to Update Order Status
@app.route("/update_order_status", methods=["POST"])
def update_order_status():

    data = request.json

    order_id = data["order_id"]
    status = data["status"]

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE orders
    SET status=%s
    WHERE order_id=%s
    """

    cursor.execute(query, (status, order_id))
    conn.commit()

    cursor.close()
    conn.close()

    return {"message": "Order status updated"}


if __name__ == "__main__":
    app.run(debug=True)
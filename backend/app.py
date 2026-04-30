# ===============================
# IMPORTS
# ===============================
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename   # ✅ ADD THIS
from database import get_connection
import os

app = Flask(__name__)

# ✅ MUST BE AFTER app creation
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/")
def home():
    return "Crop Trading API Running"


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ---------------------------
# Register Farmer
# ---------------------------
@app.route("/register_farmer", methods=["POST"])
def register_farmer():

    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")

        # ✅ validation
        if not name or not email or not password or not phone:
            return jsonify({"message": "All fields required"}), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO farmers (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
        """, (name, email, password, phone))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Farmer registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Salesman Register API
@app.route("/register_salesman", methods=["POST"])
def register_salesman():

    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")

        if not name or not email or not password or not phone:
            return jsonify({"message": "All fields required"}), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO salesmen (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
        """, (name, email, password, phone))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Salesman registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
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
        (email, password)
    )
    farmer = cursor.fetchone()

    if farmer:
        return {"role": "farmer", "id": farmer["farmer_id"]}

    # check salesman
    cursor.execute(
        "SELECT * FROM salesmen WHERE email=%s AND password=%s",
        (email, password)
    )
    salesman = cursor.fetchone()

    if salesman:
        return {"role": "salesman", "id": salesman["salesman_id"]}

    return {"message": "Invalid login"}

# Add Crop API
@app.route("/add_crop", methods=["POST"])
def add_crop():

    try:
        # ===============================
        # GET FORM DATA
        # ===============================
        farmer_id = request.form.get("farmer_id")
        crop_name = request.form.get("crop_name")
        quantity = request.form.get("quantity")
        price = request.form.get("price")
        location = request.form.get("location")

        # ===============================
        # VALIDATION
        # ===============================
        if not farmer_id or not crop_name or not quantity or not price:
            return jsonify({"message": "All fields required"}), 400

        # ===============================
        # IMAGE HANDLING
        # ===============================
        image = request.files.get("image")
        filename = ""

        if image and image.filename != "":
            filename = secure_filename(image.filename)

            # create folder if not exists
            if not os.path.exists(app.config["UPLOAD_FOLDER"]):
                os.makedirs(app.config["UPLOAD_FOLDER"])

            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            image.save(image_path)

        # ===============================
        # DATABASE INSERT
        # ===============================
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO crops (farmer_id, crop_name, quantity, price, location, image)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (farmer_id, crop_name, quantity, price, location, filename))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Crop added successfully"})

    except Exception as e:
        print("ADD CROP ERROR:", e)   # 🔥 VERY IMPORTANT FOR DEBUG
        return jsonify({"error": str(e)}), 500

# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

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
        crops.image,
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

    try:
        data = request.json

        salesman_id = data.get("salesman_id")
        crop_id = data.get("crop_id")
        quantity = data.get("quantity")

        # ✅ validation
        if not salesman_id or not crop_id or not quantity:
            return jsonify({"message": "All fields required"}), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO orders (salesman_id, crop_id, quantity, status)
            VALUES (%s, %s, %s, 'Pending')
        """, (salesman_id, crop_id, quantity))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Order placed successfully"})

    except Exception as e:
        print("PLACE ORDER ERROR:", e)
        return jsonify({"error": str(e)}), 500

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

# orders for specific salesman
@app.route("/salesman_orders/<int:salesman_id>")
def salesman_orders(salesman_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            o.order_id,
            o.quantity,
            o.status,
            c.crop_name,
            f.name AS farmer_name,
            f.phone AS farmer_phone
        FROM orders o
        JOIN crops c ON o.crop_id = c.crop_id
        JOIN farmers f ON c.farmer_id = f.farmer_id
        WHERE o.salesman_id = %s
    """, (salesman_id,))

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
    cursor = conn.cursor(dictionary=True)

    # ===============================
    # 1️⃣ GET ORDER DETAILS
    # ===============================
    cursor.execute("""
        SELECT crop_id, quantity, status
        FROM orders
        WHERE order_id = %s
    """, (order_id,))
    
    order = cursor.fetchone()

    if not order:
        return jsonify({"message": "Order not found"}), 404

    # ❌ prevent double processing
    if order["status"] != "Pending":
        return jsonify({"message": "Order already processed"})

    crop_id = order["crop_id"]
    order_qty = order["quantity"]

    # ===============================
    # 2️⃣ IF APPROVED → CHECK STOCK
    # ===============================
    if status == "Approved":

        cursor.execute("""
            SELECT quantity FROM crops WHERE crop_id = %s
        """, (crop_id,))
        
        crop = cursor.fetchone()

        if not crop:
            return jsonify({"message": "Crop not found"}), 404

        # ❌ IF NOT ENOUGH STOCK → AUTO REJECT
        if crop["quantity"] < order_qty:

            cursor.execute("""
                UPDATE orders
                SET status = 'Rejected'
                WHERE order_id = %s
            """, (order_id,))

            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({"message": "Order rejected (Insufficient stock)"})

        # ✅ REDUCE STOCK
        cursor.execute("""
            UPDATE crops
            SET quantity = quantity - %s
            WHERE crop_id = %s
        """, (order_qty, crop_id))

    # ===============================
    # 3️⃣ UPDATE ORDER STATUS
    # ===============================
    cursor.execute("""
        UPDATE orders
        SET status = %s
        WHERE order_id = %s
    """, (status, order_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": f"Order {status} successfully"})

# orders for specific farmer
@app.route("/farmer_orders/<int:farmer_id>")
def farmer_orders(farmer_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            o.order_id,
            o.quantity,
            o.status,
            c.crop_name,
            s.name AS salesman_name,
            s.phone AS salesman_phone
        FROM orders o
        JOIN crops c ON o.crop_id = c.crop_id
        JOIN salesmen s ON o.salesman_id = s.salesman_id
        WHERE c.farmer_id = %s
    """, (farmer_id,))

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"orders": orders})
    
# Stats API
@app.route("/stats")
def get_stats():

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # total crops
        cursor.execute("SELECT COUNT(*) FROM crops")
        total_crops = cursor.fetchone()[0]

        # total orders
        cursor.execute("SELECT COUNT(*) FROM orders")
        total_orders = cursor.fetchone()[0]

        # total farmers
        cursor.execute("SELECT COUNT(*) FROM farmers")
        total_farmers = cursor.fetchone()[0]

        # total salesmen
        cursor.execute("SELECT COUNT(*) FROM salesmen")
        total_salesmen = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return jsonify({
            "total_crops": total_crops,
            "total_orders": total_orders,
            "total_farmers": total_farmers,
            "total_salesmen": total_salesmen
        })

    except Exception as e:
        return jsonify({"error": str(e)})



# Run the Flask app 
if __name__ == "__main__":
    app.run(debug=True)
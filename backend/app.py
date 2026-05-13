# Crop Trading API - Flask Backend
import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from database import get_connection
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)


# Configuration for file uploads
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to close database resources
def close_resources(cursor=None, conn=None):
    try:
        if cursor:
            cursor.close()
    except:
        pass
    try:
        if conn:
            conn.close()
    except:
        pass

@app.route("/")
def home():
    return jsonify({"message": "Crop Trading API Running"})


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# ---------------------------
# Register Farmer
# ---------------------------
@app.route("/register_farmer", methods=["POST"])
def register_farmer():
    try:
        data = request.get_json() or {}

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        phone = data.get("phone", "").strip()

        if not name or not email or not password or not phone:
            return jsonify({"message": "All fields required"}), 400

        hashed_password = generate_password_hash(password)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT farmer_id FROM farmers WHERE email = %s", (email,))
        existing_farmer = cursor.fetchone()
        if existing_farmer:
            cursor.close()
            conn.close()
            return jsonify({"message": "Email already registered as farmer"}), 400

        cursor.execute(
            """
            INSERT INTO farmers (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
            """,
            (name, email, hashed_password, phone),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Farmer registered successfully"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ---------------------------
# Register Salesman
# ---------------------------
@app.route("/register_salesman", methods=["POST"])
def register_salesman():
    try:
        data = request.get_json() or {}

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        phone = data.get("phone", "").strip()

        if not name or not email or not password or not phone:
            return jsonify({"message": "All fields required"}), 400

        hashed_password = generate_password_hash(password)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT salesman_id FROM salesmen WHERE email = %s", (email,))
        existing_salesman = cursor.fetchone()
        if existing_salesman:
            cursor.close()
            conn.close()
            return jsonify({"message": "Email already registered as salesman"}), 400

        cursor.execute(
            """
            INSERT INTO salesmen (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
            """,
            (name, email, hashed_password, phone),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Salesman registered successfully"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ---------------------------
# Login
# ---------------------------
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}

        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not email or not password:
            return jsonify({"message": "Email and password required"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM farmers WHERE email = %s", (email,))
        farmer = cursor.fetchone()

        if farmer and check_password_hash(farmer["password"], password):
            cursor.close()
            conn.close()
            return jsonify({
                "role": "farmer",
                "id": farmer["farmer_id"],
                "name": farmer["name"],
                "email": farmer["email"],
                "phone": farmer["phone"]
            })

        cursor.execute("SELECT * FROM salesmen WHERE email = %s", (email,))
        salesman = cursor.fetchone()

        if salesman and check_password_hash(salesman["password"], password):
            cursor.close()
            conn.close()
            return jsonify({
                "role": "salesman",
                "id": salesman["salesman_id"],
                "name": salesman["name"],
                "email": salesman["email"],
                "phone": salesman["phone"]
            })

        cursor.close()
        conn.close()

        return jsonify({"message": "Invalid login"}), 401

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# ---------------------------
# Add Crop
# ---------------------------
@app.route("/add_crop", methods=["POST"])
def add_crop():
    conn = None
    cursor = None
    try:
        farmer_id = request.form.get("farmer_id", "").strip()
        crop_name = request.form.get("crop_name", "").strip()
        quantity = request.form.get("quantity", "").strip()
        price = request.form.get("price", "").strip()
        location = request.form.get("location", "").strip()

        if not farmer_id or not crop_name or not quantity or not price or not location:
            return jsonify({"message": "All fields are required"}), 400

        image = request.files.get("image")
        filename = None

        if image and image.filename:
          if not allowed_file(image.filename):
              return jsonify({"message": "Only png, jpg, jpeg, webp images are allowed"}), 400

          ext = image.filename.rsplit(".", 1)[1].lower()
          filename = f"{uuid.uuid4().hex}.{ext}"
          image.save(os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(filename)))

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO crops (farmer_id, crop_name, quantity, price, location, image)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (farmer_id, crop_name, quantity, price, location, filename),
        )
        conn.commit()

        return jsonify({"message": "Crop added successfully"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------
# Get Crops
# ---------------------------
@app.route("/crops", methods=["GET"])
def get_crops():
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                c.crop_id,
                c.farmer_id,
                c.crop_name,
                c.quantity,
                c.price,
                c.location,
                c.image,
                f.name AS farmer_name
            FROM crops c
            JOIN farmers f ON c.farmer_id = f.farmer_id
            ORDER BY c.crop_id DESC
            """
        )

        crops = cursor.fetchall()
        return jsonify({"crops": crops}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------
# Place Order
# ---------------------------
@app.route("/place_order", methods=["POST"])
def place_order():
    conn = None
    cursor = None
    try:
        data = request.get_json() or {}
        crop_id = data.get("crop_id")
        salesman_id = data.get("salesman_id")
        quantity = data.get("quantity")

        if not crop_id or not salesman_id or not quantity:
            return jsonify({"message": "crop_id, salesman_id and quantity are required"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT crop_id, farmer_id, quantity
            FROM crops
            WHERE crop_id = %s
            """,
            (crop_id,),
        )
        crop = cursor.fetchone()

        if not crop:
            return jsonify({"message": "Crop not found"}), 404

        if int(quantity) <= 0:
            return jsonify({"message": "Quantity must be greater than 0"}), 400

        if int(quantity) > int(crop["quantity"]):
            return jsonify({"message": "Not enough stock available"}), 400

        insert_cursor = conn.cursor()
        insert_cursor.execute(
            """
            INSERT INTO orders (crop_id, farmer_id, salesman_id, quantity, status)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (crop_id, crop["farmer_id"], salesman_id, quantity, "pending"),
        )
        conn.commit()
        insert_cursor.close()

        return jsonify({"message": "Order placed successfully"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------
# Get Orders
# ---------------------------
@app.route("/orders", methods=["GET"])
def get_orders():
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                o.order_id,
                o.crop_id,
                o.farmer_id,
                o.salesman_id,
                o.quantity,
                o.status,
                o.order_date,
                c.crop_name,
                c.price,
                f.name AS farmer_name,
                f.phone AS farmer_phone,
                s.name AS salesman_name,
                s.phone AS salesman_phone
            FROM orders o
            JOIN crops c ON o.crop_id = c.crop_id
            JOIN farmers f ON o.farmer_id = f.farmer_id
            JOIN salesmen s ON o.salesman_id = s.salesman_id
            ORDER BY o.order_id DESC
            """
        )

        orders = cursor.fetchall()
        return jsonify({"orders": orders}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------
# Get Salesman Orders
# ---------------------------
@app.route("/salesman_orders/<int:salesman_id>", methods=["GET"])
def get_salesman_orders(salesman_id):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                o.order_id,
                o.crop_id,
                o.quantity,
                o.status,
                o.order_date,
                c.crop_name,
                c.price,
                f.name AS farmer_name,
                f.phone AS farmer_phone
            FROM orders o
            JOIN crops c ON o.crop_id = c.crop_id
            JOIN farmers f ON o.farmer_id = f.farmer_id
            WHERE o.salesman_id = %s
            ORDER BY o.order_id DESC
            """,
            (salesman_id,),
        )

        orders = cursor.fetchall()
        return jsonify({"orders": orders}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------   
#  Get Farmer Orders
# ---------------------------
@app.route("/farmer_orders/<int:farmer_id>", methods=["GET"])
def get_farmer_orders(farmer_id):
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                o.order_id,
                o.crop_id,
                o.quantity,
                o.status,
                o.order_date,
                c.crop_name,
                s.name AS salesman_name,
                s.email AS salesman_email,
                s.phone AS salesman_phone
            FROM orders o
            JOIN crops c ON o.crop_id = c.crop_id
            JOIN salesmen s ON o.salesman_id = s.salesman_id
            WHERE o.farmer_id = %s
            ORDER BY o.order_id DESC
            """,
            (farmer_id,),
        )

        orders = cursor.fetchall()
        return jsonify({"orders": orders}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#  ---------------------------
# Update Order Status
# ---------------------------
@app.route('/updateorderstatus', methods=['POST', 'OPTIONS'])
def update_order_status():
    if request.method == 'OPTIONS':
        return '', 200

    conn = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No data received"}), 400

        orderid = data.get('orderid')
        status = data.get('status')

        if not orderid or not status:
            return jsonify({"message": "orderid and status are required"}), 400

        status = str(status).strip().lower()

        if status not in ['accepted', 'approved', 'rejected', 'pending']:
            return jsonify({"message": "Invalid status value"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT order_id, crop_id, quantity, status FROM orders WHERE order_id = %s",
            (orderid,)
        )
        order = cursor.fetchone()

        if not order:
            return jsonify({"message": "Order not found"}), 404

        if str(order['status']).lower() == 'accepted' and status == 'accepted':
            return jsonify({"message": "Order already accepted"}), 200

        update_cursor = conn.cursor()
        update_cursor.execute(
            "UPDATE orders SET status = %s WHERE order_id = %s",
            (status, orderid)
        )

        # Only reduce crop quantity when status changes to accepted
        if str(order['status']).lower() != 'accepted' and status == 'accepted':
            crop_cursor = conn.cursor()
            crop_cursor.execute(
                """
                UPDATE crops 
                SET quantity = quantity - %s 
                WHERE crop_id = %s AND quantity >= %s
                """,
                (order['quantity'], order['crop_id'], order['quantity'])
            )

            print(f"CROP UPDATE ROWCOUNT: {crop_cursor.rowcount}")
            print(f"CROP ID: {order['crop_id']}, QTY: {order['quantity']}")

            if crop_cursor.rowcount == 0:
                conn.rollback()
                return jsonify({"message": "Not enough crop quantity to accept this order"}), 400

            crop_cursor.close()

        conn.commit()
        update_cursor.close()
        cursor.close()
        conn.close()

        return jsonify({"message": "Order updated successfully"})

    except Exception as e:
        print(f"UPDATE ORDER ERROR: {e}")
        if conn:
            conn.rollback()
        return jsonify({"message": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------
# Get Stats
#   ---------------------------
@app.route("/stats", methods=["GET"])
def get_stats():
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM crops")
        total_crops = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM orders")
        total_orders = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM farmers")
        total_farmers = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM salesmen")
        total_salesmen = cursor.fetchone()[0]

        return jsonify({
            "total_crops": total_crops,
            "total_orders": total_orders,
            "total_farmers": total_farmers,
            "total_salesmen": total_salesmen
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# ---------------------------
# Update Crop
# ---------------------------
@app.route("/update_crop/<int:crop_id>", methods=["PUT"])
def update_crop(crop_id):
    try:
        data = request.get_json() or {}

        crop_name = data.get("crop_name", "").strip()
        quantity = data.get("quantity", "").strip()
        price = data.get("price", "").strip()
        location = data.get("location", "").strip()

        if not crop_name or not quantity or not price or not location:
            return jsonify({"message": "All fields required"}), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE crops
            SET crop_name = %s, quantity = %s, price = %s, location = %s
            WHERE crop_id = %s
            """,
            (crop_name, quantity, price, location, crop_id),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Crop updated successfully"})
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# ---------------------------
# Delete Crop
# ---------------------------
@app.route("/delete_crop/<int:crop_id>", methods=["DELETE"])
def delete_crop(crop_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM crops WHERE crop_id = %s", (crop_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Crop deleted successfully"})
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ---------------------------
# Update Salesman Order
# ---------------------------
@app.route("/update_salesman_order", methods=["POST"])
def update_salesman_order():
    try:
        data = request.get_json() or {}

        order_id = data.get("order_id")
        salesman_id = data.get("salesman_id")
        quantity = data.get("quantity")

        if not order_id or not salesman_id or not quantity:
            return jsonify({"message": "order_id, salesman_id and quantity are required"}), 400

        quantity = int(quantity)
        if quantity <= 0:
            return jsonify({"message": "Quantity must be greater than 0"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT order_id, status
            FROM orders
            WHERE order_id = %s AND salesman_id = %s
        """, (order_id, salesman_id))
        order = cursor.fetchone()

        if not order:
            cursor.close()
            conn.close()
            return jsonify({"message": "Order not found"}), 404

        if str(order["status"]).lower() != "pending":
            cursor.close()
            conn.close()
            return jsonify({"message": "Only pending orders can be edited"}), 400

        update_cursor = conn.cursor()
        update_cursor.execute("""
            UPDATE orders
            SET quantity = %s
            WHERE order_id = %s AND salesman_id = %s
        """, (quantity, order_id, salesman_id))

        conn.commit()
        update_cursor.close()
        cursor.close()
        conn.close()

        return jsonify({"message": "Order quantity updated successfully"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ---------------------------
# Delete Salesman Order
# ---------------------------
@app.route("/delete_salesman_order", methods=["POST"])
def delete_salesman_order():
    try:
        data = request.get_json() or {}

        order_id = data.get("order_id")
        salesman_id = data.get("salesman_id")

        if not order_id or not salesman_id:
            return jsonify({"message": "order_id and salesman_id are required"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT order_id, status
            FROM orders
            WHERE order_id = %s AND salesman_id = %s
        """, (order_id, salesman_id))
        order = cursor.fetchone()

        if not order:
            cursor.close()
            conn.close()
            return jsonify({"message": "Order not found"}), 404

        if str(order["status"]).lower() != "pending":
            cursor.close()
            conn.close()
            return jsonify({"message": "Only pending orders can be deleted"}), 400

        delete_cursor = conn.cursor()
        delete_cursor.execute("""
            DELETE FROM orders
            WHERE order_id = %s AND salesman_id = %s
        """, (order_id, salesman_id))

        conn.commit()
        delete_cursor.close()
        cursor.close()
        conn.close()

        return jsonify({"message": "Order deleted successfully"})

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
# ---------------------------
# Update Profile
# ---------------------------
@app.route("/updateprofile", methods=["POST"])
def update_profile():
    conn = None
    cursor = None
    update_cursor = None
    try:
        userid = str(request.form.get("userid", "")).strip()
        role = str(request.form.get("role", "")).strip().lower()
        name = str(request.form.get("name", "")).strip()
        phone = str(request.form.get("phone", "")).strip()
        email = str(request.form.get("email", "")).strip()
        remove_image = str(request.form.get("remove_image", "false")).strip().lower() == "true"
        image = request.files.get("image")

        if not userid or not role or not name or not phone or not email:
            return jsonify({"message": "All fields are required"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        if role == "farmer":
            cursor.execute(
                "SELECT farmer_id, profile_image FROM farmers WHERE farmer_id = %s",
                (userid,)
            )
            user_row = cursor.fetchone()
            table = "farmers"
            id_col = "farmer_id"
        elif role == "salesman":
            cursor.execute(
                "SELECT salesman_id, profile_image FROM salesmen WHERE salesman_id = %s",
                (userid,)
            )
            user_row = cursor.fetchone()
            table = "salesmen"
            id_col = "salesman_id"
        else:
            return jsonify({"message": "Invalid role"}), 400

        if not user_row:
            return jsonify({"message": f"{role.capitalize()} not found"}), 404

        old_filename = user_row.get("profile_image")
        filename = old_filename

        if remove_image:
            if old_filename:
                old_path = os.path.join(app.config["UPLOAD_FOLDER"], old_filename)
                if os.path.exists(old_path):
                    os.remove(old_path)
            filename = None

        if image and image.filename:
            if not allowed_file(image.filename):
                return jsonify({"message": "Only png, jpg, jpeg, webp files allowed"}), 400

            ext = image.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

            if old_filename and old_filename != filename:
                old_path = os.path.join(app.config["UPLOAD_FOLDER"], old_filename)
                if os.path.exists(old_path):
                    os.remove(old_path)

        update_cursor = conn.cursor()
        update_cursor.execute(
            f"""
            UPDATE {table}
            SET name = %s, phone = %s, email = %s, profile_image = %s
            WHERE {id_col} = %s
            """,
            (name, phone, email, filename, userid)
        )

        conn.commit()

        return jsonify({
            "message": "Profile updated successfully",
            "filename": filename or ""
        }), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"message": str(e)}), 500

    finally:
        if update_cursor:
            update_cursor.close()
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
if __name__ == "__main__":
    app.run(debug=True)

# if __name__ == '__main__':
#     app.run(debug=True, port=5001)
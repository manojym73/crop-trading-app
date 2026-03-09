from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Crop Trading API Running"

if __name__ == "__main__":
    app.run(debug=True)
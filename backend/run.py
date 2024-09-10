import os
from flask import Flask
from flask_cors import CORS
from app.routes import routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register the blueprint
app.register_blueprint(routes)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
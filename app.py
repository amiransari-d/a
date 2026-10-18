
import os
import re

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError

load_dotenv()

app = Flask(__name__)

database_url = os.getenv("DATABASE_URL", "").strip()

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024

db = SQLAlchemy(app)


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    subject = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False
    )


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(error="Please submit a valid form."), 400

    name = data.get("name", "")
    email = data.get("email", "")
    subject = data.get("subject", "")
    message = data.get("message", "")

    if not all(isinstance(value, str) for value in
               [name, email, subject, message]):
        return jsonify(error="Invalid form data."), 400

    name = name.strip()
    email = email.strip()
    subject = subject.strip()
    message = message.strip()

    if not all([name, email, subject, message]):
        return jsonify(error="All fields are required."), 400

    if len(name) > 100 or len(email) > 254:
        return jsonify(error="Name or email is too long."), 400

    if len(subject) > 150 or len(message) > 5000:
        return jsonify(error="Subject or message is too long."), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify(error="Enter a valid email address."), 400

    if not database_url:
        app.logger.error("DATABASE_URL is not configured.")
        return jsonify(error="Database is not configured yet."), 503

    try:
        contact_message = ContactMessage(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        db.session.add(contact_message)
        db.session.commit()

        return jsonify(
            message="Your message was saved successfully. Thank you!"
        ), 201

    except SQLAlchemyError:
        db.session.rollback()
        app.logger.exception("Could not save contact message.")

        return jsonify(
            error="Message could not be saved. Please try again later."
        ), 500


if __name__ == "__main__":
    app.run(debug=True)

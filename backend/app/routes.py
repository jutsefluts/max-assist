from flask import Blueprint, request, jsonify
from .services import generate_lesson_content, generate_question_content
import traceback

routes = Blueprint('routes', __name__)

@routes.route('/generate_lesson', methods=['POST'])
def generate_lesson():
    data = request.json
    topic = data.get('topic')
    audience = data.get('audience')
    objectives = data.get('objectives')
    
    if not all([topic, audience, objectives]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        sections = generate_lesson_content(topic, audience, objectives)
        return jsonify({"sections": sections})
    except Exception as e:
        error_message = f"Error: {str(e)}\n{traceback.format_exc()}"
        print(error_message)
        return jsonify({"error": "Internal Server Error", "details": error_message}), 500

@routes.route('/generate_question', methods=['POST'])
def generate_question():
    data = request.json
    text = data.get('text')
    question_type = data.get('questionType')
    
    if not text or not question_type:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        question, options, answer = generate_question_content(text, question_type)
        return jsonify({"question": question, "options": options, "answer": answer})
    except Exception as e:
        error_message = f"Error: {str(e)}\n{traceback.format_exc()}"
        print(error_message)
        return jsonify({"error": "Internal Server Error", "details": error_message}), 500

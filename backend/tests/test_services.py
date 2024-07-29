import pytest
from app.services import generate_lesson_content, generate_question_content

def test_generate_lesson_content():
    topic = "Python"
    audience = "Beginners"
    objectives = "Understand basic syntax and data structures"
    sections = generate_lesson_content(topic, audience, objectives)
    assert isinstance(sections, list)
    assert len(sections) > 0

def test_generate_question_content_radios():
    text = "What is Python?"
    question_type = "radios"
    question, options, answer = generate_question_content(text, question_type)
    assert isinstance(question, str)
    assert isinstance(options, list)
    assert isinstance(answer, str)
    assert len(options) == 4

def test_generate_question_content_textarea():
    text = "Describe Python."
    question_type = "textarea"
    question, options, answer = generate_question_content(text, question_type)
    assert isinstance(question, str)
    assert isinstance(answer, str)

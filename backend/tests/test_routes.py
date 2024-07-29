import pytest
from flask import Flask
from app.routes import routes

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(routes)
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_generate_lesson(client):
    response = client.post('/generate_lesson', json={
        'topic': 'Python',
        'audience': 'Beginners',
        'objectives': 'Understand basic syntax and data structures'
    })
    json_data = response.get_json()
    assert response.status_code == 200
    assert 'sections' in json_data

def test_generate_question(client):
    response = client.post('/generate_question', json={
        'text': 'What is Python?',
        'questionType': 'radios'
    })
    json_data = response.get_json()
    assert response.status_code == 200
    assert 'question' in json_data
    assert 'options' in json_data
    assert 'answer' in json_data

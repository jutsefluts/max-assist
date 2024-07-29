import os
from openai import OpenAI
from .config import Config

MODEL = "gpt-4o-mini"
API_KEY = Config.OPENAI_API_KEY

print("Loaded API Key from config:", API_KEY)

if not API_KEY:
    raise ValueError("No OPENAI_API_KEY found in environment variables")

client = OpenAI(api_key=API_KEY)

def generate_lesson_content(topic, audience, objectives):
    prompt = (f"Generate a detailed lesson on '{topic}' for {audience}. The learning objectives are: {objectives}. "
              "Provide content in sections suitable for an educational lesson. Exclude any instructions for teachers, "
              "timing indications, or questions. Focus only on the content that learners will see on the e-learning platform. "
              "Ensure that descriptions and their associated lists or bullet points are kept within the same section.")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content.strip()

        # Split the content into sections for the lesson content based on keywords and headings
        lesson_sections = []
        current_section = ""

        for line in content.split("\n"):
            line = line.strip()
            if line.startswith(("## ", "### ", "#### ", "Section", "Lesson Plan", "Learning Objectives")):
                if current_section:
                    lesson_sections.append(current_section.strip())
                current_section = f"<h1>{line}</h1>"
            else:
                current_section += f"<p>{line}</p>"
        
        if current_section:
            lesson_sections.append(current_section.strip())

        # Ensure each section has meaningful content
        lesson_sections = [section for section in lesson_sections if len(section.split()) > 5]

        return lesson_sections
    except Exception as e:
        raise e


def pretty_print(text):
    """
    Apply pretty-print formatting to the text.
    """
    # Split text into lines
    lines = text.split("\n")

    formatted_lines = []
    for line in lines:
        # Remove Markdown headers
        if line.startswith("#### "):
            formatted_lines.append("\n" + line[5:].strip() + "\n")
        elif line.startswith("### "):
            formatted_lines.append("\n" + line[4:].strip() + "\n")
        elif line.startswith("## "):
            formatted_lines.append("\n" + line[3:].strip() + "\n")
        elif line.startswith("###") and not line.startswith("####"):
            formatted_lines.append("\n" + line[3:].strip() + "\n")
        elif line.startswith("##") and not line.startswith("###"):
            formatted_lines.append("\n" + line[2:].strip() + "\n")
        elif line.startswith("#") and not line.startswith("##"):
            formatted_lines.append("\n" + line[1:].strip() + "\n")
        # Replace **bold** with <b>bold</b>
        elif "**" in line:
            parts = line.split("**")
            new_line = ""
            for i, part in enumerate(parts):
                if i % 2 == 0:
                    new_line += part
                else:
                    new_line += f"<b>{part}</b>"
            formatted_lines.append(new_line.strip())
        # Add spacing after headings and between list items
        elif line.startswith("-"):
            formatted_lines.append("    " + line.strip())
        elif line.strip().isdigit():
            formatted_lines.append(line.strip() + "\n")
        else:
            formatted_lines.append(line.strip())

    # Join lines with proper spacing
    formatted_text = "\n".join(formatted_lines)

    # Add spacing between paragraphs
    formatted_text = formatted_text.replace("\n", "\n\n")

    return formatted_text


def is_teacher_instruction(text):
    """
    Check if the text contains teacher instructions.
    """
    teacher_phrases = ["minutes", "teacher", "instructor", "discuss", "explain", "students will", "activity", "ask"]
    return any(phrase in text.lower() for phrase in teacher_phrases)

def is_question(text):
    """
    Check if the text contains questions.
    """
    return text.strip().endswith("?")

def generate_question_content(text, question_type):
    if question_type == 'radios':
        prompt = (f"Generate a multiple-choice question related to the following content: {text}.\n"
                  "Provide the question, four options, and indicate the correct answer. "
                  "Format the output as follows:\n"
                  "Question: <question>\n"
                  "Options:\n"
                  "1. <option1>\n"
                  "2. <option2>\n"
                  "3. <option3>\n"
                  "4. <option4>\n"
                  "Answer: <correct_option_number>")
    else:
        prompt = (f"Generate an open-ended question and its correct answer related to the following content: {text}.\n"
                  "Format the output as follows:\n"
                  "Question: <question>\n"
                  "Answer: <correct_answer>")

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        content = response.choices[0].message.content.strip()
        print("OpenAI Response Content:", content)  # Debugging line

        if question_type == 'radios':
            # Split content into lines and handle the multiple-choice format
            lines = content.split('\n')
            question = lines[0].split(": ")[1]
            options = []
            for line in lines[1:5]:
                if ". " in line:
                    options.append(line.split(". ")[1])
            answer = lines[-1].split(": ")[1]
            return question, options, answer
        else:
            # For open questions, the response includes both the question and answer
            lines = content.split('\n')
            question = lines[0].split(": ")[1]
            answer = lines[1].split(": ")[1]
            return question, [], answer

    except Exception as e:
        raise e

# max-assist

This project is a lesson generator application that consists of a backend and frontend. The backend is built using Flask, and the frontend is built using React.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Testing](#testing)
- [License](#license)

## Project Structure

max_assist/
├── backend/
│ ├── app/
│ │ ├── init.py
│ │ ├── config.py
│ │ ├── routes.py
│ │ ├── services.py
│ ├── tests/
│ │ ├── test_routes.py
│ │ ├── test_services.py
│ ├── .env
│ ├── requirements.txt
│ ├── run.py
│ ├── setup.py
├── frontend/
│ ├── public/
│ │ ├── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── Block.js
│ │ │ ├── Sidebar.js
│ │ ├── styles/
│ │ │ ├── Styles.css
│ │ ├── App.js
│ │ ├── index.js
│ ├── .env
│ ├── package.json
│ ├── package-lock.json
│ ├── .gitignore
├── .gitignore
├── README.md

r
Copy code

## Setup Instructions

To set up and run this project, follow these steps:

### Backend Setup

1. **Create a virtual environment:**
    ```sh
    python3 -m venv venv
    ```

2. **Activate the virtual environment:**
    - On Windows:
        ```sh
        .\venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```sh
        source venv/bin/activate
        ```

3. **Install the dependencies:**
    ```sh
    pip install -r backend/requirements.txt
    ```

4. **Run the backend server:**
    ```sh
    python backend/run.py
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

3. **Start the frontend development server:**
    ```sh
    npm start
    ```

## Usage

- The backend server will be running on `http://127.0.0.1:5000`.
- The frontend development server will be running on `http://127.0.0.1:3000`.

Ensure both servers are running to use the application.

## Testing

To run tests for the backend, use the following command:

```sh
pytest
License

This project is licensed under the MIT License.
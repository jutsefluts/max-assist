from setuptools import setup, find_packages

setup(
    name='max_assist',
    version='0.1',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'flask',
        'flask-cors',
        'openai',
        'python-dotenv',
    ],
    entry_points={
        'console_scripts': [
            'run_app=run:app.run',
        ],
    },
)

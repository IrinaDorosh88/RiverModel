# Base image
FROM tiangolo/uvicorn-gunicorn-fastapi:latest

# Set working directory
WORKDIR /app

COPY ./package ../package
# Copy requirements file and install dependencies
COPY ./backend/requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r ./requirements.txt

# Copy the rest of the application code
COPY ./backend/app .

# Expose port
EXPOSE 8000

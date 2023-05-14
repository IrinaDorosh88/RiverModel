# Base image
FROM tiangolo/uvicorn-gunicorn-fastapi:latest

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY ./app .

# Expose port
EXPOSE 8000

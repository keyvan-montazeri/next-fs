# FROM python:3.11-slim
# Use arm64-compatible Python base image
FROM arm64v8/python

# Install system dependencies for GPT4All (C++ backend libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    wget \
    git \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies
COPY app/requirements.txt .
RUN pip install setuptools
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY app .

# Expose FastAPI port
EXPOSE 8000

# Run the API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
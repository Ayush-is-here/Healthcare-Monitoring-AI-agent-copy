# 🐋 Step 1: Use an official, secure, lightweight Linux base image
FROM python:3.12-slim

# 🛠️ Step 2: Set critical system environment variables
# Prevents Python from writing .pyc files and keeps console logging instant
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 🔒 Step 3: THE SEED FIX! Force the Linux core to update its global certificate bundle.
# This guarantees that the operating system natively trusts PubMed and Gemini endpoints.
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# 📂 Step 4: Establish your working directory canvas
WORKDIR /app

# 📦 Step 5: Copy your pip specifications panel
COPY requirements.txt .

# ⚡ Step 6: Install your dependencies completely clean
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 🚀 Step 7: Inject the global secure environment pointer variable we used earlier
# This forces all Python web modules to use the updated certifi trust pack natively.
ENV SSL_CERT_FILE=/usr/local/lib/python3.12/site-packages/certifi/cacert.pem

# 📁 Step 8: Copy the rest of your backend codebase application tree
COPY . .

# 🔌 Step 9: Expose the Uvicorn web gateway port
EXPOSE 8000

# 🚀 Step 10: Launch your production server daemon
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
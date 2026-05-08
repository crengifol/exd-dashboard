FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt ./backend/

# Install dependencies
RUN cd backend && pip install --no-cache-dir -r requirements.txt

# Copy entire backend
COPY backend/ ./backend/

EXPOSE 8000

CMD ["cd backend && uvicorn main:app --host 0.0.0.0 --port 8000"]

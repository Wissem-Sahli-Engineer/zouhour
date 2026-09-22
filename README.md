# Zouhour ERP — Quickstart Guide (macOS)

A modern ERP platform for client management featuring AI-assisted passport extraction (OCR & portrait cropping) built with **React + Vite**, **FastAPI**, and local **Ollama Vision AI**.

---

## 🛠 Prerequisites for macOS

Before starting, ensure you have the following installed on your Mac:

1. **Homebrew** (recommended package manager):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Node.js** (v18 or newer):
   ```bash
   brew install node
   # Verify: node -v && npm -v
   ```
3. **Python 3** (3.10+):
   ```bash
   brew install python
   # Verify: python3 --version
   ```
4. **Ollama** (for local Vision AI extraction):
   ```bash
   brew install ollama
   # Or download the macOS desktop app from https://ollama.com
   ```

---

## 📦 Installation

Open **Terminal** and navigate to the project directory:

```bash
cd /path/to/zouhour
```

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Set Up Python Virtual Environment & Backend Dependencies
Using a virtual environment is the recommended standard on macOS:

```bash
# Create virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 3. Set Up the PostgreSQL Database
Clients are stored in PostgreSQL (18, installed at `/Library/PostgreSQL/18`). Create an app role and database once, as the `postgres` admin:

```bash
/Library/PostgreSQL/18/bin/psql -U postgres -h localhost \
  -c "CREATE ROLE zouhour LOGIN PASSWORD 'your_app_password';" \
  -c "CREATE DATABASE zouhour OWNER zouhour;"
```

Copy `.env.example` to `.env` and put the app password in `DATABASE_URL` (no quotes). Then create the tables:

```bash
.venv/bin/alembic upgrade head
```

Optional, one time: import the old `clients.json` (duplicates are skipped, safe to re-run):

```bash
.venv/bin/python -m backend.import_clients_json
```

Passport photos are saved as files in `uploads/clients/` (git-ignored); the database stores only their path. Back up both:

```bash
/Library/PostgreSQL/18/bin/pg_dump -U zouhour -h localhost zouhour > backup.sql
```

After changing `backend/models.py`, create and apply a migration:

```bash
.venv/bin/alembic revision --autogenerate -m "describe the change"
.venv/bin/alembic upgrade head
```

### 4. Download the Vision AI Model
Download the Qwen2.5-VL model required for passport extraction:

```bash
ollama pull qwen2.5vl:3b-8k
```

---

## 🚀 Launching the Application

To run the full stack, you need **3 services** running concurrently (open 3 separate Terminal tabs/windows or run in the background):

### Tab 1: Ollama Service
*(Skip if you already have the Ollama macOS desktop menu bar app running)*
```bash
ollama serve
```
> Quick test to verify Ollama is active:
> ```bash
> curl http://localhost:11434/
> # Should return: "Ollama is running"
> ```

---

### Tab 2: Backend API (FastAPI)
Run from the root project directory:
```bash
source .venv/bin/activate
uvicorn backend.backend:app --host 0.0.0.0 --port 8001 --reload
```
- API runs at: `http://localhost:8001`
- Swagger Docs available at: `http://localhost:8001/docs`

---

### Tab 3: Frontend (Vite + React)
```bash
npm run dev
```
- Web Application runs at: [http://localhost:5173](http://localhost:5173)

---

## 🧭 How to Use

1. **Access the App**:
   - Open your browser to [http://localhost:5173](http://localhost:5173).
2. **Sign In**:
   - Enter your email address (e.g., `agent@zouhour.com`) and any password to access the dashboard.
3. **Passport AI Extraction**:
   - Go to the **Scan / Upload** page.
   - Upload or drag-and-drop a passport photo (JPEG/PNG).
   - The backend sends the image to Ollama (`qwen2.5vl:3b-8k`), extracts all client attributes, and automatically crops the passport portrait photo.
   - Review and save the client to the database (`clients.json`).
4. **Client Management**:
   - View, search, and manage clients in the **Clients** list.

---

## ⚡ Useful macOS Shortcuts & Troubleshooting

- **Port 8001 already in use?**
  ```bash
  kill -9 $(lsof -t -i:8001)
  ```
- **Port 5173 already in use?**
  ```bash
  kill -9 $(lsof -t -i:5173)
  ```
- **Backend not finding `clients.json`?**
  Always start the backend server from the project root:
  ```bash
  uvicorn backend.backend:app --host 0.0.0.0 --port 8001 --reload
  ```

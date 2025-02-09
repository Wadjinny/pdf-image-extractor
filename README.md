# PDF Image Extractor Web App

A modern web application that allows users to extract images from PDF files. Built with FastAPI backend and React + Vite frontend.

## Features

- Upload multiple PDF files
- Extract all images from PDFs
- Download extracted images as a ZIP file
- Modern UI with Tailwind CSS and Shadcn UI
- Real-time extraction progress
- Error handling and validation

## Tech Stack

### Backend
- FastAPI
- PyMuPDF (fitz)
- Poetry for dependency management
- Python 3.8.1+

### Frontend
- React + Vite
- Tailwind CSS
- Shadcn UI components
- Lucide icons
- TypeScript

## Project Structure

```
pdf-image-extractor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── assets/
│   ├── public/
│   └── index.html
├── pyproject.toml
├── run.sh
└── README.md
```

## Prerequisites

- Python 3.8.1 or higher (required for development dependencies)
- Node.js 16 or higher
- Poetry (Python package manager)
- npm or yarn

### Installing Poetry

There are several ways to install Poetry:

1. Using the official installer (recommended):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Using pip (alternative method):
```bash
pip install --user poetry
```

3. On macOS with Homebrew:
```bash
brew install poetry
```

4. On Windows with PowerShell:
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

After installation, verify Poetry is installed correctly:
```bash
poetry --version
```

Make sure to add Poetry to your PATH if it's not automatically added.
- On Unix-like systems, it's typically: `$HOME/.local/bin`
- On Windows: `%APPDATA%\Python\Scripts`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-image-extractor
```

2. Install backend dependencies:
```bash
cd backend
poetry install --no-root
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Development

To run both backend and frontend in development mode:

```bash
chmod +x run.sh
./run.sh
```

This will start:
- Backend server at http://localhost:8000
- Frontend dev server at http://localhost:5173

## API Documentation

Once the backend is running, you can access:
- API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
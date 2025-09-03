# Prompt Engineer Agent (Flask + Ollama)

Build and stream optimized, structured prompts based on a detailed brief (goal, audience, tone, style, format, constraints, etc.). Includes quick-use links for ChatGPT, Blackbox, Perplexity, Gemini, and Grok.

## Prerequisites
- Python 3.10+
- [Ollama](https://ollama.com) running locally (`ollama serve`) and at least one model pulled (e.g., `ollama pull llama3.1`)

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OLLAMA_HOST="http://localhost:11434"
python app.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## How it works
- Frontend collects: goal, audience, tone, style, output format, length, keywords, constraints, language, context, and few-shot examples.
- Backend composes a prompt-engineering instruction for the LLM and streams a single optimized prompt back via Ollama’s `generate` API.
- Use the dropdown to open the generated prompt directly in:
  - ChatGPT
  - Blackbox
  - Perplexity
  - Gemini
  - Grok

## File structure
- `app.py` — Flask server, `/api/models` and `/api/generate`
- `templates/index.html` — UI form and output layout
- `static/styles.css` — Styling and responsive layout
- `static/app.js` — Fetch models, stream generation, share menu
- `requirements.txt` — Dependencies

## Troubleshooting
- If `/api/models` fails, ensure Ollama is running and `OLLAMA_HOST` is set correctly.
- If generation streams errors, verify the model name exists in `ollama list`.

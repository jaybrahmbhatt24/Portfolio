import os
from typing import Dict, Generator, List

from flask import Flask, Response, jsonify, render_template, request, send_from_directory
from flask_cors import CORS

try:
    import ollama
except Exception as import_error:  # pragma: no cover
    ollama = None


def create_app() -> Flask:
    app = Flask(
        __name__,
        static_folder="static",
        template_folder="templates",
    )
    CORS(app)

    @app.route("/")
    def index() -> str:
        return render_template("index.html")

    @app.route("/favicon.ico")
    def favicon():  # pragma: no cover
        return send_from_directory(
            os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/x-icon"
        )

    @app.route("/api/models", methods=["GET"])
    def list_models() -> Response:
        if ollama is None:
            return jsonify({"error": "ollama python package not installed"}), 500
        try:
            client = ollama.Client(host=os.environ.get("OLLAMA_HOST", "http://localhost:11434"))
            result = client.list()
            models = result.get("models", [])
            names: List[str] = sorted({m.get("name", "").strip() for m in models if m.get("name")})
            return jsonify({"models": names})
        except Exception as exc:  # pragma: no cover
            return jsonify({"error": str(exc)}), 500

    def compose_prompt_engineer_instruction(payload: Dict) -> str:
        goal = (payload.get("goal") or "").strip()
        audience = (payload.get("audience") or "").strip()
        tone = (payload.get("tone") or "").strip()
        style = (payload.get("style") or "").strip()
        output_format = (payload.get("output_format") or "").strip()
        length = (payload.get("length") or "").strip()
        keywords = (payload.get("keywords") or "").strip()
        constraints = (payload.get("constraints") or "").strip()
        language = (payload.get("language") or "English").strip()
        context = (payload.get("context") or "").strip()
        examples = (payload.get("examples") or "").strip()

        details_lines: List[str] = []
        details_lines.append(f"Goal: {goal or 'N/A'}")
        if audience:
            details_lines.append(f"Target audience: {audience}")
        if tone:
            details_lines.append(f"Tone: {tone}")
        if style:
            details_lines.append(f"Writing style: {style}")
        if output_format:
            details_lines.append(f"Desired output format: {output_format}")
        if length:
            details_lines.append(f"Expected length: {length}")
        if keywords:
            details_lines.append(f"Keywords / key points: {keywords}")
        if constraints:
            details_lines.append(f"Constraints & must-haves: {constraints}")
        if language:
            details_lines.append(f"Language: {language}")
        if context:
            details_lines.append("Additional context:\n" + context)
        if examples:
            details_lines.append("Few-shot examples:\n" + examples)

        brief = "\n".join(details_lines)

        instruction = f"""
You are an expert Prompt Engineer. Your task is to transform the provided brief into a single, optimized, unambiguous, and structured prompt that will guide an LLM to produce the best possible result.

Requirements:
- Start with a crisp role and objective.
- Include explicit step-by-step instructions and success criteria.
- Specify audience, tone, and writing style.
- Constrain length and format explicitly.
- Add bullet-pointed requirements and do/don't lists when helpful.
- Include variables/placeholders only if essential.
- Use the requested language: {language}.
- Output ONLY the final optimized prompt. Do not include explanations, headers, or code fences.

Brief:
{brief}
""".strip()

        return instruction

    def stream_ollama_generate(model: str, prompt_text: str, temperature: float) -> Generator[bytes, None, None]:
        if ollama is None:
            yield b"[ERROR] ollama python package not installed.\n"
            return
        try:
            client = ollama.Client(host=os.environ.get("OLLAMA_HOST", "http://localhost:11434"))
            # Use generate API for a single-turn completion
            for chunk in client.generate(
                model=model,
                prompt=prompt_text,
                stream=True,
                options={"temperature": temperature},
            ):
                token = chunk.get("response", "")
                if not token:
                    continue
                # Yield raw text for fetch streaming
                yield token.encode("utf-8")
        except Exception as exc:  # pragma: no cover
            yield f"\n[ERROR] {exc}\n".encode("utf-8")

    @app.route("/api/generate", methods=["POST"])
    def generate_prompt() -> Response:
        payload = request.get_json(force=True, silent=True) or {}

        model = (payload.get("model") or "llama3.1").strip()
        try:
            temperature = float(payload.get("creativity", 0.3))
        except Exception:
            temperature = 0.3
        temperature = max(0.0, min(1.5, temperature))

        instruction = compose_prompt_engineer_instruction(payload)

        return Response(
            stream_ollama_generate(model=model, prompt_text=instruction, temperature=temperature),
            mimetype="text/plain; charset=utf-8",
        )

    return app


if __name__ == "__main__":  # pragma: no cover
    port = int(os.environ.get("PORT", "5000"))
    host = os.environ.get("HOST", "0.0.0.0")
    app = create_app()
    app.run(host=host, port=port, debug=True)


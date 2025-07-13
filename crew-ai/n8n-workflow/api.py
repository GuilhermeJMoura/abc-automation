from flask import Flask, request, jsonify
import re, json, os, sys
from uuid import uuid4
from dotenv import load_dotenv

# ---------------- internal imports ----------------
sys.path.append(os.path.abspath('../n8n-workflow'))   # keep your relative import
from crew_ai import Crew                               # <-- import Crew class
from config.agents import clarifier_agent              # NEW
from config.tasks  import clarify_requirements_task    # existing

# ---------------------------------------------------
load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

app = Flask(__name__)

# ①  Build a mini-crew just for the Clarifier
clarifier_crew = Crew(
    agents=[clarifier_agent],
    tasks=[clarify_requirements_task],
    verbose=True        # or False – up to you
)

# simple in-memory session cache
SESSIONS = {}           # {sid: {"history":[…]}}


def run_clarifier(user_prompt: str, history: list[str]) -> dict:
    result = clarifier_crew.kickoff(inputs={
        "user_prompt": user_prompt,
        "history": "\n".join(history)
    })
    match = re.search(r"\{.*\}", str(result))
    data  = json.loads(match.group(0)) if match else {"status": "ERROR"}

    # normalise: always return **array** under "questions"
    if data.get("status") == "ASK":
        q = data.get("questions") or data.get("question")
        if not isinstance(q, list):
            q = [q]
        data = {"status": "ASK", "questions": q}
    return data



@app.route('/clarify', methods=['POST'])
def clarify():
    data      = request.json or {}
    sess_id   = data.get('session_id') or str(uuid4())
    user_text = (data.get('user_prompt') or '').strip()
    if not user_text:
        return jsonify({"error": "user_prompt required"}), 400

    hist = SESSIONS.setdefault(sess_id, {"history": []})["history"]
    hist.append(user_text)

    out = run_clarifier(user_text, hist)

    if out.get("status") == "ASK":
        # Clarifier now returns ONE question string
        return jsonify({"session_id": sess_id, "questions": out["questions"]})

    if out.get("status") == "READY":
        return jsonify({
            "session_id": sess_id,
            "ready"     : True,
            "context"   : out["context"]
        })

    return jsonify({"error": "Clarifier failed"}), 500


# ------------------- generate-workflow endpoint (unchanged) -------------------
from config.tasks import identify_nodes_task, generate_workflow_task  # already in your repo
from config.agents import node_identifier, workflow_generator         # already in your repo
from crew_ai import crew                                              # this is your ORIGINAL crew

@app.route('/generate-workflow', methods=['POST'])
def generate_workflow():
    try:
        data = request.json or {}
        user_prompt = data.get('user_prompt')
        if not user_prompt:
            return jsonify({"error": "'user_prompt' is required"}), 400

        instruction = data.get(
            'instruction',
            'Utilize a ferramenta de busca para verificar na documentação oficial '
            'do n8n quais são as operações válidas para cada node antes de incluí-las no workflow.'
        )
        verbose = data.get('verbose', True)

        if OPENAI_API_KEY:
            os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

        result = crew.kickoff(inputs={
            "user_prompt": user_prompt,
            "verbose"    : verbose,
            "instruction": instruction
        })

        match = re.search(r"```json\n(.*?)\n```", str(result), re.DOTALL)
        if match:
            parsed = json.loads(match.group(1))
            return jsonify(parsed), 200

        return jsonify({"error": "Não foi possível extrair o JSON do resultado"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

from pathlib import Path
import os
import socket
import sys


PROJECT_DIR = Path(__file__).resolve().parent / "backend"

os.chdir(PROJECT_DIR)
sys.path.insert(0, str(PROJECT_DIR))

from app import app  # noqa: E402


def choose_port(preferred_port: int) -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        if sock.connect_ex(("127.0.0.1", preferred_port)) != 0:
            return preferred_port

    fallback_port = preferred_port + 1
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        while sock.connect_ex(("127.0.0.1", fallback_port)) == 0:
            fallback_port += 1
    print(f"Port {preferred_port} is already in use. Starting on port {fallback_port} instead.")
    return fallback_port


if __name__ == "__main__":
    port = choose_port(int(os.environ.get("PORT", "5001")))
    app.run(debug=True, port=port, use_reloader=False)

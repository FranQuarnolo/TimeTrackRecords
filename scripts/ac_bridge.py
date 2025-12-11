import asyncio
import json
import socket
import qrcode
import uvicorn
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from sim_info import SimInfo
import time

app = FastAPI()
sim_info = SimInfo()

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

@app.get("/")
async def get():
    return HTMLResponse("""
    <html>
        <head>
            <title>AC Bridge</title>
        </head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: white;">
            <h1>Assetto Corsa Bridge está Corriendo</h1>
            <p>Conecta tu aplicación Live Timing a esta PC.</p>
        </body>
    </html>
    """)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("¡Cliente conectado!")
    try:
        while True:
            # Re-initialize sim_info if it failed initially (game wasn't running)
            if not sim_info.physics:
                sim_info.__init__()
            
            if sim_info.physics and sim_info.graphics and sim_info.static:
                data = {
                    "connected": True,
                    "physics": {
                        "speedKmh": sim_info.physics.speedKmh,
                        "rpms": sim_info.physics.rpms,
                        "gear": sim_info.physics.gear,
                        "gas": sim_info.physics.gas,
                        "brake": sim_info.physics.brake,
                    },
                    "graphics": {
                        "currentTime": sim_info.graphics.iCurrentTime,
                        "lastTime": sim_info.graphics.iLastTime,
                        "bestTime": sim_info.graphics.iBestTime,
                        "completedLaps": sim_info.graphics.completedLaps,
                        "position": sim_info.graphics.position,
                        "flag": sim_info.graphics.flag,
                    },
                    "static": {
                        "maxRpm": sim_info.static.maxRpm,
                        "carModel": sim_info.static.carModel,
                        "track": sim_info.static.track,
                        "playerName": sim_info.static.playerName,
                    }
                }
            else:
                data = {
                    "connected": False,
                    "message": "Esperando a Assetto Corsa..."
                }
            
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(0.05) # 20Hz update rate
    except Exception as e:
        print(f"Conexión cerrada: {e}")

def print_qr(url):
    qr = qrcode.QRCode()
    qr.add_data(url)
    qr.make()
    qr.print_ascii()

if __name__ == "__main__":
    ip = get_ip_address()
    port = 8000
    url = f"ws://{ip}:{port}/ws"
    
    print("\n" + "="*60)
    print(f" 🏎️  AC BRIDGE INICIADO")
    print("="*60)
    print(f" IP Local: {ip}")
    print(f" URL WebSocket: {url}")
    print("="*60)
    print(" ⚠️  IMPORTANTE - LEER SI NO CONECTA:")
    print(" 1. Tu celular y esta PC deben estar en el MISMO WiFi.")
    print(" 2. Si usas VPN, desactívala.")
    print(" 3. Revisa el Firewall de Windows:")
    print("    - Asegúrate de que 'python' o 'main' tenga permisos.")
    print("    - Si tu red está como 'Pública', cámbiala a 'Privada'.")
    print("="*60)
    print(" Accede a la web app vía HTTP (no HTTPS):")
    print(f" 👉 http://{ip}:3000")
    print("="*60 + "\n")
    
    print("Escanea este código QR con tu celular:")
    print_qr(url)
    
    # Auto-open browser
    try:
        import webbrowser
        print("Abriendo navegador...")
        webbrowser.open(f"http://localhost:3000")
    except Exception as e:
        print(f"No se pudo abrir el navegador automáticamente: {e}")

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")

import cv2
import time
import json
import base64
import paho.mqtt.client as mqtt

# --- [설정] AWS 서버 정보 ---
AWS_IP = "43.202.245.190"  # AWS 퍼블릭 IP
TOPIC = "argus/cctv/stream" # 약속된 우편함 주소

# 1. MQTT 연결 (AWS로 접속)
client = mqtt.Client()
try:
    print(f"📡 AWS({AWS_IP})로 연결 시도 중...")
    client.connect(AWS_IP, 1883, 60)
    print("✅ 연결 성공! 웹캠 영상을 송출합니다. (종료하려면 Ctrl+C)")
except Exception as e:
    print(f"❌ 연결 실패! AWS 보안그룹 1883 포트가 열려있나요? ({e})")
    exit()

# 2. 노트북 웹캠 켜기 (0번 = 기본 캠)
cap = cv2.VideoCapture(0)

# 영상 크기 조절 (너무 크면 전송이 느려요)
cap.set(3, 640) # 너비
cap.set(4, 480) # 높이

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ 웹캠을 찾을 수 없습니다.")
        break

    # 3. 이미지 압축 (전송 속도를 위해 품질 50%로 낮춤)
    # 0~100 사이값. 낮을수록 화질은 떨어지지만 속도는 빨라집니다.
    _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 50])
    img_str = base64.b64encode(buffer).decode('utf-8')

    # 4. 데이터 포장 (백엔드가 알아들을 수 있는 양식)
    payload = {
        "device_id": "MY_LAPTOP_CAM",
        "img_base64": img_str,
        "detail_info": {"status": "Live", "battery": 100}
    }

    # 5. AWS로 쏘기! 🚀
    client.publish(TOPIC, json.dumps(payload))
    
    # 0.1초 대기 (초당 약 10장 전송)
    time.sleep(0.1)

cap.release()
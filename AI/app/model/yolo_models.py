from ultralytics import YOLO
from pathlib import Path
import platform

# 운영체제에 따라 모델 경로 설정
if platform.system() == "Windows":
    LOCAL_MODEL_DIR = Path("C:/models")  # Windows에서의 모델 경로
else:  # Linux(Ubuntu)일 경우
    LOCAL_MODEL_DIR = Path("/home/ubuntu/models")  # EC2 Ubuntu 서버의 모델 경로

def load_model(model_name):
    model_path = LOCAL_MODEL_DIR / f"{model_name}.pt"
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found at {model_path}")
    return YOLO(str(model_path))  # YOLOv8 모델 로드


# 모델 로드
house_model = load_model("house")
tree_model = load_model("tree")
male_model = load_model("male")
female_model = load_model("female")

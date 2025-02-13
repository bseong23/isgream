from fastapi import APIRouter, HTTPException
import requests
from PIL import Image
from io import BytesIO
import pandas as pd
from app.schemas.image import PredictionRequest
from app.model.yolo_models import house_model, tree_model, male_model, female_model
from app.core.core import diagnose
router = APIRouter()

# 기본 모델 설정 (house_model 사용)
model_mapping = {
    "house": house_model,  # 기본 모델
    "tree": tree_model,
    "male": male_model,
    "female": female_model
}

@router.post("/predict")
async def predict(request: PredictionRequest):
    predictions = []

    for file in request.files:
        # 파일 타입에 따른 모델 선택, 기본값은 house_model
        selected_model = model_mapping.get(file.type, house_model)

        try:
            # 네트워크 요청 (타임아웃 5초 설정)
            response = requests.get(file.imageUrl, timeout=5)
            response.raise_for_status()  # HTTP 오류 발생 시 예외 처리

            # 이미지 로드
            image = Image.open(BytesIO(response.content))
            width, height = image.size

            # 모델 예측 실행 (YOLOv8)
            results = selected_model.predict(image)

            # YOLOv8의 결과를 YOLOv5 형식(pandas DataFrame)으로 변환
            detected_objects = []
            for result in results:
                boxes = result.boxes.xyxy.cpu().numpy()  # 객체 좌표
                confidences = result.boxes.conf.cpu().numpy()  # 신뢰도 점수
                class_ids = result.boxes.cls.cpu().numpy()  # 클래스 ID
                class_names = result.names  # 클래스 이름

                data = []
                for i in range(len(boxes)):
                    xmin, ymin, xmax, ymax = boxes[i]
                    data.append({
                        "xmin": float(xmin),
                        "ymin": float(ymin),
                        "xmax": float(xmax),
                        "ymax": float(ymax),
                        "confidence": float(confidences[i]),
                        "class": int(class_ids[i]),
                        "name": class_names[int(class_ids[i])]
                    })

                # YOLOv5의 `pandas().xyxy[0].to_dict(orient="records")`와 동일한 구조
                detected_objects = pd.DataFrame(data).to_dict(orient="records")

            # 결과 데이터 변환 및 정규화
            for obj in detected_objects:
                obj["cx"] = (obj["xmin"] + obj["xmax"]) / 2
                obj["cy"] = (obj["ymin"] + obj["ymax"]) / 2
                obj["cx_norm"] = obj["cx"] / width
                obj["cy_norm"] = obj["cy"] / height

            # 예측 결과 저장
            predictions.append({
                "time": file.time,
                "type": file.type,
                "imageUrl": file.imageUrl,
                "image_width": width,
                "image_height": height,
                "predictions": detected_objects
            })

        except requests.exceptions.Timeout:
            raise HTTPException(status_code=408, detail=f"Request timeout for image: {file.imageUrl}")
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=400, detail=f"Network error: {file.imageUrl}, {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing image: {file.imageUrl}, {str(e)}")

    # 진단 함수 실행
    diagnose_result = diagnose(predictions)
    return diagnose_result

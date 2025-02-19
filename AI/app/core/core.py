import concurrent.futures
from app.core.rag import process_predictions

def diagnose(predictions):
    """모든 분석 결과를 멀티스레딩을 활용하여 병렬 처리 (순서 보장)"""
    type_to_function = {
        "house": house,
        "tree": tree,
        "male": male,
        "female": female,
    }

    def process_prediction(i, prediction):
        """개별 예측을 처리하는 함수"""
        header = f"검사 순서: {i+1}\n검사 시간: {prediction['time']}\n검사 유형: {prediction['type'].capitalize()}"

        # 순서가 3번째일 때 (i == 2) 추가적인 분석 내용 포함
        if i == 2:
            if prediction["type"] == "male":
                header += "\n남성이 먼저 그려졌습니다. 이는 가족 내에서 남성이 중요한 역할을 하거나, 아이가 남성에게 더 큰 심리적 의미를 부여할 가능성을 시사합니다."
            elif prediction["type"] == "female":
                header += "\n여성이 먼저 그려졌습니다. 이는 아이가 어머니 또는 여성 보호자에게 더 큰 애착을 가지고 있거나, 여성의 역할을 더 중요하게 생각할 가능성이 있습니다."

        if prediction["type"] in type_to_function:
            analysis_result = type_to_function[prediction["type"]](prediction)
            
            return f"{header}\n{process_predictions(analysis_result)}"
        return None

    # 멀티스레딩 적용 (순서 보장)
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_index = {executor.submit(process_prediction, i, pred): i for i, pred in enumerate(predictions)}
        ordered_results = [None] * len(predictions)

        for future in concurrent.futures.as_completed(future_to_index):
            index = future_to_index[future]  # 원래 인덱스 가져오기
            result = future.result()
            if result:
                ordered_results[index] = result  # 순서 유지

    return "\n----\n".join(filter(None, ordered_results))  # None 제거 후 반환

def classify_position(cx_norm, cy_norm):
    """객체의 위치를 왼쪽/가운데/오른쪽, 상/중/하로 분류"""
    x_position = "왼쪽" if cx_norm <= 0.33 else "가운데" if cx_norm <= 0.66 else "오른쪽"
    y_position = "상단" if cy_norm <= 0.33 else "중간" if cy_norm <= 0.66 else "하단"
    return x_position, y_position

def classify_size(obj_width, obj_height, image_width, image_height):
    """객체의 크기를 작은/중간/큰 크기로 분류"""
    size_ratio = ((obj_width / image_width) + (obj_height / image_height)) / 2
    return "작음" if size_ratio <= 0.33 else "중간" if size_ratio <= 0.66 else "큼"


def analyze_object(obj, category, image_width, image_height):
    """개별 객체의 위치 및 심리적 해석 (크기가 중요하지 않은 객체 제외)"""
    x_pos, y_pos = classify_position(obj["cx_norm"], obj["cy_norm"])
    interpretations = {
        "왼쪽": "과거 지향적 경향",
        "가운데": "현재의 안정과 집중",
        "오른쪽": "미래 지향적 경향",
        "상단": "이상적이고 희망적인 사고",
        "중간": "현실적이고 중립적인 태도",
        "하단": "기초적이고 안정감 있는 기반",
    }

    result = (
        f"- {obj['name']} ({category}) 존재\n"
        f"  위치: {x_pos} / {y_pos} → {interpretations[x_pos]}과 {interpretations[y_pos]} 의미"
    )

    if obj["name"] not in ["울타리", "길", "연못", "산", "꽃", "잔디", "태양", "나뿌리", "나뭇잎", "열매", "새", "구름", "별"]:
        if category not in ["남자 사람", "여자 사람"] or obj["name"] == "상체":
            size = classify_size(
                obj["xmax"] - obj["xmin"], obj["ymax"] - obj["ymin"],
                image_width, image_height
            )
            size_interpretations = {
                "작음": "자신감 부족 또는 위축된 성향",
                "중간": "평균적이고 균형 잡힌 상태",
                "큼": "자신감 넘치는 표현"
            }
            result += f"\n  크기: {size} → {size_interpretations[size]} 의미"

    return result


def analyze_missing_objects(prediction, category, expected_objects):
    """존재하지 않는 객체를 분석하여 추가 정보 제공"""
    existing_objects = {obj["name"] for obj in prediction["predictions"]}
    return [
        f"- {obj} ({category}) 없음 → 관련 요소가 생략되었을 가능성"
        for obj in expected_objects if obj not in existing_objects
    ]

def house(prediction):
    """집(House) 그림 분석"""
    return analyze_generic(prediction, "집", ["집전체", "지붕", "문", "창문", "굴뚝", "울타리", "길", "연못", "산", "나무", "꽃", "잔디", "태양"])

def tree(prediction):
    """나무(Tree) 그림 분석"""
    return analyze_generic(prediction, "나무", ["나무전체", "기둥", "수관", "가지", "뿌리", "나뿌리", "나뭇잎", "꽃", "열매", "새", "구름", "별"])

def male(prediction):
    """남성(Male) 그림 분석"""
    return analyze_generic(prediction, "남자 사람", ["사람전체", "머리", "얼굴", "눈", "코", "입", "귀", "머리카락", "목", "상체", "팔", "손", "다리", "발"])

def female(prediction):
    """여성(Female) 그림 분석"""
    return analyze_generic(prediction, "여자 사람", ["사람전체", "머리", "얼굴", "눈", "코", "입", "귀", "머리카락", "목", "상체", "팔", "손", "다리", "발"])

def analyze_generic(prediction, category, expected_objects):
    """공통 분석 함수"""
    result = [f"🔹 {category} 그림 분석"]
    image_width = prediction.get("image_width", 1)
    image_height = prediction.get("image_height", 1)

    for obj in prediction["predictions"]:
        result.append(analyze_object(obj, category, image_width, image_height))
    result.extend(analyze_missing_objects(prediction, category, expected_objects))
    return "\n".join(result)

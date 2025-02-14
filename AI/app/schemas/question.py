from pydantic import BaseModel


class QuestionRequest(BaseModel):
    question: str  # 입력 텍스트 (질문)
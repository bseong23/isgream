import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

# 환경 변수 로드
openai_api_key = os.getenv("OPENAI_API_KEY")

if not openai_api_key:
    raise ValueError("🚨 OpenAI API 키가 설정되지 않았습니다! .env 파일을 확인하세요.")

# FastAPI 라우터 설정
router = APIRouter()

# OpenAI 모델 설정
llm = ChatOpenAI(model="gpt-4-turbo", openai_api_key=openai_api_key)

# 임베딩 모델 설정
embedding_function = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=openai_api_key)

# ChromaDB 설정
vectorstore = Chroma(persist_directory="./chatbot_db", embedding_function=embedding_function)

# 데이터베이스에 문서가 있는지 확인
if not vectorstore._collection.count():
    raise ValueError("🚨 ChromaDB에 데이터가 없습니다. 먼저 문서를 삽입하세요.")

retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# 질문 요청 스키마 정의
class QuestionRequest(BaseModel):
    question: str

# 프롬프트 템플릿 정의
prompt = PromptTemplate.from_template("""
당신은 **아동 심리 상담 전문가**입니다.  
항상 **온화하고 공감적인 태도**로 보호자와 아이의 이야기를 경청하며,  
아동의 감정과 행동을 이해할 수 있도록 돕습니다.  

### 참고 문서
{context}

### 질문
{question}

**심리 상담사의 온화한 말투로 대답해 주세요.**  
답변은 **150자에서 250자** 사이로 작성해 주세요.
""")

# LCEL 체인 구성
chain = (
    {"context": retriever | RunnablePassthrough(), "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

@router.post("/question")
async def question(request: QuestionRequest):
    try:
        # 검색된 문서 확인
        search_results = retriever.invoke(request.question)
        if not search_results:
            return {"response": "⚠️ 관련 문서를 찾을 수 없습니다.", "search_results": []}

        # LangChain 실행
        response = chain.invoke(request.question)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

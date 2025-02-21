import warnings
import time
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv(override=True)

# OpenAI 모델 설정
llm = ChatOpenAI(model="gpt-3.5-turbo")

# OpenAI 임베딩 모델 로드 최적화
embedding_function = OpenAIEmbeddings()
vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embedding_function)

# Retriever 설정 최적화
retriever = vectorstore.as_retriever(search_kwargs={"k": 10}, search_type="mmr")  # 검색 개수 줄이고 MMR 적용

# 프롬프트 템플릿
prompt = PromptTemplate.from_template("""
당신은 아동 심리 상담 전문가입니다.  
항상 온화하고 공감적인 태도로 보호자와 아이의 이야기를 경청하며,  
아동의 감정과 행동을 이해할 수 있도록 돕습니다.  

### 참고 문서  
{context}  

### 질문  
아래 검사 결과를 바탕으로 집, 나무, 사람 그림의 심리적 의미를 해석해 주세요.  
특히, **검출된 모든 객체를 포함하여 중요한 의미가 빠지지 않도록 설명**해 주세요 (필수 검사 시간 포함).  

### 검사 결과  
{question}  

### 분석 요청  
✅ **모든 객체를 반영하여 분석하되, 아이의 긍정적인 면을 먼저 강조하고 해석해 주세요.**  
✅ **각 요소의 위치와 심리적 의미를 연결하여 설명해 주세요.**  
✅ **누락된 요소가 중요한 의미를 가질 경우 해석하고, 특별한 의미가 없으면 생략해 주세요.**  
✅ **문제가 있더라도 부모가 상처받지 않도록 조심스럽게 전달하고, 아이의 성장 가능성을 강조해 주세요.**  
✅ **심리 상담사의 온화한 말투로 대답해 주세요.**  
✅ **답변은 100자에서 200자 사이로 작성해 주세요.**  
""")


# RetrievalQA 체인 최적화
chain = (
        {"context": retriever, "question": lambda x: x}  # RunnablePassthrough 제거
        | prompt
        | llm
        | StrOutputParser()
)


# 🔍 **HTP 검사 결과 분석 실행**
def process_predictions(query):
    print("📝 HTP 검사 분석 시작...")

    try:
        start_time = time.time()  # 타이머 시작
        print("🤖 LLM 응답 생성 중...")

        response = chain.invoke(query)  # LLM 호출

        print(f"✅ LLM 응답 완료! (소요 시간: {time.time() - start_time:.2f}초)")
        return response

    except Exception as e:
        print(f"❌ LLM 응답 생성 중 오류 발생: {e}")
        return f"LLM 응답 생성 중 오류 발생: {e}"

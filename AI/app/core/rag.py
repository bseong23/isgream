import warnings
import time
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

# 경고 무시
warnings.filterwarnings("ignore", category=DeprecationWarning)

# 환경 변수 로드
print("🔍 환경 변수 로드 중...")
load_dotenv()

# OpenAI 모델 설정
print("🚀 OpenAI 모델 초기화...")
llm = ChatOpenAI(model="gpt-4-turbo")

# OpenAI 임베딩 모델 설정
print("🧠 OpenAI 임베딩 모델 로드 중...")
embedding_function = OpenAIEmbeddings(model="text-embedding-ada-002")
persist_directory = "./chroma_db"

# ChromaDB 벡터 저장소 로드
print("📂 ChromaDB 벡터 저장소 로드 중...")
vectorstore = Chroma(persist_directory=persist_directory, embedding_function=embedding_function)

# Retriever 생성
print("🔎 Retriever 생성 중...")
retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

prompt = PromptTemplate(
    template="""
    당신은 전문적인 HTP(집-나무-사람) 검사 해석을 수행하는 상담사입니다.
    아래 검사 결과를 바탕으로 한글로 심리적 해석을 명료하게 작성하세요.

    ### 검사 결과
    {context}

    ### 요구사항
    - 집, 나무, 사람 각각에 대해 심리적 의미를 자세히 분석하세요.
    - 분석은 간결하고 명확하게 작성하세요.
    - **각 답변의 글자 수를 최소 400자, 최대 500자로 맞춰 주세요.**
    """,
    input_variables=["context"]
)

# RetrievalQA 체인 생성
print("🔗 RetrievalQA 체인 생성 중...")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff",  # 문서 결합 방식 (stuff, map_reduce 등 가능)
    return_source_documents=True
)


# 🔍 **HTP 검사 결과 분석 실행**
def process_predictions(query):
    print("📝 HTP 검사 분석 시작...")
    start_time = time.time()

    # 문서 검색 수행
    print("🔎 문서 검색 실행 중...")
    try:
        docs = retriever.invoke(query)  # 최신 버전에서 권장되는 invoke 사용
        if not docs:
            print("⚠️ 검색된 문서가 없습니다. 쿼리를 확인하세요.")
            return "검색된 문서가 없습니다."
        print(f"✅ 문서 검색 완료! (소요 시간: {time.time() - start_time:.2f}초)")
    except Exception as e:
        print(f"❌ 문서 검색 중 오류 발생: {e}")
        return f"문서 검색 중 오류 발생: {e}"

    # LLM 응답 생성
    start_time = time.time()
    print("🤖 LLM 응답 생성 중...")
    try:
        response = qa_chain.invoke(query)
        print(f"✅ LLM 응답 완료! (소요 시간: {time.time() - start_time:.2f}초)")
        return response["result"]  # `result` 필드에서 응답 가져오기
    except Exception as e:
        print(f"❌ LLM 응답 생성 중 오류 발생: {e}")
        return f"LLM 응답 생성 중 오류 발생: {e}"
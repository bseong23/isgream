import { useNavigate } from 'react-router-dom';

const Pdf = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        console.log('PDF 다운로드 페이지 이동');
        navigate('/mypage/PDFDownload');
        
    };
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[706px] p-3 my-2 bg-white border border-gray-300 rounded items-center'>
                <div className="flex justify-between">
                    <div className="m-3 text-xl">
                        검사결과(PDF) 다운
                    </div>
                    <div className="m-3 text-xl">
                            <button 
                            onClick={handleClick}>
                                &gt;
                            </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Pdf;

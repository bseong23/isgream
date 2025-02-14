interface RelationButtonsProps{
    selectedRelation: string;
    onChange: (relation: string) => void;
}

const RelationButtons = ({ selectedRelation, onChange }: RelationButtonsProps) => {

    const getKoreanRelation = (relation: string) => {
        switch(relation) {
            case 'MOTHER': return '엄마';
            case 'FATHER': return '아빠';
            case 'REST': return '기타';
            default: return '';
        }
    };

    const getApiRelation = (koreanRelation: string) => {
        switch(koreanRelation) {
            case '엄마': return 'MOTHER';
            case '아빠': return 'FATHER';
            case '기타': return 'REST';
            default: return '';
        }
    };

    return (
        <div className="w-[95%] flex gap-2">
            {['엄마', '아빠', '기타'].map((relation) => (
                <button 
                    key={relation}
                    className={`w-1/3 p-3 rounded flex justify-center items-center
                        ${getKoreanRelation(selectedRelation) === relation 
                            ? 'bg-[#009E28] text-white border-[#009E28]' 
                            : 'bg-white border border-gray-300'}`}
                    onClick={() => onChange(getApiRelation(relation))}
                >
                    {relation}
                </button>
            ))}
        </div>
    );
};

export default RelationButtons;
import KakaoMap from "../../components/map/Kakaomap";

const CenterPage = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-4">
      <div className="w-[95%] mx-auto">
        <KakaoMap />
      </div>
    </div>
  );
};

export default CenterPage;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

interface HtpTestData {
  images: string[];
  report: string;
}

const HtpTestView = () => {
  const { htpTestId } = useParams();
  console.log("htpTestId:",htpTestId);
  const [data, setData] = useState<HtpTestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/htp-tests/${htpTestId}`);
        const result: HtpTestData = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [htpTestId]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found.</p>;

  return (
    <div>
      <h1>심리검사</h1>
      <Swiper spaceBetween={50} slidesPerView={1}>
        {data.images?.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`slide-${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div>
        <h2>HTP 검사 보고서</h2>
        <p>{data.report}</p>
      </div>
      <button>확인</button>
    </div>
  );
};


export default HtpTestView;

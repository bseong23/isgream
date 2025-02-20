import { useEffect, useRef, useState } from "react";
import SearchBar from "../Search/SearchBar";
import CounselingCard from "./CounselingCard";
import { counselingCenters } from "../../data/counselingCenters"; // 상담센터 데이터 가져오기

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setCurrentLocation({ lat: 37.498, lng: 127.036 }); // 기본 위치 (역삼 멀티캠퍼스)
        }
      );
    } else {
      setCurrentLocation({ lat: 37.498, lng: 127.036 });
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    const initialPosition = new kakao.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng
    );
    const mapInstance = new kakao.maps.Map(mapRef.current, {
      center: initialPosition,
      level: 4
    });
    setMap(mapInstance);

    // 상담센터 마커 추가
    counselingCenters.forEach((center) => {
      const markerPosition = new kakao.maps.LatLng(center.lat, center.lng);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: mapInstance
      });

      const infoWindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:10px; width:200px; height:auto; overflow:hidden; word-wrap:break-word;"><h4>${center.name}</h4><p>${center.address}</p><p>${center.phone}</p></div>`,
        removable: true
      });

      kakao.maps.event.addListener(marker, "click", () =>
        infoWindow.open(mapInstance, marker)
      );
    });
  }, [currentLocation]);

  // 🔹 지도 이동 함수 (이름 클릭 시 실행)
  const moveToLocation = (lat: number, lng: number) => {
    if (map) {
      const newPosition = new kakao.maps.LatLng(lat, lng);
      map.setCenter(newPosition);
      map.setLevel(3);
    }
  };

  // 🔹 검색 기능 (키워드로 지도 이동)
  const handleSearch = (keyword: string) => {
    if (!map || !window.kakao) {
      console.error("Kakao Maps가 로드되지 않음.");
      return;
    }

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(
      keyword,
      (data, status) => {
        if (
          status === window.kakao.maps.services.Status.OK &&
          data.length > 0
        ) {
          const firstPlace = data[0];
          const newPosition = new window.kakao.maps.LatLng(
            parseFloat(firstPlace.y),
            parseFloat(firstPlace.x)
          );

          map.setCenter(newPosition);
          map.setLevel(3);
        } else {
          alert("검색 결과가 없습니다.");
        }
      },
      { location: map.getCenter() }
    );
  };

  return (
    <div>
      {/* 🔹 검색 기능 */}
      <SearchBar onSearch={handleSearch} placeholder="장소를 검색하세요" />

      {/* 🔹 지도 */}
      <div
        ref={mapRef}
        className="w-full h-[300px] md:h-[500px] rounded-[15px]"
        data-testid="map-container"
      />

      {/* 🔹 상담센터 카드 리스트 */}
      <div className="mt-4 space-y-4">
        {counselingCenters.map((center, index) => (
          <CounselingCard
            key={index}
            {...center}
            moveToLocation={moveToLocation}
          />
        ))}
      </div>
    </div>
  );
}

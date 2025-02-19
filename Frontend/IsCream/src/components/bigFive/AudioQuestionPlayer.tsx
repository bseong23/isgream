import { useState, useRef, useEffect } from "react";
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react";

const AudioQuestionPlayer = ({ questionIndex }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudioUrl = () => {
    return `https://a407-20250124.s3.ap-northeast-2.amazonaws.com/audio/${questionIndex + 1}.mp3`;
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("오디오 재생 실패:", error);
        });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      playAudio();
    }
  };

  // questionIndex가 변경될 때마다 새로운 음성 로드 및 재생
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl();
      playAudio();
    }
  }, [questionIndex]);

  // 오디오 종료 시 상태 업데이트
  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
    };

    const audioElement = audioRef.current;
    audioElement?.addEventListener("ended", handleEnded);

    return () => {
      audioElement?.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <audio ref={audioRef} className="hidden" />

      {/* 재생/일시정지 버튼 */}
      <button
        onClick={isPlaying ? pauseAudio : playAudio}
        className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
        aria-label={isPlaying ? "일시정지" : "재생"}
      >
        {isPlaying ? (
          <PauseCircle className="w-6 h-6 text-gray-600" />
        ) : (
          <PlayCircle className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* 다시듣기 버튼 */}
      <button
        onClick={replayAudio}
        className="p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
        aria-label="다시듣기"
      >
        <RotateCcw className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
};

export default AudioQuestionPlayer;

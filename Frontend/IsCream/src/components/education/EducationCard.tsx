import { Education } from "@/types/education";

interface EducationCardProps extends Education {
  onVideoClick?: (videoUrl: string) => void;
}

const EducationCard = ({
  imageUrl,
  title,
  videoUrl,
  description,
  onVideoClick
}: EducationCardProps) => {
  return (
    <div
      className="w-full mb-6 rounded-lg border border-[#BEBEBE] hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => onVideoClick?.(videoUrl)}
    >
      <div className="relative p-2">
        <div className="w-full h-64 relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold line-clamp-2 mb-3">{title}</h3>
          <p className="text-gray-600 text-base line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;

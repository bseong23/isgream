export const createUploadFormData = ({
  file,
  time,
  childId, // 서버에서는 chidiId로 받음
  type,
  index,
  gender,
}: {
  file: File;
  time: string;
  childId: number;
  type: string;
  index: number;
  gender?: "male" | "female";
}) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "htp",
    JSON.stringify({
      time,
      childId: childId, // ✅ 필드명을 서버에서 요구하는 "chidiId"로 변경
      type: gender ? gender : type, // ✅ "person" 대신 "male" 또는 "female"로 변환
      index,
    })
  );

  console.log("📦 생성된 FormData:", Object.fromEntries(formData.entries())); // 🚀 디버깅용 로그

  return formData;
};

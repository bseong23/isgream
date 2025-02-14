
interface ProfileFormLabelProps{
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

const ProfileFormLabel = ({ label, required, children }: ProfileFormLabelProps) => (
    <div>
        <div className="w-[95%]">
        </div>
        <div className="flex justify-center">
          <div className="w-[95%]">
            <span>{label} </span>
            {required && <span className="text-blue-500">*</span>}
          </div>
        </div>
        <div className="flex justify-center">
          {children}
        </div>
      </div>
);

export default ProfileFormLabel;
import Image from 'next/image';

type ProfessionalAvatarProps = {
  professionalId: number;
};

export default function ProfessionalAvatar({ professionalId }: ProfessionalAvatarProps) {
  return (
    <Image
      width={125}
      height={125}
      src={`https://i.pravatar.cc/150?img=${professionalId}`}
      alt='Avatar'
      className='rounded-full mb-3'
    />
  );
}

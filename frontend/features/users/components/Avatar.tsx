import Image from 'next/image';

type AvatarProps = {
  id: number;
  size?: number;
};

export default function Avatar({ id, size = 125 }: AvatarProps) {
  return (
    <Image
      width={size}
      height={size}
      src={`https://i.pravatar.cc/150?img=${id}`}
      alt='User avatar'
      className='rounded-full mb-3'
    />
  );
}

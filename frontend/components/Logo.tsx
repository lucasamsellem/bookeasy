import Image from 'next/image';

export default function Logo({ size }: { size: number }) {
  return (
    <Image src='/assets/BookEasy_logo.png' width={size} height={size} alt='Logo de BookEasy' />
  );
}

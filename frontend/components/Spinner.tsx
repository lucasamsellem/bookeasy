export default function Spinner({ centered = false }: { centered?: boolean }) {
  return (
    <div
      className={`${centered ? 'absolute top-1/2 left-1/2' : ''} flex justify-center items-center`}
    >
      <div className='size-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
    </div>
  );
}

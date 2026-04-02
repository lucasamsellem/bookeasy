export default function Spinner({ centered = false }: { centered?: boolean }) {
  return (
    <div
      className={`${centered ? 'absolute top-1/2 left-1/2' : ''} flex justify-center items-center`}
    >
      <div className='size-5 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
    </div>
  );
}

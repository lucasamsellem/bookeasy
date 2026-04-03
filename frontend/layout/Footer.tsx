export default function Footer() {
  return (
    <footer className='text-center py-6 border-t border-gray-200'>
      <p className='mb-2 text-sm text-gray-600'>&copy; 2026 BookEasy - Tous droits réservés</p>

      <div className='flex justify-center gap-4 mb-2'>
        <a
          href='https://github.com/lucasamsellem/bookeasy'
          target='_blank'
          rel='noopener noreferrer'
          className='text-gray-500 hover:text-gray-900 transition'
        >
          GitHub
        </a>

        <a
          href='https://www.google.com'
          target='_blank'
          className='text-gray-500 hover:text-gray-900 transition'
        >
          Newsletter
        </a>
        <a
          href='https://www.google.com'
          target='_blank'
          rel='noopener noreferrer'
          className='text-gray-500 hover:text-gray-900 transition'
        >
          Twitter
        </a>
        <a
          href='https://www.google.com'
          target='_blank'
          rel='noopener noreferrer'
          className='text-gray-500 hover:text-gray-900 transition'
        >
          LinkedIn
        </a>
      </div>

      <p className='text-xs text-gray-400'>Conçu avec ❤️ par l&apos;équipe BookEasy</p>
    </footer>
  );
}

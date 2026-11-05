import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-950 px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/booknook.png"
              alt="BookNook Logo"
              className="h-10 w-10 object-contain"
            />
            <h2 className="text-2xl font-extrabold">
              BookNook<span className="text-amber-400"></span>
            </h2>
          </Link>

          <p className="mt-4 max-w-sm leading-7 text-blue-200">
            Your online reading corner. Discover books, explore knowledge, and
            enjoy the joy of reading.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-bold text-amber-400">Quick Links</h3>

          <div className="flex flex-col gap-3 text-blue-100">
            <Link href="/" className="transition hover:text-amber-400">
              Home
            </Link>
            <Link href="/books" className="transition hover:text-amber-400">
              All Books
            </Link>
            <Link href="/login" className="transition hover:text-amber-400">
              Login
            </Link>
            <Link href="/register" className="transition hover:text-amber-400">
              Register
            </Link>
          </div>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="mb-4 font-bold text-amber-400">Contact</h3>

          <p className="text-blue-100">Email: support@booknook.com</p>

          <p className="mt-3 text-blue-100">Follow us on social media</p>

          <div className="mt-5 flex items-center gap-4">
            {/* Facebook */}
            <Link
              href="/"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white transition hover:bg-amber-400 hover:text-blue-950"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.2H7.7V13h2.7v8h3.1Z" />
              </svg>
            </Link>

            {/* Instagram */}
            <Link
              href="/"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white transition hover:bg-amber-400 hover:text-blue-950"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </Link>

            {/* X */}
            <Link
              href="/"
              aria-label="X"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white transition hover:bg-amber-400 hover:text-blue-950"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.9 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-blue-800 pt-6 text-center text-sm text-blue-300">
        © {new Date().getFullYear()} BookNook. All rights reserved.
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/booknook.png"
            alt="BookNook Logo"
            className="h-10 w-10 object-contain"
          />

          <span className="text-2xl font-extrabold tracking-tight text-blue-950">
            BookNook<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-semibold text-blue-900 transition hover:text-amber-600"
          >
            Home
          </Link>

          <Link
            href="/books"
            className="text-slate-600 transition hover:text-blue-900"
          >
            All Books
          </Link>

          <Link
            href="/login"
            className="text-slate-600 transition hover:text-blue-900"
          >
            Login
          </Link>
        </div>

        {/* Get Started Button */}
        <Link
          href="/register"
          className="rounded-full bg-blue-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}

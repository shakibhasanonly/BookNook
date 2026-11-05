'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoggedIn = !!session?.user;

  const loggedOutLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Books', href: '/books' },
  ];

  const loggedInLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Books', href: '/books' },
    { name: 'Add Book', href: '/add-book' },
    { name: 'My Books', href: '/my-books' },
    { name: 'My Borrows', href: '/my-borrows' },
  ];

  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success('Logged out successfully!');
      setProfileOpen(false);
      setMenuOpen(false);
      router.push('/');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/booknook.jpg"
            alt="BookNook Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-extrabold text-blue-950">
            BookNook<span className="text-amber-500">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="font-semibold text-slate-600 transition hover:text-amber-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isPending &&
            (!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-blue-950 px-5 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-blue-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2"
                >
                  <img
                    src={session.user.image || '/booknook.jpg'}
                    alt="User"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="font-semibold text-blue-950">
                    {session.user.name}
                  </span>
                  <span className="text-xs">▼</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-blue-950 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-slate-700 hover:text-amber-600"
              >
                {link.name}
              </Link>
            ))}

            {!isPending &&
              (!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="font-semibold text-blue-950"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-blue-950 px-5 py-2 text-center font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <img
                      src={session.user.image || '/booknook.jpg'}
                      alt="User"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span className="font-semibold text-blue-950">
                      {session.user.name}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="font-semibold text-slate-700"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}

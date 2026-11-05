'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName?: string;
  userEmail?: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Protect Book Details Route
  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      router.replace('/login');
      return;
    }
  }, [isPending, session, router]);

  // Fetch Book Only After Authentication
  useEffect(() => {
    if (isPending || !session?.user?.email || !id) return;

    let cancelled = false;

    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        );

        if (!response.ok) throw new Error('Book not found');

        const data = await response.json();

        if (!cancelled) {
          setBook(data);
        }
      } catch {
        if (!cancelled) {
          setError('Book details could not be loaded.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [id, isPending, session?.user?.email]);

  const handleBorrow = () => {
    if (isPending) return;

    if (!session?.user?.email) {
      router.replace('/login');
      return;
    }

    if (!book || book.totalCopies <= 0) {
      showToast('This book is not available.', 'error');
      return;
    }

    setShowModal(true);
  };

  const confirmBorrow = async () => {
    if (!book || !session?.user?.email) return;

    setBorrowing(true);

    const borrowDate = new Date();
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + 7);

    try {
      // Get JWT token from Better Auth
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          'Authentication token could not be retrieved. Please login again.',
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            bookId: book._id,
            bookTitle: book.title,
            bookImage: book.image,
            userName: session.user.name || 'User',
            userEmail: session.user.email,
            borrowDate: borrowDate.toISOString(),
            returnDate: returnDate.toISOString(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to borrow book.');
      }

      setBook(prev =>
        prev ? { ...prev, totalCopies: prev.totalCopies - 1 } : prev,
      );

      setShowModal(false);
      showToast('Book borrowed successfully!', 'success');

      setTimeout(() => {
        router.push('/my-borrows');
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to borrow book.';

      showToast(message, 'error');
    } finally {
      setBorrowing(false);
    }
  };

  // Wait for authentication or redirect logged-out users
  if (isPending || !session?.user?.email) {
    return (
      <main className="flex min-h-screen flex-col bg-white text-slate-800">
        <Navbar />

        <section className="flex flex-1 items-center justify-center px-6">
          <p className="text-center text-slate-500">
            {isPending ? 'Checking your login...' : 'Redirecting to login...'}
          </p>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />

      {toast && (
        <div
          role="status"
          className={`fixed left-1/2 top-5 z-[100] -translate-x-1/2 rounded-lg px-6 py-4 text-sm font-semibold text-white shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-700' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:py-14">
        {loading ? (
          <p className="py-24 text-center text-slate-500">
            Loading book details...
          </p>
        ) : error || !book ? (
          <div className="py-24 text-center">
            <p className="text-lg font-semibold text-red-600">
              {error || 'Book not found.'}
            </p>

            <Link
              href="/books"
              className="mt-5 inline-block font-semibold text-blue-950 hover:text-amber-600"
            >
              Back to All Books
            </Link>
          </div>
        ) : (
          <div className="grid items-center gap-10 md:grid-cols-[330px_1fr] md:gap-14">
            <div className="flex min-h-[380px] items-center justify-center rounded-lg bg-slate-50 p-7">
              <img
                src={book.image}
                alt={book.title}
                className="max-h-[430px] w-full object-contain"
              />
            </div>

            <div>
              <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {book.category}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-blue-950 md:text-4xl">
                {book.title}
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                By{' '}
                <span className="font-semibold text-slate-700">
                  {book.author}
                </span>
              </p>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                {book.description}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-5 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">Added By</p>
                  <p className="mt-2 font-semibold text-blue-950">
                    {book.userName || 'Not available'}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {book.userEmail || 'Not available'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Copies Left
                  </p>
                  <p className="mt-2 text-2xl font-bold text-blue-950">
                    {book.totalCopies}
                  </p>
                  <p
                    className={`mt-1 text-xs font-medium ${
                      book.totalCopies > 0 ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {book.totalCopies > 0 ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleBorrow}
                  disabled={book.totalCopies <= 0 || isPending}
                  className="rounded-md bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {book.totalCopies > 0 ? 'Borrow This Book' : 'Not Available'}
                </button>

                <Link
                  href="/books"
                  className="text-sm font-semibold text-slate-500 transition hover:text-amber-600"
                >
                  Back to All Books
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {showModal && book && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-blue-950">Confirm Borrow</h2>

            <p className="mt-2 text-sm text-slate-500">
              Borrow this book for 7 days.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  User Name
                </label>
                <input
                  value={session?.user?.name || ''}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  User Email
                </label>
                <input
                  value={session?.user?.email || ''}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Borrow Date
                </label>
                <input
                  value={new Date().toLocaleDateString()}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Return Date
                </label>
                <input
                  value={new Date(
                    new Date().setDate(new Date().getDate() + 7),
                  ).toLocaleDateString()}
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={borrowing}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmBorrow}
                disabled={borrowing}
                className="rounded-full bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
              >
                {borrowing ? 'Confirming...' : 'Confirm Borrow'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

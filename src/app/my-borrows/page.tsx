'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function MyBorrows() {
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Borrowed Books
  useEffect(() => {
    const fetchBorrows = async () => {
      if (isPending) return;

      if (!session?.user?.email) {
        setBorrows([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          throw new Error('Authentication failed. Please login again.');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        );

        const result = await response.json();

        // Debugging: Show actual backend response
        console.log('BORROWS STATUS:', response.status);
        console.log('BORROWS RESPONSE:', result);

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load borrowed books');
        }

        setBorrows(result);
      } catch (err) {
        console.error('Fetch Borrows Error:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Borrowed books could not be loaded. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session, isPending]);

  // Format Date
  const formatDate = (date: string) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Return Book
  const handleReturn = async (borrow: Borrow) => {
    setReturningId(borrow._id);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error('Authentication failed. Please login again.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows/${borrow._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to return book');
      }

      setBorrows(prev => prev.filter(item => item._id !== borrow._id));

      showToast('Book returned successfully!', 'success');
    } catch (err) {
      console.error('Return Book Error:', err);

      showToast(
        err instanceof Error
          ? err.message
          : 'Failed to return book. Please try again.',
        'error',
      );
    } finally {
      setReturningId(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />

      {/* Toast Notification */}
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

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        {/* Page Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Your Reading List
          </p>

          <h1 className="text-3xl font-bold">My Borrows</h1>

          <p className="mt-2 text-slate-500">
            Books you are reading right now.
          </p>
        </div>

        {/* Loading */}
        {isPending || loading ? (
          <p className="py-16 text-center text-slate-500">
            Loading borrowed books...
          </p>
        ) : !session?.user?.email ? (
          /* Not Logged In */
          <div className="rounded-xl border border-slate-200 py-16 text-center">
            <p className="text-slate-600">
              Please login to view your borrowed books.
            </p>

            <Link
              href="/login"
              className="mt-4 inline-block font-semibold text-emerald-700"
            >
              Login
            </Link>
          </div>
        ) : error ? (
          /* Error */
          <div className="rounded-xl border border-red-200 bg-red-50 py-16 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        ) : borrows.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border border-slate-200 py-16 text-center">
            <h2 className="text-xl font-semibold">No borrowed books yet</h2>

            <p className="mt-2 text-slate-500">
              Explore our library and borrow your first book.
            </p>

            <Link
              href="/books"
              className="mt-5 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          /* Borrowed Books Table */
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Book</th>

                    <th className="px-6 py-4 font-semibold">Borrow Date</th>

                    <th className="px-6 py-4 font-semibold">Return Date</th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {borrows.map(borrow => (
                    <tr
                      key={borrow._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            className="h-16 w-12 rounded object-cover"
                          />

                          <p className="font-semibold text-slate-800">
                            {borrow.bookTitle}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(borrow.borrowDate)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(borrow.returnDate)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleReturn(borrow)}
                          disabled={returningId === borrow._id}
                          className="rounded-full bg-emerald-700 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                        >
                          {returningId === borrow._id
                            ? 'Returning...'
                            : 'Return Book'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

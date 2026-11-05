'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/books/${id}`);

        if (!response.ok) throw new Error('Book not found');

        const data = await response.json();
        setBook(data);
      } catch {
        setError('Book details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  const handleBorrow = () => {
    router.push('/my-borrows');
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-800">
      <Navbar />

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
          <>
            <div className="grid items-center gap-10 md:grid-cols-[330px_1fr] md:gap-14">
              {/* Book Cover */}
              <div className="flex min-h-[380px] items-center justify-center rounded-lg bg-slate-50 p-7">
                <img
                  src={book.image}
                  alt={book.title}
                  className="max-h-[430px] w-full object-contain"
                />
              </div>

              {/* Book Information */}
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

                {/* Added By and Copies Left */}
                <div className="mt-7 grid grid-cols-1 gap-5 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Added By
                    </p>

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

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleBorrow}
                    disabled={book.totalCopies <= 0}
                    className="rounded-md bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {book.totalCopies > 0
                      ? 'Borrow This Book'
                      : 'Not Available'}
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
          </>
        )}
      </section>

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}

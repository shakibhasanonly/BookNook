'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import Introduction from '@/components/Introduction';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`,
        );

        if (!response.ok) {
          throw new Error('Failed to load books');
        }

        const data = await response.json();

        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch {
        setError('Books could not be loaded. Please try again.');

        toast.error('Books could not be loaded!', {
          position: 'top-center',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const latestBooks = books.slice(0, 6);

  const fictionalBooks = books.filter(
    book => book.category?.trim().toLowerCase() === 'fiction',
  );

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <Navbar />

      <HeroSlider />

      <Introduction />

      {/* New Arrivals */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold tracking-[0.2em] text-amber-600">
                EXPLORE OUR COLLECTION
              </p>

              <h2 className="text-3xl font-extrabold text-blue-950 md:text-4xl">
                New Arrivals
              </h2>

              <p className="mt-2 text-slate-500">
                Discover the latest additions to our library.
              </p>

              <div className="mt-4 h-1 w-16 rounded-full bg-amber-400" />
            </div>

            <Link
              href="/books"
              className="font-semibold text-blue-950 transition hover:text-amber-600"
            >
              See All Books →
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="py-16 text-center text-red-500">{error}</p>
          )}

          {/* Empty State */}
          {!loading && !error && latestBooks.length === 0 && (
            <p className="py-16 text-center text-slate-500">
              No books have been added yet.
            </p>
          )}

          {/* Book Cards */}
          {!loading && !error && latestBooks.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {latestBooks.map(book => (
                <article
                  key={book._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-64 items-center justify-center overflow-hidden bg-slate-100">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {book.category}
                    </span>

                    <h3 className="mt-4 text-xl font-bold text-blue-950">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      By {book.author}
                    </p>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-5 inline-block font-semibold text-blue-950 transition hover:text-amber-600"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* See All Books Button */}
          <div className="mt-12 text-center">
            <Link
              href="/books"
              className="inline-block rounded-full bg-blue-950 px-8 py-3 font-semibold text-white transition hover:bg-blue-900"
            >
              See All Books
            </Link>
          </div>
        </div>
      </section>

      {/* More Than a Library */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          {/* Left Content */}
          <div>
            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-amber-600">
              WHY BOOKNOOK
            </p>

            <h2 className="text-4xl font-extrabold leading-tight text-blue-950 md:text-5xl">
              More Than a Library.
              <span className="mt-2 block text-amber-600">
                A World of Possibilities.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
              Books open doors to new ideas, unforgettable adventures, and
              endless possibilities. Discover your next favorite read and make
              every reading moment meaningful with BookNook.
            </p>

            <Link
              href="/books"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-blue-950 px-8 py-3.5 font-semibold text-white transition hover:bg-blue-900"
            >
              Explore Our Collection
              <span className="text-xl">→</span>
            </Link>
          </div>

          {/* Right Content */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
            <div className="mb-8">
              <span className="text-sm font-bold tracking-widest text-amber-600">
                YOUR READING JOURNEY
              </span>

              <h3 className="mt-3 text-2xl font-bold text-blue-950">
                Every Book Opens a New Door.
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Find inspiration, explore new perspectives, and enjoy the
                experience of reading.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <span className="text-3xl">📖</span>

                <h4 className="mt-3 font-bold text-blue-950">Discover</h4>

                <p className="mt-1 text-xs text-slate-500">New ideas</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <span className="text-3xl">📚</span>

                <h4 className="mt-3 font-bold text-blue-950">Explore</h4>

                <p className="mt-1 text-xs text-slate-500">New worlds</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <span className="text-3xl">✨</span>

                <h4 className="mt-3 font-bold text-blue-950">Enjoy</h4>

                <p className="mt-1 text-xs text-slate-500">Every page</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fictional Worlds */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading - Left Aligned */}
          <div className="mb-12">
            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-amber-600">
              STORIES THAT SPARK IMAGINATION
            </p>

            <h2 className="text-3xl font-extrabold text-blue-950 md:text-4xl">
              Explore Fictional Worlds
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-500">
              Step into magical adventures, unforgettable characters, and
              extraordinary stories waiting to be discovered.
            </p>

            <div className="mt-5 h-1 w-16 rounded-full bg-amber-400" />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && fictionalBooks.length === 0 && (
            <p className="py-12 text-center text-slate-500">
              No fictional books are available right now.
            </p>
          )}

          {/* Fictional Book Cards */}
          {!loading && !error && fictionalBooks.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {fictionalBooks.map(book => (
                <article
                  key={book._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-72 items-center justify-center overflow-hidden bg-slate-100">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-blue-950 shadow-sm">
                      FICTION
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-blue-950">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Written by {book.author}
                    </p>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-950 transition hover:text-amber-600"
                    >
                      Discover This Book →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Explore All Books */}
          <div className="mt-12 text-center">
            <Link
              href="/books"
              className="inline-block rounded-full border border-blue-950 px-8 py-3 font-semibold text-blue-950 transition hover:bg-blue-950 hover:text-white"
            >
              Explore All Books
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

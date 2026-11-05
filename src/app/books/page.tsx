'use client';

import { useEffect, useMemo, useState } from 'react';
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
}

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

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
        setBooks(data);
      } catch {
        setError('Books could not be loaded. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(books.map(book => book.category))],
    [books],
  );

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'All' || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <section className="bg-blue-950 px-6 py-16 text-center text-white">
        <p className="mb-3 text-sm font-bold tracking-[0.2em] text-amber-400">
          DISCOVER YOUR NEXT READ
        </p>

        <h1 className="text-4xl font-extrabold md:text-5xl">
          Explore All Books
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-blue-100">
          Discover amazing stories, explore new ideas, and find your next
          favorite book.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 outline-none focus:border-amber-500"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 outline-none focus:border-amber-500"
          >
            {categories.map(item => (
              <option key={item} value={item}>
                {item === 'All' ? 'All Categories' : item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="py-20 text-center text-lg font-semibold text-blue-950">
            Loading books...
          </p>
        ) : error ? (
          <p className="py-20 text-center text-red-600">{error}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="py-20 text-center text-lg text-slate-500">
            No books found.
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map(book => (
              <Link
                href={`/books/${book._id}`}
                key={book._id}
                className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-64 overflow-hidden bg-slate-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    {book.category}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-blue-950">
                    {book.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    By {book.author}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {book.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">
                      Copies: {book.totalCopies}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        book.totalCopies > 0
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {book.totalCopies > 0 ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-bold text-blue-700">
                    View Details →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}

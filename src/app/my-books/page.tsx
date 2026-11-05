'use client';

import { useEffect, useState, type FormEvent } from 'react';
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
  userEmail?: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function MyBooks() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    image: '',
    description: '',
    totalCopies: 1,
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchMyBooks = async () => {
      if (isPending) return;

      if (!session?.user?.email) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`,
        );

        if (!response.ok) {
          throw new Error('Failed to load books');
        }

        const data: Book[] = await response.json();

        setBooks(
          data.filter(book => book.userEmail?.trim() === session.user.email),
        );
      } catch {
        setError('Books could not be loaded. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [session, isPending]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: book.totalCopies,
    });
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;

    setSaving(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error('Authentication failed. Please login again.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${editingBook._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            ...formData,
            totalCopies: Number(formData.totalCopies),
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      setBooks(prev =>
        prev.map(book =>
          book._id === editingBook._id
            ? {
                ...book,
                ...formData,
                totalCopies: Number(formData.totalCopies),
              }
            : book,
        ),
      );

      setEditingBook(null);
      showToast('Book updated successfully!', 'success');
    } catch {
      showToast('Failed to update book. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBook) return;

    setDeleting(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error('Authentication failed. Please login again.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${deletingBook._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setBooks(prev => prev.filter(book => book._id !== deletingBook._id));

      setDeletingBook(null);
      showToast('Book deleted successfully!', 'success');
    } catch {
      showToast('Failed to delete book. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

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

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
              Your Collection
            </p>
            <h1 className="text-3xl font-bold">My Books</h1>
            <p className="mt-2 text-slate-500">
              Books you added to the library.
            </p>
          </div>

          <Link
            href="/add-book"
            className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            + Add New Book
          </Link>
        </div>

        {isPending || loading ? (
          <p className="py-16 text-center text-slate-500">
            Loading your books...
          </p>
        ) : !session?.user?.email ? (
          <div className="rounded-xl border border-slate-200 py-16 text-center">
            <p className="text-slate-600">Please login to view your books.</p>
            <Link
              href="/login"
              className="mt-4 inline-block font-semibold text-emerald-700"
            >
              Login
            </Link>
          </div>
        ) : error ? (
          <p className="py-16 text-center text-red-500">{error}</p>
        ) : books.length === 0 ? (
          <div className="rounded-xl border border-slate-200 py-16 text-center">
            <h2 className="text-xl font-semibold">No books added yet</h2>
            <p className="mt-2 text-slate-500">
              Start building your collection by adding a book.
            </p>
            <Link
              href="/add-book"
              className="mt-5 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Book</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Copies</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {books.map(book => (
                    <tr key={book._id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-16 w-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {book.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {book.category}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {book.totalCopies}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/books/${book._id}`}
                            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold hover:bg-slate-100"
                          >
                            View
                          </Link>

                          <button
                            onClick={() => handleEdit(book)}
                            className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeletingBook(book)}
                            className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">Edit Book</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Book Title"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
              />

              <input
                required
                type="text"
                placeholder="Author Name"
                value={formData.author}
                onChange={e =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
              />

              <input
                required
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
              />

              <input
                required
                type="url"
                placeholder="Book Image URL"
                value={formData.image}
                onChange={e =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
              />

              <textarea
                required
                rows={3}
                placeholder="Short Description"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
              />

              <input
                required
                type="number"
                min="0"
                placeholder="Total Copies"
                value={formData.totalCopies}
                onChange={e =>
                  setFormData({
                    ...formData,
                    totalCopies: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 rounded-full border border-slate-300 py-3 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
            <h2 className="text-xl font-bold">Delete Book?</h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800">
                {deletingBook.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="flex-1 rounded-full border border-slate-300 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

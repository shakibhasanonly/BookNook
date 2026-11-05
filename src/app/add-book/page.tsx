'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { authClient } from '@/lib/auth-client';

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    image: '',
    description: '',
    totalCopies: '1',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      alert('Please login first!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalCopies: Number(formData.totalCopies),
          userName: session.user.name,
          userEmail: session.user.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add book');
      }

      alert('Book added successfully!');
      router.push('/books');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!session?.user) {
    return <p className="p-10 text-center">Please login to add a book.</p>;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
            Add New Book
          </h1>

          <p className="mb-8 text-center text-gray-500">
            Share a new book with the BookNook community.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">Book Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Author</label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter category"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Book Image URL</label>
              <input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Paste book image URL"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg border p-3"
                placeholder="Write book description"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Total Copies</label>
              <input
                name="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="rounded-lg bg-gray-100 p-4">
              <p className="mb-2 font-semibold">Added By</p>

              <p className="text-sm text-gray-700">Name: {session.user.name}</p>

              <p className="text-sm text-gray-700">
                Email: {session.user.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

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
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const addedDate = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      setMessage('Please login first!');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          'Unable to get authentication token. Please login again.',
        );
      }

      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          ...formData,
          totalCopies: Number(formData.totalCopies),
          addedDate,
          userName: session.user.name,
          userEmail: session.user.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add book');
      }

      setMessageType('success');
      setMessage('Book added successfully!');

      setTimeout(() => {
        router.push('/books');
        router.refresh();
      }, 1000);
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong!',
      );
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

          {message && (
            <div
              role="alert"
              className={`mb-5 rounded-lg p-3 text-center ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

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
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border bg-white p-3"
              >
                <option value="">Select a category</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
                <option value="Others">Others</option>
              </select>
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

            <div>
              <label className="mb-2 block font-medium">Added Date</label>
              <input
                type="date"
                value={addedDate}
                readOnly
                className="w-full rounded-lg border bg-gray-100 p-3 text-gray-600"
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

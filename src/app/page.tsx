import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import Introduction from '@/components/Introduction';

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Others',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600',
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600',
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600',
  },
  {
    title: 'Wonder',
    author: 'R. J. Palacio',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Introduction */}
      <Introduction />

      {/* Featured Books */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold tracking-[0.2em] text-amber-600">
                EXPLORE OUR COLLECTION
              </p>

              <h2 className="text-3xl font-extrabold text-blue-950 md:text-4xl">
                Featured Books
              </h2>
            </div>

            <Link
              href="/books"
              className="font-bold text-blue-900 hover:text-amber-600"
            >
              See All Books →
            </Link>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(book => (
              <article
                key={book.title}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-64 items-center justify-center overflow-hidden bg-slate-100">
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

                  <h3 className="mt-4 text-xl font-bold text-blue-950">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    By {book.author}
                  </p>

                  <Link
                    href="/books"
                    className="mt-5 inline-block font-bold text-blue-900 hover:text-amber-600"
                  >
                    Explore Book →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why BookNook */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 text-sm font-bold tracking-[0.2em] text-amber-600">
            WHY BOOKNOOK
          </p>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight text-blue-950 md:text-4xl">
            More Than a Library. A World of Possibilities.
          </h2>

          <p className="mb-8 leading-8 text-slate-500">
            Find books that match your interests, borrow with ease, and keep
            track of your reading journey in one convenient place.
          </p>

          <Link
            href="/books"
            className="inline-block rounded-full bg-blue-950 px-7 py-3 font-bold text-white transition hover:bg-blue-800"
          >
            Explore Collection
          </Link>
        </div>

        <div className="rounded-3xl bg-amber-50 p-10 text-center">
          <div className="text-8xl">📚</div>

          <h3 className="mt-5 text-2xl font-extrabold text-blue-950">
            Read More. Discover More.
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            Every book is a new adventure waiting for you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 px-6 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/booknook.jpg"
                alt="BookNook Logo"
                className="h-10 w-10 object-contain"
              />

              <h2 className="text-2xl font-extrabold">
                BookNook<span className="text-amber-400">.</span>
              </h2>
            </div>

            <p className="mt-4 max-w-sm leading-7 text-blue-200">
              Your online reading corner. Discover books, explore knowledge, and
              enjoy the joy of reading.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-amber-400">Quick Links</h3>

            <div className="flex flex-col gap-3 text-blue-100">
              <Link href="/">Home</Link>
              <Link href="/books">All Books</Link>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-amber-400">Contact</h3>

            <p className="text-blue-100">Email: support@booknook.com</p>

            <p className="mt-3 text-blue-100">Follow us on social media</p>

            <div className="mt-4 flex gap-4 text-sm font-bold text-amber-300">
              <span>Facebook</span>
              <span>Instagram</span>
              <span>X</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-blue-800 pt-6 text-center text-sm text-blue-300">
          © {new Date().getFullYear()} BookNook. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

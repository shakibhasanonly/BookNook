'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error('Please login to view your profile.', {
        position: 'top-center',
      });
      router.replace('/login');
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-semibold text-blue-950">Loading your profile...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-5 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-blue-950 md:text-4xl">
              My Profile
            </h1>
            <p className="mt-3 text-slate-500">
              Welcome to your BookNook profile.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="bg-blue-950 px-6 py-10 text-center">
              <img
                src={user.image || '/booknook.png'}
                alt="Profile"
                className="mx-auto h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
              />

              <h2 className="mt-4 text-2xl font-bold text-white">
                {user.name || 'BookNook Member'}
              </h2>

              <p className="mt-2 text-sm text-blue-100">
                BookNook Community Member
              </p>
            </div>

            <div className="p-6 md:p-10">
              <h3 className="mb-6 text-xl font-bold text-blue-950">
                Profile Information
              </h3>

              <div className="space-y-5">
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Full Name
                  </p>
                  <p className="mt-2 font-semibold text-slate-800">
                    {user.name || 'Not available'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Email Address
                  </p>
                  <p className="mt-2 break-all font-semibold text-slate-800">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="rounded-full bg-blue-950 px-8 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

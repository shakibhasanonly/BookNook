'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    title: 'Discover Your Next Favorite Book',
    subtitle: 'Explore thousands of stories, ideas, and adventures.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
  },
  {
    title: 'Every Book Opens a New World',
    subtitle: 'Read, learn, and grow with BookNook.',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6',
  },
  {
    title: 'Your Reading Journey Starts Here',
    subtitle: 'Find the perfect book for your next adventure.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
  },
];

export default function HeroSlider() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="overflow-hidden rounded-3xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative flex min-h-[420px] items-center bg-cover bg-center px-8 py-16 md:min-h-[520px] md:px-16"
              style={{
                backgroundImage: `linear-gradient(rgba(5, 20, 50, 0.72), rgba(5, 20, 50, 0.72)), url(${slide.image})`,
              }}
            >
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
                  {slide.title}
                </h1>

                <p className="mt-5 text-base text-slate-200 md:text-xl">
                  {slide.subtitle}
                </p>

                <a
                  href="/books"
                  className="mt-8 inline-block rounded-full bg-amber-500 px-8 py-3 font-bold text-blue-950 transition hover:bg-amber-400"
                >
                  Browse Books
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

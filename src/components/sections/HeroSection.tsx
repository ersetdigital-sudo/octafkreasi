import React from 'react';

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://res.cloudinary.com/dqjh7utdb/image/upload/v1779769292/k7q6qdumq11ce4olu8ai.png)',
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container-app relative z-10 flex min-h-[600px] flex-col justify-center pb-32 pt-20">
        {/* Badge */}
        <span className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          ✨ Jelajah Indonesia, Ciptakan Cerita
        </span>

        {/* Heading */}
        <h1 className="max-w-3xl font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          Jelajahi keindahan Indonesia{' '}
          <em className="not-italic font-light italic">bersama</em>{' '}
          octafkreasi
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
          Ribuan destinasi menakjubkan, pengalaman tak terlupakan, dan layanan
          terbaik untuk perjalananmu.
        </p>
      </div>
    </section>
  );
}

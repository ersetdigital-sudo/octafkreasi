import React from 'react';

export interface AboutDestinationProps {
  description: string;
  tagChips?: string[];
  destinationName: string;
}

export function AboutDestination({ description, destinationName }: AboutDestinationProps) {
  return (
    <section className="py-6">
      <h2 className="font-heading text-xl font-bold text-gray-900 sm:text-2xl">
        Tentang {destinationName}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
        {description}
      </p>
    </section>
  );
}

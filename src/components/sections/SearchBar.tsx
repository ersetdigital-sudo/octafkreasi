'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatDateID(date: Date): string {
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function SearchBar() {
  const router = useRouter();

  // Destinations from Supabase
  const [destinations, setDestinations] = useState<{ id: string; name: string; slug: string; country: string }[]>([]);

  useEffect(() => {
    supabase
      .from('destinations')
      .select('id, name, slug, country')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setDestinations(data);
      });
  }, []);

  // Destination autocomplete
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('');
  const destRef = useRef<HTMLDivElement>(null);

  // Date picker
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const dateRef = useRef<HTMLDivElement>(null);

  // Guest selector
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showGuests, setShowGuests] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);

  // Filter destinations based on input
  const filteredDestinations = destination.trim()
    ? destinations.filter((d) =>
        d.name.toLowerCase().includes(destination.toLowerCase())
      )
    : destinations;

  // Close dropdowns on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (destRef.current && !destRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
    if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
      setShowDatePicker(false);
    }
    if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
      setShowGuests(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Guest summary text
  const guestSummary = `${adults} Dewasa${children > 0 ? `, ${children} Anak` : ''}`;

  // Calendar helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);

  const canGoPrev = calendarYear > today.getFullYear() || (calendarYear === today.getFullYear() && calendarMonth > today.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(calendarYear, calendarMonth, day);
    return date < today;
  };

  const handleSelectDate = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(calendarYear, calendarMonth, day);
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (selectedSlug) {
      // Go directly to destination page
      const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      if (dateParam) params.set('date', dateParam);
      if (adults > 1 || children > 0) {
        params.set('adults', String(adults));
        params.set('children', String(children));
      }
      const query = params.toString();
      router.push(`/destinasi/${selectedSlug}${query ? `?${query}` : ''}`);
    } else if (destination.trim()) {
      // Search with query
      params.set('q', destination.trim());
      if (selectedDate) params.set('date', selectedDate.toISOString().split('T')[0]);
      if (adults > 1 || children > 0) {
        params.set('adults', String(adults));
        params.set('children', String(children));
      }
      router.push(`/destinasi?${params.toString()}`);
    } else {
      // No input, go to all destinations
      const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      if (dateParam) params.set('date', dateParam);
      if (adults > 1 || children > 0) {
        params.set('adults', String(adults));
        params.set('children', String(children));
      }
      const query = params.toString();
      router.push(`/destinasi${query ? `?${query}` : ''}`);
    }
  };

  return (
    <section className="relative z-20 -mt-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl rounded-2xl bg-white p-4 shadow-xl sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-3">
          {/* Tujuan - Autocomplete */}
          <div className="relative flex-1" ref={destRef}>
            <label htmlFor="destination" className="mb-1.5 block text-sm font-medium text-gray-700">
              Tujuan
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setSelectedSlug('');
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Mau ke mana?"
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        setDestination(dest.name);
                        setSelectedSlug(dest.slug);
                        setShowSuggestions(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-primary-50"
                    >
                      <svg className="h-4 w-4 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dest.name}</p>
                        <p className="text-xs text-gray-500">{dest.country}, Indonesia</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    Destinasi tidak ditemukan
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tanggal - Custom Datepicker */}
          <div className="relative flex-1" ref={dateRef}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tanggal
            </label>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex w-full items-center rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-left text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
                {selectedDate ? formatDateID(selectedDate) : 'Pilih tanggal'}
              </span>
            </button>

            {/* Calendar Dropdown */}
            {showDatePicker && (
              <div className="absolute left-0 top-full z-50 mt-1 w-[300px] rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
                {/* Month/Year Header */}
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={!canGoPrev}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30"
                    aria-label="Bulan sebelumnya"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span className="text-sm font-semibold text-gray-900">
                    {MONTHS_ID[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
                    aria-label="Bulan berikutnya"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                {/* Day Headers */}
                <div className="mb-1 grid grid-cols-7 gap-1">
                  {DAYS_ID.map((day) => (
                    <div key={day} className="py-1 text-center text-[11px] font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before first day */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isDateDisabled(day);
                    const isSelected = selectedDate &&
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === calendarMonth &&
                      selectedDate.getFullYear() === calendarYear;
                    const isToday = today.getDate() === day &&
                      today.getMonth() === calendarMonth &&
                      today.getFullYear() === calendarYear;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleSelectDate(day)}
                        disabled={disabled}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ${
                          isSelected
                            ? 'bg-primary font-semibold text-white'
                            : isToday
                            ? 'border border-primary font-medium text-primary'
                            : disabled
                            ? 'cursor-not-allowed text-gray-300'
                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tamu - Counter Dropdown */}
          <div className="relative flex-1" ref={guestRef}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tamu
            </label>
            <button
              type="button"
              onClick={() => setShowGuests(!showGuests)}
              className="flex w-full items-center rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-left text-sm text-gray-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              {guestSummary}
            </button>

            {/* Guest Dropdown */}
            {showGuests && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
                {/* Dewasa */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dewasa</p>
                    <p className="text-xs text-gray-500">Usia 12+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Kurangi dewasa"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-gray-900">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(12, adults + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary"
                      aria-label="Tambah dewasa"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Anak */}
                <div className="flex items-center justify-between border-t border-gray-100 py-2 pt-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Anak</p>
                    <p className="text-xs text-gray-500">Usia 2-11</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Kurangi anak"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-gray-900">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(6, children + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-primary hover:text-primary"
                      aria-label="Tambah anak"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Done button */}
                <button
                  type="button"
                  onClick={() => setShowGuests(false)}
                  className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Cari Sekarang
          </button>
        </div>
      </form>
    </section>
  );
}

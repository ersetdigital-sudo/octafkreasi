import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Octafkreasi - Jasa Tour Travel Terpercaya di Indonesia",
  description:
    "Octafkreasi adalah jasa tour travel terpercaya di Indonesia. Temukan paket wisata terbaik ke Raja Ampat, Bali, Labuan Bajo, dan destinasi impian lainnya dengan harga terjangkau. Pesan sekarang!",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL("https://www.octafkreasi.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Octafkreasi - Jasa Tour Travel Terpercaya di Indonesia",
    description: "Temukan paket wisata terbaik ke Raja Ampat, Bali, Labuan Bajo, dan destinasi impian lainnya dengan harga terjangkau.",
    type: "website",
    locale: "id_ID",
    siteName: "Octafkreasi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Octafkreasi - Jasa Tour Travel Terpercaya di Indonesia",
    description: "Temukan paket wisata terbaik ke Raja Ampat, Bali, Labuan Bajo, dan destinasi impian lainnya dengan harga terjangkau.",
  },
  keywords: ["jasa tour travel terpercaya", "jasa tour travel Indonesia", "paket wisata Indonesia", "tour travel murah", "octafkreasi"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

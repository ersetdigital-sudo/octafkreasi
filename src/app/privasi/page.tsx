import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Kebijakan Privasi
              </h1>
              <p className="mt-4 text-gray-500">Terakhir diperbarui: 1 Januari 2026</p>
            </div>

            {/* Content */}
            <div className="mt-10 space-y-8">
              {/* 1. Pendahuluan */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">1. Pendahuluan</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Selamat datang di Octaf Kreasi. Kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami. Dengan mengakses atau menggunakan platform Octaf Kreasi, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
                </p>
              </section>

              {/* 2. Informasi yang Kami Kumpulkan */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">2. Informasi yang Kami Kumpulkan</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kami mengumpulkan informasi yang Anda berikan secara langsung maupun yang dikumpulkan secara otomatis saat Anda menggunakan layanan kami, termasuk:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Nama lengkap dan informasi identitas</li>
                  <li>Alamat email dan nomor telepon</li>
                  <li>Data pembayaran (nomor kartu, rekening bank)</li>
                  <li>Preferensi perjalanan dan riwayat pemesanan</li>
                  <li>Informasi perangkat dan data penggunaan platform</li>
                  <li>Lokasi geografis (jika diizinkan)</li>
                </ul>
              </section>

              {/* 3. Penggunaan Informasi */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">3. Penggunaan Informasi</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Memproses dan mengelola pesanan paket wisata Anda</li>
                  <li>Mengirimkan konfirmasi pemesanan, e-voucher, dan informasi perjalanan</li>
                  <li>Berkomunikasi mengenai perubahan layanan atau promosi (dengan persetujuan Anda)</li>
                  <li>Meningkatkan kualitas layanan dan pengalaman pengguna</li>
                  <li>Memenuhi kewajiban hukum dan regulasi yang berlaku</li>
                  <li>Mencegah penipuan dan menjaga keamanan platform</li>
                </ul>
              </section>

              {/* 4. Perlindungan Data */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">4. Perlindungan Data</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kami menerapkan langkah-langkah keamanan yang ketat untuk melindungi data pribadi Anda:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Enkripsi SSL/TLS untuk semua transmisi data</li>
                  <li>Akses terbatas hanya untuk personel yang berwenang</li>
                  <li>Audit keamanan berkala oleh pihak ketiga independen</li>
                  <li>Penyimpanan data di server yang aman dengan standar industri</li>
                  <li>Prosedur penanganan insiden keamanan yang terstruktur</li>
                </ul>
              </section>

              {/* 5. Berbagi Informasi */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">5. Berbagi Informasi</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kami tidak menjual data pribadi Anda kepada pihak ketiga. Informasi Anda hanya dibagikan dalam kondisi berikut:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Kepada mitra perjalanan (hotel, maskapai, operator tur) yang terkait langsung dengan pemesanan Anda</li>
                  <li>Kepada penyedia layanan pembayaran untuk memproses transaksi</li>
                  <li>Jika diwajibkan oleh hukum atau perintah pengadilan</li>
                  <li>Untuk melindungi hak, keamanan, atau properti Octaf Kreasi dan penggunanya</li>
                </ul>
              </section>

              {/* 6. Cookie dan Teknologi Pelacakan */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Cookie dan Teknologi Pelacakan</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda di platform kami. Cookie membantu kami mengingat preferensi Anda, menganalisis penggunaan situs, dan menyajikan konten yang relevan. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda. Perlu diketahui bahwa menonaktifkan cookie tertentu dapat memengaruhi fungsionalitas platform.
                </p>
              </section>

              {/* 7. Hak Pengguna */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">7. Hak Pengguna</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Anda memiliki hak-hak berikut terkait data pribadi Anda:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li><strong>Hak Akses:</strong> Meminta salinan data pribadi yang kami simpan tentang Anda</li>
                  <li><strong>Hak Koreksi:</strong> Meminta perbaikan data yang tidak akurat atau tidak lengkap</li>
                  <li><strong>Hak Penghapusan:</strong> Meminta penghapusan data pribadi Anda dari sistem kami</li>
                  <li><strong>Hak Pembatasan:</strong> Meminta pembatasan pemrosesan data Anda</li>
                  <li><strong>Hak Portabilitas:</strong> Meminta transfer data Anda ke layanan lain</li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Untuk menggunakan hak-hak tersebut, silakan hubungi kami melalui email di hello@octafkreasi.id.
                </p>
              </section>

              {/* 8. Perubahan Kebijakan */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">8. Perubahan Kebijakan</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik kami atau persyaratan hukum. Perubahan signifikan akan diberitahukan melalui email atau pemberitahuan di platform. Kami menyarankan Anda untuk meninjau kebijakan ini secara berkala. Penggunaan berkelanjutan atas layanan kami setelah perubahan dianggap sebagai persetujuan Anda terhadap kebijakan yang diperbarui.
                </p>
              </section>

              {/* 9. Kontak */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">9. Kontak</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Jika Anda memiliki pertanyaan atau kekhawatiran mengenai Kebijakan Privasi ini atau penanganan data pribadi Anda, silakan hubungi kami:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Email: hello@octafkreasi.id</li>
                  <li>WhatsApp: +62 812-3456-7890</li>
                  <li>Alamat: Jl. Sudirman No. 123, Jakarta Selatan, Indonesia</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

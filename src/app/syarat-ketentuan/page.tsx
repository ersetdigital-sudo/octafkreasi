import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Syarat dan Ketentuan
              </h1>
              <p className="mt-4 text-gray-500">Terakhir diperbarui: 1 Januari 2025</p>
            </div>

            {/* Content */}
            <div className="mt-10 space-y-8">
              {/* 1. Ketentuan Umum */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">1. Ketentuan Umum</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Syarat dan Ketentuan ini mengatur penggunaan platform octafkreasi dan semua layanan yang disediakan. Dengan mengakses atau menggunakan layanan kami, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui salah satu ketentuan, mohon untuk tidak menggunakan layanan kami.
                </p>
              </section>

              {/* 2. Pendaftaran dan Akun */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">2. Pendaftaran dan Akun</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Untuk menggunakan layanan pemesanan, Anda harus membuat akun dengan memberikan informasi yang akurat dan lengkap. Anda bertanggung jawab untuk:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Menjaga kerahasiaan kredensial akun Anda</li>
                  <li>Memastikan semua informasi yang diberikan adalah benar dan terkini</li>
                  <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
                  <li>Memberitahu kami segera jika terjadi penggunaan tidak sah atas akun Anda</li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kami berhak menangguhkan atau menutup akun yang melanggar ketentuan ini.
                </p>
              </section>

              {/* 3. Pemesanan Paket Wisata */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">3. Pemesanan Paket Wisata</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Proses pemesanan paket wisata di octafkreasi meliputi:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li><strong>Proses Booking:</strong> Pilih paket, tentukan tanggal dan jumlah peserta, isi data diri, dan lakukan pembayaran</li>
                  <li><strong>Konfirmasi:</strong> Setelah pembayaran berhasil, Anda akan menerima email konfirmasi dan e-voucher dalam waktu maksimal 1x24 jam</li>
                  <li><strong>Perubahan:</strong> Perubahan jadwal atau detail pesanan dapat dilakukan maksimal 3 hari sebelum keberangkatan, tergantung ketersediaan</li>
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Pemesanan dianggap sah setelah pembayaran dikonfirmasi oleh sistem kami. octafkreasi berhak membatalkan pesanan jika ditemukan indikasi penipuan atau pelanggaran ketentuan.
                </p>
              </section>

              {/* 4. Harga dan Pembayaran */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">4. Harga dan Pembayaran</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Ketentuan mengenai harga dan pembayaran:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Semua harga ditampilkan dalam mata uang Rupiah (IDR) dan sudah termasuk pajak kecuali dinyatakan lain</li>
                  <li>Metode pembayaran yang tersedia: transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), kartu kredit/debit, dan PayLater</li>
                  <li>Batas waktu pembayaran adalah 2 jam setelah pemesanan dibuat. Pesanan yang tidak dibayar dalam batas waktu akan otomatis dibatalkan</li>
                  <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Harga yang berlaku adalah harga pada saat pemesanan dikonfirmasi</li>
                </ul>
              </section>

              {/* 5. Kebijakan Pembatalan dan Refund */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">5. Kebijakan Pembatalan dan Refund</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Kebijakan pembatalan dan pengembalian dana berlaku sebagai berikut:
                </p>
                <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Waktu Pembatalan</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Refund</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 text-gray-600">7 hari atau lebih sebelum keberangkatan</td>
                        <td className="px-4 py-3 font-medium text-green-600">100%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-600">3 - 7 hari sebelum keberangkatan</td>
                        <td className="px-4 py-3 font-medium text-yellow-600">50%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-600">Kurang dari 3 hari sebelum keberangkatan</td>
                        <td className="px-4 py-3 font-medium text-red-600">Tidak ada refund</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-600">Force majeure (bencana alam, pandemi, dll.)</td>
                        <td className="px-4 py-3 font-medium text-green-600">100% atau reschedule gratis</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Proses refund membutuhkan waktu 7-14 hari kerja setelah permintaan pembatalan disetujui. Refund akan dikembalikan melalui metode pembayaran yang sama dengan saat pemesanan.
                </p>
              </section>

              {/* 6. Tanggung Jawab Pengguna */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Tanggung Jawab Pengguna</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Sebagai pengguna layanan octafkreasi, Anda bertanggung jawab untuk:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Memberikan informasi yang benar dan akurat saat melakukan pemesanan</li>
                  <li>Memastikan dokumen perjalanan (KTP, paspor, visa) masih berlaku</li>
                  <li>Mematuhi peraturan dan ketentuan di destinasi wisata</li>
                  <li>Menjaga ketertiban dan tidak melakukan tindakan yang merugikan peserta lain</li>
                  <li>Bertanggung jawab atas barang bawaan pribadi selama perjalanan</li>
                </ul>
              </section>

              {/* 7. Batasan Tanggung Jawab octafkreasi */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">7. Batasan Tanggung Jawab octafkreasi</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  octafkreasi bertindak sebagai platform perantara antara pengguna dan penyedia layanan wisata. Kami tidak bertanggung jawab atas:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Perubahan jadwal atau pembatalan oleh pihak penyedia layanan (maskapai, hotel, operator tur)</li>
                  <li>Kerugian yang timbul akibat force majeure (bencana alam, pandemi, kerusuhan)</li>
                  <li>Kehilangan atau kerusakan barang pribadi selama perjalanan</li>
                  <li>Cedera atau masalah kesehatan yang terjadi selama perjalanan</li>
                  <li>Ketidaksesuaian ekspektasi pengguna dengan kondisi aktual di destinasi</li>
                </ul>
              </section>

              {/* 8. Hak Kekayaan Intelektual */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">8. Hak Kekayaan Intelektual</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Seluruh konten di platform octafkreasi, termasuk namun tidak terbatas pada teks, gambar, logo, desain, kode program, dan materi lainnya, dilindungi oleh hak cipta dan hak kekayaan intelektual. Pengguna dilarang menyalin, memodifikasi, mendistribusikan, atau menggunakan konten tersebut untuk tujuan komersial tanpa izin tertulis dari octafkreasi.
                </p>
              </section>

              {/* 9. Penyelesaian Sengketa */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">9. Penyelesaian Sengketa</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Setiap sengketa yang timbul dari penggunaan layanan octafkreasi akan diselesaikan melalui:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                  <li>Musyawarah untuk mufakat antara kedua belah pihak</li>
                  <li>Mediasi melalui lembaga mediasi yang disepakati bersama</li>
                  <li>Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri Jakarta Selatan sesuai hukum yang berlaku di Republik Indonesia</li>
                </ul>
              </section>

              {/* 10. Perubahan Syarat dan Ketentuan */}
              <section>
                <h2 className="text-xl font-bold text-gray-900">10. Perubahan Syarat dan Ketentuan</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  octafkreasi berhak mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan berlaku efektif setelah dipublikasikan di platform kami. Kami akan memberitahukan perubahan signifikan melalui email atau notifikasi di platform. Penggunaan berkelanjutan atas layanan kami setelah perubahan dianggap sebagai persetujuan Anda terhadap syarat dan ketentuan yang diperbarui.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi kami di hello@octafkreasi.id.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

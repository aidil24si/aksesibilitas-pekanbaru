import { Accessibility, AlertTriangle, Building2, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'

function BerandaPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary-600 px-4 py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <Accessibility className="h-16 w-16" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Sistem Informasi Aksesibilitas Fasilitas Publik Pekanbaru
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
            Temukan informasi aksesibilitas fasilitas publik dan laporkan
            hambatan yang Anda temui untuk Pekanbaru yang lebih inklusif.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/fasilitas"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-50"
            >
              <Building2 className="h-5 w-5" aria-hidden="true" />
              Lihat Fasilitas
            </Link>
            <Link
              to="/lapor"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Laporkan Hambatan
            </Link>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Tentang Sistem Ini
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              icon={<Building2 className="h-8 w-8 text-primary-600" />}
              title="Informasi Fasilitas"
              description="Lihat daftar fasilitas publik beserta informasi aksesibilitasnya."
            />
            <InfoCard
              icon={<AlertTriangle className="h-8 w-8 text-accent-500" />}
              title="Laporan Hambatan"
              description="Laporkan hambatan aksesibilitas yang Anda temui di fasilitas publik."
            />
            <InfoCard
              icon={<ClipboardList className="h-8 w-8 text-secondary-600" />}
              title="Pantau Status"
              description="Pantau status laporan yang telah Anda kirimkan."
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-gray-200 bg-amber-50 px-4 py-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-amber-800">
            <strong>Catatan:</strong> Sistem ini masih dalam tahap pengembangan
            prototipe. Data yang ditampilkan merupakan data contoh untuk
            keperluan demonstrasi dan belum terverifikasi.
          </p>
        </div>
      </section>
    </div>
  )
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-lg border border-gray-200 p-6 text-center shadow-sm">
      <div className="mb-4 flex justify-center" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default BerandaPage

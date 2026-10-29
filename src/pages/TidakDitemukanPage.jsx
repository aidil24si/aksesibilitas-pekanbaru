import { Link } from 'react-router-dom'

function TidakDitemukanPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mb-8 text-gray-600">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default TidakDitemukanPage

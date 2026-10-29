import { Accessibility, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/fasilitas', label: 'Fasilitas' },
  { to: '/lapor', label: 'Lapor Hambatan' },
]

function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-primary-700 no-underline">
            <Accessibility className="h-7 w-7" aria-hidden="true" />
            <span className="text-lg font-bold">Aksesibilitas PKU</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden gap-1 md:flex" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors no-underline ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-gray-200 px-4 py-2 md:hidden" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium transition-colors no-underline ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          <p>
            Aksesibilitas Pekanbaru &mdash; Prototipe Sistem Informasi
            Aksesibilitas Fasilitas Publik
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Data yang ditampilkan merupakan data contoh untuk keperluan
            demonstrasi.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default RootLayout

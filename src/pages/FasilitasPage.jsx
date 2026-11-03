import { Building2, Info, Trees, ShieldAlert, Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAccessibility } from '../contexts'
import {
  FACILITY_TYPE,
  FACILITY_TYPE_LABELS,
  CORE_NEED_GROUPS,
  NEED_GROUP_LABELS,
  PUBLICATION_STATUS,
} from '../domain/constants'

function FasilitasPage() {
  const { facilities, selectedNeeds, toggleNeed, getFacilitySummary } =
    useAccessibility()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Daftar Fasilitas Publik (Kandidat Awal)
        </h1>
        <p className="mt-2 text-gray-600">
          Daftar fasilitas publik yang sedang dieksplorasi di Pekanbaru.
          Informasi aksesibilitas pada tahap prototipe ini belum diobservasi
          secara resmi dan tidak memuat klaim sepihak.
        </p>
      </div>

      {/* Filter Profil Kebutuhan Fungsional (Cakupan Inti Prototipe) */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
        <h2 className="mb-2 text-base font-semibold text-gray-900">
          Sesuaikan Kebutuhan Aksesibilitas Anda
        </h2>
        <p className="mb-4 text-xs text-gray-500">
          Pilih kebutuhan fungsional yang relevan bagi Anda. Sistem tidak
          meminta identifikasi medis pengguna.
        </p>
        <div className="flex flex-wrap gap-2">
          {CORE_NEED_GROUPS.map((need) => {
            const isSelected = selectedNeeds.includes(need)
            return (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                {NEED_GROUP_LABELS[need]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Daftar Fasilitas */}
      <div className="space-y-4">
        {facilities.map((facility) => {
          const summary = getFacilitySummary(facility.id)
          const isDraft = facility.publicationStatus === PUBLICATION_STATUS.DRAFT

          return (
            <div
              key={facility.id}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {facility.type === FACILITY_TYPE.MALL ? (
                        <Building2 className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                      ) : (
                        <Trees className="h-3.5 w-3.5 text-secondary-600" aria-hidden="true" />
                      )}
                      {FACILITY_TYPE_LABELS[facility.type]}
                    </span>

                    {isDraft && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <ShieldAlert className="h-3 w-3" aria-hidden="true" />
                        Verifikasi Lokasi Diperlukan
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-700">
                    <Link
                      to={`/fasilitas/${facility.id}`}
                      className="after:absolute after:inset-0 focus:outline-none"
                    >
                      {facility.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">{facility.address || 'Alamat belum tercatat'}</p>
                  {facility.description && (
                    <p className="mt-1 text-xs text-gray-600">{facility.description}</p>
                  )}
                </div>

                {/* Status Penilaian Aksesibilitas */}
                <div className="mt-3 flex items-center justify-between gap-3 sm:mt-0 sm:flex-col sm:items-end">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    <Info className="h-3.5 w-3.5" aria-hidden="true" />
                    {summary && summary.fulfilled.length > 0
                      ? `${summary.fulfilled.length} kriteria terpenuhi`
                      : 'Belum ada data observasi'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                    Lihat detail
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </div>

              {/* Status Kejujuran Data */}
              <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                Status data: {facility.publicationStatus} &bull; Koordinat:{' '}
                {facility.coordinates
                  ? `${facility.coordinates.lat}, ${facility.coordinates.lng}`
                  : 'Belum terdata'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Peringatan Kepatuhan & Batasan */}
      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        <strong>Pemberitahuan Transparansi:</strong> Sistem Aksesibilitas
        Pekanbaru pada tahap prototipe ini belum memuat hasil asesmen
        terverifikasi untuk fasilitas di atas. Data fasilitas hanya mencakup
        identitas awal dan tidak boleh dianggap sebagai jaminan aksesibilitas
        atau sertifikasi kepatuhan.
      </div>
    </div>
  )
}

export default FasilitasPage

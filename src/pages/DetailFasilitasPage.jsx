import {
  Building2,
  Trees,
  ShieldAlert,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MinusCircle,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  FileText,
  Info,
} from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { useAccessibility } from '../contexts'
import {
  FACILITY_TYPE,
  FACILITY_TYPE_LABELS,
  NEED_GROUP,
  NEED_GROUP_LABELS,
  OBSERVATION_STATUS,
  USER_FACING_STATUS_LABELS,
  CRITERION_DEV_STATUS,
  PUBLICATION_STATUS,
  EVIDENCE_TYPE_LABELS,
} from '../domain/constants'

// Helper komponen ikon & style status observasi (tidak mengandalkan warna semata)
function ObservationStatusBadge({ status }) {
  const label =
    USER_FACING_STATUS_LABELS[status] || 'Status tidak terdefinisi'

  switch (status) {
    case OBSERVATION_STATUS.CONFIRMED_YES:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span>{label}</span>
        </span>
      )
    case OBSERVATION_STATUS.CONFIRMED_NO:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
          <XCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
          <span>{label}</span>
        </span>
      )
    case OBSERVATION_STATUS.CONFLICTING_EVIDENCE:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
          <span>{label}</span>
        </span>
      )
    case OBSERVATION_STATUS.NOT_APPLICABLE:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          <MinusCircle className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span>{label}</span>
        </span>
      )
    case OBSERVATION_STATUS.UNKNOWN:
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          <HelpCircle className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span>{label}</span>
        </span>
      )
  }
}

function DetailFasilitasPage() {
  const { id } = useParams()
  const { getFacilityDetailReport, selectedNeeds, toggleNeed } =
    useAccessibility()

  const report = getFacilityDetailReport(id)

  // Kondisi: ID tidak ditemukan
  if (!report || !report.facility) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <HelpCircle className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Fasilitas Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-2 max-w-md text-gray-600">
          Fasilitas dengan ID <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{id}</code> tidak terdaftar dalam basis data sistem prototipe ini.
        </p>
        <div className="mt-8">
          <Link
            to="/fasilitas"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke Daftar Fasilitas
          </Link>
        </div>
      </div>
    )
  }

  const { facility, summary, items, hasObservations } = report
  const isDraftFacility = facility.publicationStatus === PUBLICATION_STATUS.DRAFT

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Navigasi Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link
          to="/fasilitas"
          className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-800"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Daftar Fasilitas
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate font-semibold text-gray-800">{facility.name}</span>
      </nav>

      {/* Bagian A: Identitas Fasilitas */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="facility-identity-heading">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {facility.type === FACILITY_TYPE.MALL ? (
                  <Building2 className="h-4 w-4 text-primary-600" aria-hidden="true" />
                ) : (
                  <Trees className="h-4 w-4 text-secondary-600" aria-hidden="true" />
                )}
                {FACILITY_TYPE_LABELS[facility.type]}
              </span>

              {isDraftFacility ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                  Data Draft (Verifikasi Diperlukan)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Terpublikasi
                </span>
              )}
            </div>

            <h1 id="facility-identity-heading" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {facility.name}
            </h1>

            {facility.description && (
              <p className="mt-2 text-base text-gray-600">{facility.description}</p>
            )}
          </div>

          <div className="shrink-0 pt-1">
            <Link
              to={`/lapor?facilityId=${facility.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
              Laporkan Hambatan di Sini
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2.5 text-gray-700">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <div>
              <span className="block font-medium text-gray-900">Alamat Fisik</span>
              <span>{facility.address || 'Alamat spesifik belum tercatat'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-gray-700">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <div>
              <span className="block font-medium text-gray-900">Jam Operasional</span>
              <span>{facility.operatingHours || 'Informasi jam operasional belum tersedia'}</span>
            </div>
          </div>
        </div>

        {/* Informasi Koordinat & Waktu Pembaruan */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-400">
          <span>
            Koordinat:{' '}
            {facility.coordinates
              ? `${facility.coordinates.lat}, ${facility.coordinates.lng}`
              : 'Belum terdata secara presisi'}
          </span>
          {facility.updatedAt && (
            <span>
              Diperbarui: {new Date(facility.updatedAt).toLocaleDateString('id-ID')}
            </span>
          )}
        </div>

        {/* Catatan Khusus untuk Fasilitas Berstatus Draft */}
        {isDraftFacility && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <strong>Perhatian Status Data:</strong> Fasilitas ini berstatus <em>Draft</em>.
            Nama, alamat, atau batas fisiknya masih memerlukan konfirmasi lapangan sebelum
            dijadikan acuan publik tetap.
          </div>
        )}
      </section>

      {/* Bagian C: Filter Berdasarkan Kebutuhan Pengguna */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-slate-50 p-6" aria-labelledby="need-filter-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 id="need-filter-heading" className="text-base font-semibold text-gray-900">
              Saring Berdasarkan Kebutuhan Anda
            </h2>
            <p className="mt-0.5 text-xs text-gray-600">
              Pilih kebutuhan fungsional yang relevan. Sistem ini tidak memerlukan diagnosis medis.
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {selectedNeeds.length} kebutuhan aktif
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.values(NEED_GROUP).map((need) => {
            const isSelected = selectedNeeds.includes(need)
            return (
              <button
                key={need}
                type="button"
                onClick={() => toggleNeed(need)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
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
      </section>

      {/* Bagian B: Ringkasan Aksesibilitas (Berasal dari Mesin Penilaian) */}
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-lg font-bold text-gray-900">
          Ringkasan Aksesibilitas Terkait Kebutuhan Anda
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Ringkasan objektif berdasarkan observasi kriteria yang relevan dengan kebutuhan yang Anda pilih. Sistem tidak membuat skor angka arbitrer atau persentase klaim sepihak.
        </p>

        {/* Metrik Ringkasan Status */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center">
            <span className="block text-2xl font-bold text-emerald-700">
              {summary.fulfilled.length}
            </span>
            <span className="mt-1 block text-xs font-medium text-emerald-800">
              Terpenuhi
            </span>
          </div>

          <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-center">
            <span className="block text-2xl font-bold text-rose-700">
              {summary.notFulfilled.length}
            </span>
            <span className="mt-1 block text-xs font-medium text-rose-800">
              Belum Terpenuhi
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="block text-2xl font-bold text-slate-700">
              {summary.unknown.length}
            </span>
            <span className="mt-1 block text-xs font-medium text-slate-700">
              Belum Diketahui
            </span>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center">
            <span className="block text-2xl font-bold text-amber-800">
              {summary.conflicting.length}
            </span>
            <span className="mt-1 block text-xs font-medium text-amber-900">
              Bukti Berbeda
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
            <span className="block text-2xl font-bold text-gray-600">
              {summary.notApplicable.length}
            </span>
            <span className="mt-1 block text-xs font-medium text-gray-700">
              Tidak Berlaku
            </span>
          </div>
        </div>

        {/* Peringatan Kriteria Kritis Unknown */}
        {summary.hasUnknownCritical && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <strong className="font-semibold">Perhatian Kriteria Kritis:</strong> Terdapat kriteria penting bagi kebutuhan mobilitas/akses Anda yang statusnya masih <em>belum diketahui</em>. Sistem tidak menyatakan fasilitas ini sepenuhnya sesuai bagi Anda sampai ada bukti yang memadai.
            </div>
          </div>
        )}

        {/* Notifikasi Kriteria Not Fulfilled */}
        {summary.notFulfilled.length > 0 && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <div>
              <strong className="font-semibold">Hambatan Terdeteksi:</strong> Terdapat {summary.notFulfilled.length} kriteria relevan yang terkonfirmasi tidak terpenuhi di fasilitas ini.
            </div>
          </div>
        )}
      </section>

      {/* Bagian F: Penjelasan Kejujuran Kondisi Data Kosong */}
      {!hasObservations && (
        <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-sm text-blue-900" aria-labelledby="empty-obs-heading">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <div>
              <h3 id="empty-obs-heading" className="font-semibold text-blue-950">
                Informasi Aksesibilitas Belum Cukup untuk Dinilai
              </h3>
              <p className="mt-1 text-xs text-blue-800">
                Informasi aksesibilitas untuk fasilitas ini belum cukup untuk dinilai melalui proses verifikasi bukti resmi. Kondisi ini <strong>tidak berarti</strong> fasilitas tidak menyediakan aksesibilitas, melainkan belum ada catatan audit lapangan atau laporan pengguna yang diverifikasi.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bagian D: Daftar Kriteria Aksesibilitas */}
      <section className="mt-8" aria-labelledby="criteria-list-heading">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
          <h2 id="criteria-list-heading" className="text-lg font-bold text-gray-900">
            Rincian Kriteria Aksesibilitas Relevan ({items.length})
          </h2>
          <span className="text-xs text-gray-500">
            Menampilkan kriteria untuk fasilitas tipe {FACILITY_TYPE_LABELS[facility.type]}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            Tidak ada kriteria aksesibilitas yang relevan untuk kombinasi jenis fasilitas dan kelompok kebutuhan yang sedang Anda pilih.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {items.map((item) => {
              const { criterion, observation, status, isCritical, evidenceSources } = item
              const isDraftCrit = criterion.devStatus === CRITERION_DEV_STATUS.DRAFT

              return (
                <article
                  key={criterion.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300"
                  aria-labelledby={`criterion-title-${criterion.id}`}
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                            Kritis Bagi Kebutuhan Anda
                          </span>
                        )}

                        {/* Penanda Kriteria Draft */}
                        {isDraftCrit && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                            Kriteria Pengembangan (Draft)
                          </span>
                        )}
                      </div>

                      <h3
                        id={`criterion-title-${criterion.id}`}
                        className="text-base font-bold text-gray-900"
                      >
                        {criterion.name}
                      </h3>

                      <p className="text-sm text-gray-600">{criterion.description}</p>
                    </div>

                    {/* Badge Status Observasi Pengguna */}
                    <div className="sm:text-right shrink-0">
                      <ObservationStatusBadge status={status} />
                    </div>
                  </div>

                  {/* Rincian Observasi Lapangan / Desk Review */}
                  {observation && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-3.5 text-xs text-gray-700 space-y-2">
                      {observation.notes && (
                        <div>
                          <strong className="text-gray-900">Catatan Hasil Pemeriksaan: </strong>
                          <span>{observation.notes}</span>
                        </div>
                      )}

                      {observation.measuredValue && (
                        <div>
                          <strong className="text-gray-900">Nilai Terukur: </strong>
                          <span>{observation.measuredValue}</span>
                        </div>
                      )}

                      {observation.observedAt && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            Waktu Observasi:{' '}
                            {new Date(observation.observedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bagian E: Sumber Bukti Pendukung */}
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    {evidenceSources && evidenceSources.length > 0 ? (
                      <div className="space-y-2.5">
                        <span className="block text-xs font-semibold text-gray-700">
                          Sumber Bukti Pendukung ({evidenceSources.length}):
                        </span>
                        <div className="space-y-2">
                          {evidenceSources.map((ev) => {
                            const hasValidUrl =
                              Boolean(ev.url && typeof ev.url === 'string' && ev.url.trim().length > 0)

                            return (
                              <div
                                key={ev.id}
                                className="rounded-lg border border-gray-200 bg-gray-50/70 p-3 text-xs text-gray-700 space-y-1.5"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                                    <FileText className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                                    <span>{ev.name}</span>
                                    {ev.type && (
                                      <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-normal text-gray-700">
                                        {EVIDENCE_TYPE_LABELS[ev.type] || ev.type}
                                      </span>
                                    )}
                                  </div>

                                  {hasValidUrl && (
                                    <a
                                      href={ev.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-800 hover:underline"
                                    >
                                      Buka Tautan Sumber
                                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                    </a>
                                  )}
                                </div>

                                {ev.excerpt && (
                                  <blockquote className="border-l-2 border-gray-300 pl-2 text-gray-600 italic">
                                    &ldquo;{ev.excerpt}&rdquo;
                                  </blockquote>
                                )}

                                {ev.limitations && (
                                  <p className="text-[11px] text-amber-800">
                                    <strong>Catatan Keterbatasan:</strong> {ev.limitations}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-3 text-[11px] text-gray-400">
                                  {ev.publishedAt && (
                                    <span>Publikasi: {ev.publishedAt}</span>
                                  )}
                                  {ev.accessedAt && (
                                    <span>Diakses: {ev.accessedAt}</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">
                        {observation
                          ? 'Belum ada dokumen sumber bukti eksternal yang diunggah untuk observasi ini.'
                          : 'Belum ada bukti yang terekam karena kriteria ini belum diobservasi.'}
                      </p>
                    )}
                  </div>

                  {/* Dasar Rujukan Kriteria Draft */}
                  {criterion.reference && (
                    <div className="mt-2 text-[11px] text-gray-400">
                      Rujukan kriteria: {criterion.reference}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Batasan Sistem & Kejujuran Data */}
      <footer className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-xs text-gray-600">
        <h4 className="font-semibold text-gray-900">Batasan Sistem dan Tanggung Jawab:</h4>
        <p className="mt-1 leading-relaxed">
          Informasi aksesibilitas pada website ini disajikan semata-mata untuk membantu pengguna memperoleh gambaran awal sebelum berkunjung. Sistem ini bukan merupakan pengganti sertifikasi audit resmi oleh instansi pemerintah berwenang dan tidak boleh dijadikan klaim pemenuhan hukum arsitektural total.
        </p>
      </footer>
    </div>
  )
}

export default DetailFasilitasPage

import { useState, useId, useMemo } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  Link as LinkIcon,
  Send,
  User,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccessibility } from '../contexts'
import {
  CRITERION_DEV_STATUS,
  FACILITY_TYPE_LABELS,
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
} from '../domain/constants'

const TODAY_DATE_STRING = new Date().toISOString().split('T')[0]

function LaporPage() {
  const [searchParams] = useSearchParams()
  const initialFacilityId = searchParams.get('facilityId') || ''

  const { facilities, criteria, reports, addReport } = useAccessibility()

  // Form state
  const [facilityId, setFacilityId] = useState(initialFacilityId)
  const [criterionId, setCriterionId] = useState('')
  const [description, setDescription] = useState('')
  const [observedAt, setObservedAt] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [reporterName, setReporterName] = useState('')

  // UI state
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [recentReportId, setRecentReportId] = useState(null)

  // Accessible IDs
  const facilitySelectId = useId()
  const criterionSelectId = useId()
  const descriptionTextareaId = useId()
  const observedAtInputId = useId()
  const evidenceUrlInputId = useId()
  const reporterNameInputId = useId()

  // Kriteria yang cocok dengan fasilitas terpilih
  const selectedFacility = useMemo(
    () => facilities.find((f) => f.id === facilityId),
    [facilities, facilityId],
  )

  const availableCriteria = useMemo(() => {
    if (!selectedFacility) return criteria
    return criteria.filter((c) =>
      c.applicableFacilityTypes.includes(selectedFacility.type),
    )
  }, [criteria, selectedFacility])

  const selectedCriterion = useMemo(
    () => criteria.find((c) => c.id === criterionId),
    [criteria, criterionId],
  )

  // Validasi input sisi klien
  const validate = () => {
    const newErrors = {}

    if (!facilityId || facilityId.trim() === '') {
      newErrors.facilityId = 'Fasilitas wajib dipilih.'
    }

    if (!description || description.trim() === '') {
      newErrors.description = 'Deskripsi kondisi atau hambatan wajib diisi.'
    } else if (description.trim().length < 10) {
      newErrors.description =
        'Deskripsi terlalu singkat. Tuliskan minimal 10 karakter agar informatif.'
    }

    if (observedAt) {
      if (observedAt > TODAY_DATE_STRING) {
        newErrors.observedAt =
          'Waktu pengamatan tidak boleh lebih dari tanggal hari ini.'
      }
    }

    if (evidenceUrl && evidenceUrl.trim() !== '') {
      const trimmed = evidenceUrl.trim()
      const urlPattern = /^https?:\/\/.+/i
      if (!urlPattern.test(trimmed)) {
        newErrors.evidenceUrl =
          'Tautan bukti harus diawali dengan http:// atau https://'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const created = addReport({
      facilityId,
      criterionId: criterionId || null,
      description: description.trim(),
      observedAt: observedAt || null,
      evidenceUrl: evidenceUrl.trim() || null,
      reporterName: reporterName.trim() || null,
    })

    setRecentReportId(created.id)
    setIsSubmitted(true)

    // Reset form field
    setDescription('')
    setObservedAt('')
    setEvidenceUrl('')
    setReporterName('')
    setCriterionId('')
    setErrors({})
  }

  // Cari nama fasilitas dan kriteria untuk daftar laporan
  const getFacilityName = (fId) => {
    const f = facilities.find((item) => item.id === fId)
    return f ? f.name : `Fasilitas ID: ${fId}`
  }

  const getCriterionName = (cId) => {
    if (!cId) return 'Hambatan Umum / Seluruh Area'
    const c = criteria.find((item) => item.id === cId)
    return c ? c.name : 'Kriteria Tidak Terdaftar'
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Laporkan Hambatan Aksesibilitas
        </h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          Bantu warga Pekanbaru dengan melaporkan hambatan fisik atau fasilitas
          aksesibilitas yang tidak berfungsi. Setiap laporan dicatat sebagai
          masukan masyarakat yang <strong>menunggu proses verifikasi</strong> dan
          tidak secara otomatis mengubah penilaian resmi fasilitas.
        </p>
      </div>

      {/* Pemberitahuan Transparansi & Integritas Data */}
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 sm:text-sm">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
          <div className="space-y-1">
            <strong className="block font-semibold text-blue-950">
              Prinsip Integritas Pelaporan:
            </strong>
            <p>
              1. Laporan baru tidak langsung mengubah hasil asesmen fasilitas
              menjadi tidak terpenuhi.
            </p>
            <p>
              2. Pada tahap prototipe ini, data disimpan secara lokal di
              peramban perangkat ini (LocalStorage) dan belum terintegrasi ke
              peladen pemerintah kota.
            </p>
          </div>
        </div>
      </div>

      {/* Konfirmasi Sukses */}
      {isSubmitted && (
        <div
          role="status"
          className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <strong className="font-semibold text-emerald-950">
                Laporan Berhasil Dicatat!
              </strong>
              <p className="mt-1 text-xs text-emerald-800">
                Laporan Anda (ID: <code>{recentReportId}</code>) telah tersimpan
                pada perangkat ini dengan status <strong>Menunggu Verifikasi</strong>.
                Terima kasih atas kepedulian Anda untuk aksesibilitas Pekanbaru.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
              >
                Tutup pemberitahuan ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulir Pelaporan */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="form-heading">
        <h2 id="form-heading" className="text-lg font-bold text-gray-900">
          Formulir Laporan Kondisi Lapangan
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Tanda bintang (<span className="text-rose-500 font-bold">*</span>)
          menunjukkan field wajib diisi.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          {/* Field: Fasilitas */}
          <div>
            <label
              htmlFor={facilitySelectId}
              className="block text-sm font-semibold text-gray-900"
            >
              Fasilitas Publik yang Dilaporkan <span className="text-rose-500">*</span>
            </label>
            <select
              id={facilitySelectId}
              value={facilityId}
              onChange={(e) => {
                setFacilityId(e.target.value)
                setCriterionId('') // reset kriteria jika ganti fasilitas
                if (errors.facilityId) {
                  setErrors((prev) => ({ ...prev, facilityId: null }))
                }
              }}
              aria-invalid={Boolean(errors.facilityId)}
              aria-describedby={errors.facilityId ? 'facility-error' : undefined}
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.facilityId
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <option value="">-- Pilih Fasilitas Publik di Pekanbaru --</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({FACILITY_TYPE_LABELS[fac.type]}
                  {fac.publicationStatus === 'draft' ? ' - Draft' : ''})
                </option>
              ))}
            </select>
            {errors.facilityId && (
              <p id="facility-error" className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {errors.facilityId}
              </p>
            )}
          </div>

          {/* Field: Kriteria Terdampak */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={criterionSelectId}
                className="block text-sm font-semibold text-gray-900"
              >
                Kriteria / Aspek yang Terdampak{' '}
                <span className="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              {selectedCriterion && selectedCriterion.devStatus === CRITERION_DEV_STATUS.DRAFT && (
                <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Kriteria Draft
                </span>
              )}
            </div>
            <select
              id={criterionSelectId}
              value={criterionId}
              onChange={(e) => setCriterionId(e.target.value)}
              disabled={!facilityId}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">
                {facilityId
                  ? '-- Hambatan Umum / Tidak Terikat Satu Kriteria Spesifik --'
                  : '-- Pilih fasilitas terlebih dahulu --'}
              </option>
              {availableCriteria.map((crit) => (
                <option key={crit.id} value={crit.id}>
                  {crit.name}
                  {crit.devStatus === CRITERION_DEV_STATUS.DRAFT
                    ? ' (Kriteria Draft)'
                    : ''}
                </option>
              ))}
            </select>
            {selectedCriterion && (
              <p className="mt-1.5 text-xs text-gray-500">
                <strong>Catatan Kriteria:</strong> {selectedCriterion.description}{' '}
                {selectedCriterion.devStatus === CRITERION_DEV_STATUS.DRAFT && (
                  <span className="text-purple-700">
                    (Kriteria ini dirumuskan sebagai draft dan belum menjadi standar audit resmi).
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Field: Deskripsi Hambatan */}
          <div>
            <label
              htmlFor={descriptionTextareaId}
              className="block text-sm font-semibold text-gray-900"
            >
              Deskripsi Hambatan / Kondisi yang Ditemukan <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-gray-500">
              Ceritakan lokasi spesifik dan hambatan yang dialami (misal: posisi ramp, keberadaan tangga, pegangan yang rusak, dll).
            </p>
            <textarea
              id={descriptionTextareaId}
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: null }))
                }
              }}
              placeholder="Contoh: Ramp pintu masuk utama terhalang pot bunga besar dan undakan 10 cm, menyulitkan pengguna kursi roda untuk masuk."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'desc-error' : undefined}
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-gray-300 bg-white'
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              {errors.description ? (
                <p id="desc-error" className="flex items-center gap-1 text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.description}
                </p>
              ) : (
                <span className="text-gray-400">Minimal 10 karakter</span>
              )}
              <span className="text-gray-400">{description.length} karakter</span>
            </div>
          </div>

          {/* Grid: Waktu Pengamatan & Foto/Tautan Bukti */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Field: Waktu Pengamatan */}
            <div>
              <label
                htmlFor={observedAtInputId}
                className="block text-sm font-semibold text-gray-900"
              >
                Waktu Pengamatan{' '}
                <span className="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="date"
                  id={observedAtInputId}
                  value={observedAt}
                  max={TODAY_DATE_STRING}
                  onChange={(e) => {
                    setObservedAt(e.target.value)
                    if (errors.observedAt) {
                      setErrors((prev) => ({ ...prev, observedAt: null }))
                    }
                  }}
                  aria-invalid={Boolean(errors.observedAt)}
                  aria-describedby={errors.observedAt ? 'date-error' : undefined}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.observedAt
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-gray-300 bg-white'
                  }`}
                />
              </div>
              {errors.observedAt && (
                <p id="date-error" className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.observedAt}
                </p>
              )}
            </div>

            {/* Field: Tautan Bukti Foto / Dokumen */}
            <div>
              <label
                htmlFor={evidenceUrlInputId}
                className="block text-sm font-semibold text-gray-900"
              >
                Tautan Bukti Foto / Dokumen{' '}
                <span className="text-xs font-normal text-gray-500">(Opsional)</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="url"
                  id={evidenceUrlInputId}
                  value={evidenceUrl}
                  placeholder="https://drive.google.com/... atau tautan foto"
                  onChange={(e) => {
                    setEvidenceUrl(e.target.value)
                    if (errors.evidenceUrl) {
                      setErrors((prev) => ({ ...prev, evidenceUrl: null }))
                    }
                  }}
                  aria-invalid={Boolean(errors.evidenceUrl)}
                  aria-describedby={errors.evidenceUrl ? 'url-error' : undefined}
                  className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.evidenceUrl
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-gray-300 bg-white'
                  }`}
                />
              </div>
              {errors.evidenceUrl ? (
                <p id="url-error" className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.evidenceUrl}
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">
                  Tidak diwajibkan jika Anda tidak memiliki dokumentasi foto.
                </p>
              )}
            </div>
          </div>

          {/* Field: Nama Pelapor */}
          <div>
            <label
              htmlFor={reporterNameInputId}
              className="block text-sm font-semibold text-gray-900"
            >
              Nama Pelapor{' '}
              <span className="text-xs font-normal text-gray-500">(Opsional / Boleh Dikosongkan)</span>
            </label>
            <input
              type="text"
              id={reporterNameInputId}
              value={reporterName}
              placeholder="Anonim / Nama Anda"
              onChange={(e) => setReporterName(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Tombol Kirim */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <Link
              to="/fasilitas"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Kembali ke Fasilitas
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Kirim Laporan Hambatan
            </button>
          </div>
        </form>
      </section>

      {/* Bagian: Daftar Laporan Tersimpan di Perangkat Ini */}
      <section className="mt-12" aria-labelledby="reports-list-heading">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
          <h2 id="reports-list-heading" className="text-xl font-bold text-gray-900">
            Laporan Tersimpan di Perangkat Ini ({reports.length})
          </h2>
          <span className="text-xs text-gray-500">
            Data tersimpan secara lokal pada peramban perangkat Anda
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            <p>Belum ada laporan hambatan yang tercatat di perangkat ini.</p>
            <p className="mt-1 text-xs text-gray-400">
              Laporan yang Anda kirimkan melalui formulir di atas akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {reports.map((report) => {
              const hasValidEvidence =
                report.evidenceUrl &&
                typeof report.evidenceUrl === 'string' &&
                /^https?:\/\//i.test(report.evidenceUrl)

              return (
                <article
                  key={report.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 sm:p-6"
                  aria-labelledby={`report-title-${report.id}`}
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800">
                          <Building2 className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                          {getFacilityName(report.facilityId)}
                        </span>

                        {report.criterionId && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {getCriterionName(report.criterionId)}
                          </span>
                        )}
                      </div>

                      <h3
                        id={`report-title-${report.id}`}
                        className="mt-2 text-base font-semibold text-gray-900"
                      >
                        Laporan #{report.id.slice(-6)} &mdash; {getFacilityName(report.facilityId)}
                      </h3>
                    </div>

                    {/* Badge Status Verifikasi */}
                    <div className="shrink-0">
                      {report.status === REPORT_STATUS.VERIFIED ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                          {REPORT_STATUS_LABELS[REPORT_STATUS.VERIFIED]}
                        </span>
                      ) : report.status === REPORT_STATUS.REJECTED ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          <AlertTriangle className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                          {REPORT_STATUS_LABELS[REPORT_STATUS.REJECTED]}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                          <Clock className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                          {REPORT_STATUS_LABELS[REPORT_STATUS.PENDING_VERIFICATION]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Isi Deskripsi */}
                  <p className="mt-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {report.description}
                  </p>

                  {/* Tautan Bukti jika ada */}
                  {hasValidEvidence && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs">
                      <LinkIcon className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                      <a
                        href={report.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        Lihat Dokumen / Bukti Pendukung
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  )}

                  {/* Catatan Verifikasi */}
                  <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
                      <div>
                        <strong>Catatan Status: </strong>
                        {report.verificationNotes ||
                          'Laporan sedang menunggu proses peninjauan independen. Belum ada tindak lanjut otomatis dari pengelola fasilitas.'}
                      </div>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[11px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" aria-hidden="true" />
                      <span>{`Pelapor: ${report.reporterName || 'Anonim'}`}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {report.observedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          Diamati: {report.observedAt}
                        </span>
                      )}
                      <span>
                        Dikirim: {new Date(report.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-xs text-gray-500">
        <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-gray-600" aria-hidden="true" />
          Keterbatasan Prototipe Pelaporan:
        </h3>
        <p className="mt-1 leading-relaxed">
          Fitur ini berfungsi sebagai media pencatatan partisipatif awal. Sistem ini belum terhubung ke sistem tiket penanganan resmi Pemerintah Kota Pekanbaru atau pengelola mal. Seluruh laporan yang masuk memerlukan verifikasi data lapangan sebelum dapat dipertimbangkan dalam asesmen aksesibilitas.
        </p>
      </footer>
    </div>
  )
}

export default LaporPage

/**
 * Konstanta domain untuk Sistem Aksesibilitas Pekanbaru.
 *
 * File ini mendefinisikan nilai-nilai tetap yang digunakan di seluruh
 * sistem. Perubahan pada konstanta ini dapat berdampak pada logika
 * penilaian dan tampilan data.
 */

/**
 * Status hasil observasi terhadap satu kriteria aksesibilitas.
 *
 * Setiap status memiliki makna berbeda dan TIDAK boleh disamakan:
 * - confirmed_yes: terdapat bukti memadai bahwa kriteria terpenuhi
 * - confirmed_no: terdapat bukti memadai bahwa kriteria tidak terpenuhi
 * - unknown: informasi belum cukup untuk menentukan status
 * - not_applicable: kriteria tidak relevan pada konteks fasilitas tersebut
 * - conflicting_evidence: terdapat bukti yang saling bertentangan
 */
export const OBSERVATION_STATUS = Object.freeze({
  CONFIRMED_YES: 'confirmed_yes',
  CONFIRMED_NO: 'confirmed_no',
  UNKNOWN: 'unknown',
  NOT_APPLICABLE: 'not_applicable',
  CONFLICTING_EVIDENCE: 'conflicting_evidence',
})

/**
 * Jenis fasilitas yang didukung sistem.
 *
 * Cakupan awal terbatas pada mal/pusat perbelanjaan dan ruang publik
 * terbuka. Jenis lain dapat ditambahkan ketika kriteria aksesibilitas
 * yang relevan telah dirumuskan.
 */
export const FACILITY_TYPE = Object.freeze({
  MALL: 'mall',
  PUBLIC_OPEN_SPACE: 'public_open_space',
})

export const FACILITY_TYPE_LABELS = Object.freeze({
  [FACILITY_TYPE.MALL]: 'Mal / Pusat Perbelanjaan',
  [FACILITY_TYPE.PUBLIC_OPEN_SPACE]: 'Ruang Publik Terbuka',
})

/**
 * Kelompok kebutuhan fungsional pengguna.
 *
 * Dimodelkan berdasarkan kebutuhan fungsional, BUKAN diagnosis medis.
 * Satu pengguna dapat memilih lebih dari satu kebutuhan.
 * Satu kriteria dapat relevan untuk lebih dari satu kelompok.
 */
export const NEED_GROUP = Object.freeze({
  MOBILITY: 'mobility',
  VISION: 'vision',
  HEARING: 'hearing',
  COGNITIVE: 'cognitive',
})

export const NEED_GROUP_LABELS = Object.freeze({
  [NEED_GROUP.MOBILITY]: 'Mobilitas Fisik',
  [NEED_GROUP.VISION]: 'Penglihatan',
  [NEED_GROUP.HEARING]: 'Pendengaran',
  [NEED_GROUP.COGNITIVE]: 'Kognitif / Pemrosesan Informasi',
})

/**
 * Deskripsi kebutuhan fungsional untuk setiap kelompok.
 * Digunakan untuk membantu pengguna memahami apa yang dimaksud
 * dengan setiap kelompok tanpa meminta identifikasi medis.
 */
export const NEED_GROUP_DESCRIPTIONS = Object.freeze({
  [NEED_GROUP.MOBILITY]:
    'Kebutuhan terkait kemudahan bergerak, termasuk penggunaan kursi roda, alat bantu jalan, atau kesulitan berjalan jauh.',
  [NEED_GROUP.VISION]:
    'Kebutuhan terkait penglihatan, termasuk penglihatan rendah, buta warna, atau ketiadaan penglihatan.',
  [NEED_GROUP.HEARING]:
    'Kebutuhan terkait pendengaran, termasuk kesulitan mendengar pengumuman atau percakapan.',
  [NEED_GROUP.COGNITIVE]:
    'Kebutuhan terkait pemrosesan informasi, termasuk kesulitan memahami tanda atau petunjuk yang kompleks.',
})

/**
 * Status publikasi data fasilitas.
 */
export const PUBLICATION_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
})

/**
 * Status pemeriksaan (assessment).
 */
export const ASSESSMENT_STATUS = Object.freeze({
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
})

/**
 * Metode pemeriksaan.
 */
export const ASSESSMENT_METHOD = Object.freeze({
  DESK_REVIEW: 'desk_review',
  FIELD_VISIT: 'field_visit',
  USER_REPORT: 'user_report',
})

export const ASSESSMENT_METHOD_LABELS = Object.freeze({
  [ASSESSMENT_METHOD.DESK_REVIEW]: 'Kajian Dokumen / Sumber Online',
  [ASSESSMENT_METHOD.FIELD_VISIT]: 'Kunjungan Lapangan',
  [ASSESSMENT_METHOD.USER_REPORT]: 'Laporan Pengguna',
})

/**
 * Jenis sumber bukti.
 */
export const EVIDENCE_TYPE = Object.freeze({
  OFFICIAL_WEBSITE: 'official_website',
  NEWS_ARTICLE: 'news_article',
  GOVERNMENT_DOCUMENT: 'government_document',
  USER_REPORT: 'user_report',
  FIELD_OBSERVATION: 'field_observation',
  SOCIAL_MEDIA: 'social_media',
  OTHER: 'other',
})

export const EVIDENCE_TYPE_LABELS = Object.freeze({
  [EVIDENCE_TYPE.OFFICIAL_WEBSITE]: 'Situs Resmi',
  [EVIDENCE_TYPE.NEWS_ARTICLE]: 'Artikel Berita',
  [EVIDENCE_TYPE.GOVERNMENT_DOCUMENT]: 'Dokumen Pemerintah',
  [EVIDENCE_TYPE.USER_REPORT]: 'Laporan Pengguna',
  [EVIDENCE_TYPE.FIELD_OBSERVATION]: 'Observasi Lapangan',
  [EVIDENCE_TYPE.SOCIAL_MEDIA]: 'Media Sosial',
  [EVIDENCE_TYPE.OTHER]: 'Lainnya',
})

/**
 * Status pengembangan kriteria aksesibilitas.
 *
 * Kriteria yang baru dirumuskan pengembang belum dianggap tervalidasi.
 */
export const CRITERION_DEV_STATUS = Object.freeze({
  DRAFT: 'draft',
  REVIEW: 'review',
  ACCEPTED: 'accepted',
})

export const CRITERION_DEV_STATUS_LABELS = Object.freeze({
  [CRITERION_DEV_STATUS.DRAFT]: 'Kriteria Dalam Pengembangan (Draft)',
  [CRITERION_DEV_STATUS.REVIEW]: 'Dalam Peninjauan Ahli',
  [CRITERION_DEV_STATUS.ACCEPTED]: 'Tervalidasi',
})

/**
 * Label status observasi yang dirancang ramah dan mudah dipahami pengguna.
 * Menghindari konotasi kegagalan prematur atau kepastian semu.
 */
export const USER_FACING_STATUS_LABELS = Object.freeze({
  [OBSERVATION_STATUS.CONFIRMED_YES]:
    'Terpenuhi berdasarkan informasi yang tersedia',
  [OBSERVATION_STATUS.CONFIRMED_NO]:
    'Tidak terpenuhi berdasarkan informasi yang tersedia',
  [OBSERVATION_STATUS.UNKNOWN]:
    'Informasi belum tersedia atau belum cukup',
  [OBSERVATION_STATUS.NOT_APPLICABLE]:
    'Tidak relevan untuk fasilitas ini',
  [OBSERVATION_STATUS.CONFLICTING_EVIDENCE]:
    'Informasi dari sumber berbeda belum konsisten',
})

/**
 * Status verifikasi laporan hambatan aksesibilitas.
 *
 * Pada tahap prototipe:
 * - pending_verification: Laporan baru tercatat, menunggu peninjauan/verifikasi.
 * - verified: Laporan telah ditinjau dan informasinya diverifikasi.
 * - rejected: Laporan tidak dapat diverifikasi atau informasi tidak memadai.
 */
export const REPORT_STATUS = Object.freeze({
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
})

export const REPORT_STATUS_LABELS = Object.freeze({
  [REPORT_STATUS.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
  [REPORT_STATUS.VERIFIED]: 'Terverifikasi',
  [REPORT_STATUS.REJECTED]: 'Belum Dapat Diverifikasi',
})

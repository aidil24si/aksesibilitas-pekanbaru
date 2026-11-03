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
 *
 * Taksonomi terdiri dari 7 kelompok kebutuhan:
 * - 5 kelompok inti prototipe (MOBILITY, STAMINA_PACING, VISION, HEARING, COGNITIVE)
 * - 2 kelompok cakupan lanjutan (SENSORY_ENV, COMMUNICATION)
 */
export const NEED_GROUP = Object.freeze({
  MOBILITY: 'mobility',
  STAMINA_PACING: 'stamina_pacing',
  VISION: 'vision',
  HEARING: 'hearing',
  COGNITIVE: 'cognitive',
  SENSORY_ENV: 'sensory_env',
  COMMUNICATION: 'communication',
})

/**
 * Cakupan status kelompok kebutuhan dalam sistem prototipe.
 */
export const NEED_GROUP_SCOPE = Object.freeze({
  PROTOTYPE_CORE: 'prototype_core',
  EXTENDED: 'extended',
})

/**
 * Daftar kelompok kebutuhan yang masuk dalam cakupan inti prototipe (5 kelompok).
 */
export const CORE_NEED_GROUPS = Object.freeze([
  NEED_GROUP.MOBILITY,
  NEED_GROUP.STAMINA_PACING,
  NEED_GROUP.VISION,
  NEED_GROUP.HEARING,
  NEED_GROUP.COGNITIVE,
])

/**
 * Daftar kelompok kebutuhan yang masuk dalam cakupan lanjutan (2 kelompok).
 */
export const EXTENDED_NEED_GROUPS = Object.freeze([
  NEED_GROUP.SENSORY_ENV,
  NEED_GROUP.COMMUNICATION,
])

/**
 * Metadata lengkap kelompok kebutuhan fungsional.
 */
export const NEED_GROUP_METADATA = Object.freeze({
  [NEED_GROUP.MOBILITY]: Object.freeze({
    id: NEED_GROUP.MOBILITY,
    label: 'Mobilitas Fisik & Perpindahan',
    description:
      'Kebutuhan terkait kemudahan sirkulasi fisik bebas undakan, ramah kursi roda, alat bantu jalan, atau berjalan.',
    scope: NEED_GROUP_SCOPE.PROTOTYPE_CORE,
    isCore: true,
  }),
  [NEED_GROUP.STAMINA_PACING]: Object.freeze({
    id: NEED_GROUP.STAMINA_PACING,
    label: 'Daya Tahan Fisik & Istirahat',
    description:
      'Kebutuhan jeda pemulihan energi, bangku istirahat berkala, rute bertahap, dan peneduh cuaca panas.',
    scope: NEED_GROUP_SCOPE.PROTOTYPE_CORE,
    isCore: true,
  }),
  [NEED_GROUP.VISION]: Object.freeze({
    id: NEED_GROUP.VISION,
    label: 'Penglihatan & Navigasi Taktil',
    description:
      'Kebutuhan navigasi taktil, teks kontras tinggi, huruf Braille, dan panduan audio bagi hambatan penglihatan.',
    scope: NEED_GROUP_SCOPE.PROTOTYPE_CORE,
    isCore: true,
  }),
  [NEED_GROUP.HEARING]: Object.freeze({
    id: NEED_GROUP.HEARING,
    label: 'Pendengaran & Peringatan Visual',
    description:
      'Kebutuhan teks visual untuk pengumuman suara dan lampu strobo visual untuk peringatan darurat.',
    scope: NEED_GROUP_SCOPE.PROTOTYPE_CORE,
    isCore: true,
  }),
  [NEED_GROUP.COGNITIVE]: Object.freeze({
    id: NEED_GROUP.COGNITIVE,
    label: 'Orientasi Spasial & Navigasi Simbolik',
    description:
      'Kebutuhan denah lokasi "Anda Di Sini", piktogram universal, dan navigasi ruang intuitif.',
    scope: NEED_GROUP_SCOPE.PROTOTYPE_CORE,
    isCore: true,
  }),
  [NEED_GROUP.SENSORY_ENV]: Object.freeze({
    id: NEED_GROUP.SENSORY_ENV,
    label: 'Regulasi Stimulasi Sensorik Lingkungan',
    description:
      'Kebutuhan area tenang dan pengendalian input suara/cahaya berlebih bagi individu neurodivergen.',
    scope: NEED_GROUP_SCOPE.EXTENDED,
    isCore: false,
  }),
  [NEED_GROUP.COMMUNICATION]: Object.freeze({
    id: NEED_GROUP.COMMUNICATION,
    label: 'Akses Komunikasi Layanan Interaktif',
    description:
      'Kebutuhan interaksi layanan pelanggan dua arah secara tertulis/non-lisan di meja informasi.',
    scope: NEED_GROUP_SCOPE.EXTENDED,
    isCore: false,
  }),
})

export const NEED_GROUP_LABELS = Object.freeze({
  [NEED_GROUP.MOBILITY]: NEED_GROUP_METADATA[NEED_GROUP.MOBILITY].label,
  [NEED_GROUP.STAMINA_PACING]: NEED_GROUP_METADATA[NEED_GROUP.STAMINA_PACING].label,
  [NEED_GROUP.VISION]: NEED_GROUP_METADATA[NEED_GROUP.VISION].label,
  [NEED_GROUP.HEARING]: NEED_GROUP_METADATA[NEED_GROUP.HEARING].label,
  [NEED_GROUP.COGNITIVE]: NEED_GROUP_METADATA[NEED_GROUP.COGNITIVE].label,
  [NEED_GROUP.SENSORY_ENV]: NEED_GROUP_METADATA[NEED_GROUP.SENSORY_ENV].label,
  [NEED_GROUP.COMMUNICATION]: NEED_GROUP_METADATA[NEED_GROUP.COMMUNICATION].label,
})

/**
 * Deskripsi kebutuhan fungsional untuk setiap kelompok.
 * Digunakan untuk membantu pengguna memahami apa yang dimaksud
 * dengan setiap kelompok tanpa meminta identifikasi medis.
 */
export const NEED_GROUP_DESCRIPTIONS = Object.freeze({
  [NEED_GROUP.MOBILITY]: NEED_GROUP_METADATA[NEED_GROUP.MOBILITY].description,
  [NEED_GROUP.STAMINA_PACING]: NEED_GROUP_METADATA[NEED_GROUP.STAMINA_PACING].description,
  [NEED_GROUP.VISION]: NEED_GROUP_METADATA[NEED_GROUP.VISION].description,
  [NEED_GROUP.HEARING]: NEED_GROUP_METADATA[NEED_GROUP.HEARING].description,
  [NEED_GROUP.COGNITIVE]: NEED_GROUP_METADATA[NEED_GROUP.COGNITIVE].description,
  [NEED_GROUP.SENSORY_ENV]: NEED_GROUP_METADATA[NEED_GROUP.SENSORY_ENV].description,
  [NEED_GROUP.COMMUNICATION]: NEED_GROUP_METADATA[NEED_GROUP.COMMUNICATION].description,
})

/**
 * Memeriksa apakah kelompok kebutuhan termasuk dalam cakupan inti prototipe.
 *
 * @param {string} needGroup - Nilai kelompok kebutuhan (misal: 'mobility').
 * @returns {boolean}
 */
export function isCoreNeedGroup(needGroup) {
  return CORE_NEED_GROUPS.includes(needGroup)
}

/**
 * Mendapatkan salinan daftar kelompok kebutuhan yang masuk dalam cakupan inti prototipe.
 *
 * @returns {string[]}
 */
export function getCoreNeedGroups() {
  return [...CORE_NEED_GROUPS]
}

/**
 * Mendapatkan salinan daftar kelompok kebutuhan yang masuk cakupan lanjutan.
 *
 * @returns {string[]}
 */
export function getExtendedNeedGroups() {
  return [...EXTENDED_NEED_GROUPS]
}

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

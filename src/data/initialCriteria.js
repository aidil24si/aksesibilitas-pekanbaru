/**
 * Kriteria aksesibilitas awal — Aksesibilitas Pekanbaru.
 *
 * PENTING:
 * - Kriteria ini dirumuskan oleh pengembang sebagai titik awal prototipe.
 * - Kriteria belum divalidasi oleh ahli aksesibilitas atau lembaga terkait.
 * - Semua kriteria memiliki devStatus: 'draft'.
 * - Kriteria ini dirancang agar dapat diperluas untuk kelompok kebutuhan
 *   lain tanpa mengubah struktur utama.
 *
 * Referensi umum yang menjadi pertimbangan (BUKAN klaim kepatuhan):
 * - Permen PUPR No. 14/PRT/M/2017 tentang Persyaratan Kemudahan
 *   Bangunan Gedung (untuk konsep umum).
 * - Prinsip-prinsip umum aksesibilitas universal.
 */

import {
  CRITERION_DEV_STATUS,
  FACILITY_TYPE,
  NEED_GROUP,
} from '../domain/constants.js'
import { createAccessibilityCriterion } from '../domain/models.js'

export const initialCriteria = [
  // =========================================================================
  // MOBILITAS — MAL
  // =========================================================================

  createAccessibilityCriterion({
    id: 'crit_mall_entrance_ramp',
    name: 'Ramp pada pintu masuk utama',
    description:
      'Tersedia ramp atau jalur landai pada setidaknya satu pintu masuk utama yang dapat digunakan oleh pengguna kursi roda atau alat bantu jalan.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.MALL],
    evidenceGuidance:
      'Foto atau deskripsi ramp pada pintu masuk, termasuk perkiraan kemiringan jika memungkinkan.',
    reference:
      'Konsep umum aksesibilitas pintu masuk bangunan publik.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  createAccessibilityCriterion({
    id: 'crit_mall_elevator',
    name: 'Lift yang dapat diakses',
    description:
      'Tersedia lift yang cukup lebar untuk kursi roda, dengan tombol yang dapat dijangkau dan indikator lantai.',
    needGroups: [NEED_GROUP.MOBILITY, NEED_GROUP.VISION],
    applicableFacilityTypes: [FACILITY_TYPE.MALL],
    evidenceGuidance:
      'Informasi ketersediaan lift, dimensi pintu lift, posisi tombol, ketersediaan indikator braille atau suara.',
    reference:
      'Konsep umum lift aksesibel pada bangunan berlantai banyak.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  createAccessibilityCriterion({
    id: 'crit_mall_accessible_toilet',
    name: 'Toilet aksesibel',
    description:
      'Tersedia toilet yang dirancang untuk pengguna kursi roda, dengan ruang manuver yang memadai, handrail, dan pintu yang cukup lebar.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.MALL],
    evidenceGuidance:
      'Foto atau deskripsi toilet aksesibel, termasuk dimensi, handrail, dan mekanisme pintu.',
    reference:
      'Konsep umum toilet aksesibel pada bangunan publik.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  createAccessibilityCriterion({
    id: 'crit_mall_parking',
    name: 'Parkir khusus disabilitas',
    description:
      'Tersedia area parkir yang ditandai khusus untuk penyandang disabilitas, dengan jarak yang dekat ke pintu masuk.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.MALL],
    evidenceGuidance:
      'Foto atau informasi area parkir khusus, penandaan, dan jarak ke pintu masuk.',
    reference:
      'Konsep umum parkir aksesibel pada fasilitas publik.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  // =========================================================================
  // MOBILITAS — RUANG PUBLIK TERBUKA
  // =========================================================================

  createAccessibilityCriterion({
    id: 'crit_park_pathway',
    name: 'Jalur pejalan kaki yang rata dan stabil',
    description:
      'Tersedia jalur pejalan kaki dengan permukaan yang rata, stabil, dan cukup lebar untuk pengguna kursi roda atau alat bantu jalan.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    evidenceGuidance:
      'Foto atau deskripsi kondisi jalur, material permukaan, lebar jalur.',
    reference:
      'Konsep umum jalur aksesibel pada ruang terbuka.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  createAccessibilityCriterion({
    id: 'crit_park_entrance',
    name: 'Pintu masuk area yang aksesibel',
    description:
      'Pintu masuk area tidak memiliki hambatan fisik seperti anak tangga tanpa alternatif ramp atau jalur landai.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    evidenceGuidance:
      'Foto atau deskripsi pintu masuk, ada tidaknya tangga, ramp alternatif.',
    reference:
      'Konsep umum pintu masuk aksesibel.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  createAccessibilityCriterion({
    id: 'crit_park_toilet',
    name: 'Toilet aksesibel di area publik',
    description:
      'Tersedia toilet yang dapat digunakan oleh pengguna kursi roda di dalam atau dekat area publik terbuka.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    evidenceGuidance:
      'Foto atau informasi toilet aksesibel, lokasi, dimensi.',
    reference:
      'Konsep umum toilet aksesibel pada fasilitas publik.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  // =========================================================================
  // PENGLIHATAN — MAL & RUANG PUBLIK
  // =========================================================================

  createAccessibilityCriterion({
    id: 'crit_mall_tactile_guidance',
    name: 'Jalur pemandu taktil (guiding block)',
    description:
      'Tersedia jalur pemandu taktil (guiding block) pada area publik untuk membantu navigasi penyandang gangguan penglihatan.',
    needGroups: [NEED_GROUP.VISION],
    applicableFacilityTypes: [FACILITY_TYPE.MALL, FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    evidenceGuidance:
      'Foto atau deskripsi jalur pemandu taktil, area yang dilayani.',
    reference:
      'Konsep umum jalur pemandu pada fasilitas publik.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  createAccessibilityCriterion({
    id: 'crit_signage_clarity',
    name: 'Penanda dan petunjuk yang jelas',
    description:
      'Penanda arah dan informasi menggunakan ukuran huruf yang cukup besar, kontras warna yang memadai, dan penempatan yang konsisten.',
    needGroups: [NEED_GROUP.VISION, NEED_GROUP.COGNITIVE],
    applicableFacilityTypes: [FACILITY_TYPE.MALL, FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    evidenceGuidance:
      'Foto penanda, informasi ukuran teks, kontras, dan konsistensi penempatan.',
    reference:
      'Konsep umum signage aksesibel.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),

  // =========================================================================
  // PENDENGARAN — MAL
  // =========================================================================

  createAccessibilityCriterion({
    id: 'crit_mall_visual_announcement',
    name: 'Pengumuman visual',
    description:
      'Informasi penting yang biasanya disampaikan melalui pengumuman suara juga tersedia dalam bentuk visual (layar, papan informasi).',
    needGroups: [NEED_GROUP.HEARING],
    applicableFacilityTypes: [FACILITY_TYPE.MALL],
    evidenceGuidance:
      'Foto atau informasi tentang ketersediaan layar informasi, papan pengumuman visual.',
    reference:
      'Konsep umum aksesibilitas informasi untuk penyandang gangguan pendengaran.',
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),
]

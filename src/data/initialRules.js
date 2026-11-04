/**
 * Aturan penilaian awal — Aksesibilitas Pekanbaru.
 *
 * PENTING:
 * - Aturan ini dirumuskan oleh pengembang sebagai titik awal prototipe.
 * - Bobot, ambang batas, atau formula skor TIDAK ditetapkan secara
 *   arbitrer. Aturan ini hanya mendefinisikan kondisi terpenuhi/tidak.
 * - Penentuan kriteria "kritis" bersifat sementara dan perlu tinjauan
 *   dari ahli aksesibilitas.
 *
 * Keputusan yang masih harus ditetapkan:
 * - Apakah perlu membedakan tingkat keparahan ketidaktersediaan.
 * - Bagaimana menangani kriteria yang sebagian terpenuhi (contoh:
 *   ramp ada tapi terlalu curam).
 * - Apakah perlu versi aturan per jenis fasilitas.
 */

import { NEED_GROUP, OBSERVATION_STATUS } from '../domain/constants.js'
import { createAssessmentRule } from '../domain/models.js'

export const initialAssessmentRules = [
  // Ramp pintu masuk — kritis untuk mobilitas
  createAssessmentRule({
    id: 'rule_mall_entrance_ramp',
    criterionId: 'crit_mall_entrance_ramp',
    description:
      'Ramp pada pintu masuk utama dianggap tersedia jika ada observasi confirmed_yes. Dianggap tidak tersedia jika confirmed_no.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
    unknownHandling:
      'Jika status unknown, kemampuan akses pintu masuk belum dapat dipastikan.',
  }),

  // Lift — kritis untuk mobilitas
  createAssessmentRule({
    id: 'rule_mall_elevator',
    criterionId: 'crit_mall_elevator',
    description:
      'Lift aksesibel dianggap tersedia jika confirmed_yes. Perlu diperhatikan bahwa keberadaan lift saja belum menjamin seluruh area dapat diakses.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
    unknownHandling:
      'Jika status unknown, ketersediaan lift belum dapat dipastikan.',
  }),

  // Toilet aksesibel (mal) — kritis untuk mobilitas
  createAssessmentRule({
    id: 'rule_mall_accessible_toilet',
    criterionId: 'crit_mall_accessible_toilet',
    description:
      'Toilet aksesibel dianggap tersedia jika confirmed_yes. Keberadaan toilet biasa tidak dianggap setara.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
    unknownHandling:
      'Jika status unknown, ketersediaan toilet aksesibel belum dapat dipastikan.',
  }),

  // Parkir — tidak kritis tapi penting
  createAssessmentRule({
    id: 'rule_mall_parking',
    criterionId: 'crit_mall_parking',
    description:
      'Parkir khusus disabilitas dianggap tersedia jika confirmed_yes.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [],
    unknownHandling:
      'Jika status unknown, ketersediaan parkir khusus belum dapat dipastikan.',
  }),

  // Jalur pejalan kaki (ruang publik) — kritis untuk mobilitas
  createAssessmentRule({
    id: 'rule_park_pathway',
    criterionId: 'crit_park_pathway',
    description:
      'Jalur pejalan kaki dianggap aksesibel jika confirmed_yes (permukaan rata, stabil, cukup lebar).',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
    unknownHandling:
      'Jika status unknown, kondisi jalur belum dapat dipastikan.',
  }),

  // Pintu masuk area publik — kritis untuk mobilitas
  createAssessmentRule({
    id: 'rule_park_entrance',
    criterionId: 'crit_park_entrance',
    description:
      'Pintu masuk dianggap aksesibel jika confirmed_yes (tanpa hambatan fisik atau tersedia alternatif).',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
    unknownHandling:
      'Jika status unknown, aksesibilitas pintu masuk belum dapat dipastikan.',
  }),

  // Toilet aksesibel (ruang publik)
  createAssessmentRule({
    id: 'rule_park_toilet',
    criterionId: 'crit_park_toilet',
    description:
      'Toilet aksesibel dianggap tersedia jika confirmed_yes.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
    unknownHandling:
      'Jika status unknown, ketersediaan toilet aksesibel belum dapat dipastikan.',
  }),

  // Jalur pemandu taktil — kritis untuk penglihatan
  createAssessmentRule({
    id: 'rule_tactile_guidance',
    criterionId: 'crit_mall_tactile_guidance',
    description:
      'Jalur pemandu taktil dianggap tersedia jika confirmed_yes.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.VISION],
    unknownHandling:
      'Jika status unknown, ketersediaan jalur pemandu belum dapat dipastikan.',
  }),

  // Penanda dan petunjuk — non-kritis
  createAssessmentRule({
    id: 'rule_signage_clarity',
    criterionId: 'crit_signage_clarity',
    description:
      'Penanda dianggap jelas jika confirmed_yes (ukuran huruf, kontras, konsistensi memadai).',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [],
    unknownHandling:
      'Jika status unknown, kualitas penanda belum dapat dipastikan.',
  }),

  // Pengumuman visual — kritis untuk pendengaran
  createAssessmentRule({
    id: 'rule_visual_announcement',
    criterionId: 'crit_mall_visual_announcement',
    description:
      'Pengumuman visual dianggap tersedia jika confirmed_yes.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.HEARING],
    unknownHandling:
      'Jika status unknown, ketersediaan pengumuman visual belum dapat dipastikan.',
  }),

  // =========================================================================
  // DAYA TAHAN FISIK & ISTIRAHAT (STAMINA_PACING)
  // =========================================================================

  // Bangku istirahat — kritis untuk daya tahan fisik & istirahat
  createAssessmentRule({
    id: 'rule_circulation_rest_benches',
    criterionId: 'crit_circulation_rest_benches',
    description:
      'Bangku istirahat publik dianggap tersedia jika ada observasi confirmed_yes (bangku stabil, bersandaran punggung, gratis di sirkulasi publik). Keberadaan satu bangku atau kursi komersial berbayar tidak cukup untuk menyatakan kriteria terpenuhi.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.STAMINA_PACING],
    unknownHandling:
      'Jika status unknown, ketersediaan tempat duduk istirahat yang memadai belum dapat dipastikan.',
  }),

  // Peneduh cuaca — kritis untuk daya tahan fisik pada ruang terbuka publik
  createAssessmentRule({
    id: 'rule_open_space_shade',
    criterionId: 'crit_open_space_shade',
    description:
      'Peneduh cuaca dianggap memadai jika ada observasi confirmed_yes (area istirahat dan jalur sirkulasi utama terlindung dari paparan matahari terik). Keberadaan peneduh lokal tidak otomatis melindungi seluruh area.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.STAMINA_PACING],
    unknownHandling:
      'Jika status unknown atau kecukupan naungan belum terbukti, perlindungan cuaca belum dapat dipastikan.',
  }),
]

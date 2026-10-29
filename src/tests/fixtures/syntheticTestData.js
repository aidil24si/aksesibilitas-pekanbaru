/**
 * FIXTURE PENGUJIAN SINTETIS (DATA UJI FIKTIF)
 *
 * PERHATIAN:
 * Seluruh data dalam file ini adalah DATA SINTETIS (FIKTIF) semata-mata
 * untuk keperluan unit testing logic sistem.
 * BUKAN data nyata fasilitas di Pekanbaru, BUKAN hasil audit aktual,
 * dan TIDAK BOLEH digunakan untuk klaim faktual publik.
 */

import {
  FACILITY_TYPE,
  NEED_GROUP,
  OBSERVATION_STATUS,
  ASSESSMENT_METHOD,
  PUBLICATION_STATUS,
  CRITERION_DEV_STATUS,
  EVIDENCE_TYPE,
} from '../../domain/constants.js'
import {
  createFacility,
  createAccessibilityCriterion,
  createFacilityAssessment,
  createCriterionObservation,
  createEvidenceSource,
  createObservationEvidence,
  createUserNeedProfile,
  createAssessmentRule,
} from '../../domain/models.js'

// 1. Fasilitas Fiktif untuk Pengujian
export const syntheticFacilities = {
  mallA: createFacility({
    id: 'fac_synthetic_mall_a',
    name: '[SINTETIS] Mal Contoh Alpha',
    type: FACILITY_TYPE.MALL,
    address: 'Jl. Contoh Sintetis No. 1, Wilayah Uji',
    publicationStatus: PUBLICATION_STATUS.DRAFT,
  }),
  parkB: createFacility({
    id: 'fac_synthetic_park_b',
    name: '[SINTETIS] Taman Terbuka Contoh Beta',
    type: FACILITY_TYPE.PUBLIC_OPEN_SPACE,
    address: 'Jl. Contoh Sintetis No. 2, Wilayah Uji',
    publicationStatus: PUBLICATION_STATUS.DRAFT,
  }),
}

// 2. Kriteria Sintetis Terkendali
export const syntheticCriteria = [
  createAccessibilityCriterion({
    id: 'crit_syn_ramp',
    name: '[SINTETIS] Ramp Akses Utama',
    description: 'Ramp pintu masuk utama dengan kemiringan wajar.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.MALL, FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),
  createAccessibilityCriterion({
    id: 'crit_syn_elevator',
    name: '[SINTETIS] Lift Aksesibel',
    description: 'Lift dengan tombol terjangkau dan pintu lebar.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.MALL], // Khusus mall
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),
  createAccessibilityCriterion({
    id: 'crit_syn_toilet',
    name: '[SINTETIS] Toilet Disabilitas',
    description: 'Toilet dengan pegangan rambat dan ruang putar.',
    needGroups: [NEED_GROUP.MOBILITY],
    applicableFacilityTypes: [FACILITY_TYPE.MALL, FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),
  createAccessibilityCriterion({
    id: 'crit_syn_tactile',
    name: '[SINTETIS] Guiding Block Taktil',
    description: 'Ubin pemandu jalan bagi tunanetra.',
    needGroups: [NEED_GROUP.VISION],
    applicableFacilityTypes: [FACILITY_TYPE.MALL, FACILITY_TYPE.PUBLIC_OPEN_SPACE],
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),
  createAccessibilityCriterion({
    id: 'crit_syn_audio_caption',
    name: '[SINTETIS] Teks Pengumuman Visual',
    description: 'Pengumuman suara disertai tampilan teks.',
    needGroups: [NEED_GROUP.HEARING],
    applicableFacilityTypes: [FACILITY_TYPE.MALL],
    devStatus: CRITERION_DEV_STATUS.DRAFT,
  }),
]

// 3. Aturan Sintetis
export const syntheticRules = [
  createAssessmentRule({
    id: 'rule_syn_ramp',
    criterionId: 'crit_syn_ramp',
    description: 'Ramp pintu masuk wajib tersedia bagi mobilitas.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
  }),
  createAssessmentRule({
    id: 'rule_syn_elevator',
    criterionId: 'crit_syn_elevator',
    description: 'Lift wajib tersedia bagi mobilitas pada gedung bertingkat.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.MOBILITY],
  }),
  createAssessmentRule({
    id: 'rule_syn_tactile',
    criterionId: 'crit_syn_tactile',
    description: 'Guiding block penting bagi pemandu jalan penglihatan.',
    fulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_YES],
    notFulfilledWhen: [OBSERVATION_STATUS.CONFIRMED_NO],
    criticalForNeeds: [NEED_GROUP.VISION],
  }),
]

// 4. Profil Kebutuhan Sintetis
export const syntheticProfiles = {
  mobilityOnly: createUserNeedProfile({
    id: 'profile_mobility',
    selectedNeeds: [NEED_GROUP.MOBILITY],
  }),
  visionOnly: createUserNeedProfile({
    id: 'profile_vision',
    selectedNeeds: [NEED_GROUP.VISION],
  }),
  hearingOnly: createUserNeedProfile({
    id: 'profile_hearing',
    selectedNeeds: [NEED_GROUP.HEARING],
  }),
  mobilityAndVision: createUserNeedProfile({
    id: 'profile_multi',
    selectedNeeds: [NEED_GROUP.MOBILITY, NEED_GROUP.VISION],
  }),
}

// 5. Helper pembuat assessment sintetis
export function createSyntheticAssessment(facilityId, id = 'asmt_synthetic_1') {
  return createFacilityAssessment({
    id,
    facilityId,
    method: ASSESSMENT_METHOD.DESK_REVIEW,
    notes: 'Pemeriksaan sintetis untuk unit testing.',
  })
}

// 6. Sumber Bukti Sintetis (Uji Bukti)
export const syntheticEvidenceSources = {
  officialDoc: createEvidenceSource({
    id: 'evd_syn_official_1',
    name: '[SINTETIS] Dokumen Denah Aksesibilitas Mal Alpha',
    type: EVIDENCE_TYPE.OFFICIAL_WEBSITE,
    url: 'https://example.com/synthetic/denah.pdf',
    publishedAt: '2026-01-15',
    accessedAt: '2026-02-01',
    excerpt: 'Ramp utama terletak di lobi timur dengan kemiringan 1:12.',
    limitations: 'Data diperoleh dari publikasi digital tanpa pengukuran langsung.',
  }),
  userPhoto: createEvidenceSource({
    id: 'evd_syn_user_2',
    name: '[SINTETIS] Foto Laporan Warga di Lapangan',
    type: EVIDENCE_TYPE.USER_REPORT,
    url: '', // Sengaja kosong untuk menguji bahwa link tidak tampil jika URL kosong
    publishedAt: '2026-03-10',
    accessedAt: '2026-03-11',
    excerpt: 'Foto menunjukkan lift berfungsi dan memiliki penanda taktil.',
    limitations: 'Foto hanya mencakup satu sisi elevator.',
  }),
}

// 7. Helper pembuat observasi & relasi bukti sintetis
export function createSyntheticObservationWithEvidence({
  id = 'obs_syn_1',
  assessmentId,
  criterionId,
  status = OBSERVATION_STATUS.CONFIRMED_YES,
  evidenceId = 'evd_syn_official_1',
  notes = 'Catatan observasi sintetis',
}) {
  const observation = createCriterionObservation({
    id,
    assessmentId,
    criterionId,
    status,
    notes,
  })

  const link = createObservationEvidence({
    id: `oe_${id}_${evidenceId}`,
    observationId: id,
    evidenceId,
  })

  return { observation, link }
}

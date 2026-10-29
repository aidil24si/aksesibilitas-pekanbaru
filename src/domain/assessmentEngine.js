/**
 * Assessment Engine — Mesin Penilaian Aksesibilitas.
 *
 * Modul ini berisi logika penilaian murni (pure functions) yang
 * menentukan kriteria relevan berdasarkan profil kebutuhan pengguna
 * dan merangkum hasil observasi.
 *
 * Prinsip utama:
 * 1. Tidak ada skor agregat tunggal.
 * 2. Status `unknown` tidak boleh berubah menjadi `confirmed_no`.
 * 3. Status `not_applicable` tidak dianggap sebagai kegagalan.
 * 4. Status `conflicting_evidence` dipertahankan, tidak dipilih otomatis.
 * 5. Jika ada kriteria kritis yang unknown, sistem tidak boleh menyatakan
 *    fasilitas sepenuhnya sesuai.
 */

import { OBSERVATION_STATUS } from './constants.js'

// ---------------------------------------------------------------------------
// Penentuan Kriteria Relevan
// ---------------------------------------------------------------------------

/**
 * Menentukan kriteria yang relevan berdasarkan profil kebutuhan pengguna
 * dan jenis fasilitas.
 *
 * Satu kriteria relevan jika:
 * - Jenis fasilitas termasuk dalam applicableFacilityTypes kriteria, DAN
 * - Setidaknya satu kelompok kebutuhan pengguna termasuk dalam
 *   needGroups kriteria.
 *
 * @param {Object[]} criteria - Daftar seluruh kriteria.
 * @param {Object} userProfile - Profil kebutuhan pengguna.
 * @param {string} facilityType - Jenis fasilitas.
 * @returns {Object[]} Kriteria yang relevan.
 */
export function getRelevantCriteria(criteria, userProfile, facilityType) {
  if (!criteria || !Array.isArray(criteria)) return []
  if (!userProfile || !Array.isArray(userProfile.selectedNeeds)) return []
  if (!facilityType) return []

  return criteria.filter((criterion) => {
    const matchesFacilityType =
      criterion.applicableFacilityTypes.includes(facilityType)
    const matchesNeedGroup = criterion.needGroups.some((ng) =>
      userProfile.selectedNeeds.includes(ng),
    )
    return matchesFacilityType && matchesNeedGroup
  })
}

// ---------------------------------------------------------------------------
// Pengambilan Observasi Terbaru
// ---------------------------------------------------------------------------

/**
 * Mengambil observasi terbaru untuk setiap kriteria pada fasilitas tertentu.
 *
 * Jika ada beberapa observasi untuk kriteria yang sama (dari assessment
 * berbeda), observasi yang paling baru digunakan.
 *
 * @param {Object[]} observations - Seluruh observasi.
 * @param {Object[]} assessments - Seluruh assessment.
 * @param {string} facilityId - ID fasilitas.
 * @param {string[]} criterionIds - ID kriteria yang dicari.
 * @returns {Map<string, Object>} Map dari criterionId ke observasi terbaru.
 */
export function getLatestObservations(
  observations,
  assessments,
  facilityId,
  criterionIds,
) {
  // Dapatkan assessment IDs untuk fasilitas ini
  const facilityAssessmentIds = new Set(
    assessments
      .filter((a) => a.facilityId === facilityId)
      .map((a) => a.id),
  )

  // Filter observasi yang relevan
  const relevant = observations.filter(
    (obs) =>
      facilityAssessmentIds.has(obs.assessmentId) &&
      criterionIds.includes(obs.criterionId),
  )

  // Ambil observasi terbaru per kriteria
  const latestMap = new Map()
  for (const obs of relevant) {
    const existing = latestMap.get(obs.criterionId)
    if (!existing || obs.observedAt > existing.observedAt) {
      latestMap.set(obs.criterionId, obs)
    }
  }

  return latestMap
}

// ---------------------------------------------------------------------------
// Ringkasan Penilaian per Kriteria
// ---------------------------------------------------------------------------

/**
 * Menentukan status ringkasan untuk satu kriteria berdasarkan observasi.
 *
 * Jika tidak ada observasi, statusnya adalah `unknown`.
 * Status observasi langsung digunakan tanpa konversi.
 *
 * @param {Object|undefined} observation - Observasi terbaru, atau undefined.
 * @returns {string} Status dari OBSERVATION_STATUS.
 */
export function getCriterionStatus(observation) {
  if (!observation) {
    return OBSERVATION_STATUS.UNKNOWN
  }
  return observation.status
}

// ---------------------------------------------------------------------------
// Ringkasan Penilaian Fasilitas
// ---------------------------------------------------------------------------

/**
 * Hasil ringkasan penilaian fasilitas berdasarkan kriteria relevan.
 *
 * @typedef {Object} FacilitySummary
 * @property {Object[]} fulfilled - Kriteria yang confirmed_yes.
 * @property {Object[]} notFulfilled - Kriteria yang confirmed_no.
 * @property {Object[]} unknown - Kriteria yang belum dapat dinilai.
 * @property {Object[]} notApplicable - Kriteria yang tidak relevan.
 * @property {Object[]} conflicting - Kriteria dengan bukti bertentangan.
 * @property {boolean} hasUnknownCritical - Ada kriteria kritis yang unknown.
 * @property {boolean} canDeclareFullyAccessible - Apakah boleh menyatakan
 *   fasilitas sepenuhnya sesuai (false jika ada critical unknown).
 */

/**
 * Membuat ringkasan penilaian fasilitas.
 *
 * @param {Object[]} relevantCriteria - Kriteria yang relevan.
 * @param {Map<string, Object>} observationMap - Map criterionId → observasi.
 * @param {Object[]} [rules] - Aturan penilaian (untuk penentuan critical).
 * @param {Object} [userProfile] - Profil kebutuhan pengguna.
 * @returns {FacilitySummary}
 */
export function summarizeAssessment(
  relevantCriteria,
  observationMap,
  rules = [],
  userProfile = null,
) {
  const result = {
    fulfilled: [],
    notFulfilled: [],
    unknown: [],
    notApplicable: [],
    conflicting: [],
    hasUnknownCritical: false,
    canDeclareFullyAccessible: false,
  }

  // Kumpulkan ID kriteria yang kritis untuk kebutuhan pengguna
  const criticalCriterionIds = new Set()
  if (userProfile && rules.length > 0) {
    for (const rule of rules) {
      const isCriticalForUser =
        rule.criticalForNeeds &&
        rule.criticalForNeeds.some((need) =>
          userProfile.selectedNeeds.includes(need),
        )
      if (isCriticalForUser) {
        criticalCriterionIds.add(rule.criterionId)
      }
    }
  }

  for (const criterion of relevantCriteria) {
    const observation = observationMap.get(criterion.id)
    const status = getCriterionStatus(observation)
    const isCritical = criticalCriterionIds.has(criterion.id)

    const entry = {
      criterion,
      observation: observation || null,
      status,
      isCritical,
    }

    switch (status) {
      case OBSERVATION_STATUS.CONFIRMED_YES:
        result.fulfilled.push(entry)
        break
      case OBSERVATION_STATUS.CONFIRMED_NO:
        result.notFulfilled.push(entry)
        break
      case OBSERVATION_STATUS.NOT_APPLICABLE:
        result.notApplicable.push(entry)
        break
      case OBSERVATION_STATUS.CONFLICTING_EVIDENCE:
        result.conflicting.push(entry)
        break
      case OBSERVATION_STATUS.UNKNOWN:
      default:
        result.unknown.push(entry)
        if (isCritical) {
          result.hasUnknownCritical = true
        }
        break
    }
  }

  // Fasilitas hanya dapat dinyatakan "sepenuhnya sesuai" jika:
  // 1. Tidak ada kriteria yang confirmed_no
  // 2. Tidak ada kriteria kritis yang unknown
  // 3. Tidak ada bukti bertentangan
  // 4. Ada setidaknya satu kriteria yang confirmed_yes
  result.canDeclareFullyAccessible =
    result.notFulfilled.length === 0 &&
    !result.hasUnknownCritical &&
    result.conflicting.length === 0 &&
    result.fulfilled.length > 0

  return result
}

// ---------------------------------------------------------------------------
// Laporan Detail Evaluasi Fasilitas
// ---------------------------------------------------------------------------

/**
 * Menyusun data detail evaluasi fasilitas secara lengkap,
 * termasuk status kriteria, ringkasan, dan bukti pendukung.
 *
 * @param {Object} params
 * @param {Object} params.facility - Objek fasilitas
 * @param {Object[]} params.criteria - Seluruh kriteria
 * @param {Object[]} [params.assessments] - Seluruh asesmen
 * @param {Object[]} [params.observations] - Seluruh observasi
 * @param {Object[]} [params.rules] - Aturan penilaian
 * @param {Object} params.userProfile - Profil kebutuhan pengguna
 * @param {Function} [params.getEvidenceFn] - Fungsi (observationId) => evidenceSources[]
 * @returns {Object|null}
 */
export function buildFacilityDetailReport({
  facility,
  criteria,
  assessments = [],
  observations = [],
  rules = [],
  userProfile,
  getEvidenceFn = null,
}) {
  if (!facility) return null

  const relevantCriteria = getRelevantCriteria(
    criteria,
    userProfile,
    facility.type,
  )
  const criterionIds = relevantCriteria.map((c) => c.id)

  const observationMap = getLatestObservations(
    observations,
    assessments,
    facility.id,
    criterionIds,
  )

  const summary = summarizeAssessment(
    relevantCriteria,
    observationMap,
    rules,
    userProfile,
  )

  // Hitung apakah fasilitas memiliki observasi aktual yang tercatat
  const facilityAssessments = assessments.filter(
    (a) => a.facilityId === facility.id,
  )
  const facilityAssessmentIds = new Set(facilityAssessments.map((a) => a.id))
  const actualObservationsCount = observations.filter((o) =>
    facilityAssessmentIds.has(o.assessmentId),
  ).length

  // Siapkan kriteria kritis
  const criticalCriterionIds = new Set()
  if (userProfile && rules.length > 0) {
    for (const rule of rules) {
      const isCriticalForUser =
        rule.criticalForNeeds &&
        rule.criticalForNeeds.some((need) =>
          userProfile.selectedNeeds.includes(need),
        )
      if (isCriticalForUser) {
        criticalCriterionIds.add(rule.criterionId)
      }
    }
  }

  // Rincian per kriteria
  const items = relevantCriteria.map((criterion) => {
    const observation = observationMap.get(criterion.id) || null
    const status = getCriterionStatus(observation)
    const isCritical = criticalCriterionIds.has(criterion.id)
    const evidenceSources =
      observation && getEvidenceFn ? getEvidenceFn(observation.id) : []

    return {
      criterion,
      observation,
      status,
      isCritical,
      evidenceSources,
    }
  })

  return {
    facility,
    summary,
    relevantCriteria,
    items,
    hasObservations: actualObservationsCount > 0,
  }
}

// ---------------------------------------------------------------------------
// Utilitas Tampilan
// ---------------------------------------------------------------------------

/**
 * Label status observasi dalam Bahasa Indonesia.
 */
export const STATUS_LABELS = Object.freeze({
  [OBSERVATION_STATUS.CONFIRMED_YES]: 'Tersedia (terkonfirmasi)',
  [OBSERVATION_STATUS.CONFIRMED_NO]: 'Tidak tersedia (terkonfirmasi)',
  [OBSERVATION_STATUS.UNKNOWN]: 'Belum diketahui',
  [OBSERVATION_STATUS.NOT_APPLICABLE]: 'Tidak berlaku',
  [OBSERVATION_STATUS.CONFLICTING_EVIDENCE]: 'Bukti bertentangan',
})

/**
 * Mendapatkan label status dalam Bahasa Indonesia.
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  return STATUS_LABELS[status] || 'Status tidak dikenal'
}

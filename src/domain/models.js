/**
 * Fungsi pembuatan dan validasi entitas domain.
 *
 * Setiap factory function memastikan entitas memiliki struktur yang
 * konsisten. Validasi bersifat defensif — data yang tidak valid akan
 * menghasilkan error yang jelas, bukan data yang rusak secara diam-diam.
 *
 * Factory functions ini dirancang agar service layer tidak perlu
 * mengetahui detail struktur internal entitas.
 */

import {
  ASSESSMENT_METHOD,
  ASSESSMENT_STATUS,
  CRITERION_DEV_STATUS,
  EVIDENCE_TYPE,
  FACILITY_TYPE,
  NEED_GROUP,
  OBSERVATION_STATUS,
  PUBLICATION_STATUS,
  REPORT_STATUS,
} from './constants.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let idCounter = 0

/**
 * Menghasilkan ID unik sederhana untuk prototipe.
 * ID ini BUKAN pengganti UUID atau ID database.
 */
export function generateId(prefix = 'id') {
  idCounter++
  return `${prefix}_${Date.now()}_${idCounter}`
}

/** Reset counter — hanya untuk pengujian. */
export function _resetIdCounter() {
  idCounter = 0
}

function requireString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} harus berupa string yang tidak kosong.`)
  }
  return value.trim()
}

function requireEnum(value, enumObj, fieldName) {
  const valid = Object.values(enumObj)
  if (!valid.includes(value)) {
    throw new Error(
      `${fieldName} tidak valid: "${value}". Nilai yang diterima: ${valid.join(', ')}.`,
    )
  }
  return value
}

function requireArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} harus berupa array.`)
  }
  return value
}

// ---------------------------------------------------------------------------
// Facility
// ---------------------------------------------------------------------------

/**
 * Membuat entitas Facility.
 *
 * @param {Object} data
 * @param {string} data.name - Nama fasilitas.
 * @param {string} data.type - Jenis fasilitas (FACILITY_TYPE).
 * @param {string} [data.id]
 * @param {string} [data.address]
 * @param {{ lat: number, lng: number }} [data.coordinates]
 * @param {string} [data.description]
 * @param {string} [data.operatingHours]
 * @param {string} [data.publicationStatus]
 * @param {string} [data.updatedAt]
 * @returns {Object}
 */
export function createFacility(data) {
  const name = requireString(data.name, 'Facility.name')
  const type = requireEnum(data.type, FACILITY_TYPE, 'Facility.type')

  return {
    id: data.id || generateId('fac'),
    name,
    type,
    address: data.address || null,
    coordinates: data.coordinates || null,
    description: data.description || null,
    operatingHours: data.operatingHours || null,
    publicationStatus: data.publicationStatus || PUBLICATION_STATUS.DRAFT,
    updatedAt: data.updatedAt || new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// AccessibilityCriterion
// ---------------------------------------------------------------------------

/**
 * Membuat entitas AccessibilityCriterion.
 *
 * @param {Object} data
 * @param {string} data.name - Nama kriteria.
 * @param {string} data.description - Deskripsi kriteria.
 * @param {string[]} data.needGroups - Kelompok kebutuhan yang relevan.
 * @param {string[]} data.applicableFacilityTypes - Jenis fasilitas yang relevan.
 * @param {string} [data.id]
 * @param {string} [data.evidenceGuidance] - Panduan jenis bukti yang diperlukan.
 * @param {string} [data.reference] - Dasar kriteria atau referensi.
 * @param {string} [data.devStatus] - Status pengembangan kriteria.
 * @returns {Object}
 */
export function createAccessibilityCriterion(data) {
  const name = requireString(data.name, 'Criterion.name')
  const description = requireString(data.description, 'Criterion.description')
  const needGroups = requireArray(data.needGroups, 'Criterion.needGroups')
  const applicableFacilityTypes = requireArray(
    data.applicableFacilityTypes,
    'Criterion.applicableFacilityTypes',
  )

  // Validasi setiap nilai dalam array
  needGroups.forEach((ng) => requireEnum(ng, NEED_GROUP, 'Criterion.needGroups[]'))
  applicableFacilityTypes.forEach((ft) =>
    requireEnum(ft, FACILITY_TYPE, 'Criterion.applicableFacilityTypes[]'),
  )

  return {
    id: data.id || generateId('crit'),
    name,
    description,
    needGroups,
    applicableFacilityTypes,
    evidenceGuidance: data.evidenceGuidance || null,
    reference: data.reference || null,
    devStatus: data.devStatus || CRITERION_DEV_STATUS.DRAFT,
  }
}

// ---------------------------------------------------------------------------
// FacilityAssessment
// ---------------------------------------------------------------------------

/**
 * Membuat entitas FacilityAssessment.
 *
 * @param {Object} data
 * @param {string} data.facilityId - ID fasilitas yang diperiksa.
 * @param {string} data.method - Metode pemeriksaan.
 * @param {string} [data.id]
 * @param {string} [data.date]
 * @param {string} [data.assessor] - Petugas atau asal pemeriksaan.
 * @param {string} [data.notes]
 * @param {string} [data.status]
 * @returns {Object}
 */
export function createFacilityAssessment(data) {
  const facilityId = requireString(data.facilityId, 'Assessment.facilityId')
  const method = requireEnum(data.method, ASSESSMENT_METHOD, 'Assessment.method')

  return {
    id: data.id || generateId('asmt'),
    facilityId,
    date: data.date || new Date().toISOString().split('T')[0],
    method,
    assessor: data.assessor || null,
    notes: data.notes || null,
    status: data.status || ASSESSMENT_STATUS.COMPLETED,
  }
}

// ---------------------------------------------------------------------------
// CriterionObservation
// ---------------------------------------------------------------------------

/**
 * Membuat entitas CriterionObservation.
 *
 * @param {Object} data
 * @param {string} data.assessmentId - ID pemeriksaan.
 * @param {string} data.criterionId - ID kriteria.
 * @param {string} data.status - Status hasil observasi (OBSERVATION_STATUS).
 * @param {string} [data.id]
 * @param {string|number} [data.measuredValue] - Nilai terukur jika relevan.
 * @param {string} [data.notes]
 * @param {string} [data.observedAt]
 * @returns {Object}
 */
export function createCriterionObservation(data) {
  const assessmentId = requireString(data.assessmentId, 'Observation.assessmentId')
  const criterionId = requireString(data.criterionId, 'Observation.criterionId')
  const status = requireEnum(data.status, OBSERVATION_STATUS, 'Observation.status')

  return {
    id: data.id || generateId('obs'),
    assessmentId,
    criterionId,
    status,
    measuredValue: data.measuredValue ?? null,
    notes: data.notes || null,
    observedAt: data.observedAt || new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// EvidenceSource
// ---------------------------------------------------------------------------

/**
 * Membuat entitas EvidenceSource.
 *
 * @param {Object} data
 * @param {string} data.name - Nama sumber.
 * @param {string} data.type - Jenis sumber.
 * @param {string} [data.id]
 * @param {string} [data.url]
 * @param {string} [data.publishedAt]
 * @param {string} [data.accessedAt]
 * @param {string} [data.excerpt] - Kutipan singkat dari sumber.
 * @param {string} [data.limitations] - Catatan keterbatasan sumber.
 * @returns {Object}
 */
export function createEvidenceSource(data) {
  const name = requireString(data.name, 'Evidence.name')
  const type = requireEnum(data.type, EVIDENCE_TYPE, 'Evidence.type')

  return {
    id: data.id || generateId('evd'),
    name,
    type,
    url: data.url || null,
    publishedAt: data.publishedAt || null,
    accessedAt: data.accessedAt || new Date().toISOString().split('T')[0],
    excerpt: data.excerpt || null,
    limitations: data.limitations || null,
  }
}

// ---------------------------------------------------------------------------
// ObservationEvidence (hubungan many-to-many)
// ---------------------------------------------------------------------------

/**
 * Membuat entitas penghubung ObservationEvidence.
 *
 * @param {Object} data
 * @param {string} data.observationId
 * @param {string} data.evidenceId
 * @param {string} [data.id]
 * @returns {Object}
 */
export function createObservationEvidence(data) {
  const observationId = requireString(data.observationId, 'ObsEvidence.observationId')
  const evidenceId = requireString(data.evidenceId, 'ObsEvidence.evidenceId')

  return {
    id: data.id || generateId('oe'),
    observationId,
    evidenceId,
  }
}

// ---------------------------------------------------------------------------
// UserNeedProfile
// ---------------------------------------------------------------------------

/**
 * Membuat entitas UserNeedProfile.
 *
 * Profil kebutuhan berisi daftar kelompok kebutuhan fungsional yang
 * dipilih pengguna. Tidak memerlukan identitas atau diagnosis medis.
 *
 * @param {Object} data
 * @param {string[]} data.selectedNeeds - Kelompok kebutuhan yang dipilih.
 * @param {string} [data.id]
 * @returns {Object}
 */
export function createUserNeedProfile(data) {
  const selectedNeeds = requireArray(data.selectedNeeds, 'NeedProfile.selectedNeeds')
  selectedNeeds.forEach((n) =>
    requireEnum(n, NEED_GROUP, 'NeedProfile.selectedNeeds[]'),
  )

  if (selectedNeeds.length === 0) {
    throw new Error('NeedProfile.selectedNeeds harus memiliki minimal satu kebutuhan.')
  }

  return {
    id: data.id || generateId('profile'),
    selectedNeeds: [...selectedNeeds],
  }
}

// ---------------------------------------------------------------------------
// AssessmentRule
// ---------------------------------------------------------------------------

/**
 * Membuat entitas AssessmentRule.
 *
 * Aturan penilaian mendefinisikan bagaimana kriteria tertentu dianggap
 * terpenuhi atau tidak untuk kebutuhan tertentu.
 *
 * @param {Object} data
 * @param {string} data.criterionId - Kriteria yang dinilai.
 * @param {string} data.description - Penjelasan aturan.
 * @param {string[]} data.fulfilledWhen - Kondisi yang dianggap terpenuhi.
 * @param {string[]} data.notFulfilledWhen - Kondisi yang dianggap tidak terpenuhi.
 * @param {string[]} [data.criticalForNeeds] - Kebutuhan yang menganggap ini kritis.
 * @param {string} [data.unknownHandling] - Cara menangani status unknown.
 * @param {string} [data.id]
 * @param {number} [data.version]
 * @returns {Object}
 */
export function createAssessmentRule(data) {
  const criterionId = requireString(data.criterionId, 'Rule.criterionId')
  const description = requireString(data.description, 'Rule.description')
  const fulfilledWhen = requireArray(data.fulfilledWhen, 'Rule.fulfilledWhen')
  const notFulfilledWhen = requireArray(data.notFulfilledWhen, 'Rule.notFulfilledWhen')

  return {
    id: data.id || generateId('rule'),
    criterionId,
    description,
    fulfilledWhen,
    notFulfilledWhen,
    criticalForNeeds: data.criticalForNeeds || [],
    unknownHandling:
      data.unknownHandling ||
      'Jika status unknown, kriteria dianggap belum dapat dinilai.',
    version: data.version || 1,
  }
}

// ---------------------------------------------------------------------------
// BarrierReport (Laporan Hambatan Aksesibilitas)
// ---------------------------------------------------------------------------

/**
 * Membuat entitas BarrierReport (Laporan Hambatan Aksesibilitas).
 *
 * @param {Object} data
 * @param {string} data.facilityId - ID fasilitas yang dilaporkan.
 * @param {string} data.description - Deskripsi kondisi atau hambatan yang diamati.
 * @param {string} [data.id]
 * @param {string|null} [data.criterionId] - ID kriteria jika terkait, atau null.
 * @param {string|null} [data.observedAt] - Waktu pengamatan (ISO date/string).
 * @param {string} [data.createdAt] - Waktu pembuatan laporan.
 * @param {string|null} [data.evidenceUrl] - Tautan atau referensi bukti jika tersedia.
 * @param {string} [data.status] - Status verifikasi laporan (REPORT_STATUS).
 * @param {string|null} [data.verificationNotes] - Catatan proses verifikasi.
 * @param {string|null} [data.reporterName] - Nama pelapor (opsional).
 * @returns {Object}
 */
export function createBarrierReport(data) {
  const facilityId = requireString(data.facilityId, 'BarrierReport.facilityId')
  const description = requireString(data.description, 'BarrierReport.description')
  const status = data.status
    ? requireEnum(data.status, REPORT_STATUS, 'BarrierReport.status')
    : REPORT_STATUS.PENDING_VERIFICATION

  return {
    id: data.id || generateId('rep'),
    facilityId,
    criterionId: data.criterionId || null,
    description,
    observedAt: data.observedAt || null,
    createdAt: data.createdAt || new Date().toISOString(),
    evidenceUrl: data.evidenceUrl ? data.evidenceUrl.trim() : null,
    status,
    verificationNotes: data.verificationNotes || null,
    reporterName: data.reporterName ? data.reporterName.trim() : null,
  }
}

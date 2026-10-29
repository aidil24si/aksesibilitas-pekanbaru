/**
 * DataStore — Lapisan akses data untuk prototipe.
 *
 * Menggunakan LocalStorage sebagai penyimpanan sementara.
 * Dirancang agar penggantian ke Supabase tidak memerlukan
 * perubahan pada komponen UI yang menggunakan service ini.
 *
 * Prinsip:
 * - Semua pembacaan menangani data kosong atau rusak.
 * - Penulisan atomik per collection.
 * - Data demonstrasi dimuat secara terkendali dan terpisah.
 */

const STORAGE_PREFIX = 'akses_pku_'

// ---------------------------------------------------------------------------
// LocalStorage Helpers
// ---------------------------------------------------------------------------

// In-memory fallback if localStorage is unavailable
const memoryStorage = new Map()

function getStorageItem(key) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key)
  }
  return memoryStorage.get(key) || null
}

function setStorageItem(key, value) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value)
  } else {
    memoryStorage.set(key, value)
  }
}

function removeStorageItem(key) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key)
  } else {
    memoryStorage.delete(key)
  }
}

function getCollection(key) {
  try {
    const raw = getStorageItem(STORAGE_PREFIX + key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      console.warn(`Data "${key}" bukan array, mengembalikan array kosong.`)
      return []
    }
    return parsed
  } catch (error) {
    console.error(`Gagal membaca "${key}" dari LocalStorage:`, error)
    return []
  }
}

function setCollection(key, data) {
  try {
    setStorageItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch (error) {
    console.error(`Gagal menulis "${key}" ke LocalStorage:`, error)
  }
}

// ---------------------------------------------------------------------------
// Generic CRUD
// ---------------------------------------------------------------------------

function getAll(collectionKey) {
  return getCollection(collectionKey)
}

function getById(collectionKey, id) {
  const items = getCollection(collectionKey)
  return items.find((item) => item.id === id) || null
}

function save(collectionKey, item) {
  const items = getCollection(collectionKey)
  const existingIndex = items.findIndex((i) => i.id === item.id)
  if (existingIndex >= 0) {
    items[existingIndex] = item
  } else {
    items.push(item)
  }
  setCollection(collectionKey, items)
  return item
}

function remove(collectionKey, id) {
  const items = getCollection(collectionKey)
  const filtered = items.filter((item) => item.id !== id)
  setCollection(collectionKey, filtered)
  return filtered.length < items.length
}

function replaceAll(collectionKey, items) {
  setCollection(collectionKey, items)
}

// ---------------------------------------------------------------------------
// Collection Keys
// ---------------------------------------------------------------------------

const COLLECTIONS = {
  FACILITIES: 'facilities',
  CRITERIA: 'criteria',
  ASSESSMENTS: 'assessments',
  OBSERVATIONS: 'observations',
  EVIDENCE_SOURCES: 'evidence_sources',
  OBSERVATION_EVIDENCE: 'observation_evidence',
  ASSESSMENT_RULES: 'assessment_rules',
  REPORTS: 'barrier_reports',
}

// ---------------------------------------------------------------------------
// Facility Service
// ---------------------------------------------------------------------------

export const facilityService = {
  getAll: () => getAll(COLLECTIONS.FACILITIES),
  getById: (id) => getById(COLLECTIONS.FACILITIES, id),
  save: (facility) => save(COLLECTIONS.FACILITIES, facility),
  remove: (id) => remove(COLLECTIONS.FACILITIES, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.FACILITIES, items),
}

// ---------------------------------------------------------------------------
// Criterion Service
// ---------------------------------------------------------------------------

export const criterionService = {
  getAll: () => getAll(COLLECTIONS.CRITERIA),
  getById: (id) => getById(COLLECTIONS.CRITERIA, id),
  save: (criterion) => save(COLLECTIONS.CRITERIA, criterion),
  remove: (id) => remove(COLLECTIONS.CRITERIA, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.CRITERIA, items),
}

// ---------------------------------------------------------------------------
// Assessment Service
// ---------------------------------------------------------------------------

export const assessmentService = {
  getAll: () => getAll(COLLECTIONS.ASSESSMENTS),
  getById: (id) => getById(COLLECTIONS.ASSESSMENTS, id),
  getByFacilityId: (facilityId) =>
    getAll(COLLECTIONS.ASSESSMENTS).filter((a) => a.facilityId === facilityId),
  save: (assessment) => save(COLLECTIONS.ASSESSMENTS, assessment),
  remove: (id) => remove(COLLECTIONS.ASSESSMENTS, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.ASSESSMENTS, items),
}

// ---------------------------------------------------------------------------
// Observation Service
// ---------------------------------------------------------------------------

export const observationService = {
  getAll: () => getAll(COLLECTIONS.OBSERVATIONS),
  getById: (id) => getById(COLLECTIONS.OBSERVATIONS, id),
  getByAssessmentId: (assessmentId) =>
    getAll(COLLECTIONS.OBSERVATIONS).filter(
      (o) => o.assessmentId === assessmentId,
    ),
  save: (observation) => save(COLLECTIONS.OBSERVATIONS, observation),
  remove: (id) => remove(COLLECTIONS.OBSERVATIONS, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.OBSERVATIONS, items),
}

// ---------------------------------------------------------------------------
// Evidence Service
// ---------------------------------------------------------------------------

export const evidenceService = {
  getAll: () => getAll(COLLECTIONS.EVIDENCE_SOURCES),
  getById: (id) => getById(COLLECTIONS.EVIDENCE_SOURCES, id),
  save: (evidence) => save(COLLECTIONS.EVIDENCE_SOURCES, evidence),
  remove: (id) => remove(COLLECTIONS.EVIDENCE_SOURCES, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.EVIDENCE_SOURCES, items),
}

// ---------------------------------------------------------------------------
// Observation-Evidence Link Service
// ---------------------------------------------------------------------------

export const observationEvidenceService = {
  getAll: () => getAll(COLLECTIONS.OBSERVATION_EVIDENCE),
  getByObservationId: (observationId) =>
    getAll(COLLECTIONS.OBSERVATION_EVIDENCE).filter(
      (oe) => oe.observationId === observationId,
    ),
  save: (link) => save(COLLECTIONS.OBSERVATION_EVIDENCE, link),
  remove: (id) => remove(COLLECTIONS.OBSERVATION_EVIDENCE, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.OBSERVATION_EVIDENCE, items),
}

/**
 * Mendapatkan seluruh sumber bukti yang mendukung suatu observasi.
 *
 * @param {string} observationId
 * @returns {Object[]}
 */
export function getEvidenceForObservation(observationId) {
  if (!observationId) return []
  const links = observationEvidenceService.getByObservationId(observationId)
  return links
    .map((link) => evidenceService.getById(link.evidenceId))
    .filter(Boolean)
}

// ---------------------------------------------------------------------------
// Assessment Rule Service
// ---------------------------------------------------------------------------

export const assessmentRuleService = {
  getAll: () => getAll(COLLECTIONS.ASSESSMENT_RULES),
  getById: (id) => getById(COLLECTIONS.ASSESSMENT_RULES, id),
  getByCriterionId: (criterionId) =>
    getAll(COLLECTIONS.ASSESSMENT_RULES).filter(
      (r) => r.criterionId === criterionId,
    ),
  save: (rule) => save(COLLECTIONS.ASSESSMENT_RULES, rule),
  remove: (id) => remove(COLLECTIONS.ASSESSMENT_RULES, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.ASSESSMENT_RULES, items),
}

// ---------------------------------------------------------------------------
// Barrier Report Service (Laporan Hambatan Aksesibilitas)
// ---------------------------------------------------------------------------

export const reportService = {
  getAll: () => getAll(COLLECTIONS.REPORTS),
  getById: (id) => getById(COLLECTIONS.REPORTS, id),
  getByFacilityId: (facilityId) =>
    getAll(COLLECTIONS.REPORTS).filter((r) => r.facilityId === facilityId),
  save: (report) => save(COLLECTIONS.REPORTS, report),
  remove: (id) => remove(COLLECTIONS.REPORTS, id),
  replaceAll: (items) => replaceAll(COLLECTIONS.REPORTS, items),
}

// ---------------------------------------------------------------------------
// Data Reset
// ---------------------------------------------------------------------------

/**
 * Menghapus seluruh data dari LocalStorage.
 * Hanya untuk pengembangan dan pengujian.
 */
export function clearAllData() {
  Object.values(COLLECTIONS).forEach((key) => {
    removeStorageItem(STORAGE_PREFIX + key)
  })
}

/**
 * Memuat data seed ke LocalStorage.
 * Menggantikan seluruh data yang ada.
 *
 * @param {Object} seedData - Objek dengan key sesuai collection.
 */
export function loadSeedData(seedData) {
  if (seedData.facilities) facilityService.replaceAll(seedData.facilities)
  if (seedData.criteria) criterionService.replaceAll(seedData.criteria)
  if (seedData.assessments) assessmentService.replaceAll(seedData.assessments)
  if (seedData.observations) observationService.replaceAll(seedData.observations)
  if (seedData.evidenceSources) evidenceService.replaceAll(seedData.evidenceSources)
  if (seedData.observationEvidence)
    observationEvidenceService.replaceAll(seedData.observationEvidence)
  if (seedData.assessmentRules)
    assessmentRuleService.replaceAll(seedData.assessmentRules)
  if (seedData.reports) reportService.replaceAll(seedData.reports)
}

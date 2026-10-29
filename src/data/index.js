/**
 * Seed Data — Aksesibilitas Pekanbaru.
 *
 * Modul ini menyediakan fungsi untuk memuat data awal ke LocalStorage.
 * Data awal terdiri dari:
 * - Fasilitas kandidat (identitas saja, tanpa klaim aksesibilitas).
 * - Kriteria aksesibilitas draft (belum tervalidasi).
 * - Aturan penilaian draft.
 *
 * TIDAK ada observasi atau bukti yang dimuat secara otomatis, karena
 * informasi aksesibilitas memerlukan sumber yang dapat dipertanggungjawabkan.
 */

import { loadSeedData, clearAllData } from '../services/dataStore.js'
import { initialFacilities } from './initialFacilities.js'
import { initialCriteria } from './initialCriteria.js'
import { initialAssessmentRules } from './initialRules.js'

/**
 * Memuat data seed ke LocalStorage.
 * Menggantikan seluruh data yang ada.
 *
 * @param {Object} [options]
 * @param {boolean} [options.clearFirst=true] - Hapus data yang ada terlebih dahulu.
 */
export function loadInitialData(options = {}) {
  const { clearFirst = true } = options

  if (clearFirst) {
    clearAllData()
  }

  loadSeedData({
    facilities: initialFacilities,
    criteria: initialCriteria,
    assessmentRules: initialAssessmentRules,
    // Sengaja tidak ada assessments, observations, atau evidence
    // karena belum ada sumber yang memadai.
    assessments: [],
    observations: [],
    evidenceSources: [],
    observationEvidence: [],
  })
}

export { initialFacilities } from './initialFacilities.js'
export { initialCriteria } from './initialCriteria.js'
export { initialAssessmentRules } from './initialRules.js'

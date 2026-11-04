import { describe, it, expect } from 'vitest'
import {
  FACILITY_TYPE,
  NEED_GROUP,
  OBSERVATION_STATUS,
  CRITERION_DEV_STATUS,
} from '../domain/constants.js'
import {
  createAccessibilityCriterion,
  createUserNeedProfile,
  createCriterionObservation,
} from '../domain/models.js'
import {
  getRelevantCriteria,
  summarizeAssessment,
} from '../domain/assessmentEngine.js'
import { initialCriteria } from '../data/initialCriteria.js'
import { initialAssessmentRules } from '../data/initialRules.js'

describe('Sprint 5.2 — Implementasi Kriteria STAMINA_PACING', () => {
  const benchCriterion = initialCriteria.find(
    (c) => c.id === 'crit_circulation_rest_benches',
  )
  const shadeCriterion = initialCriteria.find(
    (c) => c.id === 'crit_open_space_shade',
  )
  const benchRule = initialAssessmentRules.find(
    (r) => r.criterionId === 'crit_circulation_rest_benches',
  )
  const shadeRule = initialAssessmentRules.find(
    (r) => r.criterionId === 'crit_open_space_shade',
  )

  // -------------------------------------------------------------------------
  // 1. PENDAFTARAN DAN KEUNIKAN ID KRITERIA
  // -------------------------------------------------------------------------
  describe('1. Pendaftaran dan Keunikan ID Kriteria', () => {
    it('kedua kriteria terdaftar di initialCriteria dengan ID unik', () => {
      expect(benchCriterion).toBeDefined()
      expect(shadeCriterion).toBeDefined()

      const allIds = initialCriteria.map((c) => c.id)
      const uniqueIds = new Set(allIds)
      expect(uniqueIds.size).toBe(allIds.length)
      expect(allIds).toContain('crit_circulation_rest_benches')
      expect(allIds).toContain('crit_open_space_shade')
    })

    it('kedua kriteria memiliki nama resmi yang sesuai spesifikasi', () => {
      expect(benchCriterion.name).toBe('Bangku Istirahat')
      expect(shadeCriterion.name).toBe('Peneduh Cuaca')
    })

    it('kedua kriteria berstatus draft pada tahap awal prototipe', () => {
      expect(benchCriterion.devStatus).toBe(CRITERION_DEV_STATUS.DRAFT)
      expect(shadeCriterion.devStatus).toBe(CRITERION_DEV_STATUS.DRAFT)
    })
  })

  // -------------------------------------------------------------------------
  // 2. KETERHUBUNGAN KE STAMINA_PACING DAN TIPE FASILITAS
  // -------------------------------------------------------------------------
  describe('2. Keterhubungan ke Kelompok Kebutuhan STAMINA_PACING', () => {
    it('kedua kriteria terhubung secara eksklusif ke STAMINA_PACING', () => {
      expect(benchCriterion.needGroups).toEqual([NEED_GROUP.STAMINA_PACING])
      expect(shadeCriterion.needGroups).toEqual([NEED_GROUP.STAMINA_PACING])
    })

    it('Bangku Istirahat berlaku untuk Mal dan Ruang Publik Terbuka', () => {
      expect(benchCriterion.applicableFacilityTypes).toContain(FACILITY_TYPE.MALL)
      expect(benchCriterion.applicableFacilityTypes).toContain(
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      )
    })

    it('Peneduh Cuaca berlaku khusus untuk Ruang Publik Terbuka', () => {
      expect(shadeCriterion.applicableFacilityTypes).toEqual([
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      ])
    })
  })

  // -------------------------------------------------------------------------
  // 3. VALIDASI MODEL DOMAIN
  // -------------------------------------------------------------------------
  describe('3. Validasi Model Domain', () => {
    it('createAccessibilityCriterion menerima definisi kriteria stamina', () => {
      const customCriterion = createAccessibilityCriterion({
        name: 'Bangku Istirahat Uji',
        description: 'Uji deskripsi tempat duduk istirahat.',
        needGroups: [NEED_GROUP.STAMINA_PACING],
        applicableFacilityTypes: [FACILITY_TYPE.MALL],
      })
      expect(customCriterion.id).toBeDefined()
      expect(customCriterion.needGroups).toContain('stamina_pacing')
    })

    it('aturan asesmen terdaftar dan menandai kriteria sebagai kritis bagi STAMINA_PACING', () => {
      expect(benchRule).toBeDefined()
      expect(shadeRule).toBeDefined()

      expect(benchRule.criticalForNeeds).toContain(NEED_GROUP.STAMINA_PACING)
      expect(shadeRule.criticalForNeeds).toContain(NEED_GROUP.STAMINA_PACING)
    })
  })

  // -------------------------------------------------------------------------
  // 4. PENGENALAN OLEH MESIN PENILAIAN (ASSESSMENT ENGINE)
  // -------------------------------------------------------------------------
  describe('4. Pengenalan oleh Mesin Penilaian', () => {
    const staminaProfile = createUserNeedProfile({
      selectedNeeds: [NEED_GROUP.STAMINA_PACING],
    })

    it('mengambil Bangku Istirahat untuk fasilitas tipe Mall', () => {
      const relevant = getRelevantCriteria(
        initialCriteria,
        staminaProfile,
        FACILITY_TYPE.MALL,
      )
      const relevantIds = relevant.map((c) => c.id)

      expect(relevantIds).toContain('crit_circulation_rest_benches')
      expect(relevantIds).not.toContain('crit_open_space_shade')
    })

    it('mengambil Bangku Istirahat DAN Peneduh Cuaca untuk Ruang Publik Terbuka', () => {
      const relevant = getRelevantCriteria(
        initialCriteria,
        staminaProfile,
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      )
      const relevantIds = relevant.map((c) => c.id)

      expect(relevantIds).toContain('crit_circulation_rest_benches')
      expect(relevantIds).toContain('crit_open_space_shade')
    })

    it('profil kombinasi (Mobilitas + Stamina) menghasilkan gabungan kriteria yang tepat', () => {
      const multiProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.MOBILITY, NEED_GROUP.STAMINA_PACING],
      })

      const relevant = getRelevantCriteria(
        initialCriteria,
        multiProfile,
        FACILITY_TYPE.MALL,
      )
      const relevantIds = relevant.map((c) => c.id)

      // Kriteria mobilitas mal
      expect(relevantIds).toContain('crit_mall_entrance_ramp')
      expect(relevantIds).toContain('crit_mall_accessible_toilet')
      // Kriteria stamina mal
      expect(relevantIds).toContain('crit_circulation_rest_benches')
    })
  })

  // -------------------------------------------------------------------------
  // 5. KETIADAAN OBSERVASI TIDAK MENGHASILKAN CONFIRMED_YES (STATUS UNKNOWN)
  // -------------------------------------------------------------------------
  describe('5. Ketiadaan Observasi Menghasilkan Status Unknown Secara Jujur', () => {
    const staminaProfile = createUserNeedProfile({
      selectedNeeds: [NEED_GROUP.STAMINA_PACING],
    })

    it('tanpa observasi, seluruh kriteria stamina berstatus unknown', () => {
      const relevant = getRelevantCriteria(
        initialCriteria,
        staminaProfile,
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      )
      const emptyObsMap = new Map()

      const summary = summarizeAssessment(
        relevant,
        emptyObsMap,
        initialAssessmentRules,
        staminaProfile,
      )

      expect(summary.fulfilled).toHaveLength(0)
      expect(summary.notFulfilled).toHaveLength(0)
      expect(summary.unknown).toHaveLength(relevant.length)
      expect(summary.hasUnknownCritical).toBe(true)
      expect(summary.canDeclareFullyAccessible).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // 6. TIDAK ADA REGRESI PADA KELOMPOK KEBUTUHAN LAIN
  // -------------------------------------------------------------------------
  describe('6. Isolasi dan Non-Regresi terhadap Kelompok Lain', () => {
    it('profil MOBILITY murni tidak menyertakan kriteria stamina', () => {
      const mobilityProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.MOBILITY],
      })

      const relevantMall = getRelevantCriteria(
        initialCriteria,
        mobilityProfile,
        FACILITY_TYPE.MALL,
      )
      const relevantIdsMall = relevantMall.map((c) => c.id)

      expect(relevantIdsMall).not.toContain('crit_circulation_rest_benches')
      expect(relevantIdsMall).not.toContain('crit_open_space_shade')

      const relevantPark = getRelevantCriteria(
        initialCriteria,
        mobilityProfile,
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      )
      const relevantIdsPark = relevantPark.map((c) => c.id)

      expect(relevantIdsPark).not.toContain('crit_circulation_rest_benches')
      expect(relevantIdsPark).not.toContain('crit_open_space_shade')
    })

    it('profil VISION murni dan HEARING murni tidak terpengaruh', () => {
      const visionProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.VISION],
      })
      const hearingProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.HEARING],
      })

      const relevantVision = getRelevantCriteria(
        initialCriteria,
        visionProfile,
        FACILITY_TYPE.MALL,
      )
      expect(relevantVision.map((c) => c.id)).not.toContain(
        'crit_circulation_rest_benches',
      )

      const relevantHearing = getRelevantCriteria(
        initialCriteria,
        hearingProfile,
        FACILITY_TYPE.MALL,
      )
      expect(relevantHearing.map((c) => c.id)).not.toContain(
        'crit_circulation_rest_benches',
      )
    })
  })

  // -------------------------------------------------------------------------
  // 7. OBSERVASI YANG TIDAK CUKUP TIDAK MENGHASILKAN KESIMPULAN BERLEBIHAN
  // -------------------------------------------------------------------------
  describe('7. Batasan Integritas Bukti dan Observasi', () => {
    const staminaProfile = createUserNeedProfile({
      selectedNeeds: [NEED_GROUP.STAMINA_PACING],
    })

    it('jika satu kriteria confirmed_yes tetapi kriteria kritis lain unknown, canDeclareFullyAccessible tetap false', () => {
      const relevant = getRelevantCriteria(
        initialCriteria,
        staminaProfile,
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      )

      const partialObsMap = new Map()
      // Bangku istirahat terkonfirmasi ada
      partialObsMap.set(
        'crit_circulation_rest_benches',
        createCriterionObservation({
          assessmentId: 'asmt_test_1',
          criterionId: 'crit_circulation_rest_benches',
          status: OBSERVATION_STATUS.CONFIRMED_YES,
        }),
      )
      // Peneduh cuaca belum ada data observasi (unknown)

      const summary = summarizeAssessment(
        relevant,
        partialObsMap,
        initialAssessmentRules,
        staminaProfile,
      )

      expect(summary.fulfilled).toHaveLength(1)
      expect(summary.unknown).toHaveLength(1)
      expect(summary.hasUnknownCritical).toBe(true)
      // Sistem tidak boleh mengklaim fasilitas sepenuhnya sesuai
      expect(summary.canDeclareFullyAccessible).toBe(false)
    })

    it('jika terkonfirmasi tidak terpenuhi (confirmed_no), masuk ke notFulfilled', () => {
      const relevant = getRelevantCriteria(
        initialCriteria,
        staminaProfile,
        FACILITY_TYPE.MALL,
      )

      const noObsMap = new Map()
      noObsMap.set(
        'crit_circulation_rest_benches',
        createCriterionObservation({
          assessmentId: 'asmt_test_2',
          criterionId: 'crit_circulation_rest_benches',
          status: OBSERVATION_STATUS.CONFIRMED_NO,
        }),
      )

      const summary = summarizeAssessment(
        relevant,
        noObsMap,
        initialAssessmentRules,
        staminaProfile,
      )

      expect(summary.notFulfilled).toHaveLength(1)
      expect(summary.fulfilled).toHaveLength(0)
      expect(summary.canDeclareFullyAccessible).toBe(false)
    })
  })
})

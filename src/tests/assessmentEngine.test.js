import { describe, it, expect } from 'vitest'
import {
  getRelevantCriteria,
  getLatestObservations,
  getCriterionStatus,
  summarizeAssessment,
} from '../domain/assessmentEngine.js'
import {
  OBSERVATION_STATUS,
  FACILITY_TYPE,
} from '../domain/constants.js'
import { createCriterionObservation } from '../domain/models.js'
import {
  syntheticCriteria,
  syntheticRules,
  syntheticProfiles,
  createSyntheticAssessment,
} from './fixtures/syntheticTestData.js'

describe('Assessment Engine - Prinsip dan Aturan Penilaian', () => {
  // -------------------------------------------------------------------------
  // KASUS 1: Semua kriteria relevan terpenuhi
  // Sistem dapat merangkum bahwa seluruh kriteria relevan yang diperiksa
  // menunjukkan terpenuhi, tanpa mengklaim sertifikasi keseluruhan.
  // -------------------------------------------------------------------------
  describe('Kasus 1: Semua kriteria relevan terpenuhi', () => {
    it('harus merangkum bahwa kriteria relevan terpenuhi tanpa mengklaim sertifikasi audit', () => {
      const userProfile = syntheticProfiles.visionOnly
      const facilityType = FACILITY_TYPE.MALL
      const assessment = createSyntheticAssessment('fac_synthetic_mall_a')

      const relevantCriteria = getRelevantCriteria(
        syntheticCriteria,
        userProfile,
        facilityType,
      )

      expect(relevantCriteria.length).toBeGreaterThan(0)

      // Seluruh kriteria relevan diobservasi dengan confirmed_yes
      const observationMap = new Map()
      relevantCriteria.forEach((crit) => {
        observationMap.set(
          crit.id,
          createCriterionObservation({
            assessmentId: assessment.id,
            criterionId: crit.id,
            status: OBSERVATION_STATUS.CONFIRMED_YES,
          }),
        )
      })

      const summary = summarizeAssessment(
        relevantCriteria,
        observationMap,
        syntheticRules,
        userProfile,
      )

      // Verifikasi:
      // 1. Seluruh kriteria masuk kategori fulfilled
      expect(summary.fulfilled.length).toBe(relevantCriteria.length)
      expect(summary.notFulfilled.length).toBe(0)
      expect(summary.unknown.length).toBe(0)
      expect(summary.conflicting.length).toBe(0)
      expect(summary.hasUnknownCritical).toBe(false)

      // 2. canDeclareFullyAccessible menunjukkan kesesuaian kriteria relevan
      expect(summary.canDeclareFullyAccessible).toBe(true)

      // 3. Sistem TIDAK menghasilkan sertifikat/klaim sertifikasi keseluruhan
      expect(summary).not.toHaveProperty('certified')
      expect(summary).not.toHaveProperty('certificationStatus')
      expect(summary).not.toHaveProperty('universalScore')
    })
  })

  // -------------------------------------------------------------------------
  // KASUS 2: Ada kriteria yang tidak terpenuhi
  // Sistem harus menampilkan kriteria yang belum terpenuhi secara eksplisit.
  // -------------------------------------------------------------------------
  describe('Kasus 2: Ada kriteria yang tidak terpenuhi', () => {
    it('harus mencatat dan menampilkan kriteria yang belum terpenuhi secara eksplisit', () => {
      const userProfile = syntheticProfiles.mobilityOnly
      const facilityType = FACILITY_TYPE.MALL
      const assessment = createSyntheticAssessment('fac_synthetic_mall_a')

      const relevantCriteria = getRelevantCriteria(
        syntheticCriteria,
        userProfile,
        facilityType,
      )

      const observationMap = new Map()
      // Ramp: confirmed_yes
      observationMap.set(
        'crit_syn_ramp',
        createCriterionObservation({
          assessmentId: assessment.id,
          criterionId: 'crit_syn_ramp',
          status: OBSERVATION_STATUS.CONFIRMED_YES,
        }),
      )
      // Elevator: confirmed_no (secara eksplisit tidak terpenuhi)
      observationMap.set(
        'crit_syn_elevator',
        createCriterionObservation({
          assessmentId: assessment.id,
          criterionId: 'crit_syn_elevator',
          status: OBSERVATION_STATUS.CONFIRMED_NO,
          notes: 'Lift dalam perbaikan / tidak dapat diakses kursi roda',
        }),
      )

      const summary = summarizeAssessment(
        relevantCriteria,
        observationMap,
        syntheticRules,
        userProfile,
      )

      // Eksplisit terdapat di notFulfilled
      expect(summary.notFulfilled.length).toBe(1)
      expect(summary.notFulfilled[0].criterion.id).toBe('crit_syn_elevator')
      expect(summary.notFulfilled[0].status).toBe(OBSERVATION_STATUS.CONFIRMED_NO)

      // Tidak boleh dinyatakan sepenuhnya sesuai
      expect(summary.canDeclareFullyAccessible).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // KASUS 3: Informasi tidak tersedia
  // Sistem tidak boleh mengubah status unknown menjadi confirmed_no.
  // -------------------------------------------------------------------------
  describe('Kasus 3: Informasi tidak tersedia (unknown)', () => {
    it('tidak boleh mengasumsikan ketiadaan informasi sebagai confirmed_no', () => {
      const observation = undefined
      const status = getCriterionStatus(observation)

      // Harus unknown, bukan confirmed_no
      expect(status).toBe(OBSERVATION_STATUS.UNKNOWN)
      expect(status).not.toBe(OBSERVATION_STATUS.CONFIRMED_NO)

      const userProfile = syntheticProfiles.mobilityOnly
      const facilityType = FACILITY_TYPE.MALL
      const relevantCriteria = getRelevantCriteria(
        syntheticCriteria,
        userProfile,
        facilityType,
      )

      // Map observasi kosong (tidak ada data observasi yang ditemukan)
      const emptyObservationMap = new Map()

      const summary = summarizeAssessment(
        relevantCriteria,
        emptyObservationMap,
        syntheticRules,
        userProfile,
      )

      // Seluruh kriteria tanpa data harus masuk kategori unknown, bukan notFulfilled
      expect(summary.notFulfilled.length).toBe(0)
      expect(summary.unknown.length).toBe(relevantCriteria.length)

      // Karena ada kriteria kritis yang unknown (misal ramp/lift untuk mobilitas),
      // hasUnknownCritical harus true, dan fasilitas TIDAK boleh dinyatakan sepenuhnya sesuai
      expect(summary.hasUnknownCritical).toBe(true)
      expect(summary.canDeclareFullyAccessible).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // KASUS 4: Kriteria tidak relevan (not_applicable)
  // Sistem tidak boleh memperlakukan not_applicable sebagai kegagalan.
  // -------------------------------------------------------------------------
  describe('Kasus 4: Kriteria tidak relevan (not_applicable)', () => {
    it('tidak boleh memperlakukan not_applicable sebagai kegagalan atau kriteria tidak terpenuhi', () => {
      const userProfile = syntheticProfiles.mobilityOnly
      const facilityType = FACILITY_TYPE.MALL
      const assessment = createSyntheticAssessment('fac_synthetic_mall_a')

      const relevantCriteria = getRelevantCriteria(
        syntheticCriteria,
        userProfile,
        facilityType,
      ).filter(
        (c) => c.id === 'crit_syn_ramp' || c.id === 'crit_syn_elevator',
      )

      const observationMap = new Map()
      // Ramp: confirmed_yes
      observationMap.set(
        'crit_syn_ramp',
        createCriterionObservation({
          assessmentId: assessment.id,
          criterionId: 'crit_syn_ramp',
          status: OBSERVATION_STATUS.CONFIRMED_YES,
        }),
      )
      // Elevator: not_applicable (misal gedung hanya 1 lantai sehingga lift tidak berlaku)
      observationMap.set(
        'crit_syn_elevator',
        createCriterionObservation({
          assessmentId: assessment.id,
          criterionId: 'crit_syn_elevator',
          status: OBSERVATION_STATUS.NOT_APPLICABLE,
          notes: 'Fasilitas satu lantai, elevator tidak diperlukan.',
        }),
      )

      const summary = summarizeAssessment(
        relevantCriteria,
        observationMap,
        syntheticRules,
        userProfile,
      )

      // not_applicable tidak boleh masuk notFulfilled
      expect(summary.notFulfilled.length).toBe(0)
      expect(summary.notApplicable.length).toBe(1)
      expect(summary.notApplicable[0].criterion.id).toBe('crit_syn_elevator')

      // Selama tidak ada confirmed_no dan tidak ada critical unknown,
      // fasilitas memenuhi kriteria relevan yang berlaku
      expect(summary.canDeclareFullyAccessible).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // KASUS 5: Bukti bertentangan (conflicting_evidence)
  // Sistem harus mempertahankan status konflik dan tidak memilih hasil otomatis.
  // -------------------------------------------------------------------------
  describe('Kasus 5: Bukti bertentangan (conflicting_evidence)', () => {
    it('harus mempertahankan status konflik dan tidak otomatis menentukan lolos/gagal', () => {
      const userProfile = syntheticProfiles.mobilityOnly
      const facilityType = FACILITY_TYPE.MALL
      const assessment = createSyntheticAssessment('fac_synthetic_mall_a')

      const relevantCriteria = getRelevantCriteria(
        syntheticCriteria,
        userProfile,
        facilityType,
      ).filter((c) => c.id === 'crit_syn_ramp')

      const observationMap = new Map()
      // Laporan A menyebut ada ramp, Laporan B menyebut ramp terhalang tangga permanen
      observationMap.set(
        'crit_syn_ramp',
        createCriterionObservation({
          assessmentId: assessment.id,
          criterionId: 'crit_syn_ramp',
          status: OBSERVATION_STATUS.CONFLICTING_EVIDENCE,
          notes: 'Sumber resmi menyebut ada ramp, laporan lapangan menyebut ada undakan 20cm.',
        }),
      )

      const summary = summarizeAssessment(
        relevantCriteria,
        observationMap,
        syntheticRules,
        userProfile,
      )

      // Harus dicatat khusus dalam kelompok conflicting
      expect(summary.conflicting.length).toBe(1)
      expect(summary.conflicting[0].criterion.id).toBe('crit_syn_ramp')
      expect(summary.conflicting[0].status).toBe(OBSERVATION_STATUS.CONFLICTING_EVIDENCE)

      // Tidak boleh dianggap confirmed_yes secara spekulatif
      expect(summary.fulfilled.length).toBe(0)
      // Tidak boleh dinyatakan sepenuhnya sesuai
      expect(summary.canDeclareFullyAccessible).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // KASUS 6: Profil kebutuhan berbeda
  // Pemilihan kebutuhan berbeda menghasilkan himpunan kriteria relevan berbeda.
  // -------------------------------------------------------------------------
  describe('Kasus 6: Profil kebutuhan berbeda menghasilkan kriteria relevan berbeda', () => {
    it('harus menyaring kriteria sesuai kebutuhan fungsional pengguna', () => {
      const facilityType = FACILITY_TYPE.MALL

      const mobilityCriteria = getRelevantCriteria(
        syntheticCriteria,
        syntheticProfiles.mobilityOnly,
        facilityType,
      )

      const visionCriteria = getRelevantCriteria(
        syntheticCriteria,
        syntheticProfiles.visionOnly,
        facilityType,
      )

      const hearingCriteria = getRelevantCriteria(
        syntheticCriteria,
        syntheticProfiles.hearingOnly,
        facilityType,
      )

      // Kriteria mobilitas mengandung ramp, elevator, toilet
      const mobilityIds = mobilityCriteria.map((c) => c.id)
      expect(mobilityIds).toContain('crit_syn_ramp')
      expect(mobilityIds).toContain('crit_syn_elevator')
      expect(mobilityIds).not.toContain('crit_syn_audio_caption')

      // Kriteria penglihatan mengandung guiding block taktil
      const visionIds = visionCriteria.map((c) => c.id)
      expect(visionIds).toContain('crit_syn_tactile')
      expect(visionIds).not.toContain('crit_syn_elevator')

      // Kriteria pendengaran mengandung caption visual
      const hearingIds = hearingCriteria.map((c) => c.id)
      expect(hearingIds).toContain('crit_syn_audio_caption')
      expect(hearingIds).not.toContain('crit_syn_ramp')

      // Profil ganda (Mobilitas + Penglihatan) harus menggabungkan kriteria kedua kelompok
      const multiCriteria = getRelevantCriteria(
        syntheticCriteria,
        syntheticProfiles.mobilityAndVision,
        facilityType,
      )
      const multiIds = multiCriteria.map((c) => c.id)
      expect(multiIds).toContain('crit_syn_ramp')
      expect(multiIds).toContain('crit_syn_tactile')
      expect(multiIds).not.toContain('crit_syn_audio_caption')
    })

    it('harus menyaring kriteria berdasarkan jenis fasilitas fisik', () => {
      // Lift hanya berlaku untuk mall, bukan ruang terbuka taman
      const mallCriteria = getRelevantCriteria(
        syntheticCriteria,
        syntheticProfiles.mobilityOnly,
        FACILITY_TYPE.MALL,
      )

      const parkCriteria = getRelevantCriteria(
        syntheticCriteria,
        syntheticProfiles.mobilityOnly,
        FACILITY_TYPE.PUBLIC_OPEN_SPACE,
      )

      expect(mallCriteria.map((c) => c.id)).toContain('crit_syn_elevator')
      expect(parkCriteria.map((c) => c.id)).not.toContain('crit_syn_elevator')
    })
  })

  // -------------------------------------------------------------------------
  // Pengujian Tambahan: Penanganan Observasi Terbaru
  // -------------------------------------------------------------------------
  describe('Penanganan Observasi Terbaru', () => {
    it('harus memilih observasi yang paling mutakhir jika terdapat observasi ganda', () => {
      const facilityId = 'fac_synthetic_mall_a'
      const criterionId = 'crit_syn_ramp'

      const assessments = [
        createSyntheticAssessment(facilityId, 'asmt_old'),
        createSyntheticAssessment(facilityId, 'asmt_new'),
      ]

      const observations = [
        createCriterionObservation({
          id: 'obs_1',
          assessmentId: 'asmt_old',
          criterionId,
          status: OBSERVATION_STATUS.CONFIRMED_NO,
          observedAt: '2026-01-01T10:00:00Z',
        }),
        createCriterionObservation({
          id: 'obs_2',
          assessmentId: 'asmt_new',
          criterionId,
          status: OBSERVATION_STATUS.CONFIRMED_YES,
          observedAt: '2026-06-01T10:00:00Z', // Lebih baru
        }),
      ]

      const latestMap = getLatestObservations(
        observations,
        assessments,
        facilityId,
        [criterionId],
      )

      expect(latestMap.get(criterionId).id).toBe('obs_2')
      expect(latestMap.get(criterionId).status).toBe(OBSERVATION_STATUS.CONFIRMED_YES)
    })
  })
})

import { describe, it, expect } from 'vitest'
import {
  createFacility,
  createAccessibilityCriterion,
  createCriterionObservation,
  createEvidenceSource,
  createObservationEvidence,
  createUserNeedProfile,
} from '../domain/models.js'
import {
  FACILITY_TYPE,
  NEED_GROUP,
  OBSERVATION_STATUS,
  EVIDENCE_TYPE,
  CRITERION_DEV_STATUS,
  PUBLICATION_STATUS,
} from '../domain/constants.js'

describe('Domain Models & Defensive Validation', () => {
  describe('createFacility', () => {
    it('membuat entitas fasilitas valid', () => {
      const fac = createFacility({
        name: 'Contoh Fasilitas',
        type: FACILITY_TYPE.MALL,
      })
      expect(fac.id).toBeDefined()
      expect(fac.name).toBe('Contoh Fasilitas')
      expect(fac.type).toBe(FACILITY_TYPE.MALL)
      expect(fac.publicationStatus).toBe(PUBLICATION_STATUS.DRAFT)
    })

    it('menolak pembuatan fasilitas dengan nama kosong atau tipe tidak valid', () => {
      expect(() => createFacility({ name: '', type: FACILITY_TYPE.MALL })).toThrow()
      expect(() =>
        createFacility({ name: 'Fasilitas X', type: 'invalid_type' }),
      ).toThrow()
    })
  })

  describe('createAccessibilityCriterion', () => {
    it('membuat entitas kriteria dengan validasi needGroups dan applicableFacilityTypes', () => {
      const crit = createAccessibilityCriterion({
        name: 'Ramp Aksesibel',
        description: 'Kemiringan standar',
        needGroups: [NEED_GROUP.MOBILITY],
        applicableFacilityTypes: [FACILITY_TYPE.MALL],
      })
      expect(crit.id).toBeDefined()
      expect(crit.needGroups).toEqual([NEED_GROUP.MOBILITY])
      expect(crit.devStatus).toBe(CRITERION_DEV_STATUS.DRAFT)
    })

    it('menolak kelompok kebutuhan yang tidak dikenal', () => {
      expect(() =>
        createAccessibilityCriterion({
          name: 'Kriteria X',
          description: 'Desc',
          needGroups: ['unknown_need'],
          applicableFacilityTypes: [FACILITY_TYPE.MALL],
        }),
      ).toThrow()
    })
  })

  describe('createUserNeedProfile', () => {
    it('membuat profil kebutuhan fungsional tanpa diagnosis medis', () => {
      const profile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.MOBILITY, NEED_GROUP.VISION],
      })
      expect(profile.selectedNeeds).toContain(NEED_GROUP.MOBILITY)
      expect(profile.selectedNeeds).toContain(NEED_GROUP.VISION)
    })

    it('menolak profil tanpa kebutuhan sama sekali', () => {
      expect(() => createUserNeedProfile({ selectedNeeds: [] })).toThrow()
    })
  })

  describe('createCriterionObservation', () => {
    it('mencatat observasi dengan status yang tepat', () => {
      const obs = createCriterionObservation({
        assessmentId: 'asmt_1',
        criterionId: 'crit_1',
        status: OBSERVATION_STATUS.CONFIRMED_YES,
      })
      expect(obs.status).toBe(OBSERVATION_STATUS.CONFIRMED_YES)
    })

    it('menolak status observasi di luar enum yang ditentukan', () => {
      expect(() =>
        createCriterionObservation({
          assessmentId: 'asmt_1',
          criterionId: 'crit_1',
          status: 'verified_perfect', // Status fiktif yang tidak ada
        }),
      ).toThrow()
    })
  })

  describe('createEvidenceSource & createObservationEvidence', () => {
    it('membuat entitas sumber bukti dan penghubung observasi-bukti', () => {
      const evd = createEvidenceSource({
        name: 'Situs Resmi Pengelola Mal',
        type: EVIDENCE_TYPE.OFFICIAL_WEBSITE,
        url: 'https://example.com/akses',
      })
      expect(evd.id).toBeDefined()
      expect(evd.type).toBe(EVIDENCE_TYPE.OFFICIAL_WEBSITE)

      const link = createObservationEvidence({
        observationId: 'obs_1',
        evidenceId: evd.id,
      })
      expect(link.observationId).toBe('obs_1')
      expect(link.evidenceId).toBe(evd.id)
    })
  })
})

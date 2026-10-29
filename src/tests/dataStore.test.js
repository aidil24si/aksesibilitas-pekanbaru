import { describe, it, expect, beforeEach } from 'vitest'
import {
  facilityService,
  clearAllData,
  loadSeedData,
} from '../services/dataStore.js'
import { FACILITY_TYPE } from '../domain/constants.js'

describe('DataStore Service Layer', () => {
  beforeEach(() => {
    clearAllData()
  })

  it('melakukan CRUD dasar pada facilityService', () => {
    const fac = {
      id: 'fac_test_1',
      name: 'Fasilitas Uji',
      type: FACILITY_TYPE.MALL,
    }

    facilityService.save(fac)
    expect(facilityService.getAll().length).toBe(1)
    expect(facilityService.getById('fac_test_1')).toEqual(fac)

    // Update
    const updated = { ...fac, name: 'Fasilitas Uji Diubah' }
    facilityService.save(updated)
    expect(facilityService.getById('fac_test_1').name).toBe('Fasilitas Uji Diubah')

    // Remove
    facilityService.remove('fac_test_1')
    expect(facilityService.getAll().length).toBe(0)
  })

  it('dapat memuat dan mengganti seed data secara terkendali', () => {
    loadSeedData({
      facilities: [{ id: 'fac_s1', name: 'Fac 1', type: FACILITY_TYPE.MALL }],
      criteria: [],
      assessments: [],
      observations: [],
      evidenceSources: [],
      observationEvidence: [],
      assessmentRules: [],
    })

    expect(facilityService.getAll().length).toBe(1)
    expect(facilityService.getById('fac_s1').name).toBe('Fac 1')

    clearAllData()
    expect(facilityService.getAll().length).toBe(0)
  })
})

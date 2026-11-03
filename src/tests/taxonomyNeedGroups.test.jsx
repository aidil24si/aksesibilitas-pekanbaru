import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import {
  NEED_GROUP,
  NEED_GROUP_SCOPE,
  CORE_NEED_GROUPS,
  EXTENDED_NEED_GROUPS,
  NEED_GROUP_METADATA,
  NEED_GROUP_LABELS,
  NEED_GROUP_DESCRIPTIONS,
  isCoreNeedGroup,
  getCoreNeedGroups,
  getExtendedNeedGroups,
  FACILITY_TYPE,
} from '../domain/constants.js'
import {
  createUserNeedProfile,
  createAccessibilityCriterion,
} from '../domain/models.js'
import { getRelevantCriteria } from '../domain/assessmentEngine.js'

describe('Sprint 5.1 — Taksonomi Kelompok Kebutuhan Aksesibilitas', () => {
  // -------------------------------------------------------------------------
  // 1. KETUJUH ID TERSEDIA DENGAN KONSISTEN
  // -------------------------------------------------------------------------
  describe('1. Ketersediaan Tujuh ID Kelompok Kebutuhan', () => {
    it('mendefinisikan tepat 7 ID kelompok kebutuhan', () => {
      const keys = Object.keys(NEED_GROUP)
      expect(keys).toHaveLength(7)
      expect(keys).toEqual(
        expect.arrayContaining([
          'MOBILITY',
          'STAMINA_PACING',
          'VISION',
          'HEARING',
          'COGNITIVE',
          'SENSORY_ENV',
          'COMMUNICATION',
        ]),
      )
    })

    it('memiliki nilai string yang tepat untuk setiap ID', () => {
      expect(NEED_GROUP.MOBILITY).toBe('mobility')
      expect(NEED_GROUP.STAMINA_PACING).toBe('stamina_pacing')
      expect(NEED_GROUP.VISION).toBe('vision')
      expect(NEED_GROUP.HEARING).toBe('hearing')
      expect(NEED_GROUP.COGNITIVE).toBe('cognitive')
      expect(NEED_GROUP.SENSORY_ENV).toBe('sensory_env')
      expect(NEED_GROUP.COMMUNICATION).toBe('communication')
    })
  })

  // -------------------------------------------------------------------------
  // 2. NILAI SETIAP ID KONSISTEN DAN UNIK
  // -------------------------------------------------------------------------
  describe('2. Konsistensi dan Keunikan Nilai Kelompok Kebutuhan', () => {
    it('seluruh nilai NEED_GROUP adalah unik tanpa duplikasi', () => {
      const values = Object.values(NEED_GROUP)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(7)
      expect(values).toHaveLength(7)
    })

    it('setiap kelompok memiliki label resmi Bahasa Indonesia yang sesuai', () => {
      expect(NEED_GROUP_LABELS[NEED_GROUP.MOBILITY]).toBe(
        'Mobilitas Fisik & Perpindahan',
      )
      expect(NEED_GROUP_LABELS[NEED_GROUP.STAMINA_PACING]).toBe(
        'Daya Tahan Fisik & Istirahat',
      )
      expect(NEED_GROUP_LABELS[NEED_GROUP.VISION]).toBe(
        'Penglihatan & Navigasi Taktil',
      )
      expect(NEED_GROUP_LABELS[NEED_GROUP.HEARING]).toBe(
        'Pendengaran & Peringatan Visual',
      )
      expect(NEED_GROUP_LABELS[NEED_GROUP.COGNITIVE]).toBe(
        'Orientasi Spasial & Navigasi Simbolik',
      )
      expect(NEED_GROUP_LABELS[NEED_GROUP.SENSORY_ENV]).toBe(
        'Regulasi Stimulasi Sensorik Lingkungan',
      )
      expect(NEED_GROUP_LABELS[NEED_GROUP.COMMUNICATION]).toBe(
        'Akses Komunikasi Layanan Interaktif',
      )
    })

    it('setiap kelompok memiliki deskripsi fungsional tanpa diagnosis medis', () => {
      Object.values(NEED_GROUP).forEach((needValue) => {
        const desc = NEED_GROUP_DESCRIPTIONS[needValue]
        expect(desc).toBeDefined()
        expect(typeof desc).toBe('string')
        expect(desc.trim().length).toBeGreaterThan(10)
      })
    })

    it('setiap kelompok memiliki metadata lengkap (id, label, description, scope, isCore)', () => {
      Object.values(NEED_GROUP).forEach((needValue) => {
        const meta = NEED_GROUP_METADATA[needValue]
        expect(meta).toBeDefined()
        expect(meta.id).toBe(needValue)
        expect(meta.label).toBe(NEED_GROUP_LABELS[needValue])
        expect(meta.description).toBe(NEED_GROUP_DESCRIPTIONS[needValue])
        expect([
          NEED_GROUP_SCOPE.PROTOTYPE_CORE,
          NEED_GROUP_SCOPE.EXTENDED,
        ]).toContain(meta.scope)
        expect(typeof meta.isCore).toBe('boolean')
      })
    })
  })

  // -------------------------------------------------------------------------
  // 3. LIMA KELOMPOK INTI DAPAT DIGUNAKAN DALAM FILTER KEBUTUHAN
  // -------------------------------------------------------------------------
  describe('3. Validasi Lima Kelompok Inti Prototipe', () => {
    it('CORE_NEED_GROUPS berisi tepat 5 kelompok inti', () => {
      expect(CORE_NEED_GROUPS).toHaveLength(5)
      expect(CORE_NEED_GROUPS).toEqual([
        NEED_GROUP.MOBILITY,
        NEED_GROUP.STAMINA_PACING,
        NEED_GROUP.VISION,
        NEED_GROUP.HEARING,
        NEED_GROUP.COGNITIVE,
      ])
    })

    it('isCoreNeedGroup mengembalikan true untuk seluruh 5 kelompok inti', () => {
      CORE_NEED_GROUPS.forEach((coreGroup) => {
        expect(isCoreNeedGroup(coreGroup)).toBe(true)
        expect(NEED_GROUP_METADATA[coreGroup].isCore).toBe(true)
        expect(NEED_GROUP_METADATA[coreGroup].scope).toBe(
          NEED_GROUP_SCOPE.PROTOTYPE_CORE,
        )
      })
    })

    it('getCoreNeedGroups mengembalikan salinan array kelompok inti', () => {
      const core = getCoreNeedGroups()
      expect(core).toHaveLength(5)
      expect(core).not.toBe(CORE_NEED_GROUPS) // harus salinan baru
      expect(core).toEqual([...CORE_NEED_GROUPS])
    })

    it('seluruh 5 kelompok inti dapat digunakan untuk membuat UserNeedProfile', () => {
      CORE_NEED_GROUPS.forEach((coreGroup) => {
        const profile = createUserNeedProfile({
          selectedNeeds: [coreGroup],
        })
        expect(profile.selectedNeeds).toContain(coreGroup)
      })

      // Multi-core profile
      const multiProfile = createUserNeedProfile({
        selectedNeeds: CORE_NEED_GROUPS,
      })
      expect(multiProfile.selectedNeeds).toHaveLength(5)
    })

    it('hanya 5 kelompok inti yang dirender sebagai tombol filter di UI Fasilitas', () => {
      const html = renderToString(
        <MemoryRouter initialEntries={['/fasilitas']}>
          <App />
        </MemoryRouter>,
      )

      // Memastikan kelima label inti tampil di halaman
      expect(html).toContain('Mobilitas Fisik &amp; Perpindahan')
      expect(html).toContain('Daya Tahan Fisik &amp; Istirahat')
      expect(html).toContain('Penglihatan &amp; Navigasi Taktil')
      expect(html).toContain('Pendengaran &amp; Peringatan Visual')
      expect(html).toContain('Orientasi Spasial &amp; Navigasi Simbolik')

      // Memastikan kedua label lanjutan TIDAK tampil di pilihan filter aktif
      expect(html).not.toContain('Regulasi Stimulasi Sensorik Lingkungan')
      expect(html).not.toContain('Akses Komunikasi Layanan Interaktif')
    })
  })

  // -------------------------------------------------------------------------
  // 4. DUA KELOMPOK LANJUTAN DIKENALI TETAPI BUKAN INTI
  // -------------------------------------------------------------------------
  describe('4. Validasi Dua Kelompok Lanjutan (Extended Scope)', () => {
    it('EXTENDED_NEED_GROUPS berisi tepat SENSORY_ENV dan COMMUNICATION', () => {
      expect(EXTENDED_NEED_GROUPS).toHaveLength(2)
      expect(EXTENDED_NEED_GROUPS).toEqual([
        NEED_GROUP.SENSORY_ENV,
        NEED_GROUP.COMMUNICATION,
      ])
    })

    it('isCoreNeedGroup mengembalikan false untuk kelompok lanjutan', () => {
      expect(isCoreNeedGroup(NEED_GROUP.SENSORY_ENV)).toBe(false)
      expect(isCoreNeedGroup(NEED_GROUP.COMMUNICATION)).toBe(false)
      expect(NEED_GROUP_METADATA[NEED_GROUP.SENSORY_ENV].isCore).toBe(false)
      expect(NEED_GROUP_METADATA[NEED_GROUP.COMMUNICATION].isCore).toBe(false)
      expect(NEED_GROUP_METADATA[NEED_GROUP.SENSORY_ENV].scope).toBe(
        NEED_GROUP_SCOPE.EXTENDED,
      )
      expect(NEED_GROUP_METADATA[NEED_GROUP.COMMUNICATION].scope).toBe(
        NEED_GROUP_SCOPE.EXTENDED,
      )
    })

    it('getExtendedNeedGroups mengembalikan salinan array kelompok lanjutan', () => {
      const extended = getExtendedNeedGroups()
      expect(extended).toHaveLength(2)
      expect(extended).not.toBe(EXTENDED_NEED_GROUPS)
      expect(extended).toEqual([...EXTENDED_NEED_GROUPS])
    })

    it('kelompok lanjutan dikenali oleh domain model tanpa melempar error', () => {
      // Dikenali dalam UserNeedProfile
      const profile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.SENSORY_ENV, NEED_GROUP.COMMUNICATION],
      })
      expect(profile.selectedNeeds).toContain('sensory_env')
      expect(profile.selectedNeeds).toContain('communication')

      // Dikenali dalam kriteria aksesibilitas
      const crit = createAccessibilityCriterion({
        name: 'Ruang Tenang Regulasi Diri',
        description: 'Tersedia ruang tenang minim stimulasi.',
        needGroups: [NEED_GROUP.SENSORY_ENV],
        applicableFacilityTypes: [FACILITY_TYPE.MALL],
      })
      expect(crit.needGroups).toContain(NEED_GROUP.SENSORY_ENV)
    })
  })

  // -------------------------------------------------------------------------
  // 5. KOMPATIBILITAS KELOMPOK LAMA DENGAN FUNGSI EKSISTING
  // -------------------------------------------------------------------------
  describe('5. Kompatibilitas dengan Fungsi Domain yang Ada', () => {
    it('kelompok lama (MOBILITY, VISION, HEARING, COGNITIVE) memiliki nilai yang identik', () => {
      expect(NEED_GROUP.MOBILITY).toBe('mobility')
      expect(NEED_GROUP.VISION).toBe('vision')
      expect(NEED_GROUP.HEARING).toBe('hearing')
      expect(NEED_GROUP.COGNITIVE).toBe('cognitive')
    })

    it('mesin penilaian getRelevantCriteria tetap bekerja secara konsisten', () => {
      const testCriteria = [
        createAccessibilityCriterion({
          id: 'crit_test_mob',
          name: 'Ramp',
          description: 'Ramp masuk',
          needGroups: [NEED_GROUP.MOBILITY],
          applicableFacilityTypes: [FACILITY_TYPE.MALL],
        }),
        createAccessibilityCriterion({
          id: 'crit_test_sta',
          name: 'Bangku Istirahat',
          description: 'Bangku koridor',
          needGroups: [NEED_GROUP.STAMINA_PACING],
          applicableFacilityTypes: [FACILITY_TYPE.MALL],
        }),
      ]

      const mobilityProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.MOBILITY],
      })
      const staminaProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.STAMINA_PACING],
      })
      const combinedProfile = createUserNeedProfile({
        selectedNeeds: [NEED_GROUP.MOBILITY, NEED_GROUP.STAMINA_PACING],
      })

      const resMob = getRelevantCriteria(testCriteria, mobilityProfile, FACILITY_TYPE.MALL)
      expect(resMob.map((c) => c.id)).toEqual(['crit_test_mob'])

      const resSta = getRelevantCriteria(testCriteria, staminaProfile, FACILITY_TYPE.MALL)
      expect(resSta.map((c) => c.id)).toEqual(['crit_test_sta'])

      const resBoth = getRelevantCriteria(testCriteria, combinedProfile, FACILITY_TYPE.MALL)
      expect(resBoth.map((c) => c.id)).toEqual(['crit_test_mob', 'crit_test_sta'])
    })
  })

  // -------------------------------------------------------------------------
  // 6. MENOLAK REFERENSI ID KELOMPOK YANG TIDAK TERDAFTAR
  // -------------------------------------------------------------------------
  describe('6. Penolakan ID Kelompok Kebutuhan Tidak Terdaftar', () => {
    it('menolak pembuatan UserNeedProfile dengan nilai kebutuhan ilegal', () => {
      expect(() =>
        createUserNeedProfile({
          selectedNeeds: ['invalid_need_group'],
        }),
      ).toThrow()

      expect(() =>
        createUserNeedProfile({
          selectedNeeds: ['speech'], // varian usang yang ditolak
        }),
      ).toThrow()

      expect(() =>
        createUserNeedProfile({
          selectedNeeds: ['sensory_environment'], // varian non-kanonis
        }),
      ).toThrow()
    })

    it('menolak pembuatan AccessibilityCriterion dengan needGroup ilegal', () => {
      expect(() =>
        createAccessibilityCriterion({
          name: 'Kriteria Palsu',
          description: 'Desc',
          needGroups: ['random_group'],
          applicableFacilityTypes: [FACILITY_TYPE.MALL],
        }),
      ).toThrow()
    })

    it('seluruh kunci dalam NEED_GROUP_METADATA, LABELS, dan DESCRIPTIONS adalah nilai valid NEED_GROUP', () => {
      const validValues = Object.values(NEED_GROUP)

      Object.keys(NEED_GROUP_METADATA).forEach((key) => {
        expect(validValues).toContain(key)
      })

      Object.keys(NEED_GROUP_LABELS).forEach((key) => {
        expect(validValues).toContain(key)
      })

      Object.keys(NEED_GROUP_DESCRIPTIONS).forEach((key) => {
        expect(validValues).toContain(key)
      })
    })
  })
})

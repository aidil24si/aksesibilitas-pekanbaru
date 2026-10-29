import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import {
  reportService,
  observationService,
  clearAllData,
  loadSeedData,
} from '../services/dataStore.js'
import {
  createBarrierReport,
} from '../domain/models.js'
import {
  REPORT_STATUS,
  OBSERVATION_STATUS,
} from '../domain/constants.js'
import {
  buildFacilityDetailReport,
} from '../domain/assessmentEngine.js'
import {
  syntheticFacilities,
  syntheticCriteria,
  syntheticRules,
  syntheticProfiles,
  createSyntheticAssessment,
  createSyntheticObservationWithEvidence,
} from './fixtures/syntheticTestData.js'

describe('Sprint 3 — Formulir Pelaporan Hambatan Aksesibilitas', () => {
  beforeEach(() => {
    clearAllData()
  })

  // -------------------------------------------------------------------------
  // KASUS 1: Formulir dapat ditampilkan
  // -------------------------------------------------------------------------
  it('1. Formulir pelaporan dapat ditampilkan pada rute /lapor dengan field-field lengkap', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/lapor']}>
        <App />
      </MemoryRouter>,
    )

    expect(html).toContain('Laporkan Hambatan Aksesibilitas')
    expect(html).toContain('Fasilitas Publik yang Dilaporkan')
    expect(html).toContain('Deskripsi Hambatan / Kondisi yang Ditemukan')
    expect(html).toContain('Waktu Pengamatan')
    expect(html).toContain('Tautan Bukti Foto / Dokumen')
    expect(html).toContain('Kirim Laporan Hambatan')
  })

  // -------------------------------------------------------------------------
  // KASUS 2: Validasi field wajib berfungsi
  // -------------------------------------------------------------------------
  it('2. Validasi field wajib (fasilitas & deskripsi min 10 karakter) berfungsi', () => {
    // Data tanpa fasilitas
    expect(() =>
      createBarrierReport({
        facilityId: '',
        description: 'Deskripsi yang cukup panjang',
      }),
    ).toThrow(/facilityId harus berupa string yang tidak kosong/i)

    // Data tanpa deskripsi
    expect(() =>
      createBarrierReport({
        facilityId: 'fac_living_world',
        description: '',
      }),
    ).toThrow(/description harus berupa string yang tidak kosong/i)
  })

  // -------------------------------------------------------------------------
  // KASUS 3: Laporan dapat dibuat dengan data valid
  // -------------------------------------------------------------------------
  it('3. Laporan dapat dibuat dengan data valid', () => {
    const report = createBarrierReport({
      facilityId: 'fac_living_world',
      criterionId: 'crit_mall_entrance_ramp',
      description: 'Ramp pintu utama terhalang tangga permanen setinggi 15 cm.',
      observedAt: '2026-10-25',
      evidenceUrl: 'https://example.com/foto-ramp.jpg',
      reporterName: 'Warga Pekanbaru',
    })

    expect(report.id).toBeDefined()
    expect(report.facilityId).toBe('fac_living_world')
    expect(report.criterionId).toBe('crit_mall_entrance_ramp')
    expect(report.description).toBe('Ramp pintu utama terhalang tangga permanen setinggi 15 cm.')
    expect(report.observedAt).toBe('2026-10-25')
    expect(report.evidenceUrl).toBe('https://example.com/foto-ramp.jpg')
    expect(report.reporterName).toBe('Warga Pekanbaru')
  })

  // -------------------------------------------------------------------------
  // KASUS 4: Laporan menyimpan ID fasilitas yang benar
  // -------------------------------------------------------------------------
  it('4. Laporan menyimpan ID fasilitas yang tepat sesuai pilihan pengguna', () => {
    const reportA = createBarrierReport({
      facilityId: 'fac_mall_ska',
      description: 'Pintu toilet khusus terkunci dan tidak dapat diakses.',
    })

    const reportB = createBarrierReport({
      facilityId: 'fac_rth_putri_kaca_mayang',
      description: 'Jalur pejalan kaki berlubang cukup dalam.',
    })

    expect(reportA.facilityId).toBe('fac_mall_ska')
    expect(reportB.facilityId).toBe('fac_rth_putri_kaca_mayang')
  })

  // -------------------------------------------------------------------------
  // KASUS 5: Laporan baru mendapat status awal menunggu verifikasi
  // -------------------------------------------------------------------------
  it('5. Laporan baru secara default selalu berstatus pending_verification (menunggu verifikasi)', () => {
    const report = createBarrierReport({
      facilityId: 'fac_ciputra_seraya',
      description: 'Lift di lantai 2 dalam perbaikan dan tombol tidak bersuara.',
    })

    expect(report.status).toBe(REPORT_STATUS.PENDING_VERIFICATION)
  })

  // -------------------------------------------------------------------------
  // KASUS 6: Laporan tanpa foto tetap dapat dikirim (foto bersifat opsional)
  // -------------------------------------------------------------------------
  it('6. Laporan tanpa foto/tautan bukti tetap valid dan dapat disimpan (foto bersifat opsional)', () => {
    const report = createBarrierReport({
      facilityId: 'fac_transmart',
      description: 'Lahan parkir disabilitas ditempati oleh kendaraan umum tanpa stiker.',
      evidenceUrl: null, // Tanpa bukti foto
    })

    expect(report.evidenceUrl).toBeNull()
    expect(report.status).toBe(REPORT_STATUS.PENDING_VERIFICATION)

    // Simpan ke service
    reportService.save(report)
    expect(reportService.getById(report.id)).toBeDefined()
  })

  // -------------------------------------------------------------------------
  // KASUS 7: Laporan tetap terpisah dari observasi asesmen
  // -------------------------------------------------------------------------
  it('7. Laporan tersimpan di koleksi terpisah dan tidak menambah atau menimpa koleksi observasi asesmen', () => {
    const initialObsCount = observationService.getAll().length

    const report = createBarrierReport({
      facilityId: 'fac_synthetic_mall_a',
      criterionId: 'crit_syn_ramp',
      description: 'Ramp curam dan tidak ada pegangan rambat.',
    })

    reportService.save(report)

    // Koleksi observasi resmi TIDAK berubah
    const afterObsCount = observationService.getAll().length
    expect(afterObsCount).toBe(initialObsCount)

    // Koleksi laporan bertambah
    const reports = reportService.getAll()
    expect(reports.length).toBe(1)
    expect(reports[0].id).toBe(report.id)
  })

  // -------------------------------------------------------------------------
  // KASUS 8: Pembuatan laporan tidak mengubah ringkasan asesmen fasilitas
  // -------------------------------------------------------------------------
  it('8. Pembuatan laporan tidak mengubah ringkasan asesmen fasilitas (integritas asesmen terjaga)', () => {
    const facility = syntheticFacilities.mallA
    const assessment = createSyntheticAssessment(facility.id)

    // Observasi resmi menyatakan ramp confirmed_yes
    const { observation: rampObs } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_official_ramp',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_ramp',
      status: OBSERVATION_STATUS.CONFIRMED_YES,
    })

    loadSeedData({
      facilities: [facility],
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [rampObs],
      assessmentRules: syntheticRules,
    })

    // Hitung ringkasan sebelum ada laporan
    const reportBefore = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [rampObs],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    expect(reportBefore.summary.fulfilled.length).toBe(1)
    expect(reportBefore.summary.notFulfilled.length).toBe(0)

    // Sekarang pengguna melaporkan hambatan pada ramp yang sama
    const userReport = createBarrierReport({
      facilityId: facility.id,
      criterionId: 'crit_syn_ramp',
      description: 'Laporan warga: Ramp terhalang motor yang parkir liar.',
    })
    reportService.save(userReport)

    // Hitung ringkasan setelah ada laporan
    const reportAfter = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [rampObs],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    // Integritas Asesmen: Tetap sama, laporan tidak otomatis mengubah status kriteria menjadi confirmed_no!
    expect(reportAfter.summary.fulfilled.length).toBe(reportBefore.summary.fulfilled.length)
    expect(reportAfter.summary.notFulfilled.length).toBe(reportBefore.summary.notFulfilled.length)
    expect(reportAfter.summary.unknown.length).toBe(reportBefore.summary.unknown.length)
  })

  // -------------------------------------------------------------------------
  // KASUS 9: Laporan yang tersimpan dapat ditampilkan kembali sesuai kemampuan penyimpanan
  // -------------------------------------------------------------------------
  it('9. Laporan yang tersimpan dapat ditampilkan kembali dengan benar pada daftar laporan', () => {
    const report = createBarrierReport({
      facilityId: 'fac_living_world',
      criterionId: 'crit_mall_elevator',
      description: 'Pintu lift menutup terlalu cepat bagi lansia dan pengguna tongkat.',
      observedAt: '2026-10-28',
      reporterName: 'Aidil',
    })
    reportService.save(report)

    const retrieved = reportService.getAll()
    expect(retrieved.length).toBe(1)
    expect(retrieved[0].id).toBe(report.id)
    expect(retrieved[0].description).toBe(report.description)

    // Verifikasi pada render HTML /lapor
    const html = renderToString(
      <MemoryRouter initialEntries={['/lapor']}>
        <App />
      </MemoryRouter>,
    )

    expect(html).toContain('Living World Pekanbaru')
    expect(html).toContain('Pintu lift menutup terlalu cepat')
    expect(html).toContain('Menunggu Verifikasi')
    expect(html).toContain('Pelapor: Aidil')
  })

  // -------------------------------------------------------------------------
  // KASUS 10: Kondisi fasilitas atau kriteria yang tidak ditemukan ditangani dengan benar
  // -------------------------------------------------------------------------
  it('10. Kondisi fasilitas atau kriteria tidak dikenal pada laporan ditangani secara aman tanpa crash', () => {
    // Laporan dengan ID fasilitas asing/fiktif
    const orphanReport = createBarrierReport({
      facilityId: 'fac_unknown_9999',
      criterionId: 'crit_unknown_8888',
      description: 'Hambatan pada fasilitas yang ID-nya sudah tidak ada.',
    })
    reportService.save(orphanReport)

    const html = renderToString(
      <MemoryRouter initialEntries={['/lapor']}>
        <App />
      </MemoryRouter>,
    )

    // Tidak crash, menampilkan fallback ID fasilitas & kriteria
    expect(html).toContain('fac_unknown_9999')
    expect(html).toContain('Kriteria Tidak Terdaftar')
  })

  // -------------------------------------------------------------------------
  // KASUS 11: Semua rute yang sudah ada tetap berfungsi
  // -------------------------------------------------------------------------
  it('11. Seluruh rute aplikasi (/, /fasilitas, /fasilitas/:id, /lapor, 404) tetap berfungsi berdampingan', () => {
    const routes = [
      { path: '/', expectedText: 'Sistem Informasi Aksesibilitas Fasilitas Publik Pekanbaru' },
      { path: '/fasilitas', expectedText: 'Daftar Fasilitas Publik' },
      { path: '/fasilitas/fac_living_world', expectedText: 'Living World Pekanbaru' },
      { path: '/lapor', expectedText: 'Laporkan Hambatan Aksesibilitas' },
      { path: '/lapor?facilityId=fac_living_world', expectedText: 'Laporkan Hambatan Aksesibilitas' },
      { path: '/rute-palsu-404', expectedText: 'Halaman Tidak Ditemukan' },
    ]

    routes.forEach(({ path, expectedText }) => {
      const html = renderToString(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      )
      expect(html).toContain(expectedText)
    })
  })
})

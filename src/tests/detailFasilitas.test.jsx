import { describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import {
  clearAllData,
  loadSeedData,
  getEvidenceForObservation,
} from '../services/dataStore.js'
import {
  buildFacilityDetailReport,
} from '../domain/assessmentEngine.js'
import {
  OBSERVATION_STATUS,
  CRITERION_DEV_STATUS,
} from '../domain/constants.js'
import {
  syntheticFacilities,
  syntheticCriteria,
  syntheticRules,
  syntheticProfiles,
  syntheticEvidenceSources,
  createSyntheticAssessment,
  createSyntheticObservationWithEvidence,
} from './fixtures/syntheticTestData.js'

describe('Sprint 2 — Halaman Detail Fasilitas & Laporan Aksesibilitas', () => {
  beforeEach(() => {
    clearAllData()
  })

  // -------------------------------------------------------------------------
  // KASUS 1: ID fasilitas valid menampilkan detail fasilitas yang sesuai
  // -------------------------------------------------------------------------
  it('1. ID fasilitas valid menampilkan identitas dan informasi fasilitas yang sesuai', () => {
    const facility = syntheticFacilities.mallA
    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [],
      observations: [],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    expect(report).not.toBeNull()
    expect(report.facility.id).toBe('fac_synthetic_mall_a')
    expect(report.facility.name).toBe('[SINTETIS] Mal Contoh Alpha')
    expect(report.facility.address).toBe('Jl. Contoh Sintetis No. 1, Wilayah Uji')
    expect(report.relevantCriteria.length).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  // KASUS 2: ID tidak valid menampilkan kondisi tidak ditemukan
  // -------------------------------------------------------------------------
  it('2. ID tidak valid menghasilkan status laporan null / halaman tidak ditemukan', () => {
    const report = buildFacilityDetailReport({
      facility: null, // ID tidak ada
      criteria: syntheticCriteria,
      assessments: [],
      observations: [],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    expect(report).toBeNull()

    // Verifikasi rendering komponen dengan route ID yang tidak valid
    const html = renderToString(
      <MemoryRouter initialEntries={['/fasilitas/non_existent_id_999']}>
        <App />
      </MemoryRouter>,
    )

    expect(html).toContain('Fasilitas Tidak Ditemukan')
    expect(html).toContain('Kembali ke Daftar Fasilitas')
  })

  // -------------------------------------------------------------------------
  // KASUS 3: Fasilitas tanpa observasi tidak menghasilkan klaim aksesibilitas palsu
  // -------------------------------------------------------------------------
  it('3. Fasilitas tanpa observasi tidak menghasilkan klaim aksesibilitas palsu (hasObservations = false)', () => {
    const facility = syntheticFacilities.mallA
    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [],
      observations: [],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    expect(report.hasObservations).toBe(false)
    expect(report.summary.fulfilled.length).toBe(0)
    expect(report.summary.notFulfilled.length).toBe(0)
    // Seluruh kriteria relevan harus berstatus unknown
    expect(report.summary.unknown.length).toBe(report.relevantCriteria.length)
    // Tidak boleh menyatakan fasilitas sepenuhnya sesuai
    expect(report.summary.canDeclareFullyAccessible).toBe(false)
  })

  // -------------------------------------------------------------------------
  // KASUS 4: Status unknown tetap berbeda dari confirmed_no
  // -------------------------------------------------------------------------
  it('4. Status unknown tetap berbeda dari confirmed_no dan tidak disamakan', () => {
    const facility = syntheticFacilities.mallA
    const assessment = createSyntheticAssessment(facility.id)

    // Buat observasi confirmed_no untuk elevator
    const { observation: elevatorObs } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_no',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_elevator',
      status: OBSERVATION_STATUS.CONFIRMED_NO,
      notes: 'Lift tidak memenuhi dimensi standar kursi roda',
    })

    // Ramp tidak memiliki observasi sama sekali (status = unknown)
    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [elevatorObs],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    // Cari item ramp dan elevator
    const elevatorItem = report.items.find((i) => i.criterion.id === 'crit_syn_elevator')
    const rampItem = report.items.find((i) => i.criterion.id === 'crit_syn_ramp')

    expect(elevatorItem.status).toBe(OBSERVATION_STATUS.CONFIRMED_NO)
    expect(rampItem.status).toBe(OBSERVATION_STATUS.UNKNOWN)

    // confirmed_no berada di notFulfilled, unknown berada di unknown
    expect(report.summary.notFulfilled.map((e) => e.criterion.id)).toContain('crit_syn_elevator')
    expect(report.summary.notFulfilled.map((e) => e.criterion.id)).not.toContain('crit_syn_ramp')
    expect(report.summary.unknown.map((e) => e.criterion.id)).toContain('crit_syn_ramp')
  })

  // -------------------------------------------------------------------------
  // KASUS 5: Status not_applicable tidak dihitung sebagai kegagalan
  // -------------------------------------------------------------------------
  it('5. Status not_applicable tidak dihitung sebagai kegagalan / notFulfilled', () => {
    const facility = syntheticFacilities.mallA
    const assessment = createSyntheticAssessment(facility.id)

    const { observation: rampObs } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_ramp',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_ramp',
      status: OBSERVATION_STATUS.CONFIRMED_YES,
    })

    const { observation: elevatorObs } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_elev_na',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_elevator',
      status: OBSERVATION_STATUS.NOT_APPLICABLE,
      notes: 'Fasilitas satu lantai datar, elevator tidak berlaku.',
    })

    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [rampObs, elevatorObs],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    expect(report.summary.notApplicable.length).toBe(1)
    expect(report.summary.notApplicable[0].criterion.id).toBe('crit_syn_elevator')
    expect(report.summary.notFulfilled.length).toBe(0) // Tidak boleh masuk failure
  })

  // -------------------------------------------------------------------------
  // KASUS 6: Status conflicting_evidence ditampilkan secara jelas
  // -------------------------------------------------------------------------
  it('6. Status conflicting_evidence dicatat dalam kelompok conflicting tanpa ditebak otomatis', () => {
    const facility = syntheticFacilities.mallA
    const assessment = createSyntheticAssessment(facility.id)

    const { observation: conflictObs } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_conflict',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_ramp',
      status: OBSERVATION_STATUS.CONFLICTING_EVIDENCE,
      notes: 'Laporan warga menyebut ramp curam, pengelola menyebut sesuai standar.',
    })

    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [conflictObs],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    expect(report.summary.conflicting.length).toBe(1)
    expect(report.summary.conflicting[0].criterion.id).toBe('crit_syn_ramp')
    expect(report.summary.fulfilled.length).toBe(0)
    expect(report.summary.canDeclareFullyAccessible).toBe(false)
  })

  // -------------------------------------------------------------------------
  // KASUS 7: Perubahan profil kebutuhan memperbarui kriteria relevan
  // -------------------------------------------------------------------------
  it('7. Perubahan profil kebutuhan memperbarui daftar kriteria relevan secara dinamis', () => {
    const facility = syntheticFacilities.mallA

    // Profil Mobilitas
    const reportMobility = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      userProfile: syntheticProfiles.mobilityOnly,
    })

    // Profil Pendengaran
    const reportHearing = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      userProfile: syntheticProfiles.hearingOnly,
    })

    const mobilityCriterionIds = reportMobility.relevantCriteria.map((c) => c.id)
    const hearingCriterionIds = reportHearing.relevantCriteria.map((c) => c.id)

    expect(mobilityCriterionIds).toContain('crit_syn_ramp')
    expect(mobilityCriterionIds).not.toContain('crit_syn_audio_caption')

    expect(hearingCriterionIds).toContain('crit_syn_audio_caption')
    expect(hearingCriterionIds).not.toContain('crit_syn_ramp')
  })

  // -------------------------------------------------------------------------
  // KASUS 8: Kriteria draft ditandai dengan benar
  // -------------------------------------------------------------------------
  it('8. Kriteria draft ditandai dengan devStatus draft agar tidak disalahartikan sebagai standar resmi', () => {
    const facility = syntheticFacilities.mallA
    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      userProfile: syntheticProfiles.visionOnly,
    })

    const tactileItem = report.items.find((i) => i.criterion.id === 'crit_syn_tactile')
    expect(tactileItem.criterion.devStatus).toBe(CRITERION_DEV_STATUS.DRAFT)
  })

  // -------------------------------------------------------------------------
  // KASUS 9: Sumber bukti ditampilkan hanya jika tersedia
  // -------------------------------------------------------------------------
  it('9. Sumber bukti dilampirkan hanya jika tersedia pada observasi yang bersangkutan', () => {
    const facility = syntheticFacilities.mallA
    const assessment = createSyntheticAssessment(facility.id)

    // Seed data bukti dan link
    const evDoc = syntheticEvidenceSources.officialDoc
    const { observation: rampObs, link } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_ev_1',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_ramp',
      status: OBSERVATION_STATUS.CONFIRMED_YES,
      evidenceId: evDoc.id,
    })

    // Observasi toilet tanpa bukti
    const { observation: toiletObs } = createSyntheticObservationWithEvidence({
      id: 'obs_syn_ev_2',
      assessmentId: assessment.id,
      criterionId: 'crit_syn_toilet',
      status: OBSERVATION_STATUS.CONFIRMED_YES,
    })

    loadSeedData({
      facilities: [facility],
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [rampObs, toiletObs],
      evidenceSources: [evDoc],
      observationEvidence: [link],
      assessmentRules: syntheticRules,
    })

    const report = buildFacilityDetailReport({
      facility,
      criteria: syntheticCriteria,
      assessments: [assessment],
      observations: [rampObs, toiletObs],
      rules: syntheticRules,
      userProfile: syntheticProfiles.mobilityOnly,
      getEvidenceFn: getEvidenceForObservation,
    })

    const rampItem = report.items.find((i) => i.criterion.id === 'crit_syn_ramp')
    const toiletItem = report.items.find((i) => i.criterion.id === 'crit_syn_toilet')

    // Ramp memiliki 1 sumber bukti otentik
    expect(rampItem.evidenceSources.length).toBe(1)
    expect(rampItem.evidenceSources[0].name).toBe('[SINTETIS] Dokumen Denah Aksesibilitas Mal Alpha')
    expect(rampItem.evidenceSources[0].url).toBe('https://example.com/synthetic/denah.pdf')

    // Toilet tidak memiliki bukti pendukung
    expect(toiletItem.evidenceSources.length).toBe(0)
  })

  // -------------------------------------------------------------------------
  // KASUS 10: Rute yang sudah ada tetap berfungsi
  // -------------------------------------------------------------------------
  it('10. Seluruh rute yang sudah ada (/, /fasilitas, /fasilitas/:id, /lapor, *) tetap berfungsi', () => {
    // 1. Rute Beranda
    const berandaHtml = renderToString(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(berandaHtml).toContain('Sistem Informasi Aksesibilitas Fasilitas Publik Pekanbaru')

    // 2. Rute Daftar Fasilitas
    const fasilitasHtml = renderToString(
      <MemoryRouter initialEntries={['/fasilitas']}>
        <App />
      </MemoryRouter>,
    )
    expect(fasilitasHtml).toContain('Daftar Fasilitas Publik')
    expect(fasilitasHtml).toContain('Living World Pekanbaru')

    // 3. Rute Detail Fasilitas
    const detailHtml = renderToString(
      <MemoryRouter initialEntries={['/fasilitas/fac_living_world']}>
        <App />
      </MemoryRouter>,
    )
    expect(detailHtml).toContain('Living World Pekanbaru')
    expect(detailHtml).toContain('Ringkasan Aksesibilitas Terkait Kebutuhan Anda')

    // 4. Rute Lapor
    const laporHtml = renderToString(
      <MemoryRouter initialEntries={['/lapor']}>
        <App />
      </MemoryRouter>,
    )
    expect(laporHtml).toContain('Laporkan Hambatan Aksesibilitas')

    // 5. Rute Tidak Ditemukan (404)
    const notFoundHtml = renderToString(
      <MemoryRouter initialEntries={['/halaman-acak-yang-tidak-ada']}>
        <App />
      </MemoryRouter>,
    )
    expect(notFoundHtml).toContain('Halaman Tidak Ditemukan')
  })
})

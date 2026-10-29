/**
 * Data awal fasilitas kandidat — Aksesibilitas Pekanbaru.
 *
 * PENTING:
 * - Data ini berisi identitas fasilitas yang diambil dari informasi publik.
 * - TIDAK ada klaim aksesibilitas yang dibuat di sini.
 * - Informasi aksesibilitas akan diisi melalui proses assessment terpisah
 *   yang memerlukan bukti.
 * - Alamat dan koordinat diisi berdasarkan informasi publik umum.
 *   Koordinat bersifat perkiraan, bukan hasil survei geodetik.
 * - Fasilitas dengan informasi yang masih memerlukan verifikasi
 *   ditandai dengan publicationStatus: 'draft'.
 */

import { FACILITY_TYPE, PUBLICATION_STATUS } from '../domain/constants.js'
import { createFacility } from '../domain/models.js'

/**
 * Catatan sumber data:
 *
 * Identitas dan alamat fasilitas diambil dari informasi publik umum
 * seperti Google Maps, situs resmi fasilitas, dan direktori bisnis.
 * Informasi ini tidak menjamin keakuratan alamat fisik secara presisi.
 *
 * Hutan Kota Pekanbaru: identitas dan lokasi belum konsisten
 * di berbagai sumber publik. Ditandai sebagai draft sampai ada
 * klarifikasi.
 */

export const initialFacilities = [
  // === MAL / PUSAT PERBELANJAAN ===

  createFacility({
    id: 'fac_living_world',
    name: 'Living World Pekanbaru',
    type: FACILITY_TYPE.MALL,
    address: 'Jl. Riau, Kel. Kampung Melayu, Kec. Sukajadi, Pekanbaru',
    coordinates: { lat: 0.5075, lng: 101.4483 },
    description: 'Pusat perbelanjaan di Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_mall_ska',
    name: 'Mall SKA',
    type: FACILITY_TYPE.MALL,
    address: 'Jl. Soekarno-Hatta, Kel. Labuh Baru Timur, Kec. Payung Sekaki, Pekanbaru',
    coordinates: { lat: 0.4958, lng: 101.4095 },
    description: 'Pusat perbelanjaan di Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_ciputra_seraya',
    name: 'Mal Ciputra Seraya',
    type: FACILITY_TYPE.MALL,
    address: 'Jl. Riau, Kel. Kampung Melayu, Kec. Sukajadi, Pekanbaru',
    coordinates: { lat: 0.5069, lng: 101.4502 },
    description: 'Pusat perbelanjaan di Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_mal_pekanbaru',
    name: 'Mal Pekanbaru',
    type: FACILITY_TYPE.MALL,
    address: 'Jl. Jend. Sudirman, Kel. Simpang Empat, Kec. Pekanbaru Kota, Pekanbaru',
    coordinates: { lat: 0.5072, lng: 101.4538 },
    description: 'Pusat perbelanjaan di pusat kota Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_transmart',
    name: 'Transmart Pekanbaru',
    type: FACILITY_TYPE.MALL,
    address: 'Jl. Jend. Sudirman, Kel. Jadirejo, Kec. Sukajadi, Pekanbaru',
    coordinates: { lat: 0.5085, lng: 101.4451 },
    description: 'Pusat perbelanjaan dan hypermarket di Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  // === RUANG PUBLIK TERBUKA ===

  createFacility({
    id: 'fac_rth_putri_kaca_mayang',
    name: 'RTH Putri Kaca Mayang',
    type: FACILITY_TYPE.PUBLIC_OPEN_SPACE,
    address: 'Jl. Jend. Sudirman, Kel. Jadirejo, Kec. Sukajadi, Pekanbaru',
    coordinates: { lat: 0.5099, lng: 101.4436 },
    description: 'Ruang terbuka hijau di pusat kota Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_rth_tunjuk_ajar',
    name: 'RTH Tunjuk Ajar Integritas',
    type: FACILITY_TYPE.PUBLIC_OPEN_SPACE,
    address: 'Jl. Cut Nyak Dien, Kel. Jadirejo, Kec. Sukajadi, Pekanbaru',
    coordinates: { lat: 0.5100, lng: 101.4390 },
    description: 'Ruang terbuka hijau di Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_taman_kota',
    name: 'Taman Kota Pekanbaru',
    type: FACILITY_TYPE.PUBLIC_OPEN_SPACE,
    address: 'Pekanbaru',
    description:
      'Taman kota di Pekanbaru. Alamat spesifik perlu diverifikasi karena beberapa sumber merujuk lokasi berbeda.',
    publicationStatus: PUBLICATION_STATUS.DRAFT,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_hutan_kota',
    name: 'Hutan Kota Pekanbaru',
    type: FACILITY_TYPE.PUBLIC_OPEN_SPACE,
    address: 'Pekanbaru',
    description:
      'Hutan kota di Pekanbaru. Identitas dan lokasi masih memerlukan verifikasi karena sumber publik yang ditemukan tidak konsisten.',
    publicationStatus: PUBLICATION_STATUS.DRAFT,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),

  createFacility({
    id: 'fac_alam_mayang',
    name: 'Taman Rekreasi Alam Mayang',
    type: FACILITY_TYPE.PUBLIC_OPEN_SPACE,
    address: 'Jl. Imam Munandar (Harapan Raya), Kel. Tangkerang Selatan, Kec. Bukit Raya, Pekanbaru',
    coordinates: { lat: 0.4872, lng: 101.4756 },
    description: 'Taman rekreasi dengan danau dan area bermain di Pekanbaru.',
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
    updatedAt: '2026-10-29T00:00:00.000Z',
  }),
]

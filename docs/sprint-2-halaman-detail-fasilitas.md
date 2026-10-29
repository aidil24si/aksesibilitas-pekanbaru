# Dokumentasi Sprint 2 — Halaman Detail Fasilitas
**Sistem Informasi Aksesibilitas Fasilitas Publik Pekanbaru**

---

## 1. Ikhtisar Sprint 2

Sprint 2 mengimplementasikan rute `/fasilitas/:id` untuk menyajikan rincian aksesibilitas setiap fasilitas secara objektif, transparan, dan berpusat pada kebutuhan pengguna.

Tujuan utama yang dicapai:
1. **Navigasi Mulus**: Kartu fasilitas pada halaman `/fasilitas` terhubung langsung ke rute detail `/fasilitas/:id`.
2. **Kondisi Not Found Aman**: Permintaan ke ID yang tidak valid menghasilkan tampilan "Fasilitas Tidak Ditemukan" tanpa crash.
3. **Pengambilan Bukti Transparan**: Jika observasi didukung oleh bukti, tautan sumber (hanya URL valid), kutipan, tanggal, dan catatan keterbatasan disajikan secara terperinci.
4. **Penanganan Data Kosong Jujur**: Fasilitas yang belum memiliki observasi diberi penjelasan bahwa data belum cukup untuk dinilai, bukan berarti fasilitas tidak aksesibel.
5. **Penanda Kriteria Draft**: Seluruh kriteria yang masih berstatus `draft` diberi badge jelas agar tidak disalahartikan sebagai standar resmi tervalidasi.
6. **Integrasi Profil Kebutuhan**: Pengguna dapat menyaring kriteria relevan berdasarkan kebutuhan fungsional tanpa diagnosis medis.

---

## 2. Struktur Halaman Detail (`/fasilitas/:id`)

Halaman `DetailFasilitasPage` disusun atas modul-modul berikut:

### A. Breadcrumb Navigasi
Tautan balik ke `/fasilitas` dengan nama fasilitas saat ini.

### B. Identitas Fasilitas
- Nama fasilitas.
- Label jenis fasilitas (`Mal / Pusat Perbelanjaan` atau `Ruang Publik Terbuka`) dengan ikon pembeda.
- Badge status publikasi (`Terpublikasi` vs `Data Draft - Verifikasi Diperlukan`).
- Alamat fisik (atau catatan bahwa alamat belum tercatat).
- Jam operasional (jika ada, tanpa mereka-reka).
- Koordinat lintang/bujur (jika ada).
- Tanggal pembaruan data.
- Banner peringatan khusus jika fasilitas berstatus `draft`.

### C. Filter Kebutuhan Fungsional Pengguna
- Terhubung langsung dengan `AccessibilityContext` global (`selectedNeeds`, `toggleNeed`).
- Memungkinkan pengguna memilih lebih dari satu kebutuhan (Mobilitas Fisik, Penglihatan, Pendengaran, Kognitif).
- Perubahan pilihan secara otomatis merekomputasi kriteria relevan dan ringkasan status.

### D. Ringkasan Aksesibilitas
- Dihitung oleh `summarizeAssessment` dari Sprint 1.
- Menampilkan 5 kartu status: Terpenuhi, Belum Terpenuhi, Belum Diketahui, Bukti Berbeda, dan Tidak Berlaku.
- **Peringatan Kriteria Kritis**: Jika kriteria berstatus `unknown` merupakan kriteria kritis bagi kebutuhan pengguna saat ini, sistem menampilkan peringatan eksplisit bahwa fasilitas belum dapat dinyatakan sepenuhnya sesuai.
- **Peringatan Hambatan**: Jika ada kriteria `confirmed_no`, sistem menginformasikannya secara terbuka.

### E. Penjelasan Kondisi Data Kosong
Jika fasilitas belum memiliki catatan observasi (`!hasObservations`), kotak informasi menegaskan bahwa belum adanya data bukan bukti ketiadaan aksesibilitas.

### F. Daftar Kriteria Relevan & Bukti Pendukung
Setiap kriteria yang cocok dengan jenis fasilitas dan kebutuhan pengguna menampilkan:
- Nama kriteria.
- Badge kriteria kritis (jika relevan).
- Badge status draft (`CRITERION_DEV_STATUS.DRAFT`).
- Badge status observasi ramah pengguna (`USER_FACING_STATUS_LABELS`) dengan kombinasi teks dan ikon (tidak mengandalkan warna semata).
- Deskripsi kriteria.
- Catatan hasil pemeriksaan & nilai terukur (jika ada).
- Rujukan kriteria.
- **Sumber Bukti Pendukung**:
  - Nama sumber & tipe sumber.
  - Tautan aktif (hanya dibuka jika URL valid, dengan `target="_blank"` dan `rel="noopener noreferrer"`).
  - Kutipan isi bukti.
  - Catatan keterbatasan bukti.
  - Waktu publikasi dan waktu akses.

### G. Batasan Sistem dan Disclaimer
Pernyataan penutup bahwa sistem bukan pengganti audit profesional dan tidak mengklaim kepatuhan hukum total.

---

## 3. Label Status Pengguna (User-Facing Mapping)

| Status Internal | Label Pengguna | Ikon |
|---|---|---|
| `confirmed_yes` | Terpenuhi berdasarkan informasi yang tersedia | `CheckCircle2` |
| `confirmed_no` | Tidak terpenuhi berdasarkan informasi yang tersedia | `XCircle` |
| `unknown` | Informasi belum tersedia atau belum cukup | `HelpCircle` |
| `not_applicable` | Tidak relevan untuk fasilitas ini | `MinusCircle` |
| `conflicting_evidence` | Informasi dari sumber berbeda belum konsisten | `AlertTriangle` |

---

## 4. Rute Aplikasi

| Rute | Komponen Halaman | Deskripsi |
|---|---|---|
| `/` | `BerandaPage` | Beranda sistem dan penjelasan proyek. |
| `/fasilitas` | `FasilitasPage` | Daftar fasilitas kandidat dengan link ke detail. |
| `/fasilitas/:id` | `DetailFasilitasPage` | Halaman detail fasilitas & kriteria aksesibilitas. |
| `/lapor` | `LaporPage` | Placeholder pelaporan hambatan warga. |
| `*` | `TidakDitemukanPage` | Halaman 404 aplikasi. |

---

## 5. Hasil Pengujian Unit & Integrasi

Semua 10 pengujian wajib Sprint 2 dijalankan melalui Vitest (`src/tests/detailFasilitas.test.jsx`) bersama pengujian domain sebelumnya:

```text
✓ src/tests/models.test.js (9 tests)
✓ src/tests/dataStore.test.js (2 tests)
✓ src/tests/assessmentEngine.test.js (8 tests)
✓ src/tests/detailFasilitas.test.jsx (10 tests)

Test Files  4 passed (4)
Tests       29 passed (29)
```

Hasil verifikasi:
1. `npm run test`: **29 passed** (0 failed).
2. `npm run lint`: **0 warnings, 0 errors** pada 24 files.
3. `npm run build`: **Berhasil (2.18s)**, ukuran bundle 301 kB (91 kB gzip).

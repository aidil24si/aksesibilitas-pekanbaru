# Dokumentasi Sprint 3 — Formulir Pelaporan Hambatan Aksesibilitas
**Sistem Informasi Aksesibilitas Fasilitas Publik Pekanbaru**

---

## 1. Ikhtisar Fitur

Sprint 3 mengubah rute placeholder `/lapor` menjadi fitur formulir pelaporan partisipatif masyarakat yang terstruktur untuk mencatat kondisi atau hambatan aksesibilitas di fasilitas publik Pekanbaru.

### Prinsip Utama
1. **Laporan adalah Masukan, Bukan Asesmen Otomatis**: Laporan warga tidak secara otomatis mengubah hasil asesmen fasilitas, tidak langsung menetapkan status kriteria menjadi `confirmed_no`, dan tidak mengubah ringkasan asesmen resmi.
2. **Status Awal Jujur**: Laporan yang baru dikirim secara bawaan berstatus `pending_verification` ("Menunggu Verifikasi").
3. **Tanpa Akun / Autentikasi Palsu**: Pelapor dapat menyertakan nama secara opsional atau mengirimkan secara anonim tanpa sistem otorisasi palsu.
4. **Kriteria Draft Transparan**: Kriteria yang masih berstatus draft diberi penanda jelas agar tidak disalahartikan sebagai standar audit resmi.
5. **Bukti Foto Opsional**: Pengguna tidak dipaksa memiliki foto; tautan bukti foto/dokumen bersifat sukarela dan divalidasi format URL-nya jika diisi.
6. **Transparansi Penyimpanan**: Pengguna diberitahu bahwa pada tahap prototipe ini data tersimpan di LocalStorage peramban dan belum terhubung ke database terpusat pemerintah kota.

---

## 2. Model Data & Skema Laporan (`BarrierReport`)

Entitas laporan didefinisikan pada `src/domain/models.js` melalui factory function `createBarrierReport`:

| Properti | Tipe | Status | Deskripsi |
|---|---|---|---|
| `id` | `string` | Wajib (Auto) | Identifier unik dengan format `rep_<timestamp>_<counter>`. |
| `facilityId` | `string` | Wajib | ID fasilitas publik Pekanbaru yang dilaporkan. |
| `criterionId` | `string \| null` | Opsional | ID kriteria aksesibilitas yang terdampak (atau null jika hambatan umum). |
| `description` | `string` | Wajib | Uraian detail hambatan (minimal 10 karakter). |
| `observedAt` | `string \| null` | Opsional | Tanggal pengamatan (tidak boleh tanggal masa depan). |
| `createdAt` | `string` | Wajib (Auto) | Timestamp ISO saat laporan dibuat di peramban. |
| `evidenceUrl` | `string \| null` | Opsional | Tautan web/Google Drive bukti foto atau dokumen. |
| `status` | `string` | Wajib (Auto) | Status verifikasi (`pending_verification`, `verified`, `rejected`). |
| `verificationNotes` | `string \| null` | Opsional | Catatan status peninjauan atau verifikasi. |
| `reporterName` | `string \| null` | Opsional | Nama pelapor atau string anonim. |

---

## 3. Status Verifikasi Laporan (`REPORT_STATUS`)

| Status Internal | Label Pengguna | Penjelasan |
|---|---|---|
| `pending_verification` | Menunggu Verifikasi | Laporan tercatat di sistem lokal, menunggu peninjauan oleh tim/pengelola. |
| `verified` | Terverifikasi | Laporan telah ditinjau dan terbukti sesuai kondisi riil. |
| `rejected` | Belum Dapat Diverifikasi | Informasi dalam laporan belum memadai atau belum dapat dibuktikan. |

---

## 4. Mekanisme Penyimpanan & Keterbatasannya

- **Implementasi**: Disimpan melalui `reportService` di `src/services/dataStore.js` menggunakan LocalStorage dengan kunci `akses_pku_barrier_reports`.
- **Persistensi**: Data bertahan setelah halaman dimuat ulang (*reload*), namun terikat pada peramban/perangkat yang digunakan.
- **Keterbatasan**: Tidak ada sinkronisasi multi-perangkat atau database cloud terpusat. Informasi ini disampaikan secara terbuka melalui banner di halaman pelaporan.

---

## 5. Bukti Integritas Data Asesmen

Integritas data dibuktikan melalui pengujian unit otomatis di `src/tests/laporPage.test.jsx`:
- **Kasus 7**: Menunjukkan bahwa penambahan entitas `BarrierReport` ke `reportService` sama sekali tidak menambah atau mengubah entitas di `observationService`.
- **Kasus 8**: Menunjukkan fasilitas dengan kriteria terkonfirmasi (`confirmed_yes`) tetap memiliki ringkasan asesmen yang utuh (`fulfilled: 1`, `notFulfilled: 0`) meskipun ada laporan hambatan warga baru pada kriteria yang sama.

---

## 6. Hasil Pengujian

Total 40 pengujian unit Vitest mencakup seluruh modul aplikasi:
- `src/tests/models.test.js`: 9 tests passed.
- `src/tests/dataStore.test.js`: 2 tests passed.
- `src/tests/assessmentEngine.test.js`: 8 tests passed.
- `src/tests/detailFasilitas.test.jsx`: 10 tests passed.
- `src/tests/laporPage.test.jsx`: 11 tests passed.

Hasil linter (`oxlint`): **0 warnings, 0 errors**.
Hasil build (`vite build`): **Berhasil**.

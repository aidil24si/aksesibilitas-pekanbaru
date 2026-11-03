# FINALISASI TAKSONOMI DAN VALIDASI INDIKATOR AKSESIBILITAS
**Proyek: Sistem Informasi Aksesibilitas Fasilitas Publik Pekanbaru**  
**Dokumen Analisis Teknis, Verifikasi Standar, & Perancangan Arsitektur — Sprint 4.1**

---

## 1. Ringkasan Eksekutif

Dokumen ini merupakan tindak lanjut langsung dan penyempurnaan kritis atas hasil audit Sprint 4. Tujuan utama Sprint 4.1 adalah **menyelesaikan seluruh keputusan konseptual, taksonomis, dan teknis yang belum tuntas**, memverifikasi akurasi rujukan regulasi nasional dan standar internasional, serta menetapkan batas operasional indikator dan bukti **sebelum dilakukan perubahan kode aplikasi pada Sprint 5**.

### Prinsip Pokok yang Diterapkan:
1. **Understand the problem before designing the solution**: Membedakan secara tegas antara *Kebutuhan Fungsional Pengguna*, *Aspek Aksesibilitas Lingkungan*, *Kriteria Penilaian*, *Indikator Pengukuran*, *Metode Pengumpulan*, dan *Bukti*.
2. **Evidence before assumptions**: Setiap angka teknis dan rujukan hukum diverifikasi langsung ke teks sumber resmi primer. Angka yang berasal dari interpretasi, sumber sekunder, atau standar berbayar yang belum diverifikasi penuh ditandai secara transparan.
3. **Functional needs before disability labels**: Menolak kategorisasi berbasis diagnosis medis sempit. Taksonomi disusun berdasarkan cara pengguna berinteraksi dengan lingkungan fisik.
4. **Feasibility before unnecessary complexity**: Membedakan apa yang realistis dikumpulkan dan dibuktikan pada tahap prototipe vs apa yang memerlukan audit instrumen teknis tingkat lanjut.
5. **Integritas Tanpa Kompromi**: Tidak ada data sintetis yang disamarkan sebagai data riil, dan tidak ada klaim validasi komunitas/ahli yang dibuat-buat jika belum dilaksanakan.

---

## 2. Kondisi dan Temuan Kritis dari Evaluasi Sprint 4

Evaluasi mendalam terhadap dokumen `docs/sprint-4-audit-taksonomi-aksesibilitas.md` dan basis kode aktual (`src/domain/`, `src/data/`, `src/services/`) menemukan sejumlah ambiguitas dan kelemahan konseptual yang harus diselesaikan:

1. **Inkonsistensi Penamaan ID Kelompok Kebutuhan**:
   Pada dokumen Sprint 4, terdapat ketidakkonsistenan penamaan identifier antara teks narasi dan tabel matriks:
   - Teks mengusulkan: `SENSORY_ENVIRONMENT` dan `COMMUNICATION_SPEECH`.
   - Matriks menggunakan singkatan: `SENSORY_ENV` dan `COMMUNICATION`.
   - Kode aplikasi eksisting saat ini menggunakan format enum: `MOBILITY`, `VISION`, `HEARING`, `COGNITIVE`.
   *Keputusan*: Harus dikunci satu konvensi penamaan seragam untuk arsitektur domain.
2. **Pencampuran Dimensi pada Kelompok Usulan `STAMINA_PACING`**:
   Sprint 4 mencampurkan keterbatasan stamina/daya tahan perjalanan (butuh tempat duduk perhentian & peneduh cuaca panas) dengan aspek kekuatan fisik membuka pintu berat dan jangkauan fisik fasilitas. Hal ini menimbulkan tumpang tindih dengan kelompok `MOBILITY`.
3. **Kelemahan Ruang Lingkup `COMMUNICATION_SPEECH`**:
   Istilah "Speech" (wicara) terlalu sempit dan berpotensi memunculkan anggapan keliru bahwa kebutuhan ini hanya untuk orang dengan gangguan wicara anatomis. Pengguna bahasa isyarat, orang dengan afasia, atau individu non-verbal memerlukan aksesibilitas interaksi dua arah di meja layanan publik.
4. **Akurasi Angka Teknis Regulasi**:
   Sebagian angka teknis dalam dokumen Sprint 4 (seperti kemiringan ramp, dimensi kabin lift, lebar jalur pedestrian, dan kontras visual) dicantumkan tanpa konteks operasional lengkap dari Permen PUPR No. 14/PRT/M/2017 dan ISO 21542:2021.
5. **Kualitas Bukti vs Kemampuan Pembuktian**:
   Klaim bahwa foto visual umum dapat membuktikan "kemiringan ramp $\le 7^\circ$" atau "ruang putar toilet 150 cm" adalah keliru secara metodologis. Foto tanpa skala atau objek pembanding terukur tidak dapat membuktikan kepatuhan dimensi presisi.

---

## 3. Tugas A — Finalisasi Taksonomi Kelompok Kebutuhan Fungsional

### A. Evaluasi Rinci Tiap Kelompok

#### 1. `MOBILITY` (Mobilitas Fisik & Perpindahan)
- **Cakupan Fungsional**: Pengguna kursi roda (manual/motor), pengguna alat bantu jalan (kruk, walker, tongkat penyangga), orang dengan gaya berjalan tidak stabil (*unsteady gait*), dan orang dengan gangguan koordinasi motorik kasar.
- **Batasan**: Fokus pada **eliminasi hambatan fisik geometris**: perbedaan ketinggian (undakan/tangga), lebar bukaan pintu/koridor, permukaan pijakan, dan kelengkapan pegangan rambat (*handrail/grab bar*).
- **Keputusan**: **FINAL UNTUK PROTOTIPE** (Kelompok Inti).

#### 2. `STAMINA_PACING` (Daya Tahan Fisik & Pengaturan Ritme Perjalanan)
- **Evaluasi**: Apakah dipisahkan dari `MOBILITY`?
  - *Analisis*: Pengguna kursi roda dapat memiliki stamina lengan yang tinggi, sementara seorang lansia atau penderita penyakit kardiovaskular/asma dapat berjalan tanpa alat bantu tetapi tidak mampu berjalan terus-menerus lebih dari 50 meter tanpa henti. Memaksakan kebutuhan tempat duduk istirahat dan peneduh cuaca ke dalam `MOBILITY` akan mengaburkan perbedaan mendasar antara *hambatan geometris jalan* vs *hambatan kapasitas energi*.
  - *Batas Cakupan*: Dibatasi secara ketat pada **penyediaan jeda istirahat, jarak tempuh bertahap, dan perlindungan dari kelelahan termal ekstrem (cuaca panas Pekanbaru)**. Masalah kekuatan memutar handle pintu atau jangkauan ketinggian tombol dikembalikan ke aspek ergonomi `MOBILITY`.
- **Keputusan**: **FINAL UNTUK PROTOTIPE** (Kelompok Baru Terstandarisasi).

#### 3. `SENSORY_ENVIRONMENT` (Regulasi Stimulasi Sensorik & Lingkungan)
- **Evaluasi**: Mengakomodasi kebutuhan pengguna yang sensitif terhadap input lingkungan visual dan auditori intensitas tinggi (individu neurodivergen, autisme, ADHD, gangguan pemrosesan sensorik, migrain kronis, PTSD).
- **Batas Cakupan**: Dibatasi pada **kondisi lingkungan mikro**: ketersediaan ruang/sudut tenang (*calm/quiet space*), prediktabilitas tata letak, serta pengendalian kebisingan ekstrem dan lampu silau/flicker di ruang publik. Tidak menggunakan diagnosis medis.
- **Keputusan**: **DIPERTAHANKAN SEBAGAI CAKUPAN PENGEMBANGAN (Tahap Menengah)**. Pada prototipe awal, indikator fisiknya difokuskan pada ketersediaan ruang tenang (*quiet room*), sedangkan pengukuran desibel dan lux ditunda.

#### 4. `COMMUNICATION_ACCESS` (Akses Komunikasi & Interaksi Layanan)
- **Evaluasi Penggantian Nama**: Mengubah usulan `COMMUNICATION_SPEECH` menjadi `COMMUNICATION_ACCESS`.
  - *Alasan*: Pengguna bahasa isyarat, penyandang disabilitas rungu, wicara, afasia, maupun neurodivergen non-verbal memiliki kebutuhan bersama: **dapat berinteraksi dua arah dengan petugas informasi/layanan tanpa paksaan berbicara lisan**. Istilah "Access" mencerminkan hak penyediaan akomodasi yang layak sesuai amanat UU No. 8 Tahun 2016 Pasal 97.
- **Batas Cakupan**: Dibatasi pada titik interaksi layanan pelanggan/meja informasi publik di mal atau loket taman.
- **Keputusan**: **DIPERTAHANKAN SEBAGAI CAKUPAN PENGEMBANGAN**.

#### 5. `VISION` (Penglihatan) & `HEARING` (Pendengaran)
- **VISION**: Mencakup tunanetra total (butuh informasi taktil dan audio) serta low-vision/buta warna (butuh kontras luminansi tinggi dan pencahayaan merata).
- **HEARING**: Mencakup tuli total dan kurang dengar (butuh pengumuman teks visual dan sinyal bahaya strobo).
- **Keputusan**: **FINAL UNTUK PROTOTIPE** (Kelompok Inti).

#### 6. `COGNITIVE_WAYFINDING` (Orientasi Spasial & Pemrosesan Informasi)
- **Evaluasi Penyempurnaan**: Memfokuskan kelompok `COGNITIVE` eksisting menjadi orientasi navigasi (*spatial wayfinding*). Di fasilitas fisik publik, kebutuhan fungsional kognitif utama adalah **tidak tersesat, memahami piktogram universal, dan navigasi mandiri**.
- **Keputusan**: **FINAL UNTUK PROTOTIPE** (Fokus Spasial/Navigasi).

---

### B. Tabel Taksonomi Final Kelompok Kebutuhan Fungsional

| ID Kelompok | Nama Kelompok (Bahasa Indonesia) | Definisi Operasional | Kebutuhan Fungsional Pengguna | Batas Cakupan Sistem | Contoh Situasi Riil di Pekanbaru | Status Keputusan |
|---|---|---|---|---|---|---|
| `MOBILITY` | Mobilitas Fisik & Perpindahan | Kebutuhan sirkulasi dan perpindahan fisik bebas hambatan geometris undakan/sempit. | Sirkulasi horizontal/vertikal bebas tangga, permukaan stabil, bukaan lebar, pegangan tumpu. | Akses jalan masuk, pintu, lift fisik, ramp, toilet disabilitas, dan petak parkir. | Pengguna kursi roda memasuki lobi Mal SKA atau jalur pedestrian RTH Kaca Mayang. | **Final untuk Prototipe** |
| `STAMINA_PACING` | Daya Tahan Fisik & Istirahat | Kebutuhan pengaturan ritme energi fisik dan jeda pemulihan dari kelelahan. | Tempat duduk istirahat berkala, rute tidak terlalu panjang tanpa jeda, peneduh dari panas terik. | Bangku taman/koridor mal, kanopi/pohon peneduh, area duduk tanpa kewajiban berbelanja. | Lansia atau pengunjung dengan masalah jantung berjalan di sepanjang koridor Living World atau mengitari Alam Mayang. | **Final untuk Prototipe** |
| `VISION` | Penglihatan & Navigasi Taktil | Kebutuhan navigasi dan persepsi informasi visual/taktil bagi hambatan penglihatan. | Jalur pemandu pemukaan lantai, teks kontras tinggi, informasi suara/braille, bebas silau. | Pemandu taktil lantai, papan petunjuk visual, antarmuka suara lift, tangga ber-nosing. | Penyandang disabilitas netra menelusuri trotoar menuju lobi mal atau membaca arah toilet. | **Final untuk Prototipe** |
| `HEARING` | Pendengaran & Peringatan Visual | Kebutuhan penangkapan informasi audio dan peringatan bahaya secara visual. | Pengumuman suara disajikan tertulis, sistem alarm bahaya visual (strobo), pencahayaan bibir staf. | Layar informasi publik, sistem sinyal darurat visual di ruang publik dan toilet. | Pengunjung tuli di atrium mal saat ada pengumuman evakuasi atau informasi operasional. | **Final untuk Prototipe** |
| `COGNITIVE` | Orientasi & Pemrosesan Informasi | Kebutuhan orientasi ruang mandiri yang intuitif dan mudah dipahami. | Piktogram visual universal, denah sederhana "Anda Di Sini", penanda arah yang konsisten. | Papan navigasi, peta direktori mal/taman, penamaan zona fasilitas yang konsisten. | Pengunjung dengan disabilitas intelektual atau memori mencari jalan keluar atau toilet di mal labirin. | **Final untuk Prototipe** |
| `SENSORY_ENV` | Lingkungan Sensorik & Ketenangan | Kebutuhan regulasi input stimulasi suara, cahaya, dan kerumunan. | Ruang istirahat sensorik (*quiet space*), akustik tidak berdengung ekstrem, pencahayaan bebas flicker. | Area tenang khusus atau sudut hening publik, pengendalian suara bising terpusat. | Individu autistik mengalami *sensory overload* akibat riuh atrium dan membutuhkan area tenang untuk regulasi. | **Cakupan Pengembangan (Sprint Lanjutan)** |
| `COMMUNICATION` | Akses Komunikasi & Layanan | Kebutuhan interaksi layanan pelanggan dua arah non-lisan/adaptif. | Komunikasi tulis, media digital interaktif, staf sabar dan ramah non-verbal. | Meja informasi utama, loket tiket ruang rekreasi publik. | Penyandang disabilitas wicara/rungu menanyakan jadwal atau lokasi fasilitas kepada petugas informasi. | **Cakupan Pengembangan (Sprint Lanjutan)** |

---

## 4. Tugas B — Finalisasi dan Audit 16 Aspek Kebutuhan Sprint 4

Audit terhadap 16 aspek awal Sprint 4 menghasilkan restrukturisasi yang lebih tegas agar tidak ada aspek yang tumpang tindih atau rancu:

| ID Aspek Lama | Kelompok Kebutuhan | Nama Aspek Final | Deskripsi Kebutuhan | Contoh Hambatan Riil | Jenis Fasilitas | Keputusan & Alasan Tindakan |
|---|---|---|---|---|---|---|
| `MOB-ENT` | `MOBILITY` | Akses Pintu Masuk Bebas Undakan | Kebutuhan memasuki bangunan/area tanpa terhalang anak tangga tunggal maupun majemuk. | Pintu utama lobi mal memiliki undakan 3 trap tanpa alternatif jalur ramp di dekatnya. | Mal & Ruang Terbuka | **Pertahankan & Perjelas**: Kritis untuk mobilitas kursi roda/walker. |
| `MOB-VER` | `MOBILITY` | Sirkulasi Vertikal Fisik | Kebutuhan berpindah lantai secara vertikal dengan sarana mekanis memadai. | Mal bertingkat hanya memiliki eskalator sempit dan tangga manual; lift rusak atau khusus karyawan. | Mal | **Pecah**: Dikhususkan pada *dimensi fisik lift* (lebar bukaan pintu dan luas kabin). Aspek sensorik dipindah ke `VIS-AUD`. |
| `MOB-SAN` | `MOBILITY` | Fasilitas Sanitasi Aksesibel | Kebutuhan menggunakan toilet dengan ruang gerak memadai dan sarana transfer yang aman. | Pintu toilet membuka ke dalam sehingga membentur kursi roda; tidak ada pegangan tumpu kloset. | Mal & Ruang Terbuka | **Perjelas**: Satukan aspek toilet mal dan toilet ruang terbuka dalam satu standar sanitasi operasional. |
| `MOB-PRK` | `MOBILITY` | Petak Parkir Aksesibel & Rute Transfer | Kebutuhan ruang transfer aman di samping kendaraan dan jalur bebas hambatan menuju lobi. | Mobil parkir berhimpitan sehingga pintu samping tidak dapat dibuka lebar untuk transfer kursi roda. | Mal | **Perjelas**: Memisahkan keberadaan marka parkir dari kontinuitas jalur bebas undakan ke pintu masuk. |
| `MOB-PTH` | `MOBILITY` | Permukaan Jalur Pejalan Kaki | Kebutuhan jalur pejalan kaki yang padat, rata, tidak licin, dan bebas jebakan roda/kruk. | Paving block taman lepas/bergelombang akibat akar pohon; jalan tanah becek saat hujan. | Mal & Ruang Terbuka | **Pertahankan**: Berlaku untuk selasar luar mal dan jalur pedestrian taman/hutan kota. |
| `MOB-CLR` | `MOBILITY` | Gerbang & Bukaan Bebas Rintangan Sempit | Kebutuhan bukaan gerbang masuk yang tidak terblokir oleh tiang pembatas sempit atau pintu putar. | Pintu masuk taman dipasangi deretan tiang besi rapat (*bollard* jarak 50 cm) atau turnstile putar. | Ruang Terbuka | **Pertahankan**: Sangat krusial untuk taman kota di Indonesia yang kerap memasang pembatas anti-motor. |
| `STA-RST` | `STAMINA_PACING` | Tempat Duduk Istirahat Berkala | Kebutuhan jeda istirahat fisik bagi pengguna dengan stamina terbatas atau nyeri kronis. | Koridor panjang mal atau jalur lingkar taman sepanjang 300 meter tanpa satupun tempat duduk. | Mal & Ruang Terbuka | **Pertahankan**: Aspek kunci kelompok `STAMINA_PACING`. |
| `STA-SHD` | `STAMINA_PACING` | Perlindungan Cuaca & Peneduh | Kebutuhan jalur dan area duduk yang terlindung dari terik matahari ekstrem atau hujan lebat. | Taman terbuka tanpa pohon peneduh atau kanopi pelindung panas tropis Pekanbaru. | Ruang Terbuka | **Perjelas**: Fokus pada peneduh pada area istirahat/duduk dan sirkulasi utama taman. |
| `VIS-TAC` | `VISION` | Pemandu Taktil Permukaan Jalan | Kebutuhan petunjuk orientasi rute jalan bagi tongkat tunanetra dan kaki. | Jalur pemandu tidak ada, atau guiding block dipasang mengarah ke selokan terbuka/tiang listrik. | Mal & Ruang Terbuka | **Perjelas**: Menilai keberadaan ubin pengarah (garis) dan ubin peringatan (titik) serta kebebasan rintangan. |
| `VIS-CON` | `VISION` | Keterbacaan & Kontras Visual Rambu | Kebutuhan membaca informasi arah dan nama ruang bagi penyandang low-vision. | Teks penunjuk arah berwarna abu-abu muda di atas latar perak mengkilap dengan lampu tembak silau. | Mal & Ruang Terbuka | **Pecah dari COG-WAY**: Khusus mengukur kontras luminansi visual dan ukuran huruf, bukan piktogram. |
| `VIS-AUD` | `VISION` & `HEARING` | Antarmuka Multisensorik Lift | Kebutuhan mengetahui posisi lantai dan arah lift tanpa harus mengandalkan satu indera saja. | Lift bergerak tanpa suara panggilan lantai (tunanetra bingung) dan tombol tanpa angka timbul/braille. | Mal | **Pertahankan**: Aspek gabungan visual-auditori pada transportasi vertikal. |
| `HEA-ALM` | `HEARING` | Sistem Alarm Bahaya Visual (Strobo) | Kebutuhan menyadari situasi darurat/kebakaran tanpa mengandalkan pendengaran. | Alarm kebakaran berbunyi kencang tetapi tidak ada lampu strobo berkedip di toilet/lorong mal. | Mal | **Pertahankan**: Aspek keselamatan jiwa vital. |
| `HEA-TXT` | `HEARING` | Informasi Publik Visual Tertulis | Kebutuhan menerima pengumuman penting fasilitas dalam bentuk teks tertulis. | Informasi perubahan jam operasional atau evakuasi hanya diumumkan melalui pengeras suara. | Mal | **Pertahankan**: Evaluasi ketersediaan papan monitor display aktif. |
| `SEN-QUT` | `SENSORY_ENV` | Area / Ruang Tenang Regulasi Diri | Kebutuhan tempat jeda dari kebisingan dan kerumunan untuk meredakan kelebihan beban sensorik. | Atrium mal sangat bising dan padat; tidak ada ruangan tenang untuk menenangkan diri dari sensory overload. | Mal | **Tunda untuk Prototipe Awal**: Belum ada mal di Pekanbaru yang menyediakan *sensory room* formal. Dicatat sebagai kebutuhan pengembangan. |
| `COG-WAY` | `COGNITIVE` | Navigasi Simbolik & Peta Intuitif | Kebutuhan memahami rute dan denah fasilitas secara mandiri dengan simbol sederhana. | Mal bertingkat luas tanpa peta direktori visual "Anda Di Sini" di persimpangan koridor utama. | Mal & Ruang Terbuka | **Pecah dari VIS-CON**: Khusus menilai kejelasan simbol grafis piktogram universal dan peta lokasi. |
| `COM-ALT` | `COMMUNICATION` | Akomodasi Layanan Non-Lisan | Kebutuhan berinteraksi dengan petugas informasi melalui media tulis/visual alternatif. | Petugas meja informasi menolak melayani tulisan tangan dan memaksakan interaksi lisan cepat. | Mal & Ruang Terbuka | **Tunda untuk Prototipe Awal**: Menguji sikap staf membutuhkan audit lapangan khusus, belum layak diuji via desk-review. |

---

## 5. Tugas C & D — Matriks Final Kriteria, Indikator, dan Verifikasi Angka Teknis

Berikut adalah pembedahan komprehensif antara kriteria, indikator terukur, dan hasil penelusuran terhadap sumber hukum primer:

### A. Verifikasi Sumber & Parameter Angka Teknis (Hasil Pemeriksaan Primer)

| ID Kriteria | Indikator Teknis | Nilai / Parameter Terverifikasi | Sumber Rujukan Primer | Pasal / Lampiran Dokumen | Konteks Penerapan Regulasi | Jenis Ketentuan | Status Verifikasi |
|---|---|---|---|---|---|---|---|
| `CRIT-MOB-RAMP` | Kemiringan ramp (*slope*) | **Maksimal $6^\circ$ (rasio 1:10) dalam gedung; maksimal $5^\circ$ (rasio 1:12) luar gedung.** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian B.2.c | Bangunan umum & fasilitas publik | Wajib Teknis | **Terverifikasi Sumber Primer** *(Koreksi: Sprint 4 menyebut $7^\circ$, teks asli Permen 14/2017 mengatur $6^\circ$ dalam gedung dan $5^\circ$ luar gedung)*. |
| `CRIT-MOB-RAMP` | Lebar bebas ramp | **Minimal 120 cm** (bebas dari tonjolan handrail). | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian B.2.c | Bangunan gedung umum | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-MOB-ELEV-PHY` | Lebar bersih pintu lift | **Minimal 90 cm (bukaan efektif bersih).** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian C.2.a | Lift penumpang aksesibel | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-MOB-ELEV-PHY` | Dimensi bersih kabin lift | **Lebar minimal 110 cm, kedalaman/panjang minimal 140 cm.** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian C.2.a | Lift penumpang bangunan umum | Wajib Teknis | **Terverifikasi Sumber Primer** *(Koreksi: Sprint 4 menyebut $140 \times 140\text{ cm}$; teks regulasi menetapkan minimal $110\text{ cm} \times 140\text{ cm}$)*. |
| `CRIT-MOB-TOILET` | Ruang bebas manuver toilet | **Ruang bebas sekurang-kurangnya 152,5 cm antara pintu dan kloset; luas total ruang toilet disabilitas paling sedikit $152,5 \times 227,5\text{ cm}$.** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab III Bagian A.1 | Toilet penyandang disabilitas | Wajib Teknis | **Terverifikasi Sumber Primer** *(Koreksi: Angka umum 150 cm merupakan pembulatan teknis dari standar baku $152,5\text{ cm}$)*. |
| `CRIT-MOB-TOILET` | Arah bukaan pintu toilet | **Pintu harus membuka ke arah luar atau menggunakan pintu geser (*sliding*).** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab III Bagian A.1 | Toilet penyandang disabilitas | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-MOB-PARK` | Lebar petak parkir disabilitas | **Lebar minimal 370 cm (parkir tunggal)**; termasuk ruang transfer bebas kursi roda di samping mobil. | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab III Bagian E.1 | Tempat parkir mobil disabilitas | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-MOB-PARK` | Jarak parkir ke pintu masuk | **Jarak tempuh terjauh maksimal 60 meter** menuju pintu masuk lobi yang dapat diakses. | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab III Bagian E.1 | Aksesibilitas tapak luar | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-MOB-PATH` | Lebar efektif jalur pedestrian | **Minimal 150 cm untuk jalur 1 arah; minimal 160 cm untuk jalur 2 arah.** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian A.1 | Jalur pedestrian pejalan kaki | Wajib Teknis | **Terverifikasi Sumber Primer** *(Koreksi: Angka 120 cm pada regulasi merujuk pada lebar curb-ramp penyeberangan, bukan lebar badan jalur pedestrian utama)*. |
| `CRIT-MOB-GATE` | Lebar bukaan gerbang bebas rintangan | **Bukaan bersih minimal 90 cm**, bebas tiang pembatas rapat (*bollard gap* $\ge 90\text{ cm}$) dan bebas turnstile. | Permen PUPR No. 14/PRT/M/2017 & Panduan Jalur Pedestrian | Bab II Persyaratan Bukaan Pintu | Akses masuk tapak publik | Rekomendasi Teknis Adaptif | **Adaptasi Standar Terverifikasi**. |
| `CRIT-STA-BENCH` | Jarak interval bangku istirahat | **Tersedia tempat duduk istirahat pada interval jarak wajar (setiap 50–100 meter)** di sirkulasi pedestrian panjang. | Permen PUPR No. 14/PRT/M/2017 & ISO 21542:2021 | Bab III Perlengkapan Tapak; Klausul 26 ISO 21542 | Area sirkulasi publik | Rekomendasi Standar | **Terverifikasi Rekomendasi Standar Internasional**. |
| `CRIT-VIS-TACTILE` | Desain guiding block taktil | **Motif garis (pengarah/jalan terus) dan motif titik bulat (peringatan/berhenti/perubahan arah).** Warna kuning kontras. | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian A.2 | Jalur pemandu lantai | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-VIS-CONTRAST` | Rasio kontras luminansi signage | **Perbedaan nilai pantulan cahaya (*Light Reflectance Value* / LRV) minimal 30% standar dasar, disarankan $\ge 70\%$ untuk keselamatan kritis.** | ISO 21542:2021 & W3C Contrast Principles | Lampiran E ISO 21542 (Weber/Michelson Formula) | Signage & penandaan visual | Rekomendasi Standar Internasional | **Terverifikasi Sumber Internasional** *(Catatan: Permen PUPR 14/2017 hanya menyebut "kontras warna", formula matematis diatur rinci dalam ISO 21542)*. |
| `CRIT-VIS-ELEV-SENS` | Fitur sensorik lift | **Tombol angka timbul dengan huruf Braille; indikator suara otomatis dwibahasa.** | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab II Bagian C.2.a | Transportasi vertikal | Wajib Teknis | **Terverifikasi Sumber Primer**. |
| `CRIT-HEA-ALARM` | Alarm darurat visual | **Tersedia lampu strobo berkedip (*visual beacon strobe*)** yang sinkron dengan sirine darurat. | Permen PUPR No. 14/PRT/M/2017 | Lampiran Bab IV Sistem Keselamatan | Sistem proteksi darurat | Wajib Teknis | **Terverifikasi Sumber Primer**. |

---

### B. Matriks Kriteria dan Indikator Final Terstruktur

| ID Kriteria | Nama Kriteria | Kelompok Kebutuhan | Aspek Terkait | Definisi Kriteria yang Dinilai | Indikator Spesifik & Terukur | Jenis Fasilitas | Metode Pengumpulan Bukti | Jenis Bukti yang Sah | Status Validasi |
|---|---|---|---|---|---|---|---|---|---|
| `CRIT-MOB-RAMP` | Ketersediaan Ramp Akses Pintu Masuk | `MOBILITY` | `MOB-ENT` | Terdapat bidang miring/ramp yang memungkinkan pengguna kursi roda memasuki pintu masuk utama tanpa undakan tangga. | 1. Terdapat jalur ramp permanen di pintu masuk utama.<br>2. Tidak ada anak tangga pemutus sirkulasi.<br>3. Permukaan tidak licin.<br>4. Kemiringan landai (maks $6^\circ$ dalam gedung / $5^\circ$ luar gedung). | Mal & Ruang Terbuka | 1. Penelusuran foto ulasan daring.<br>2. Observasi visual langsung.<br>3. Pengukuran kemiringan (*inclinometer*). | - Foto pintu masuk memperlihatkan ramp dan anak tangga.<br>- Catatan hasil ukur kemiringan. | Terverifikasi Regulasi |
| `CRIT-MOB-GATE` | Pintu Masuk Bebas Rintangan Sempit | `MOBILITY` | `MOB-CLR` | Pintu/gerbang masuk tidak dipasangi tiang pembatas anti-motor rapat (*bollard*) atau pintu putar (*turnstile*) yang memblokir kursi roda. | 1. Lebar bukaan bersih pintu gerbang $\ge 90\text{ cm}$.<br>2. Jika terdapat bollard, celah bebas antar tiang $\ge 90\text{ cm}$.<br>3. Tidak ada pintu putar mekanik tanpa pintu bypass samping. | Ruang Terbuka Publik | 1. Observasi visual gerbang.<br>2. Foto ulasan pengunjung.<br>3. Pengukuran lebar celah tiang. | Foto gerbang utama taman/RTH dengan objek skala pembanding. | Terverifikasi Rekomendasi Standar |
| `CRIT-MOB-ELEV-PHY` | Ketersediaan & Dimensi Fisik Lift | `MOBILITY` | `MOB-VER` | Bangunan bertingkat menyediakan lift penumpang publik yang aktif dan dapat memuat kursi roda. | 1. Lift beroperasi untuk pengunjung publik.<br>2. Lebar bukaan bersih pintu lift $\ge 90\text{ cm}$.<br>3. Dimensi kabin lift $\ge 110\text{ cm} \times 140\text{ cm}$. | Mal | 1. Direktori resmi mal.<br>2. Observasi visual fungsi lift.<br>3. Pengukuran dimensi kabin. | - Foto pintu dan interior kabin lift.<br>- Lembar spesifikasi teknis lift gedung. | Terverifikasi Regulasi |
| `CRIT-MOB-TOILET` | Toilet Khusus Aksesibel | `MOBILITY` | `MOB-SAN` | Tersedia bilik toilet khusus bertanda disabilitas yang dirancang untuk pengguna kursi roda. | 1. Tersedia minimal 1 unit toilet khusus disabilitas.<br>2. Pintu geser atau membuka ke luar.<br>3. Ruang putar kursi roda memadai ($\ge 150\text{ cm}$).<br>4. Kloset duduk dilengkapi pegangan rambat tumpu (*grab bar*). | Mal & Ruang Terbuka | 1. Observasi visual interior toilet.<br>2. Laporan pengguna.<br>3. Pengukuran luas lantai dan grab bar. | Foto interior lengkap toilet (memperlihatkan kloset, grab bar, dan arah ayun pintu). | Terverifikasi Regulasi |
| `CRIT-MOB-PARK` | Petak Parkir Khusus Disabilitas | `MOBILITY` | `MOB-PRK` | Tersedia lot parkir kendaraan khusus bertanda internasional dekat lobi dengan ruang transfer kursi roda. | 1. Petak parkir bertanda marka logo kursi roda.<br>2. Lebar petak $\ge 370\text{ cm}$ (memiliki ruang bebas samping).<br>3. Jarak ke pintu masuk $\le 60\text{ meter}$ tanpa undakan trotoar. | Mal | 1. Foto area parkir mal.<br>2. Penelusuran citra satelit/street view.<br>3. Pengukuran jarak tempuh. | Foto petak parkir dan rute pedestrian penghubung ke lobi. | Terverifikasi Regulasi |
| `CRIT-MOB-PATH` | Jalur Pedestrian Rata & Bebas Hambatan | `MOBILITY` | `MOB-PTH` | Jalur sirkulasi pejalan kaki memiliki permukaan padat keras, rata, dan tidak membahayakan stabilitas roda/kruk. | 1. Permukaan keras (aspal/beton/paving rapat).<br>2. Lebar efektif jalur $\ge 150\text{ cm}$.<br>3. Bebas lubang, batu lepas, becek parah, atau akar pohon melintang. | Ruang Terbuka Publik | 1. Observasi visual rute jalan.<br>2. Video penelusuran jalur.<br>3. Foto kondisi permukaan. | Dokumentasi foto/video permukaan jalur pedestrian di beberapa titik rute. | Terverifikasi Regulasi |
| `CRIT-STA-BENCH` | Ketersediaan Bangku Istirahat Berkala | `STAMINA_PACING` | `STA-RST` | Tersedia tempat duduk istirahat umum tanpa keharusan membeli di sepanjang area sirkulasi publik. | 1. Terdapat bangku istirahat publik di koridor/jalur taman.<br>2. Interval penempatan berkala (tersedia bangku setiap ~50–100 m).<br>3. Bangku dilengkapi sandaran punggung yang kokoh. | Mal & Ruang Terbuka | 1. Observasi koridor sirkulasi.<br>2. Foto ulasan pengunjung.<br>3. Pemetaan titik bangku. | Foto deretan tempat duduk umum di area sirkulasi non-komersial. | Terverifikasi Rekomendasi Standar |
| `CRIT-STA-SHADE` | Peneduh Cuaca Jalur & Tempat Duduk | `STAMINA_PACING` | `STA-SHD` | Area berjalan dan tempat duduk terlindung dari paparan panas terik matahari langsung khas Pekanbaru. | 1. Tempat duduk memiliki kanopi pelindung atau pohon rindang.<br>2. Jalur pedestrian memiliki vegetasi naungan kanopi daun. | Ruang Terbuka Publik | 1. Foto tutupan kanopi vegetasi.<br>2. Observasi visual siang hari.<br>3. Citra satelit kanopi pohon. | Foto kondisi naungan peneduh saat siang hari. | Adaptasi Lapangan |
| `CRIT-VIS-TACTILE` | Jalur Pemandu Taktil Terintegrasi | `VISION` | `VIS-TAC` | Lantai dilengkapi ubin pemandu bertekstur timbul yang menerus dan benar fungsinya menuju area utama. | 1. Tersedia ubin garis (pengarah) dan ubin titik (peringatan).<br>2. Warna kuning cerah kontras dengan lantai sekitar.<br>3. Jalur menerus tanpa terputus tiang, pot, atau tangga terbuka. | Mal & Ruang Terbuka | 1. Observasi jalur pemandu lantai.<br>2. Foto penelusuran rute taktil. | Foto jalur pemandu taktil memperlihatkan kontinuitasnya terhadap lingkungan sekitar. | Terverifikasi Regulasi |
| `CRIT-VIS-CONTRAST` | Keterbacaan Kontras Visual Signage | `VISION` | `VIS-CON` | Papan penunjuk arah fasilitas memiliki kontras warna tajam dan huruf mudah terbaca dari kejauhan. | 1. Teks dan latar belakang memiliki kontras warna tegas (gelap di atas terang atau sebaliknya).<br>2. Ukuran huruf proporsional dan tidak menggunakan font tipis artistik.<br>3. Permukaan papan tidak silau memantulkan lampu sorot. | Mal & Ruang Terbuka | 1. Foto signage penunjuk arah.<br>2. Uji visual perbandingan warna.<br>3. Pengukuran kontras digital (LRV). | Foto tegak lurus signage informasi utama dalam pencahayaan normal. | Terverifikasi Standar |
| `CRIT-VIS-ELEV-SENS` | Fitur Suara & Braille pada Lift | `VISION` & `HEARING` | `VIS-AUD` | Lift dilengkapi tombol huruf Braille timbul dan pengumuman suara panggilan lantai otomatis. | 1. Tombol kontrol kabin dan pendaratan memiliki huruf Braille dan angka timbul.<br>2. Suara otomatis (*talking elevator*) mengumumkan nomor lantai dan arah naik/turun dalam Bahasa Indonesia. | Mal | 1. Observasi visual tombol lift.<br>2. Rekaman video/audio pergerakan lift.<br>3. Wawancara staf mal. | - Foto panel tombol lift (jarak dekat).<br>- Video/rekaman suara penunjuk lantai lift. | Terverifikasi Regulasi |
| `CRIT-COG-WAYFIND` | Peta Lokasi & Piktogram Sederhana | `COGNITIVE` | `COG-WAY` | Denah direktori fasilitas menggunakan piktogram internasional yang intuitif dengan penanda "Anda Di Sini". | 1. Tersedia peta direktori di lobi/persimpangan utama.<br>2. Memiliki penanda posisi saat ini (*You Are Here*).<br>3. Menggunakan simbol grafis piktogram standar (toilet, lift, pintu keluar). | Mal & Ruang Terbuka | 1. Foto papan direktori denah.<br>2. Observasi penempatan peta. | Foto peta denah direktori fasilitas publik. | Terverifikasi Standar |
| `CRIT-HEA-ALARM` | Alarm Evakuasi Darurat Visual (Strobo) | `HEARING` | `HEA-ALM` | Sistem peringatan bahaya gedung dilengkapi lampu strobo visual di ruang publik dan toilet. | 1. Terdapat perangkat fire alarm dengan lampu strobo (*xenon/LED flash*) terpasang di dinding/plafon.<br>2. Strobo terpasang di koridor umum dan di dalam toilet disabilitas. | Mal | 1. Observasi visual fisik perangkat alarm.<br>2. Dokumen spesifikasi K3/Building Management. | Foto perangkat alarm darurat yang menunjukkan komponen lampu strobo visual. | Terverifikasi Regulasi |
| `CRIT-HEA-DISPLAY` | Layar Informasi Operasional Teks | `HEARING` | `HEA-TXT` | Pengumuman suara penting disertai tayangan teks berjalan pada layar display publik. | 1. Tersedia monitor display informasi publik aktif.<br>2. Pengumuman suara penting ditampilkan dalam teks visual berjalan. | Mal | 1. Observasi layar monitor publik.<br>2. Foto tampilan pengumuman teks. | Dokumentasi foto/video layar monitor informasi mal. | Adaptasi Rekomendasi |

---

## 6. Tugas E — Metode Pengumpulan dan Kualitas Bukti

Dalam sistem audit aksesibilitas berbasis bukti (*evidence-based accessibility*), **kualitas sumber informasi menentukan derajat kepastian status**. Sistem tidak boleh menetapkan status `confirmed_yes` atau `confirmed_no` jika metode yang digunakan tidak mampu membuktikan indikator secara objektif.

### Matriks Kualitas Bukti per Kriteria

| ID Kriteria | Metode Pengumpulan Utama | Standar Bukti Minimum yang Sah | Batasan Metode & Risiko Kesalahan | Perlu Verifikasi Lapangan Langsung? |
|---|---|---|---|---|
| `CRIT-MOB-RAMP` | Observasi visual langsung / Foto ulasan daring | Foto tegak lurus memperlihatkan seluruh bentang ramp, titik temu lantai, dan ada tidaknya undakan tangga. | Foto sudut miring (*perspective distortion*) sering mengelabui kecuraman ramp. Tidak bisa memastikan derajat kemiringan presisi tanpa alat ukur. | **Ya (untuk kecuraman presisi)**. Foto daring hanya cukup untuk membuktikan *keberadaan fisik ramp*, bukan kelandaian legal. |
| `CRIT-MOB-GATE` | Observasi visual langsung / Foto gerbang | Foto pintu gerbang dengan orang atau kursi roda melintas, atau pengukuran lebar celah tiang. | Foto daring terkadang hanya memperlihatkan gerbang utama, sementara pintu samping untuk pejalan kaki tidak terpotret. | **Sebagian**. Foto daring beresolusi baik sering kali cukup jika lebar bukaan terlihat jelas terhadap lebar motor/manusia. |
| `CRIT-MOB-ELEV-PHY` | Penelusuran direktori resmi mal / Observasi langsung | Foto pintu lift terbuka memperlihatkan lebar pintu dan luas dalam kabin. | Brosur promosi mal sering mencantumkan "tersedia lift", namun di lapangan lift tersebut kerap dimatikan pada hari kerja atau hanya lift barang tertutup. | **Ya**. Perlu verifikasi bahwa lift aktif beroperasi untuk publik. |
| `CRIT-MOB-TOILET` | Observasi visual langsung / Laporan pengguna terverifikasi | Foto interior lengkap memperlihatkan kloset duduk, pegangan rambat samping (*grab bar*), dan ruang lantai bebas. | Foto pintu luar bertanda logo disabilitas **TIDAK SAH** sebagai bukti toilet aksesibel (sering kali dalamnya toilet jongkok biasa atau gudang alat pembersih). | **Wajib Mutlak**. Foto interior toilet wajib ada sebelum dinyatakan `confirmed_yes`. |
| `CRIT-MOB-PARK` | Foto lapangan / Citra satelit resolusi tinggi | Foto petak parkir memperlihatkan marka logo kursi roda dan ruang bebas samping kendaraan. | Marka parkir di foto lama sering kali sudah pudar atau diserobot kendaraan roda dua di lapangan. | **Sebagian**. Citra satelit dan foto ulasan Google Maps sering memadai jika diambil dalam 6 bulan terakhir. |
| `CRIT-MOB-PATH` | Video penelusuran / Foto rute sirkulasi | Foto rute pedestrian di beberapa titik memperlihatkan kontinuitas paving dan sambungan jalan. | Foto satu titik mulus tidak membuktikan 50 meter berikutnya bebas lubang atau undakan trap. | **Ya**. Memerlukan penelusuran kontinuitas rute. |
| `CRIT-STA-BENCH` | Observasi visual langsung / Foto koridor | Foto koridor sirkulasi umum yang memperlihatkan adanya bangku tempat duduk publik. | Tempat duduk di area restoran/kafe (*food court*) **TIDAK SAH** sebagai bangku istirahat publik gratis. | **Sebagian**. Foto koridor umum mal/taman cukup mudah dijumpai di Google Maps Reviews. |
| `CRIT-STA-SHADE` | Foto lapangan siang hari / Citra satelit | Foto jalur pejalan kaki taman yang memperlihatkan naungan tajuk pohon rindang atau kanopi atap. | Citra satelit musim penghujan dapat berbeda dengan kerimbunan daun saat kemarau terik di Pekanbaru. | **Tidak wajib**. Foto ulasan daring dan citra satelit umumnya cukup representatif. |
| `CRIT-VIS-TACTILE` | Observasi visual langsung rute | Foto ulasan lantai resolusi tinggi memperlihatkan ubin timbul kuning bergaris dan bertitik. | Sering terjadi *guiding block putus* (menabrak pot bunga/tiang) yang tidak terlihat jika foto hanya memotret satu petak lantai. | **Ya**. Memerlukan verifikasi bahwa jalur taktil tidak menabrak rintangan fisik berbahaya. |
| `CRIT-VIS-CONTRAST` | Foto resolusi tinggi tegak lurus | Foto signage arah memperlihatkan warna teks dan latar belakang di bawah pencahayaan normal. | Kamera ponsel dengan mode HDR otomatis dapat mendistorsi kontras visual asli di mata manusia. | **Sebagian**. Foto berkualitas baik cukup untuk evaluasi visual heuristik. |
| `CRIT-VIS-ELEV-SENS` | Rekaman audio/video langsung di dalam lift | Rekaman video lift bergerak yang memperdaratkan tombol braille timbul dan rekaman suara lantai. | Foto diam tidak dapat membuktikan fitur suara *talking elevator* berfungsi. Dokumen brosur lift tidak membuktikan suara aktif dioperasikan. | **Wajib Rekaman/Observasi Langsung**. Tidak dapat dibuktikan hanya dari foto statis eksterior lift. |
| `CRIT-COG-WAYFIND` | Foto papan direktori denah | Foto jelas papan denah fasilitas yang menunjukkan peta skematis dan piktogram standar. | Peta denah yang terlalu kecil atau usang sering kali tidak terbaca resolusi fotonya. | **Sebagian**. Foto papan direktori resolusi tinggi daring memadai. |
| `CRIT-HEA-ALARM` | Observasi langsung fisik perangkat alarm | Foto fisik panel fire alarm dinding yang secara eksplisit memiliki kubah lampu strobo bening bertuliskan *FIRE*. | Detektor asap bulat di plafon sering disalahartikan sebagai alarm strobo. | **Ya**. Memerlukan identifikasi visual perangkat fire alarm spesifik. |
| `CRIT-HEA-DISPLAY` | Foto/video layar publik aktif | Foto layar monitor publik yang sedang menyiarkan pengumuman teks operasional. | Layar TV komersial yang menyiarkan siaran televisi/iklan biasa **TIDAK SAH** sebagai display informasi operasional fasilitas. | **Sebagian**. Foto monitor informasi aktif memadai. |

---

## 7. Tugas F — Penentuan Prioritas Prototipe Berdasarkan 4 Dimensi Objektif

Evaluasi prioritas tidak menggabungkan dimensi secara arbitrer, melainkan membedah:
1. **Dampak Pengguna (*User Impact*)**: Signifikansi terhadap penentuan bisa/tidaknya berkunjung.
2. **Risiko Keselamatan (*Safety Risk*)**: Potensi cedera fisik atau bahaya keselamatan jiwa.
3. **Ketersediaan Bukti (*Evidence Availability*)**: Kemudahan verifikasi via sumber digital/terbuka.
4. **Kelayakan Implementasi (*Implementation Feasibility*)**: Kompleksitas komputasi & evaluasi prototipe.

| ID Kriteria | Dampak Pengguna | Risiko Keselamatan | Ketersediaan Bukti | Kelayakan Implementasi | Rekomendasi Prioritas Prototipe | Alasan Rekomendasi |
|---|---|---|---|---|---|---|
| `CRIT-MOB-RAMP` | **Kritis Mutlak** | **Tinggi** (risiko jatuh/terguling) | Tinggi (foto pintu utama melimpah di Google Maps) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Tanpa ramp, pengguna kursi roda tidak bisa masuk gedung sama sekali. Foto pintu utama sangat mudah diverifikasi daring. |
| `CRIT-MOB-GATE` | **Kritis Mutlak** | **Sedang** | Tinggi (foto gerbang taman melimpah) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Menjadi hambatan paling umum di taman kota Pekanbaru (pemasangan tiang anti-motor sempit). Mudah dinilai. |
| `CRIT-MOB-ELEV-PHY`| **Kritis Mutlak** | **Tinggi** (terjebak antar lantai) | Tinggi (informasi gedung bertingkat terbuka) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Sangat menentukan apakah pengunjung kursi roda dapat mengakses lantai atas mal. |
| `CRIT-MOB-TOILET` | **Kritis Mutlak** | **Tinggi** (cedera transfer kloset) | Sedang (foto interior toilet jarang diunggah publik) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Kebutuhan biologis dasar manusia. Walaupun bukti foto interior lebih langka, kriteria ini wajib ada di sistem dengan status `unknown` jika belum terverifikasi. |
| `CRIT-MOB-PARK` | **Tinggi** | **Sedang** (bahaya tertabrak saat transfer) | Tinggi (foto parkir & satelit tersedia) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Titik awal perjalanan pengguna mobil adaptif. Mudah diobservasi via citra satelit/foto area parkir. |
| `CRIT-MOB-PATH` | **Kritis** | **Tinggi** (roda tersangkut / jatuh) | Tinggi (foto lanskap taman tersedia luas) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Penentu utama mobilitas di RTH/hutan kota (apakah paving rata atau jalan tanah berbatu). |
| `CRIT-STA-BENCH` | **Tinggi** | **Sedang** (kelelahan parah / pingsan) | Tinggi (foto koridor & taman banyak tersedia) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Mewakili kelompok kebutuhan baru `STAMINA_PACING` (lansia & non-kursi roda). Sangat mudah diamati dari foto koridor/taman. |
| `CRIT-STA-SHADE` | **Sedang** | **Sedang** (*heat stroke* panas terik Riau) | Tinggi (foto tutupan kanopi pohon & satelit) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Karakteristik iklim tropis Pekanbaru sangat relevan dengan kenyamanan sirkulasi lansia di taman terbuka. |
| `CRIT-VIS-TACTILE`| **Tinggi** | **Tinggi** (menabrak objek / terperosok) | Sedang (butuh penelusuran rute menerus) | Tinggi | **Prioritas 1 (Inti Prototipe)** | Kebutuhan navigasi mandiri utama penyandang disabilitas netra. |
| `CRIT-VIS-CONTRAST`| **Sedang** | **Rendah** | Tinggi (foto signage banyak tersedia) | Sedang (evaluasi kontras visual semi-kualitatif) | **Prioritas 2 (Pengembangan Menengah)** | Signage penting, namun bukti foto ponsel sering bias pencahayaan otomatis. |
| `CRIT-VIS-ELEV-SENS`| **Tinggi** | **Sedang** (salah lantai / panik terjebak) | Rendah (membutuhkan rekaman video/audio dalam kabin) | Sedang | **Prioritas 2 (Pengembangan Menengah)** | Sangat penting bagi tunanetra, namun sulit diverifikasi daring tanpa survei langsung ke dalam lift mal. |
| `CRIT-COG-WAYFIND`| **Sedang** | **Rendah** | Tinggi (foto direktori mal sering ada) | Tinggi | **Prioritas 2 (Pengembangan Menengah)** | Membantu orientasi mandiri, dapat ditambahkan segera setelah kriteria fisik utama stabil. |
| `CRIT-HEA-ALARM` | **Kritis** | **Sangat Tinggi** (evakuasi kebakaran maut) | Rendah (foto perangkat spesifik strobo jarang dipotret publik) | Sedang | **Prioritas 2 (Pengembangan Menengah)** | Risiko keselamatan jiwa nomor 1 bagi pengunjung tuli, namun data bukti publik sangat minim tanpa konfirmasi pengelola. |
| `CRIT-HEA-DISPLAY`| **Sedang** | **Rendah** | Sedang | Sedang | **Prioritas 2 (Pengembangan Menengah)** | Berguna untuk informasi umum, namun bukan kriteria pemutus kedatangan bagi sebagian besar pengguna. |

---

## 8. Tugas G — Rekomendasi Struktur Data & Arsitektur Domain (Persiapan Sprint 5)

Evaluasi terhadap model data eksisting (`src/domain/models.js`, `src/domain/constants.js`, dan `src/domain/assessmentEngine.js`) membuktikan bahwa arsitektur fondasi yang dibangun pada Sprint 1–3 **sangat kokoh dan mampu menampung taksonomi final tanpa refaktor besar yang merusak (*breaking changes*)**.

### A. Rekomendasi Pembaruan `NEED_GROUP` (`src/domain/constants.js`)
Perluas objek enum statis dengan menambahkan `STAMINA_PACING` untuk implementasi Sprint 5, dan siapkan definisi konseptual untuk `SENSORY_ENV` dan `COMMUNICATION` pada sprint lanjutan:

```javascript
export const NEED_GROUP = Object.freeze({
  MOBILITY: 'mobility',
  STAMINA_PACING: 'stamina_pacing',
  VISION: 'vision',
  HEARING: 'hearing',
  COGNITIVE: 'cognitive',
  SENSORY_ENV: 'sensory_env',        // Tahap lanjutan
  COMMUNICATION: 'communication',    // Tahap lanjutan
})

export const NEED_GROUP_LABELS = Object.freeze({
  [NEED_GROUP.MOBILITY]: 'Mobilitas Fisik',
  [NEED_GROUP.STAMINA_PACING]: 'Daya Tahan & Istirahat',
  [NEED_GROUP.VISION]: 'Penglihatan & Taktil',
  [NEED_GROUP.HEARING]: 'Pendengaran & Visual',
  [NEED_GROUP.COGNITIVE]: 'Orientasi Spasial & Navigasi',
  [NEED_GROUP.SENSORY_ENV]: 'Lingkungan Sensorik',
  [NEED_GROUP.COMMUNICATION]: 'Akses Komunikasi Layanan',
})
```

### B. Rekomendasi Skema `AccessibilityCriterion` yang Diperkaya
Tanpa merusak antarmuka factory function `createAccessibilityCriterion`, tambahkan properti metadata opsional:
1. `aspectId`: Mengaitkan kriteria ke ID aspek taksonomi (misal: `'MOB-ENT'`, `'STA-RST'`).
2. `indicators`: Array string indikator spesifik yang dinilai (memudahkan transparansi pengguna).
3. `facilityComponent`: Komponen zona fasilitas (misal: `ENTRANCE`, `CIRCULATION`, `SANITATION`, `PARKING`).

Contoh Konseptual:
```javascript
createAccessibilityCriterion({
  id: 'crit_mall_entrance_ramp',
  aspectId: 'MOB-ENT',
  facilityComponent: 'ENTRANCE',
  name: 'Ramp Akses Pintu Masuk Utama',
  description: 'Tersedia bidang miring/ramp permanen bebas undakan tangga untuk memasuki lobi utama.',
  needGroups: [NEED_GROUP.MOBILITY],
  applicableFacilityTypes: [FACILITY_TYPE.MALL, FACILITY_TYPE.PUBLIC_OPEN_SPACE],
  indicators: [
    'Terdapat jalur ramp di akses masuk utama tanpa anak tangga pemutus',
    'Permukaan kesat tidak licin',
    'Kelandaian landai (kemiringan maksimal 6° dalam gedung / 5° luar gedung)',
  ],
  evidenceGuidance: 'Foto pintu masuk memperlihatkan seluruh bentang ramp dan pertemuan lantai.',
  reference: 'Permen PUPR No. 14/PRT/M/2017 Lampiran Bab II Bagian B.2.c',
  devStatus: CRITERION_DEV_STATUS.ACCEPTED, // atau REVIEW
})
```

### C. Kompatibilitas dengan Mesin Penilaian (`assessmentEngine.js`)
- Fungsi `getRelevantCriteria(criteria, userProfile, facilityType)` **tidak perlu diubah sama sekali**. Fungsi ini sudah menggunakan logika irisan array `needGroups` dan `applicableFacilityTypes`.
- Fungsi `summarizeAssessment` tetap bekerja sempurna dengan kriteria kritis yang dipetakan pada `AssessmentRule`.

---

## 9. Keterbatasan Riset dan Hal yang Memerlukan Validasi Lanjutan

> [!IMPORTANT]
> **Pernyataan Batas Validasi Normatif & Lapangan:**
> 1. **Keterbatasan Akses Standar Berbayar**: Standar **ISO 21542:2021** dan **BSI PAS 6463:2022** merupakan dokumen berbayar berhak cipta (*copyrighted standards*). Riset pada sprint ini menyandarkan verifikasi pada klausul publik, ringkasan teknis World Bank/GFDRR, serta publikasi jurnal ilmiah peer-reviewed yang merujuk standar tersebut. Angka teknis wajib yang dijadikan acuan hukum utama aplikasi ini adalah **Permen PUPR No. 14/PRT/M/2017** yang berstatus hukum positif terbuka dan sah di Indonesia.
> 2. **Ketiadaan Konsultasi Komunitas Nyata**: Taksonomi ini dirumuskan berdasarkan analisis literatur regulasi dan prinsip rekayasa sistem. **Belum pernah dilakukan uji coba langsung (*user study*) atau wawancara mendalam dengan komunitas penyandang disabilitas di Kota Pekanbaru** (seperti Pertuni Pekanbaru, Gerkatin Riau, atau HWDI).
> 3. **Variasi Kondisi Riil Lapangan**: Kondisi cuaca panas ekstrem Pekanbaru (rata-rata suhu siang hari $33^\circ–35^\circ\text{C}$) menjadikan kriteria peneduh (`CRIT-STA-SHADE`) sangat relevan bagi ruang terbuka hijau (RTH Kaca Mayang, RTH Tunjuk Ajar), namun belum memiliki baku mutu regulasi nasional formal selain panduan adaptif arsitektur tropis.

---

## 10. Keputusan yang Sudah Dikunci vs Keputusan yang Masih Terbuka

### Keputusan yang Dikunci (Locked Decisions):
1. **Pemisahan Kriteria Lift**: Kriteria lift eksisting dipecah menjadi *Dimensi Fisik Lift* (`CRIT-MOB-ELEV-PHY`) dan *Fitur Sensorik Suara/Braille Lift* (`CRIT-VIS-ELEV-SENS`).
2. **Pemisahan Kriteria Signage**: Kriteria signage dipecah menjadi *Kontras Keterbacaan Visual* (`CRIT-VIS-CONTRAST`) dan *Peta/Piktogram Intuitif* (`CRIT-COG-WAYFIND`).
3. **Koreksi Angka Kemiringan Ramp**: Mengoreksi angka kemiringan ramp regulasi nasional menjadi **maksimal $6^\circ$ (1:10) di dalam gedung dan maksimal $5^\circ$ (1:12) di luar gedung** (merujuk Permen PUPR 14/2017).
4. **Koreksi Dimensi Kabin Lift**: Mengoreksi dimensi kabin lift regulasi nasional menjadi **lebar minimal 110 cm dan panjang/kedalaman minimal 140 cm** dengan bukaan bersih pintu minimal 90 cm.
5. **Koreksi Dimensi Toilet**: Mengunci ukuran baku ruang toilet disabilitas pada **minimal $152,5 \times 227,5\text{ cm}$** dengan pintu geser/buka keluar.
6. **Penambahan Kelompok `STAMINA_PACING`**: Menetapkan kelompok kebutuhan daya tahan fisik dan istirahat ke dalam taksonomi inti prototipe dengan kriteria bangku istirahat (`CRIT-STA-BENCH`).

### Keputusan yang Masih Terbuka (Open Decisions):
1. **Metode Penilaian Derajat Ramp dari Foto Daring**: Apakah foto ulasan pengguna daring tanpa objek pembanding terukur boleh menetapkan status `confirmed_yes`, atau harus dibatasi pada status `unknown (perlu konfirmasi lapangan)` jika sudut kemiringan meragukan? *(Rekomendasi tim teknis: Jika ada foto jelas ramp landai dengan handrail standar, status `confirmed_yes` dapat diberikan dengan catatan keterbatasan bukti daring)*.
2. **Skema Pelabelan Kelompok Sensorik & Komunikasi**: Kapan waktu terbaik mengaktifkan kelompok `SENSORY_ENV` dan `COMMUNICATION` pada antarmuka pengguna aplikasi (direkomendasikan setelah data fasilitas tahap awal diverifikasi lapangan).

---

## 11. Rekomendasi Implementasi Konkret untuk Sprint 5

Berdasarkan keputusan yang telah dikunci di atas, Sprint 5 dapat langsung mengeksekusi implementasi kode berikut secara aman:

1. **Pembaruan Konstanta Domain (`src/domain/constants.js`)**:
   - Menambahkan `STAMINA_PACING` ke `NEED_GROUP`, `NEED_GROUP_LABELS`, dan `NEED_GROUP_DESCRIPTIONS`.
2. **Penyusunan Ulang Kriteria Awal (`src/data/initialCriteria.js`)**:
   - Menerapkan pemisahan kriteria lift (`crit_mall_elevator_physical` dan `crit_mall_elevator_sensory`).
   - Menerapkan pemisahan signage (`crit_signage_visual_contrast` dan `crit_signage_pictogram_map`).
   - Menambahkan kriteria tempat duduk istirahat (`crit_circulation_rest_benches`).
   - Memperbarui deskripsi indikator toilet, parkir, dan ramp sesuai angka teknis Permen PUPR 14/2017.
3. **Penyelarasan Aturan Asesmen (`src/data/initialRules.js`)**:
   - Menyelaraskan ID kriteria baru dan menetapkan kriteria kritis untuk `STAMINA_PACING` (misalnya ketersediaan tempat duduk).
4. **Pembaruan Pengujian Otomatis (`src/tests/`)**:
   - Menyesuaikan fixture pengujian sintetis (`syntheticTestData.js`) dan test suite agar memverifikasi kriteria baru tanpa merusak 40 test case eksisting.
5. **Pembaruan Antarmuka (`src/pages/`)**:
   - Memastikan tombol filter profil kebutuhan di Beranda, Halaman Fasilitas, dan Detail Fasilitas menampilkan tombol pilihan "Daya Tahan & Istirahat" secara responsif dan estetis.

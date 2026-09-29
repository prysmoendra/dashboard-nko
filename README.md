# Dashboard NKO

Dashboard untuk menampilkan dan menganalisis data sebagai bagian dari project Data Science Semester 7.

## Deskripsi

Project ini merupakan aplikasi dashboard berbasis web yang digunakan untuk menyajikan data dalam bentuk tabel, grafik, dan visualisasi interaktif. Dashboard ini dibuat untuk membantu pengguna memahami pola dan informasi penting dari data yang dianalisis.

## Tujuan

Tujuan dari project ini adalah:

- Mengolah dan menyajikan data secara lebih mudah dipahami.
- Menampilkan visualisasi data secara interaktif.
- Membantu proses analisis dan pengambilan keputusan berdasarkan data.
- Menerapkan konsep data science dalam aplikasi berbasis web.

## Fitur

- Menampilkan ringkasan data.
- Visualisasi data dalam bentuk grafik.
- Filter data berdasarkan kategori atau periode tertentu.
- Tabel data yang interaktif.
- Tampilan dashboard yang responsif.

## Teknologi yang Digunakan

- TypeScript
- [React/Next.js/Vite — sesuaikan dengan project]
- [Nama library chart — misalnya Recharts atau Chart.js]
- [Nama database/API jika digunakan]
- CSS atau framework UI yang digunakan

## Screenshot
## Page Login Dashboard
<img width="1665" height="1001" alt="Screenshot 2026-09-30 at 02 04 43" src="https://github.com/user-attachments/assets/ac14bb63-9312-44fa-a698-c31b4099d942" />
## Page Home Admin Dashboard
<img width="1665" height="1001" alt="Screenshot 2026-09-30 at 02 04 59" src="https://github.com/user-attachments/assets/792d2b65-dcf7-47e8-8dad-16b834dceb53" />
## Page Home Kepala Bidang Dashboard
<img width="1665" height="1001" alt="Screenshot 2026-09-30 at 02 05 15" src="https://github.com/user-attachments/assets/8a52b560-8355-4528-bd42-9c7a7cb21c0f" />
## Page Home Asisten Kepala Bidang Dashboard
<img width="1665" height="1001" alt="Screenshot 2026-09-30 at 02 06 08" src="https://github.com/user-attachments/assets/7810e439-7405-430b-980c-fdf46d47d126" />
## Page Home Pegawai Dashboard
<img width="1665" height="1001" alt="Screenshot 2026-09-30 at 02 06 38" src="https://github.com/user-attachments/assets/fd34521b-7bc0-4e20-8dbd-e9be346ba5e6" />


## Persyaratan

Pastikan sudah menginstal:

- Node.js
- npm atau package manager lainnya
- Git

## Instalasi

Clone repository:

```bash
git clone https://github.com/prysmoendra/dashboard-nko.git
cd dashboard-nko
```

Install dependencies:

```bash
npm install
```

## Konfigurasi Environment

Jika project menggunakan environment variable, buat file `.env`:

```env
VITE_API_URL=alamat_api
```

Sesuaikan nama variable dengan konfigurasi yang digunakan di dalam project.

## Menjalankan Project

Untuk menjalankan project dalam mode development:

```bash
npm run dev
```

Kemudian buka alamat yang ditampilkan di terminal, biasanya:

```text
http://localhost:5173
```

## Build untuk Production

```bash
npm run build
```

Untuk menjalankan hasil build:

```bash
npm run preview
```

## Struktur Folder

```text
dashboard-nko/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── App.tsx
├── .env.example
├── package.json
└── README.md
```

Sesuaikan struktur di atas dengan folder yang benar-benar ada di project.

## Status Project

Project ini dibuat untuk memenuhi tugas Data Science Programming Semester 7.

## Lisensi

Project ini dibuat untuk keperluan akademik.

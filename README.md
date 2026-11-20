# To-Do Life Dashboard

**RevoU CodingCamp — Final Project**
Repository: `CodingCamp-16November26-WanNaufalNafis`

---

## 📋 Deskripsi Proyek

To-Do Life Dashboard adalah aplikasi web personal berbasis browser yang dirancang untuk membantu pengelolaan tugas harian, menyimpan tautan favorit, dan menjaga fokus kerja menggunakan Pomodoro timer. Seluruh data disimpan di browser menggunakan Local Storage — tidak memerlukan backend atau koneksi internet setelah halaman dimuat.

---

## ✨ Fitur Utama (MVP)

### 🕐 Greeting, Jam & Tanggal
- Sapaan dinamis berdasarkan waktu lokal:
  - **05:00–11:59** → Good morning
  - **12:00–17:59** → Good afternoon
  - **18:00–04:59** → Good evening
- Jam digital format **24 jam (HH:MM:SS)**, diperbarui setiap detik
- Tanggal dalam **format Indonesia** (contoh: *Kamis, 19 November 2026*)

### ✅ To-Do List
- **Tambah** tugas baru
- **Edit** tugas secara inline (klik ikon pensil)
- **Tandai selesai** menggunakan checkbox
- **Hapus** tugas
- **Filter** tampilan: All / Active / Completed
- Semua tugas tersimpan di Local Storage

### 🔗 Quick Links
- **Tambah** tautan dengan nama dan URL
- **Buka** tautan di tab baru secara langsung
- **Hapus** tautan
- URL otomatis dilengkapi `https://` jika tidak diisi
- Semua tautan tersimpan di Local Storage

### ⏱️ Focus Timer
- Hitungan mundur **25 menit** (Pomodoro default)
- Tombol **Start**, **Pause**, dan **Reset**
- Tampilan format **MM:SS**
- Berhenti otomatis dan terkunci saat mencapai **00:00**

---

## 🎯 Tantangan yang Dipilih (3 dari 5)

| # | Tantangan | Implementasi |
|---|---|---|
| 1 | **Light / Dark Mode** | Tombol toggle di header; preferensi tersimpan di Local Storage |
| 2 | **Custom Name in Greeting** | Input nama di header; nama tersimpan dan ditampilkan saat sapaan |
| 3 | **Prevent Duplicate Tasks** | Pengecekan case-insensitive saat menambah dan mengedit tugas |

---

## 🛠️ Teknologi

| Teknologi | Keterangan |
|---|---|
| HTML5 | Struktur halaman (`index.html`) |
| CSS3 | Styling dengan CSS Custom Properties untuk theming (`css/style.css`) |
| Vanilla JavaScript | Seluruh logika aplikasi (`js/script.js`) |
| Web API: `localStorage` | Penyimpanan data persisten di browser |
| Web API: `Intl.DateTimeFormat` | Format tanggal dalam bahasa Indonesia |
| Web API: `setInterval` | Jam digital dan Focus Timer |

> **Tidak menggunakan** framework (React, Vue, Angular), library eksternal (jQuery), backend, atau database server.

---

## 📁 Struktur Folder

```
CodingCamp-16November26-WanNaufalNafis/
├── index.html          ← Halaman utama (entry point)
├── css/
│   └── style.css       ← Satu file CSS (light & dark theme)
├── js/
│   └── script.js       ← Satu file JavaScript
├── .kiro/              ← Konfigurasi Kiro IDE & spesifikasi proyek
│   ├── steering/
│   │   └── project-standards.md
│   └── specs/
│       └── features.md
├── .gitignore
└── README.md
```

---

## 🚀 Cara Menjalankan

### Lokal
1. Clone atau download repository ini.
2. Buka file `index.html` langsung di browser (double-click atau drag ke browser).
3. Tidak perlu instalasi, server lokal, atau koneksi internet.

### GitHub Pages
Akses langsung melalui URL GitHub Pages yang telah dikonfigurasi pada repository.

---

## 💾 Data yang Disimpan (Local Storage)

| Key | Tipe | Isi |
|---|---|---|
| `tasks` | JSON array | Daftar tugas: `[{id, text, completed}]` |
| `links` | JSON array | Daftar tautan: `[{id, name, url}]` |
| `theme` | string | Tema aktif: `"light"` atau `"dark"` |
| `userName` | string | Nama pengguna untuk sapaan |

---

## 👤 Informasi Peserta

| | |
|---|---|
| **Nama** | Wan Naufal Nafis |
| **Program** | RevoU CodingCamp |
| **Batch mulai** | 16 November 2026 |

---

*Dibuat dengan ❤️ untuk RevoU CodingCamp*

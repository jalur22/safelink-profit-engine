SAFELINK PROFIT ENGINE
======================

Paket ini berisi aplikasi web statis sederhana untuk mengelola tautan promosi.

FILE
----
- index.html : struktur halaman aplikasi
- style.css  : tampilan dan tata letak
- app.js     : fungsi tambah/edit/hapus/cari/ekspor dan pembuat URL UTM
- README.txt : petunjuk ini

CARA MEMASANG DI GITHUB
-----------------------
1. Buat repositori GitHub bernama: safelink-profit-engine
2. Pilih Add file > Upload files.
3. Ekstrak ZIP ini di perangkat Anda.
4. Unggah KEEMPAT FILE di atas ke direktori utama (root) repositori.
   Jangan unggah file ZIP sebagai satu file.
5. Tekan Commit changes.
6. Buka Settings > Pages.
7. Pada Build and deployment, pilih Deploy from a branch.
8. Pilih Branch: main dan Folder: /(root), lalu Save.
9. Tunggu proses penerbitan selesai. Alamat situs biasanya:
   https://jalur22.github.io/safelink-profit-engine/

FITUR
-----
- Menambah, mengubah, dan menghapus tautan
- Kategori, pencarian, dan filter
- Menyalin atau membuka URL
- Ekspor daftar tautan ke CSV
- Membuat URL dengan parameter UTM

CATATAN PENTING
---------------
- Data disimpan di localStorage browser/perangkat yang digunakan.
- Data tidak otomatis tersinkron ke perangkat lain atau pengguna lain.
- Hapus data browser dapat menghapus data aplikasi. Ekspor CSV secara berkala.
- Versi ini tidak menyediakan akun/login, database online, sistem redirect,
  pelacakan klik, atau laporan pendapatan.
- Parameter UTM hanya menambahkan label kampanye pada URL. Pengukuran
  kunjungan memerlukan layanan analitik pada situs tujuan.
- Jangan menyimpan kata sandi, data pribadi sensitif, atau informasi rahasia
  di aplikasi ini.

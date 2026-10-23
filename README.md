LT II REGOL 2026 — SISTEM PENILAIAN (PILIHAN B)

Isi folder:
- index.html       : menu utama memilih mata lomba
- lomba/A1.html    : halaman penilaian A1
- lomba/A2.html    : halaman penilaian A2
- penilaian.js     : konfigurasi terpusat kriteria, bobot, checklist, potongan, dan entry ID Google Forms
- app.js           : mesin antarmuka, perhitungan, dan pengiriman
- style.css        : tampilan bersama

PENTING:
1. Simpan seluruh struktur folder; jangan pindahkan A1.html/A2.html keluar dari folder lomba.
2. Untuk GitHub Pages, unggah folder beserta isinya ke repository dengan struktur yang sama.
3. A1 diset menjadi total 100 karena Sikap dan etika 5 + Ketepatan 25 + Kelengkapan 25 + Kerapian 25 + Kebersihan 10 + Kekompakan 10.
4. A2 total 100 sesuai konfigurasi yang diberikan.
5. Daftar potongan ketepatan adalah simulasi awal dan harus dicocokkan dengan juknis resmi.
6. Pengiriman Google Forms menggunakan POST ke formResponse. Browser tidak dapat memastikan respons tersimpan karena batasan lintas situs; selalu periksa tab Respons.
7. File ini merupakan paket awal untuk diuji, bukan jaminan bahwa Google Forms menerima seluruh isian pada form aktual. Lakukan pengiriman uji terlebih dahulu.
8. Menambah mata lomba baru:
   a. Tambahkan konfigurasi di COMPETITIONS dalam penilaian.js (duplikasi pola A2, termasuk criteria, checklist, deductionItems, scoring).
   b. Buat lomba/A3.html dengan menyalin A2.html, lalu ganti data-competition menjadi A3 dan sesuaikan jalur relatif.
   c. Tambahkan kartu tautan A3 pada index.html.

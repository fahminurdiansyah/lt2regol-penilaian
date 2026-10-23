/**
 * KONFIGURASI TERPUSAT PENILAIAN LT II REGOL 2026
 * Edit bobot, daftar butir, dan potongan di file ini.
 * Semua halaman lomba membaca konfigurasi yang sama.
 */
(function (root) {
  "use strict";

  const FORM_RESPONSE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe1qSFeu5SvMp6JdAMDk66kyAQmJtwdHMnywVaml42oQMkPBw/formResponse";

  const FORM_ENTRIES = {
    mataLomba: "511078072",
    namaRegu: "1652413056",
    criteria: {
      sikapEtika: "1102203745",
      kedisiplinan: "308553817",
      dayaTanggap: "473179287",
      ketepatan: "646836897",
      kesesuaianProsedur: "1748328363",
      pengetahuanPemahaman: "1374223098",
      akurasi: "1816097833",
      ketelitian: "616625118",
      kelengkapan: "409883208",
      kerapian: "192813140",
      kebersihan: "1486708454",
      kualitasHasil: "1569268478",
      fungsiKegunaan: "274155439",
      keselamatan: "1328534777",
      kreativitas: "1631170157",
      kekompakan: "1597175075",
      kerjaSama: "1345773215",
      kecepatanEfisiensiWaktu: "1817279958",
      pengelolaanSumberdaya: "806863660",
      komunikasi: "1550933585"
    }
  };

  const CRITERIA = [
    { key:"sikapEtika", label:"Sikap dan etika" },
    { key:"kedisiplinan", label:"Kedisiplinan" },
    { key:"dayaTanggap", label:"Daya tanggap" },
    { key:"ketepatan", label:"Ketepatan", mode:"deduction" },
    { key:"kesesuaianProsedur", label:"Kesesuaian Prosedur" },
    { key:"pengetahuanPemahaman", label:"Pengetahuan/pemahaman" },
    { key:"akurasi", label:"Akurasi" },
    { key:"ketelitian", label:"Ketelitian" },
    { key:"kelengkapan", label:"Kelengkapan", mode:"checklist" },
    { key:"kerapian", label:"Kerapian" },
    { key:"kebersihan", label:"Kebersihan" },
    { key:"kualitasHasil", label:"Kualitas hasil" },
    { key:"fungsiKegunaan", label:"Fungsi/kegunaan" },
    { key:"keselamatan", label:"Keselamatan" },
    { key:"kreativitas", label:"Kreativitas" },
    { key:"kekompakan", label:"Kekompakan" },
    { key:"kerjaSama", label:"Kerja sama" },
    { key:"kecepatanEfisiensiWaktu", label:"Kecepatan/efisiensi waktu" },
    { key:"pengelolaanSumberdaya", label:"Pengelolaan sumberdaya" },
    { key:"komunikasi", label:"Komunikasi" }
  ];

  const A1_CHECKLIST = [
    "Tas",
    "Seragam Pramuka lengkap",
    "Pakaian olahraga atau pakaian kegiatan",
    "Pakaian ganti dan pakaian tidur",
    "Pakaian dalam",
    "Jaket atau pakaian hangat",
    "Sepatu dan sandal",
    "Jas hujan atau ponco",
    "Alat ibadah",
    "Alat mandi dan handuk",
    "Obat-obatan pribadi",
    "Alat tulis dan buku saku Pramuka",
    "Alat tidur (matras dan selimut atau sleeping bag)",
    "Alat makan",
    "Botol minum",
    "Bekal makanan sesuai ketentuan panitia",
    "Senter",
    "Kantong pakaian kotor dan kantong sampah"
  ];

  const A2_CHECKLIST = [
    "Standarisasi format dokumen",
    "Biodata anggota regu / daftar induk anggota regu",
    "Sejarah regu",
    "Log book regu",
    "Daftar hadir latihan",
    "Inventaris regu",
    "Iuran regu",
    "Kas/tabungan regu",
    "Notulensi regu (format sismintir)",
    "Buku SKU",
    "Buku SKK",
    "Perencanaan tapak perkemahan (rincian diuraikan)"
  ];

  const COMPETITIONS = {
    A1: {
      label: "A1",
      title: "Pemeriksaan Perlengkapan",
      description: "Penilaian perlengkapan individu/regu.",
      criteria: {
        sikapEtika: 5, kedisiplinan: 0, dayaTanggap: 0,
        ketepatan: 25, kesesuaianProsedur: 0,
        pengetahuanPemahaman: 0, akurasi: 0, ketelitian: 0,
        kelengkapan: 25, kerapian: 25, kebersihan: 10,
        kualitasHasil: 0, fungsiKegunaan: 0, keselamatan: 0,
        kreativitas: 0, kekompakan: 10, kerjaSama: 0,
        kecepatanEfisiensiWaktu: 0, pengelolaanSumberdaya: 0,
        komunikasi: 0
      },
      checklist: A1_CHECKLIST,
      deductionItems: [
        { id:"danger", label:"Membawa barang berbahaya", deduction:10 },
        { id:"prohibited", label:"Membawa barang yang dilarang", deduction:5 },
        { id:"electronics", label:"Membawa perangkat elektronik tanpa izin", deduction:3 },
        { id:"provisions", label:"Bekal tidak sesuai ketentuan", deduction:3 },
        { id:"excess", label:"Membawa barang tidak diperlukan/berlebihan", deduction:2 }
      ],
      scoring: {
        ketepatan: "Nilai dimulai dari bobot maksimal, lalu dikurangi sesuai temuan.",
        kelengkapan: "Nilai dihitung proporsional berdasarkan butir yang dicentang."
      }
    },
    A2: {
      label: "A2",
      title: "Administrasi Regu",
      description: "Penilaian kelengkapan dan mutu administrasi regu.",
      criteria: {
        sikapEtika: 0, kedisiplinan: 0, dayaTanggap: 0,
        ketepatan: 30, kesesuaianProsedur: 0,
        pengetahuanPemahaman: 0, akurasi: 0, ketelitian: 0,
        kelengkapan: 40, kerapian: 15, kebersihan: 0,
        kualitasHasil: 0, fungsiKegunaan: 0, keselamatan: 0,
        kreativitas: 15, kekompakan: 0, kerjaSama: 0,
        kecepatanEfisiensiWaktu: 0, pengelolaanSumberdaya: 0,
        komunikasi: 0
      },
      checklist: A2_CHECKLIST,
      deductionItems: [
        { id:"empty", label:"Berkas kosong atau hanya berupa sampul", deduction:5 },
        { id:"mismatch", label:"Isi tidak sesuai dengan judul berkas", deduction:5 },
        { id:"cover", label:"Buku lain hanya diganti sampul/cover", deduction:10 },
        { id:"illegible", label:"Isi tidak terbaca atau bagian penting tidak tersedia", deduction:3 },
        { id:"format", label:"Format dokumen tidak mengikuti ketentuan", deduction:2 }
      ],
      scoring: {
        ketepatan: "Nilai dimulai dari bobot maksimal, lalu dikurangi sesuai temuan.",
        kelengkapan: "Nilai dihitung proporsional berdasarkan butir dokumen yang tersedia."
      }
    }

    // Untuk menambah A3, duplikasi struktur A2 di atas, beri koma setelah
    // blok A2, lalu ubah kode, judul, bobot, checklist, dan deductionItems.
  };

  function getCompetition(code) {
    const key = String(code || "").toUpperCase();
    if (!COMPETITIONS[key]) throw new Error("Mata lomba belum dikonfigurasi: " + key);
    return COMPETITIONS[key];
  }

  function getActiveCriteria(code) {
    const c = getCompetition(code);
    return CRITERIA
      .filter(item => Number(c.criteria[item.key] || 0) > 0)
      .map(item => ({
        ...item,
        entryId: FORM_ENTRIES.criteria[item.key],
        maxScore: Number(c.criteria[item.key])
      }));
  }

  function getTotalMax(code) {
    return getActiveCriteria(code).reduce((sum, item) => sum + item.maxScore, 0);
  }

  function buildFormPayload(code, teamName, values) {
    const c = getCompetition(code);
    const vals = values || {};
    const payload = {};
    payload["entry." + FORM_ENTRIES.mataLomba] = c.label;
    payload["entry." + FORM_ENTRIES.namaRegu] = teamName || "";
    CRITERIA.forEach(item => {
      const max = Number(c.criteria[item.key] || 0);
      let value = max > 0 ? Number(vals[item.key] || 0) : 0;
      if (!Number.isFinite(value)) value = 0;
      payload["entry." + FORM_ENTRIES.criteria[item.key]] =
        max > 0 ? Math.max(0, Math.min(max, value)) : 0;
    });
    return payload;
  }

  root.PenilaianConfig = {
    FORM_RESPONSE_URL, FORM_ENTRIES, CRITERIA, COMPETITIONS,
    getCompetition, getActiveCriteria, getTotalMax, buildFormPayload
  };
})(window);

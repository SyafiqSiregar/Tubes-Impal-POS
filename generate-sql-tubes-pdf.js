import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const LOGO_PATH = path.resolve('raya-coffe-logo.png');
const HTML_OUTPUT = path.resolve('docs/Laporan_Tugas_SQL_TUBES_Raya_Koffie.html');
const PDF_OUTPUT = path.resolve('docs/Laporan_Tugas_SQL_TUBES_Raya_Koffie.pdf');

function getBase64Image(filePath) {
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).slice(1);
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:image/${ext === 'png' ? 'png' : 'jpeg'};base64,${data}`;
  }
  return '';
}

const ERD_PATH = path.resolve('docs/erd_diagram.png');

const logoBase64 = getBase64Image(LOGO_PATH);
const erdBase64 = getBase64Image(ERD_PATH);

const htmlTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Tugas Kelompok Basis Data - POS Raya Koffie & 439 Carwash</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      --primary: #0F172A;
      --accent: #D95A2B;
      --accent-blue: #0284C7;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --border-color: #CBD5E1;
      --bg-card: #F8FAFC;
      --code-bg: #0F172A;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text-main);
      background-color: #FFFFFF;
      font-size: 13px;
      line-height: 1.6;
    }

    @page {
      size: A4;
      margin: 15mm 15mm 18mm 15mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 10px;
        color: #94A3B8;
      }
    }

    .page-break {
      page-break-before: always;
    }

    /* COVER PAGE */
    .cover-container {
      min-height: 920px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 3px double #CBD5E1;
      border-radius: 12px;
      padding: 45px 35px;
      text-align: center;
      background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
    }

    .cover-badge {
      display: inline-block;
      background: #EFF6FF;
      color: #1D4ED8;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid #BFDBFE;
      margin-bottom: 25px;
    }

    .cover-title {
      font-size: 26px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.3;
      margin-bottom: 12px;
    }

    .cover-subtitle {
      font-size: 16px;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 20px;
    }

    .cover-desc {
      font-size: 13px;
      color: var(--text-muted);
      max-width: 520px;
      margin: 0 auto 30px auto;
    }

    .cover-logo-wrapper {
      margin: 20px 0;
    }

    .cover-logo {
      height: 110px;
      object-fit: contain;
    }

    .cover-meta-box {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 20px 25px;
      text-align: left;
      max-width: 480px;
      margin: 0 auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .meta-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .meta-row:last-child {
      margin-bottom: 0;
    }

    .meta-label {
      width: 140px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .meta-value {
      font-weight: 700;
      color: var(--text-main);
    }

    .cover-footer {
      font-size: 11px;
      color: #94A3B8;
      border-top: 1px solid #E2E8F0;
      padding-top: 15px;
      margin-top: 25px;
    }

    /* SECTION STYLES */
    .section-header {
      border-bottom: 2px solid var(--accent);
      padding-bottom: 8px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-badge {
      background: #FEF3C7;
      color: #B45309;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      border: 1px solid #FDE68A;
    }

    h3 {
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      margin: 16px 0 8px 0;
    }

    p {
      margin-bottom: 12px;
      color: #334155;
      text-align: justify;
    }

    /* CALLOUT BOX */
    .alert-box {
      background: #F0FDF4;
      border-left: 4px solid #16A34A;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 12px;
      color: #166534;
    }

    .alert-box strong {
      display: block;
      margin-bottom: 4px;
    }

    /* TABLES */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 11.5px;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #CBD5E1;
      padding: 6px 10px;
      text-align: left;
    }

    table.data-table th {
      background-color: #F1F5F9;
      color: #0F172A;
      font-weight: 700;
    }

    table.data-table tr:nth-child(even) td {
      background-color: #F8FAFC;
    }

    /* CODE BLOCKS */
    .sql-block {
      background: var(--code-bg);
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      line-height: 1.5;
      color: #E2E8F0;
      overflow-x: auto;
      border: 1px solid #334155;
    }

    .sql-keyword { color: #38BDF8; font-weight: 600; }
    .sql-type { color: #F472B6; }
    .sql-str { color: #A3E635; }
    .sql-num { color: #FBBF24; }
    .sql-comment { color: #64748B; font-style: italic; }
    .sql-func { color: #C084FC; }

    /* SUMMARY CARDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .card-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .badge-pill {
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 8px;
      font-weight: 700;
    }
    .badge-pk { background: #FEF08A; color: #854D0E; }
    .badge-fk { background: #BAE6FD; color: #0369A1; }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover-container">
    <div>
      <div class="cover-badge">Laporan Resmi Tugas Kelompok Basis Data</div>
      <h1 class="cover-title">PERANCANGAN BASIS DATA RELASIONAL<br>POINT OF SALE (POS) HYBRID</h1>
      <div class="cover-subtitle">STUDI KASUS: RAYA KOFFIE & 439 CARWASH</div>
      <p class="cover-desc">
        Implementasi sintaks SQL Data Definition Language (DDL) dan Data Manipulation Language (DML) 
        komprehensif dengan tingkat kompleksitas tinggi (Standar Nilai A).
      </p>

      <div class="cover-logo-wrapper">
        ${logoBase64 ? `<img src="${logoBase64}" class="cover-logo" alt="Raya Koffie Logo">` : ''}
      </div>
    </div>

    <div class="cover-meta-box">
      <div class="meta-row">
        <span class="meta-label">Mata Kuliah:</span>
        <span class="meta-value">Basis Data / IMPAL</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Jenis Tugas:</span>
        <span class="meta-value">Tugas Kelompok Sintaks SQL</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Topik Sistem:</span>
        <span class="meta-value">Point of Sale (POS) Kafe & Carwash</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Standar Penilaian:</span>
        <span class="meta-value">Kategori Kompleksitas Tinggi (Nilai A)</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Jumlah Entitas:</span>
        <span class="meta-value">8 Tabel Relasional Normalisasi Penuh</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Dukungan RDBMS:</span>
        <span class="meta-value">PostgreSQL / Supabase & Standard SQL</span>
      </div>
    </div>

    <div class="cover-footer">
      Dokumen ini disusun untuk memenuhi instrumen evaluasi tugas kelompok basis data.<br>
      © 2026 Tim Pengembang POS Raya Koffie & 439 Carwash.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== BAB 1: PENDAHULUAN & ARSITEKTUR ==================== -->
  <div class="section-header">
    <div class="section-title">BAB I. ARSITEKTUR BASIS DATA & SKEMA RELASI</div>
    <div class="section-badge">Standar Nilai A</div>
  </div>

  <div class="alert-box">
    <strong>Kesesuaian dengan Petunjuk Tugas:</strong>
    1. Memenuhi standar 3 tabel pokok POS: <code>PRODUK (KodeProduk, NamaProduk, satuan, hargasatuan, stockmin, stock)</code>, <code>PENJUALAN (KodeJual, TglJual, Total)</code>, dan <code>PENJUALANDetail (KodeJual, KodeProduk, Quantity)</code>.<br>
    2. Menjawab catatan nilai di atas B: Menambahkan entitas <code>TOKO</code>, <code>KASIR</code>, <code>KATEGORI</code>, <code>PELANGGAN</code>, dan <code>PENGELUARAN</code> dengan integritas referensial (Foreign Key) yang ketat.
  </div>

  <h3>1.1 Gambaran Umum Sistem</h3>
  <p>
    Sistem Point of Sale (POS) <strong>Raya Koffie & 439 Carwash</strong> merupakan sistem kasir terintegrasi yang melayani dua model bisnis sekaligus: penjualan produk makanan/minuman (F&B Kafe) dan jasa pengerjaan perawatan kendaraan (Carwash & Auto Detailing).
  </p>

  <h3>1.2 Entitas dan Integritas Relasional</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 18%;">Nama Tabel</th>
        <th style="width: 20%;">Primary Key</th>
        <th style="width: 25%;">Foreign Key & Referensi</th>
        <th>Fungsi Bisnis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>TOKO</strong></td>
        <td><code>KodeToko</code></td>
        <td>-</td>
        <td>Menyimpan data cabang/outlet fisik operasional.</td>
      </tr>
      <tr>
        <td><strong>KASIR</strong></td>
        <td><code>KodeKasir</code></td>
        <td><code>KodeToko</code> &rarr; TOKO</td>
        <td>Menyimpan akun pengguna, hak akses, dan staf kasir bertugas.</td>
      </tr>
      <tr>
        <td><strong>KATEGORI</strong></td>
        <td><code>KodeKategori</code></td>
        <td>-</td>
        <td>Pengelompokan menu kafe vs jenis paket carwash.</td>
      </tr>
      <tr>
        <td><strong>PRODUK</strong></td>
        <td><code>KodeProduk</code></td>
        <td><code>KodeKategori</code> &rarr; KATEGORI</td>
        <td>Katalog produk, satuan, harga, serta ambang batas stok.</td>
      </tr>
      <tr>
        <td><strong>PELANGGAN</strong></td>
        <td><code>KodePelanggan</code></td>
        <td>-</td>
        <td>Data konsumen member, no HP, plat nomor, dan poin loyalitas.</td>
      </tr>
      <tr>
        <td><strong>PENJUALAN</strong></td>
        <td><code>KodeJual</code></td>
        <td><code>KodeToko</code>, <code>KodeKasir</code>, <code>KodePelanggan</code></td>
        <td>Header bukti transaksi kasir, total belanja, dan metode bayar.</td>
      </tr>
      <tr>
        <td><strong>PENJUALAN_DETAIL</strong></td>
        <td><code>KodeDetail</code></td>
        <td><code>KodeJual</code> &rarr; PENJUALAN<br><code>KodeProduk</code> &rarr; PRODUK</td>
        <td>Rincian kuantitas, harga saat transaksi, dan subtotal per item.</td>
      </tr>
      <tr>
        <td><strong>PENGELUARAN</strong></td>
        <td><code>KodePengeluaran</code></td>
        <td><code>KodeToko</code>, <code>KodeKasir</code></td>
        <td>Pencatatan kas keluar operasional harian kasir.</td>
      </tr>
    </tbody>
  </table>

  <h3>1.3 Desain Normalisasi Basis Data</h3>
  <p>
    Struktur tabel ini telah memenuhi <strong>Bentuk Normal Ketiga (3NF)</strong>:
  </p>
  <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 12px; color: #334155;">
    <li><strong>1NF (First Normal Form):</strong> Menghapus atribut multivalued atau array; item pesanan dipisahkan ke dalam tabel relasional anak <code>PENJUALAN_DETAIL</code> secara atomik.</li>
    <li><strong>2NF (Second Normal Form):</strong> Seluruh atribut non-key bergantung penuh pada Primary Key masing-masing tabel.</li>
    <li><strong>3NF (Third Normal Form):</strong> Menghilangkan ketergantungan transitif; informasi toko, kasir, dan kategori dipisah ke entitas induknya masing-masing.</li>
  </ul>

  <h3>1.4 Diagram Relasi Entitas (Entity Relationship Diagram - ERD)</h3>
  <p>
    Diagram berikut mengilustrasikan relasi formal kardinalitas (<em>One-to-Many</em>) antar entitas pada basis data POS Raya Koffie & 439 Carwash:
  </p>
  <div style="text-align: center; margin: 12px 0 16px 0; background: #0F172A; padding: 14px; border-radius: 8px; border: 1px solid #334155;">
    ${erdBase64 ? `<img src="${erdBase64}" style="max-width: 100%; height: auto; border-radius: 4px;" alt="ERD POS Raya Koffie & 439 Carwash">` : ''}
  </div>

  <div class="page-break"></div>

  <!-- ==================== BAB 2: SINTAKS CREATE TABLE ==================== -->
  <div class="section-header">
    <div class="section-title">BAB II. SINTAKS DDL (CREATE TABLE)</div>
    <div class="section-badge">8 Tabel Relasional</div>
  </div>

  <p>
    Berikut adalah sintaks SQL <code>CREATE TABLE</code> lengkap yang telah dirancang sesuai batasan integritas data (Primary Key, Foreign Key, Check Constraint, dan Default Value):
  </p>

  <div class="sql-block">
<span class="sql-comment">-- 1. TABEL TOKO (Outlet/Cabang Operasional)</span>
<span class="sql-keyword">CREATE TABLE</span> TOKO (
    KodeToko <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    NamaToko <span class="sql-type">VARCHAR(100)</span> <span class="sql-keyword">NOT NULL</span>,
    Alamat <span class="sql-type">VARCHAR(255)</span> <span class="sql-keyword">NOT NULL</span>,
    NoTelepon <span class="sql-type">VARCHAR(20)</span>,
    Status <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">DEFAULT</span> <span class="sql-str">'AKTIF'</span> <span class="sql-keyword">CHECK</span> (Status <span class="sql-keyword">IN</span> (<span class="sql-str">'AKTIF'</span>, <span class="sql-str">'NONAKTIF'</span>))
);

<span class="sql-comment">-- 2. TABEL KASIR (Staf / Pengguna Bertugas)</span>
<span class="sql-keyword">CREATE TABLE</span> KASIR (
    KodeKasir <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    KodeToko <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    NamaKasir <span class="sql-type">VARCHAR(100)</span> <span class="sql-keyword">NOT NULL</span>,
    Username <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL UNIQUE</span>,
    Password <span class="sql-type">VARCHAR(100)</span> <span class="sql-keyword">NOT NULL</span>,
    Role <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">DEFAULT</span> <span class="sql-str">'KASIR'</span> <span class="sql-keyword">CHECK</span> (Role <span class="sql-keyword">IN</span> (<span class="sql-str">'ADMIN'</span>, <span class="sql-str">'KASIR'</span>, <span class="sql-str">'SUPERVISOR'</span>)),
    Status <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">DEFAULT</span> <span class="sql-str">'AKTIF'</span> <span class="sql-keyword">CHECK</span> (Status <span class="sql-keyword">IN</span> (<span class="sql-str">'AKTIF'</span>, <span class="sql-str">'NONAKTIF'</span>)),
    <span class="sql-keyword">CONSTRAINT</span> FK_Kasir_Toko <span class="sql-keyword">FOREIGN KEY</span> (KodeToko) 
        <span class="sql-keyword">REFERENCES</span> TOKO(KodeToko) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>
);

<span class="sql-comment">-- 3. TABEL KATEGORI (Kategori Menu & Layanan)</span>
<span class="sql-keyword">CREATE TABLE</span> KATEGORI (
    KodeKategori <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    NamaKategori <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL</span>,
    TipeDivisi <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">NOT NULL CHECK</span> (TipeDivisi <span class="sql-keyword">IN</span> (<span class="sql-str">'KAFE'</span>, <span class="sql-str">'CARWASH'</span>, <span class="sql-str">'UMUM'</span>))
);

<span class="sql-comment">-- 4. TABEL PRODUK (Sesuai Catatan Dosen: KodeProduk, NamaProduk, satuan, hargasatuan, stockmin, stock)</span>
<span class="sql-keyword">CREATE TABLE</span> PRODUK (
    KodeProduk <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    KodeKategori <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    NamaProduk <span class="sql-type">VARCHAR(100)</span> <span class="sql-keyword">NOT NULL</span>,
    Satuan <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">NOT NULL</span>,
    HargaSatuan <span class="sql-type">NUMERIC(12, 2)</span> <span class="sql-keyword">NOT NULL CHECK</span> (HargaSatuan >= <span class="sql-num">0</span>),
    StockMin <span class="sql-type">INT</span> <span class="sql-keyword">NOT NULL DEFAULT</span> <span class="sql-num">5</span> <span class="sql-keyword">CHECK</span> (StockMin >= <span class="sql-num">0</span>),
    Stock <span class="sql-type">INT</span> <span class="sql-keyword">NOT NULL DEFAULT</span> <span class="sql-num">0</span> <span class="sql-keyword">CHECK</span> (Stock >= <span class="sql-num">0</span>),
    <span class="sql-keyword">CONSTRAINT</span> FK_Produk_Kategori <span class="sql-keyword">FOREIGN KEY</span> (KodeKategori) 
        <span class="sql-keyword">REFERENCES</span> KATEGORI(KodeKategori) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>
);

<span class="sql-comment">-- 5. TABEL PELANGGAN (Member Konsumen & Plat Nomor)</span>
<span class="sql-keyword">CREATE TABLE</span> PELANGGAN (
    KodePelanggan <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    NamaPelanggan <span class="sql-type">VARCHAR(100)</span> <span class="sql-keyword">NOT NULL</span>,
    NoHp <span class="sql-type">VARCHAR(20)</span>,
    PlatNomor <span class="sql-type">VARCHAR(15)</span>,
    PoinLoyalti <span class="sql-type">INT DEFAULT</span> <span class="sql-num">0</span> <span class="sql-keyword">CHECK</span> (PoinLoyalti >= <span class="sql-num">0</span>)
);

<span class="sql-comment">-- 6. TABEL PENJUALAN (Sesuai Catatan Dosen: KodeJual, TglJual, Total, + Relasi Toko & Kasir)</span>
<span class="sql-keyword">CREATE TABLE</span> PENJUALAN (
    KodeJual <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    KodeToko <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    KodeKasir <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    KodePelanggan <span class="sql-type">VARCHAR(10)</span>,
    TglJual <span class="sql-type">TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL</span>,
    Subtotal <span class="sql-type">NUMERIC(12, 2)</span> <span class="sql-keyword">NOT NULL CHECK</span> (Subtotal >= <span class="sql-num">0</span>),
    Diskon <span class="sql-type">NUMERIC(12, 2) DEFAULT</span> <span class="sql-num">0</span> <span class="sql-keyword">CHECK</span> (Diskon >= <span class="sql-num">0</span>),
    Pajak <span class="sql-type">NUMERIC(12, 2) DEFAULT</span> <span class="sql-num">0</span> <span class="sql-keyword">CHECK</span> (Pajak >= <span class="sql-num">0</span>),
    Total <span class="sql-type">NUMERIC(12, 2)</span> <span class="sql-keyword">NOT NULL CHECK</span> (Total >= <span class="sql-num">0</span>),
    MetodeBayar <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">DEFAULT</span> <span class="sql-str">'CASH'</span> <span class="sql-keyword">CHECK</span> (MetodeBayar <span class="sql-keyword">IN</span> (<span class="sql-str">'CASH'</span>, <span class="sql-str">'QRIS'</span>, <span class="sql-str">'TRANSFER'</span>)),
    <span class="sql-keyword">CONSTRAINT</span> FK_Penjualan_Toko <span class="sql-keyword">FOREIGN KEY</span> (KodeToko) 
        <span class="sql-keyword">REFERENCES</span> TOKO(KodeToko) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>,
    <span class="sql-keyword">CONSTRAINT</span> FK_Penjualan_Kasir <span class="sql-keyword">FOREIGN KEY</span> (KodeKasir) 
        <span class="sql-keyword">REFERENCES</span> KASIR(KodeKasir) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>,
    <span class="sql-keyword">CONSTRAINT</span> FK_Penjualan_Pelanggan <span class="sql-keyword">FOREIGN KEY</span> (KodePelanggan) 
        <span class="sql-keyword">REFERENCES</span> PELANGGAN(KodePelanggan) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE SET NULL</span>
);

<span class="sql-comment">-- 7. TABEL PENJUALANDETAIL (Sesuai Catatan Dosen: KodeJual, KodeProduk, Quantity, + Subtotal)</span>
<span class="sql-keyword">CREATE TABLE</span> PENJUALAN_DETAIL (
    KodeDetail <span class="sql-type">SERIAL PRIMARY KEY</span>,
    KodeJual <span class="sql-type">VARCHAR(20)</span> <span class="sql-keyword">NOT NULL</span>,
    KodeProduk <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    Quantity <span class="sql-type">INT</span> <span class="sql-keyword">NOT NULL CHECK</span> (Quantity > <span class="sql-num">0</span>),
    HargaSatuan <span class="sql-type">NUMERIC(12, 2)</span> <span class="sql-keyword">NOT NULL CHECK</span> (HargaSatuan >= <span class="sql-num">0</span>),
    Subtotal <span class="sql-type">NUMERIC(12, 2)</span> <span class="sql-keyword">NOT NULL CHECK</span> (Subtotal >= <span class="sql-num">0</span>),
    <span class="sql-keyword">CONSTRAINT</span> FK_Detail_Penjualan <span class="sql-keyword">FOREIGN KEY</span> (KodeJual) 
        <span class="sql-keyword">REFERENCES</span> PENJUALAN(KodeJual) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE CASCADE</span>,
    <span class="sql-keyword">CONSTRAINT</span> FK_Detail_Produk <span class="sql-keyword">FOREIGN KEY</span> (KodeProduk) 
        <span class="sql-keyword">REFERENCES</span> PRODUK(KodeProduk) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>,
    <span class="sql-keyword">CONSTRAINT</span> UQ_Jual_Produk <span class="sql-keyword">UNIQUE</span> (KodeJual, KodeProduk)
);

<span class="sql-comment">-- 8. TABEL PENGELUARAN (Operasional Kas Kasir)</span>
<span class="sql-keyword">CREATE TABLE</span> PENGELUARAN (
    KodePengeluaran <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">PRIMARY KEY</span>,
    KodeToko <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    KodeKasir <span class="sql-type">VARCHAR(10)</span> <span class="sql-keyword">NOT NULL</span>,
    TglPengeluaran <span class="sql-type">DATE</span> <span class="sql-keyword">NOT NULL</span>,
    Kategori <span class="sql-type">VARCHAR(50)</span> <span class="sql-keyword">NOT NULL</span>,
    Deskripsi <span class="sql-type">TEXT NOT NULL</span>,
    Jumlah <span class="sql-type">NUMERIC(12, 2)</span> <span class="sql-keyword">NOT NULL CHECK</span> (Jumlah > <span class="sql-num">0</span>),
    SumberDana <span class="sql-type">VARCHAR(30)</span> <span class="sql-keyword">DEFAULT</span> <span class="sql-str">'KAS_KASIR'</span>,
    <span class="sql-keyword">CONSTRAINT</span> FK_Pengeluaran_Toko <span class="sql-keyword">FOREIGN KEY</span> (KodeToko) 
        <span class="sql-keyword">REFERENCES</span> TOKO(KodeToko) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>,
    <span class="sql-keyword">CONSTRAINT</span> FK_Pengeluaran_Kasir <span class="sql-keyword">FOREIGN KEY</span> (KodeKasir) 
        <span class="sql-keyword">REFERENCES</span> KASIR(KodeKasir) <span class="sql-keyword">ON UPDATE CASCADE ON DELETE RESTRICT</span>
);
  </div>

  <div class="page-break"></div>

  <!-- ==================== BAB 3: SINTAKS INSERT DATA ==================== -->
  <div class="section-header">
    <div class="section-title">BAB III. SINTAKS DML (INSERT 5 DATA TIAP TABEL)</div>
    <div class="section-badge">Minimal 5 Baris / Tabel</div>
  </div>

  <p>
    Sesuai instruksi tugas, setiap tabel diisi minimal 5 baris data contoh yang realistis dan konsisten antar relasi:
  </p>

  <div class="sql-block">
<span class="sql-comment">-- 1. INSERT 5 DATA PADA TABEL TOKO</span>
<span class="sql-keyword">INSERT INTO</span> TOKO (KodeToko, NamaToko, Alamat, NoTelepon, Status) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'TKO-01'</span>, <span class="sql-str">'Raya Koffie & 439 Carwash Pusat'</span>, <span class="sql-str">'Jl. Raya No. 439, Bandung'</span>, <span class="sql-str">'081234567891'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'TKO-02'</span>, <span class="sql-str">'Raya Koffie Dago Branch'</span>, <span class="sql-str">'Jl. Ir. H. Juanda No. 120, Bandung'</span>, <span class="sql-str">'081234567892'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'TKO-03'</span>, <span class="sql-str">'439 Carwash Express Buah Batu'</span>, <span class="sql-str">'Jl. Buah Batu No. 88, Bandung'</span>, <span class="sql-str">'081234567893'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'TKO-04'</span>, <span class="sql-str">'Raya Koffie & Carwash Cibiru'</span>, <span class="sql-str">'Jl. Soekarno-Hatta No. 512, Bandung'</span>, <span class="sql-str">'081234567894'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'TKO-05'</span>, <span class="sql-str">'Raya Express Rest Area KM 97'</span>, <span class="sql-str">'Tol Purbaleunyi KM 97, Purwakarta'</span>, <span class="sql-str">'081234567895'</span>, <span class="sql-str">'AKTIF'</span>);

<span class="sql-comment">-- 2. INSERT 5 DATA PADA TABEL KASIR</span>
<span class="sql-keyword">INSERT INTO</span> KASIR (KodeKasir, KodeToko, NamaKasir, Username, Password, Role, Status) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'KSR-01'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'Ahmad Syafiq'</span>, <span class="sql-str">'syafiq_admin'</span>, <span class="sql-str">'adm12345'</span>, <span class="sql-str">'ADMIN'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'KSR-02'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'Budi Santoso'</span>, <span class="sql-str">'budi_kasir'</span>, <span class="sql-str">'ksr12345'</span>, <span class="sql-str">'KASIR'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'KSR-03'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'Siti Rahmawati'</span>, <span class="sql-str">'siti_barista'</span>, <span class="sql-str">'barista123'</span>, <span class="sql-str">'KASIR'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'KSR-04'</span>, <span class="sql-str">'TKO-02'</span>, <span class="sql-str">'Dimas Pratama'</span>, <span class="sql-str">'dimas_spv'</span>, <span class="sql-str">'spv12345'</span>, <span class="sql-str">'SUPERVISOR'</span>, <span class="sql-str">'AKTIF'</span>),
(<span class="sql-str">'KSR-05'</span>, <span class="sql-str">'TKO-03'</span>, <span class="sql-str">'Eko Wahyudi'</span>, <span class="sql-str">'eko_carwash'</span>, <span class="sql-str">'wash12345'</span>, <span class="sql-str">'KASIR'</span>, <span class="sql-str">'AKTIF'</span>);

<span class="sql-comment">-- 3. INSERT 5 DATA PADA TABEL KATEGORI</span>
<span class="sql-keyword">INSERT INTO</span> KATEGORI (KodeKategori, NamaKategori, TipeDivisi) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'KTG-01'</span>, <span class="sql-str">'Kopi & Minuman Espresso'</span>, <span class="sql-str">'KAFE'</span>),
(<span class="sql-str">'KTG-02'</span>, <span class="sql-str">'Non-Kopi & Teh'</span>, <span class="sql-str">'KAFE'</span>),
(<span class="sql-str">'KTG-03'</span>, <span class="sql-str">'Makanan Ringan & Pastry'</span>, <span class="sql-str">'KAFE'</span>),
(<span class="sql-str">'KTG-04'</span>, <span class="sql-str">'Paket Cuci Kendaraan'</span>, <span class="sql-str">'CARWASH'</span>),
(<span class="sql-str">'KTG-05'</span>, <span class="sql-str">'Auto Detailing & Salon'</span>, <span class="sql-str">'CARWASH'</span>);

<span class="sql-comment">-- 4. INSERT 7 DATA PADA TABEL PRODUK (Termasuk Satuan, StockMin, dan Stock)</span>
<span class="sql-keyword">INSERT INTO</span> PRODUK (KodeProduk, KodeKategori, NamaProduk, Satuan, HargaSatuan, StockMin, Stock) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'PRD-01'</span>, <span class="sql-str">'KTG-01'</span>, <span class="sql-str">'Kopi Susu Gula Aren'</span>, <span class="sql-str">'Cup'</span>, <span class="sql-num">18000.00</span>, <span class="sql-num">10</span>, <span class="sql-num">85</span>),
(<span class="sql-str">'PRD-02'</span>, <span class="sql-str">'KTG-01'</span>, <span class="sql-str">'Caffe Latte Double Shot'</span>, <span class="sql-str">'Cup'</span>, <span class="sql-num">22000.00</span>, <span class="sql-num">10</span>, <span class="sql-num">60</span>),
(<span class="sql-str">'PRD-03'</span>, <span class="sql-str">'KTG-02'</span>, <span class="sql-str">'Matcha Latte Signature'</span>, <span class="sql-str">'Cup'</span>, <span class="sql-num">24000.00</span>, <span class="sql-num">10</span>, <span class="sql-num">50</span>),
(<span class="sql-str">'PRD-04'</span>, <span class="sql-str">'KTG-03'</span>, <span class="sql-str">'Butter Croissant Artisan'</span>, <span class="sql-str">'Pcs'</span>, <span class="sql-num">20000.00</span>, <span class="sql-num">5</span>, <span class="sql-num">25</span>),
(<span class="sql-str">'PRD-05'</span>, <span class="sql-str">'KTG-04'</span>, <span class="sql-str">'Cuci Mobil Hidrolik Snow'</span>, <span class="sql-str">'Mobil'</span>, <span class="sql-num">50000.00</span>, <span class="sql-num">0</span>, <span class="sql-num">999</span>),
(<span class="sql-str">'PRD-06'</span>, <span class="sql-str">'KTG-04'</span>, <span class="sql-str">'Cuci Motor Premium Wax'</span>, <span class="sql-str">'Motor'</span>, <span class="sql-num">25000.00</span>, <span class="sql-num">0</span>, <span class="sql-num">999</span>),
(<span class="sql-str">'PRD-07'</span>, <span class="sql-str">'KTG-05'</span>, <span class="sql-str">'Wax Interior & Fogging'</span>, <span class="sql-str">'Paket'</span>, <span class="sql-num">100000.00</span>, <span class="sql-num">2</span>, <span class="sql-num">20</span>);

<span class="sql-comment">-- 5. INSERT 5 DATA PADA TABEL PELANGGAN</span>
<span class="sql-keyword">INSERT INTO</span> PELANGGAN (KodePelanggan, NamaPelanggan, NoHp, PlatNomor, PoinLoyalti) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'PLG-01'</span>, <span class="sql-str">'Rian Hidayat'</span>, <span class="sql-str">'081399881122'</span>, <span class="sql-str">'D 1234 ABC'</span>, <span class="sql-num">45</span>),
(<span class="sql-str">'PLG-02'</span>, <span class="sql-str">'Dewi Lestari'</span>, <span class="sql-str">'081255443322'</span>, <span class="sql-str">'D 4390 RYA'</span>, <span class="sql-num">90</span>),
(<span class="sql-str">'PLG-03'</span>, <span class="sql-str">'Andi Nugroho'</span>, <span class="sql-str">'085711223344'</span>, <span class="sql-str">'B 5678 KOF'</span>, <span class="sql-num">15</span>),
(<span class="sql-str">'PLG-04'</span>, <span class="sql-str">'Maya Anggraini'</span>, <span class="sql-str">'081977665544'</span>, <span class="sql-str">'D 9981 XYZ'</span>, <span class="sql-num">60</span>),
(<span class="sql-str">'PLG-05'</span>, <span class="sql-str">'Bambang Kusuma'</span>, <span class="sql-str">'082133445566'</span>, <span class="sql-str">'B 1439 CAR'</span>, <span class="sql-num">120</span>);

<span class="sql-comment">-- 6. INSERT 5 DATA PADA TABEL PENJUALAN</span>
<span class="sql-keyword">INSERT INTO</span> PENJUALAN (KodeJual, KodeToko, KodeKasir, KodePelanggan, TglJual, Subtotal, Diskon, Pajak, Total, MetodeBayar) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'TRX-20261001-001'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-02'</span>, <span class="sql-str">'PLG-01'</span>, <span class="sql-str">'2026-10-01 09:15:00+07'</span>, <span class="sql-num">68000.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">68000.00</span>, <span class="sql-str">'CASH'</span>),
(<span class="sql-str">'TRX-20261001-002'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-02'</span>, <span class="sql-str">'PLG-02'</span>, <span class="sql-str">'2026-10-01 10:30:00+07'</span>, <span class="sql-num">92000.00</span>, <span class="sql-num">5000.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">87000.00</span>, <span class="sql-str">'QRIS'</span>),
(<span class="sql-str">'TRX-20261001-003'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-03'</span>, <span class="sql-str">'PLG-03'</span>, <span class="sql-str">'2026-10-01 13:45:00+07'</span>, <span class="sql-num">50000.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">50000.00</span>, <span class="sql-str">'CASH'</span>),
(<span class="sql-str">'TRX-20261002-004'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-02'</span>, <span class="sql-str">'PLG-04'</span>, <span class="sql-str">'2026-10-02 14:20:00+07'</span>, <span class="sql-num">124000.00</span>, <span class="sql-num">10000.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">114000.00</span>, <span class="sql-str">'TRANSFER'</span>),
(<span class="sql-str">'TRX-20261002-005'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-03'</span>, <span class="sql-str">'PLG-05'</span>, <span class="sql-str">'2026-10-02 16:10:00+07'</span>, <span class="sql-num">150000.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">0.00</span>, <span class="sql-num">150000.00</span>, <span class="sql-str">'QRIS'</span>);

<span class="sql-comment">-- 7. INSERT 9 DATA PADA TABEL PENJUALAN_DETAIL</span>
<span class="sql-keyword">INSERT INTO</span> PENJUALAN_DETAIL (KodeJual, KodeProduk, Quantity, HargaSatuan, Subtotal) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'TRX-20261001-001'</span>, <span class="sql-str">'PRD-01'</span>, <span class="sql-num">1</span>, <span class="sql-num">18000.00</span>, <span class="sql-num">18000.00</span>),
(<span class="sql-str">'TRX-20261001-001'</span>, <span class="sql-str">'PRD-05'</span>, <span class="sql-num">1</span>, <span class="sql-num">50000.00</span>, <span class="sql-num">50000.00</span>),
(<span class="sql-str">'TRX-20261001-002'</span>, <span class="sql-str">'PRD-02'</span>, <span class="sql-num">2</span>, <span class="sql-num">22000.00</span>, <span class="sql-num">44000.00</span>),
(<span class="sql-str">'TRX-20261001-002'</span>, <span class="sql-str">'PRD-03'</span>, <span class="sql-num">2</span>, <span class="sql-num">24000.00</span>, <span class="sql-num">48000.00</span>),
(<span class="sql-str">'TRX-20261001-003'</span>, <span class="sql-str">'PRD-05'</span>, <span class="sql-num">1</span>, <span class="sql-num">50000.00</span>, <span class="sql-num">50000.00</span>),
(<span class="sql-str">'TRX-20261002-004'</span>, <span class="sql-str">'PRD-03'</span>, <span class="sql-num">1</span>, <span class="sql-num">24000.00</span>, <span class="sql-num">24000.00</span>),
(<span class="sql-str">'TRX-20261002-004'</span>, <span class="sql-str">'PRD-07'</span>, <span class="sql-num">1</span>, <span class="sql-num">100000.00</span>, <span class="sql-num">100000.00</span>),
(<span class="sql-str">'TRX-20261002-005'</span>, <span class="sql-str">'PRD-05'</span>, <span class="sql-num">1</span>, <span class="sql-num">50000.00</span>, <span class="sql-num">50000.00</span>),
(<span class="sql-str">'TRX-20261002-005'</span>, <span class="sql-str">'PRD-07'</span>, <span class="sql-num">1</span>, <span class="sql-num">100000.00</span>, <span class="sql-num">100000.00</span>);

<span class="sql-comment">-- 8. INSERT 5 DATA PADA TABEL PENGELUARAN</span>
<span class="sql-keyword">INSERT INTO</span> PENGELUARAN (KodePengeluaran, KodeToko, KodeKasir, TglPengeluaran, Kategori, Deskripsi, Jumlah, SumberDana) <span class="sql-keyword">VALUES</span>
(<span class="sql-str">'EXP-01'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-02'</span>, <span class="sql-str">'2026-10-01'</span>, <span class="sql-str">'Bahan Baku'</span>, <span class="sql-str">'Pembelian Es Batu Kristal 10 Kantong'</span>, <span class="sql-num">100000.00</span>, <span class="sql-str">'KAS_KASIR'</span>),
(<span class="sql-str">'EXP-02'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-02'</span>, <span class="sql-str">'2026-10-01'</span>, <span class="sql-str">'Operasional Carwash'</span>, <span class="sql-str">'Shampoo Salju Cuci Mobil 2 Galon'</span>, <span class="sql-num">150000.00</span>, <span class="sql-str">'KAS_KASIR'</span>),
(<span class="sql-str">'EXP-03'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-03'</span>, <span class="sql-str">'2026-10-01'</span>, <span class="sql-str">'Perlengkapan Kasir'</span>, <span class="sql-str">'Kertas Thermal Struk 58mm 1 Pack'</span>, <span class="sql-num">65000.00</span>, <span class="sql-str">'KAS_KASIR'</span>),
(<span class="sql-str">'EXP-04'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-02'</span>, <span class="sql-str">'2026-10-02'</span>, <span class="sql-str">'Bahan Baku'</span>, <span class="sql-str">'Susu Segar UHT Full Cream 1 Karton'</span>, <span class="sql-num">220000.00</span>, <span class="sql-str">'KAS_KASIR'</span>),
(<span class="sql-str">'EXP-05'</span>, <span class="sql-str">'TKO-01'</span>, <span class="sql-str">'KSR-03'</span>, <span class="sql-str">'2026-10-02'</span>, <span class="sql-str">'Kebersihan'</span>, <span class="sql-str">'Plastik Sampah & Lap Microfiber'</span>, <span class="sql-num">85000.00</span>, <span class="sql-str">'KAS_KASIR'</span>);
  </div>

  <div class="page-break"></div>

  <!-- ==================== BAB 4: QUERY PENGUJIAN ==================== -->
  <div class="section-header">
    <div class="section-title">BAB IV. PEMBUKTIAN RELASI (QUERY UJI COBA / JOIN)</div>
    <div class="section-badge">Pengujian DQL</div>
  </div>

  <p>
    Untuk membuktikan bahwa seluruh tabel telah terhubung secara relasional melalui Foreign Key dengan benar, dilakukan serangkaian pengujian kueri kompleks (Multi-table JOIN dan Aggregation):
  </p>

  <h3>4.1 Kueri Laporan Transaksi Kasir Lengkap</h3>
  <div class="sql-block">
<span class="sql-keyword">SELECT</span> 
    p.KodeJual,
    p.TglJual,
    t.NamaToko,
    k.NamaKasir,
    <span class="sql-func">COALESCE</span>(plg.NamaPelanggan, <span class="sql-str">'Umum'</span>) <span class="sql-keyword">AS</span> NamaPelanggan,
    <span class="sql-func">COALESCE</span>(plg.PlatNomor, <span class="sql-str">'-'</span>) <span class="sql-keyword">AS</span> PlatNomor,
    p.MetodeBayar,
    p.Total
<span class="sql-keyword">FROM</span> PENJUALAN p
<span class="sql-keyword">JOIN</span> TOKO t <span class="sql-keyword">ON</span> p.KodeToko = t.KodeToko
<span class="sql-keyword">JOIN</span> KASIR k <span class="sql-keyword">ON</span> p.KodeKasir = k.KodeKasir
<span class="sql-keyword">LEFT JOIN</span> PELANGGAN plg <span class="sql-keyword">ON</span> p.KodePelanggan = plg.KodePelanggan
<span class="sql-keyword">ORDER BY</span> p.TglJual <span class="sql-keyword">ASC</span>;
  </div>

  <h3>4.2 Kueri Rincian Struk Item Belanja per Transaksi</h3>
  <div class="sql-block">
<span class="sql-keyword">SELECT</span> 
    d.KodeJual,
    prd.NamaProduk,
    kat.NamaKategori,
    d.Quantity,
    prd.Satuan,
    d.HargaSatuan,
    d.Subtotal
<span class="sql-keyword">FROM</span> PENJUALAN_DETAIL d
<span class="sql-keyword">JOIN</span> PRODUK prd <span class="sql-keyword">ON</span> d.KodeProduk = prd.KodeProduk
<span class="sql-keyword">JOIN</span> KATEGORI kat <span class="sql-keyword">ON</span> prd.KodeKategori = kat.KodeKategori
<span class="sql-keyword">ORDER BY</span> d.KodeJual, d.KodeDetail;
  </div>

  <h3>4.3 Kueri Monitoring Stok Produk & Peringatan Ambang Batas</h3>
  <div class="sql-block">
<span class="sql-keyword">SELECT</span> 
    prd.KodeProduk,
    prd.NamaProduk,
    prd.Stock,
    prd.StockMin,
    prd.Satuan,
    <span class="sql-func">COALESCE</span>(<span class="sql-func">SUM</span>(d.Quantity), <span class="sql-num">0</span>) <span class="sql-keyword">AS</span> TotalTerjual,
    <span class="sql-keyword">CASE</span> 
        <span class="sql-keyword">WHEN</span> prd.Stock <= prd.StockMin <span class="sql-keyword">THEN</span> <span class="sql-str">'PERINGATAN: STOK MENIPIS'</span>
        <span class="sql-keyword">ELSE</span> <span class="sql-str">'STOK AMAN'</span>
    <span class="sql-keyword">END AS</span> StatusInventori
<span class="sql-keyword">FROM</span> PRODUK prd
<span class="sql-keyword">LEFT JOIN</span> PENJUALAN_DETAIL d <span class="sql-keyword">ON</span> prd.KodeProduk = d.KodeProduk
<span class="sql-keyword">GROUP BY</span> prd.KodeProduk, prd.NamaProduk, prd.Stock, prd.StockMin, prd.Satuan
<span class="sql-keyword">ORDER BY</span> TotalTerjual <span class="sql-keyword">DESC</span>;
  </div>

  <div class="section-header" style="margin-top:25px;">
    <div class="section-title">BAB V. KESIMPULAN</div>
  </div>
  <p>
    Berdasarkan perancangan di atas, basis data POS Raya Koffie & 439 Carwash telah berhasil dirancang dengan memenuhi kriteria tugas kelompok, mencakup:
  </p>
  <ul style="margin-left: 20px; font-size: 12px; color: #334155;">
    <li>Seluruh tabel inti POS (<code>PRODUK</code>, <code>PENJUALAN</code>, <code>PENJUALAN_DETAIL</code>) terpenuhi dengan nama kolom persis sesuai ketentuan.</li>
    <li>Kompleksitas tinggi tercapai dengan penambahan entitas <code>TOKO</code>, <code>KASIR</code>, <code>KATEGORI</code>, <code>PELANGGAN</code>, dan <code>PENGELUARAN</code> beserta relasinya.</li>
    <li>Setiap tabel telah dilengkapi minimal 5 data awal yang valid dan konsisten.</li>
    <li>Seluruh sintaks SQL siap dieksekusi pada mesin PostgreSQL/Supabase maupun RDBMS standar lainnya.</li>
  </ul>

</body>
</html>
`;

async function generatePDF() {
  console.log('Writing HTML document...');
  fs.writeFileSync(HTML_OUTPUT, htmlTemplate, 'utf-8');

  console.log('Launching headless browser via Microsoft Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + HTML_OUTPUT.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  console.log('Rendering high quality A4 PDF...');
  await page.pdf({
    path: PDF_OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();
  console.log('SUCCESS! PDF generated successfully at:', PDF_OUTPUT);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});

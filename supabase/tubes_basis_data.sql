-- ==============================================================================
-- TUGAS BESAR BASIS DATA (TUBES) - SISTEM INFORMASI POINT OF SALE (POS)
-- STUDI KASUS: POS RAYA KOFFIE & 439 CARWASH
-- ==============================================================================
-- 1. Create semua Tabel Basis Data TUBES (8 Tabel Relasional Normalisasi Penuh)
-- 2. Insert minimal 5 data untuk tiap Tabel
-- ==============================================================================

-- HAPUS TABEL SEBELUMNYA JIKA SUDAH ADA (Urutan dari anak ke induk)
DROP TABLE IF EXISTS PENGELUARAN CASCADE;
DROP TABLE IF EXISTS PENJUALAN_DETAIL CASCADE;
DROP TABLE IF EXISTS PENJUALAN CASCADE;
DROP TABLE IF EXISTS PELANGGAN CASCADE;
DROP TABLE IF EXISTS PRODUK CASCADE;
DROP TABLE IF EXISTS KATEGORI CASCADE;
DROP TABLE IF EXISTS KASIR CASCADE;
DROP TABLE IF EXISTS TOKO CASCADE;

-- ==============================================================================
-- BAGIAN 1: CREATE SEMUA TABEL BASIS DATA (DDL)
-- ==============================================================================

-- 1. TABEL TOKO (Informasi Outlet / Cabang)
CREATE TABLE TOKO (
    KodeToko VARCHAR(10) PRIMARY KEY,
    NamaToko VARCHAR(100) NOT NULL,
    Alamat VARCHAR(255) NOT NULL,
    NoTelepon VARCHAR(20),
    Status VARCHAR(20) DEFAULT 'AKTIF' CHECK (Status IN ('AKTIF', 'NONAKTIF'))
);

-- 2. TABEL KASIR (Informasi Kasir / Pengguna Sistem yang Bertugas)
CREATE TABLE KASIR (
    KodeKasir VARCHAR(10) PRIMARY KEY,
    KodeToko VARCHAR(10) NOT NULL,
    NamaKasir VARCHAR(100) NOT NULL,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    Role VARCHAR(20) DEFAULT 'KASIR' CHECK (Role IN ('ADMIN', 'KASIR', 'SUPERVISOR')),
    Status VARCHAR(20) DEFAULT 'AKTIF' CHECK (Status IN ('AKTIF', 'NONAKTIF')),
    CONSTRAINT FK_Kasir_Toko FOREIGN KEY (KodeToko) 
        REFERENCES TOKO(KodeToko) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 3. TABEL KATEGORI (Kategori Menu Kafe & Layanan Carwash)
CREATE TABLE KATEGORI (
    KodeKategori VARCHAR(10) PRIMARY KEY,
    NamaKategori VARCHAR(50) NOT NULL,
    TipeDivisi VARCHAR(20) NOT NULL CHECK (TipeDivisi IN ('KAFE', 'CARWASH', 'UMUM'))
);

-- 4. TABEL PRODUK (Sesuai Syarat Dosen: KodeProduk, NamaProduk, satuan, hargasatuan, stockmin, stock)
CREATE TABLE PRODUK (
    KodeProduk VARCHAR(10) PRIMARY KEY,
    KodeKategori VARCHAR(10) NOT NULL,
    NamaProduk VARCHAR(100) NOT NULL,
    Satuan VARCHAR(20) NOT NULL,
    HargaSatuan NUMERIC(12, 2) NOT NULL CHECK (HargaSatuan >= 0),
    StockMin INT NOT NULL DEFAULT 5 CHECK (StockMin >= 0),
    Stock INT NOT NULL DEFAULT 0 CHECK (Stock >= 0),
    CONSTRAINT FK_Produk_Kategori FOREIGN KEY (KodeKategori) 
        REFERENCES KATEGORI(KodeKategori) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 5. TABEL PELANGGAN (Informasi Member / Konsumen beserta Plat Kendaraan)
CREATE TABLE PELANGGAN (
    KodePelanggan VARCHAR(10) PRIMARY KEY,
    NamaPelanggan VARCHAR(100) NOT NULL,
    NoHp VARCHAR(20),
    PlatNomor VARCHAR(15),
    PoinLoyalti INT DEFAULT 0 CHECK (PoinLoyalti >= 0)
);

-- 6. TABEL PENJUALAN (Sesuai Syarat Dosen: KodeJual, TglJual, Total, + Relasi Kasir, Toko, Pelanggan)
CREATE TABLE PENJUALAN (
    KodeJual VARCHAR(20) PRIMARY KEY,
    KodeToko VARCHAR(10) NOT NULL,
    KodeKasir VARCHAR(10) NOT NULL,
    KodePelanggan VARCHAR(10),
    TglJual TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Subtotal NUMERIC(12, 2) NOT NULL CHECK (Subtotal >= 0),
    Diskon NUMERIC(12, 2) DEFAULT 0 CHECK (Diskon >= 0),
    Pajak NUMERIC(12, 2) DEFAULT 0 CHECK (Pajak >= 0),
    Total NUMERIC(12, 2) NOT NULL CHECK (Total >= 0),
    MetodeBayar VARCHAR(20) DEFAULT 'CASH' CHECK (MetodeBayar IN ('CASH', 'QRIS', 'TRANSFER')),
    CONSTRAINT FK_Penjualan_Toko FOREIGN KEY (KodeToko) 
        REFERENCES TOKO(KodeToko) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_Penjualan_Kasir FOREIGN KEY (KodeKasir) 
        REFERENCES KASIR(KodeKasir) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_Penjualan_Pelanggan FOREIGN KEY (KodePelanggan) 
        REFERENCES PELANGGAN(KodePelanggan) ON UPDATE CASCADE ON DELETE SET NULL
);

-- 7. TABEL PENJUALANDETAIL (Sesuai Syarat Dosen: KodeJual, KodeProduk, Quantity, + Harga & Subtotal)
CREATE TABLE PENJUALAN_DETAIL (
    KodeDetail SERIAL PRIMARY KEY,
    KodeJual VARCHAR(20) NOT NULL,
    KodeProduk VARCHAR(10) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    HargaSatuan NUMERIC(12, 2) NOT NULL CHECK (HargaSatuan >= 0),
    Subtotal NUMERIC(12, 2) NOT NULL CHECK (Subtotal >= 0),
    CONSTRAINT FK_Detail_Penjualan FOREIGN KEY (KodeJual) 
        REFERENCES PENJUALAN(KodeJual) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_Detail_Produk FOREIGN KEY (KodeProduk) 
        REFERENCES PRODUK(KodeProduk) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT UQ_Jual_Produk UNIQUE (KodeJual, KodeProduk)
);

-- 8. TABEL PENGELUARAN (Pencatatan Biaya Operasional / Pengeluaran Toko)
CREATE TABLE PENGELUARAN (
    KodePengeluaran VARCHAR(10) PRIMARY KEY,
    KodeToko VARCHAR(10) NOT NULL,
    KodeKasir VARCHAR(10) NOT NULL,
    TglPengeluaran DATE NOT NULL,
    Kategori VARCHAR(50) NOT NULL,
    Deskripsi TEXT NOT NULL,
    Jumlah NUMERIC(12, 2) NOT NULL CHECK (Jumlah > 0),
    SumberDana VARCHAR(30) DEFAULT 'KAS_KASIR',
    CONSTRAINT FK_Pengeluaran_Toko FOREIGN KEY (KodeToko) 
        REFERENCES TOKO(KodeToko) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_Pengeluaran_Kasir FOREIGN KEY (KodeKasir) 
        REFERENCES KASIR(KodeKasir) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ==============================================================================
-- BAGIAN 2: INSERT MINIMAL 5 DATA UNTUK SETIAP TABEL (DML)
-- ==============================================================================

-- 1. Insert 5 Data ke Tabel TOKO
INSERT INTO TOKO (KodeToko, NamaToko, Alamat, NoTelepon, Status) VALUES
('TKO-01', 'Raya Koffie & 439 Carwash Pusat', 'Jl. Raya No. 439, Bandung', '081234567891', 'AKTIF'),
('TKO-02', 'Raya Koffie Dago Branch', 'Jl. Ir. H. Juanda No. 120, Bandung', '081234567892', 'AKTIF'),
('TKO-03', '439 Carwash Express Buah Batu', 'Jl. Buah Batu No. 88, Bandung', '081234567893', 'AKTIF'),
('TKO-04', 'Raya Koffie & Carwash Cibiru', 'Jl. Soekarno-Hatta No. 512, Bandung', '081234567894', 'AKTIF'),
('TKO-05', 'Raya Express Rest Area KM 97', 'Tol Purbaleunyi KM 97, Purwakarta', '081234567895', 'AKTIF');

-- 2. Insert 5 Data ke Tabel KASIR
INSERT INTO KASIR (KodeKasir, KodeToko, NamaKasir, Username, Password, Role, Status) VALUES
('KSR-01', 'TKO-01', 'Ahmad Syafiq', 'syafiq_admin', 'adm12345', 'ADMIN', 'AKTIF'),
('KSR-02', 'TKO-01', 'Budi Santoso', 'budi_kasir', 'ksr12345', 'KASIR', 'AKTIF'),
('KSR-03', 'TKO-01', 'Siti Rahmawati', 'siti_barista', 'barista123', 'KASIR', 'AKTIF'),
('KSR-04', 'TKO-02', 'Dimas Pratama', 'dimas_spv', 'spv12345', 'SUPERVISOR', 'AKTIF'),
('KSR-05', 'TKO-03', 'Eko Wahyudi', 'eko_carwash', 'wash12345', 'KASIR', 'AKTIF');

-- 3. Insert 5 Data ke Tabel KATEGORI
INSERT INTO KATEGORI (KodeKategori, NamaKategori, TipeDivisi) VALUES
('KTG-01', 'Kopi & Minuman Espresso', 'KAFE'),
('KTG-02', 'Non-Kopi & Teh', 'KAFE'),
('KTG-03', 'Makanan Ringan & Pastry', 'KAFE'),
('KTG-04', 'Paket Cuci Kendaraan', 'CARWASH'),
('KTG-05', 'Auto Detailing & Salon', 'CARWASH');

-- 4. Insert 7 Data ke Tabel PRODUK (Memuat KodeProduk, NamaProduk, satuan, hargasatuan, stockmin, stock)
INSERT INTO PRODUK (KodeProduk, KodeKategori, NamaProduk, Satuan, HargaSatuan, StockMin, Stock) VALUES
('PRD-01', 'KTG-01', 'Kopi Susu Gula Aren', 'Cup', 18000.00, 10, 85),
('PRD-02', 'KTG-01', 'Caffe Latte Double Shot', 'Cup', 22000.00, 10, 60),
('PRD-03', 'KTG-02', 'Matcha Latte Signature', 'Cup', 24000.00, 10, 50),
('PRD-04', 'KTG-03', 'Butter Croissant Artisan', 'Pcs', 20000.00, 5, 25),
('PRD-05', 'KTG-04', 'Cuci Mobil Hidrolik Snow', 'Mobil', 50000.00, 0, 999),
('PRD-06', 'KTG-04', 'Cuci Motor Premium Wax', 'Motor', 25000.00, 0, 999),
('PRD-07', 'KTG-05', 'Wax Interior & Fogging', 'Paket', 100000.00, 2, 20);

-- 5. Insert 5 Data ke Tabel PELANGGAN
INSERT INTO PELANGGAN (KodePelanggan, NamaPelanggan, NoHp, PlatNomor, PoinLoyalti) VALUES
('PLG-01', 'Rian Hidayat', '081399881122', 'D 1234 ABC', 45),
('PLG-02', 'Dewi Lestari', '081255443322', 'D 4390 RYA', 90),
('PLG-03', 'Andi Nugroho', '085711223344', 'B 5678 KOF', 15),
('PLG-04', 'Maya Anggraini', '081977665544', 'D 9981 XYZ', 60),
('PLG-05', 'Bambang Kusuma', '082133445566', 'B 1439 CAR', 120);

-- 6. Insert 5 Data ke Tabel PENJUALAN (Memuat KodeJual, TglJual, Total)
INSERT INTO PENJUALAN (KodeJual, KodeToko, KodeKasir, KodePelanggan, TglJual, Subtotal, Diskon, Pajak, Total, MetodeBayar) VALUES
('TRX-20261001-001', 'TKO-01', 'KSR-02', 'PLG-01', '2026-10-01 09:15:00+07', 68000.00, 0.00, 0.00, 68000.00, 'CASH'),
('TRX-20261001-002', 'TKO-01', 'KSR-02', 'PLG-02', '2026-10-01 10:30:00+07', 92000.00, 5000.00, 0.00, 87000.00, 'QRIS'),
('TRX-20261001-003', 'TKO-01', 'KSR-03', 'PLG-03', '2026-10-01 13:45:00+07', 50000.00, 0.00, 0.00, 50000.00, 'CASH'),
('TRX-20261002-004', 'TKO-01', 'KSR-02', 'PLG-04', '2026-10-02 14:20:00+07', 124000.00, 10000.00, 0.00, 114000.00, 'TRANSFER'),
('TRX-20261002-005', 'TKO-01', 'KSR-03', 'PLG-05', '2026-10-02 16:10:00+07', 150000.00, 0.00, 0.00, 150000.00, 'QRIS');

-- 7. Insert 9 Data ke Tabel PENJUALAN_DETAIL (Memuat KodeJual, KodeProduk, Quantity, dll)
INSERT INTO PENJUALAN_DETAIL (KodeJual, KodeProduk, Quantity, HargaSatuan, Subtotal) VALUES
('TRX-20261001-001', 'PRD-01', 1, 18000.00, 18000.00),
('TRX-20261001-001', 'PRD-05', 1, 50000.00, 50000.00),
('TRX-20261001-002', 'PRD-02', 2, 22000.00, 44000.00),
('TRX-20261001-002', 'PRD-03', 2, 24000.00, 48000.00),
('TRX-20261001-003', 'PRD-05', 1, 50000.00, 50000.00),
('TRX-20261002-004', 'PRD-03', 1, 24000.00, 24000.00),
('TRX-20261002-004', 'PRD-07', 1, 100000.00, 100000.00),
('TRX-20261002-005', 'PRD-05', 1, 50000.00, 50000.00),
('TRX-20261002-005', 'PRD-07', 1, 100000.00, 100000.00);

-- 8. Insert 5 Data ke Tabel PENGELUARAN
INSERT INTO PENGELUARAN (KodePengeluaran, KodeToko, KodeKasir, TglPengeluaran, Kategori, Deskripsi, Jumlah, SumberDana) VALUES
('EXP-01', 'TKO-01', 'KSR-02', '2026-10-01', 'Bahan Baku', 'Pembelian Es Batu Kristal 10 Kantong', 100000.00, 'KAS_KASIR'),
('EXP-02', 'TKO-01', 'KSR-02', '2026-10-01', 'Operasional Carwash', 'Shampoo Salju Cuci Mobil 2 Galon', 150000.00, 'KAS_KASIR'),
('EXP-03', 'TKO-01', 'KSR-03', '2026-10-01', 'Perlengkapan Kasir', 'Kertas Thermal Struk 58mm 1 Pack', 65000.00, 'KAS_KASIR'),
('EXP-04', 'TKO-01', 'KSR-02', '2026-10-02', 'Bahan Baku', 'Susu Segar UHT Full Cream 1 Karton', 220000.00, 'KAS_KASIR'),
('EXP-05', 'TKO-01', 'KSR-03', '2026-10-02', 'Kebersihan', 'Plastik Sampah & Lap Microfiber', 85000.00, 'KAS_KASIR');

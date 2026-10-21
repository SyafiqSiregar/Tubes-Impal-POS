-- ==============================================================================
-- QUERY PENGUJIAN RELASI & PEMBUKTIAN BASIS DATA (DQL / JOIN)
-- POS RAYA KOFFIE & 439 CARWASH
-- ==============================================================================

-- Uji 1: Menampilkan Laporan Transaksi Lengkap (JOIN Penjualan + Toko + Kasir + Pelanggan)
SELECT 
    p.KodeJual,
    p.TglJual,
    t.NamaToko,
    k.NamaKasir,
    COALESCE(plg.NamaPelanggan, 'Umum') AS NamaPelanggan,
    COALESCE(plg.PlatNomor, '-') AS PlatNomor,
    p.MetodeBayar,
    p.Total
FROM PENJUALAN p
JOIN TOKO t ON p.KodeToko = t.KodeToko
JOIN KASIR k ON p.KodeKasir = k.KodeKasir
LEFT JOIN PELANGGAN plg ON p.KodePelanggan = plg.KodePelanggan
ORDER BY p.TglJual ASC;

-- Uji 2: Menampilkan Rincian Detail Belanja per Transaksi (JOIN Penjualan + Detail + Produk)
SELECT 
    d.KodeJual,
    prd.NamaProduk,
    kat.NamaKategori,
    d.Quantity,
    prd.Satuan,
    d.HargaSatuan,
    d.Subtotal
FROM PENJUALAN_DETAIL d
JOIN PRODUK prd ON d.KodeProduk = prd.KodeProduk
JOIN KATEGORI kat ON prd.KodeKategori = kat.KodeKategori
ORDER BY d.KodeJual, d.KodeDetail;

-- Uji 3: Rekap Penjualan dan Monitoring Stok Produk (Kebutuhan Bisnis POS)
SELECT 
    prd.KodeProduk,
    prd.NamaProduk,
    prd.Stock,
    prd.StockMin,
    prd.Satuan,
    COALESCE(SUM(d.Quantity), 0) AS TotalTerjual,
    CASE 
        WHEN prd.Stock <= prd.StockMin THEN 'PERINGATAN: STOK MENIPIS'
        ELSE 'STOK AMAN'
    END AS StatusInventori
FROM PRODUK prd
LEFT JOIN PENJUALAN_DETAIL d ON prd.KodeProduk = d.KodeProduk
GROUP BY prd.KodeProduk, prd.NamaProduk, prd.Stock, prd.StockMin, prd.Satuan
ORDER BY TotalTerjual DESC;

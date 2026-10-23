import { supabase } from './supabaseClient.js';

// --- KASIR (USERS) ---
export async function getKasir() {
  const { data, error } = await supabase.from('kasir').select('*').order('kodekasir', { ascending: true });
  if (error) {
    console.error('Error getKasir:', error);
    return [];
  }
  return data;
}

// --- PRODUK ---
export async function getProducts() {
  const { data, error } = await supabase.from('produk').select('*').order('kodeproduk', { ascending: true });
  if (error) {
    // Fallback ke tabel lama jika ada
    const fallback = await supabase.from('products').select('*');
    return fallback.data || [];
  }
  return data;
}

// Map helper untuk kode produk
function resolveKodeProduk(item) {
  if (item.id && typeof item.id === 'string' && item.id.startsWith('PRD-')) {
    return item.id;
  }
  const idNum = parseInt(item.id, 10);
  if (idNum === 1) return 'PRD-01';
  if (idNum === 2) return 'PRD-02';
  if (idNum === 3) return 'PRD-01'; // Americano fallback ke Kopi Susu
  if (idNum === 4) return 'PRD-03'; // Matcha
  if (idNum === 5) return 'PRD-04'; // Croissant
  if (idNum === 6) return 'PRD-05'; // Cuci Mobil
  if (idNum === 7) return 'PRD-06'; // Cuci Motor
  if (idNum === 8) return 'PRD-07'; // Wax Interior

  // Name based fallback
  const name = (item.name || '').toLowerCase();
  if (name.includes('susu') || name.includes('aren') || name.includes('americano')) return 'PRD-01';
  if (name.includes('latte')) return 'PRD-02';
  if (name.includes('matcha')) return 'PRD-03';
  if (name.includes('croissant')) return 'PRD-04';
  if (name.includes('cuci mobil') || name.includes('mobil')) return 'PRD-05';
  if (name.includes('motor')) return 'PRD-06';
  if (name.includes('wax') || name.includes('interior')) return 'PRD-07';

  return 'PRD-01';
}

// --- TRANSAKSI (PENJUALAN & PENJUALAN_DETAIL) ---
export async function addTransaction(trx) {
  try {
    const rawId = String(trx.id || Date.now()).replace(/[^0-9]/g, '');
    const kodeJual = 'TRX-' + (rawId.length >= 8 ? rawId.slice(-10) : (Date.now().toString().slice(-8) + '-' + rawId));

    // Resolve cashier
    let kodeKasir = 'KSR-01';
    if (trx.cashierId && String(trx.cashierId).startsWith('KSR-')) {
      kodeKasir = trx.cashierId;
    } else if (trx.cashierName && trx.cashierName.toLowerCase().includes('budi')) {
      kodeKasir = 'KSR-02';
    } else if (trx.cashierName && trx.cashierName.toLowerCase().includes('siti')) {
      kodeKasir = 'KSR-03';
    }

    // 1. Simpan ke tabel PENJUALAN
    const payloadPenjualan = {
      kodejual: kodeJual,
      kodetoko: 'TKO-01',
      kodekasir: kodeKasir,
      kodepelanggan: null,
      tgljual: new Date().toISOString(),
      subtotal: Number(trx.subtotal || trx.total || 0),
      diskon: Number(trx.discount || 0),
      pajak: Number(trx.tax || 0),
      total: Number(trx.total || 0),
      metodebayar: (trx.method === 'TUNAI' ? 'CASH' : (trx.method || 'CASH')).toUpperCase()
    };

    const { data: pData, error: pError } = await supabase.from('penjualan').insert([payloadPenjualan]).select();
    if (pError) {
      console.error('Supabase Penjualan Insert Error:', pError);
    } else {
      console.log('✅ Sukses sync ke Supabase tabel PENJUALAN:', kodeJual);
    }

    // 2. Simpan ke tabel PENJUALAN_DETAIL
    if (Array.isArray(trx.items) && trx.items.length > 0) {
      const details = trx.items.map(item => {
        const prdCode = resolveKodeProduk(item);
        const qty = Math.max(1, parseInt(item.qty || item.quantity, 10) || 1);
        const price = Number(item.price || item.hargasatuan || 0);
        return {
          kodejual: kodeJual,
          kodeproduk: prdCode,
          quantity: qty,
          hargasatuan: price,
          subtotal: price * qty
        };
      });

      const { error: dError } = await supabase.from('penjualan_detail').insert(details);
      if (dError) {
        console.error('Supabase PenjualanDetail Insert Error:', dError);
      } else {
        console.log(`✅ Sukses sync ${details.length} item ke Supabase tabel PENJUALAN_DETAIL`);
      }
    }

    return pData ? pData[0] : null;
  } catch (err) {
    console.error('Error addTransaction Supabase:', err);
    return null;
  }
}

// --- PENGELUARAN (EXPENSES) ---
export async function addExpense(expense) {
  try {
    const rawId = String(expense.id || Date.now()).replace(/[^0-9]/g, '').slice(-4);
    const kodeExp = 'EXP-' + (rawId || Math.floor(Math.random() * 1000));
    const payload = {
      kodepengeluaran: kodeExp,
      kodetoko: 'TKO-01',
      kodekasir: 'KSR-01',
      tglpengeluaran: new Date().toISOString().split('T')[0],
      kategori: expense.category || 'Operasional',
      deskripsi: expense.desc || 'Pengeluaran Kasir',
      jumlah: Number(expense.amount || 0),
      sumberdana: (expense.fundSource || 'KAS_KASIR').toUpperCase()
    };

    const { data, error } = await supabase.from('pengeluaran').insert([payload]).select();
    if (error) console.error('Supabase Expense Error:', error);
    return data ? data[0] : null;
  } catch (e) {
    console.error('Expense sync error:', e);
    return null;
  }
}

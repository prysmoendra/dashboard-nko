-- Migration to re-seed monthly_targets data
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
    v_unit_id uuid;
BEGIN
    -- 1. Get the Unit ID for 'ULP Cimahi Kota'
    -- Ensure this unit exists in your 'work_units' table.
    SELECT id INTO v_unit_id FROM public.work_units WHERE name = 'ULP Cimahi Kota' LIMIT 1;

    IF v_unit_id IS NULL THEN
        RAISE EXCEPTION 'Unit "ULP Cimahi Kota" not found in work_units table. Please check the name.';
    END IF;

    -- 2. Insert the data
    -- Columns: month, year, division_name, indicator_name, unit_measurement, target_value, weight, unit_id
    INSERT INTO public.monthly_targets (
        month, 
        year, 
        division_name, 
        indicator_name, 
        unit_measurement, 
        target_value, 
        weight, 
        unit_id
    ) VALUES
    (1, 2026, 'JAR', 'SAIDI (sesuai kewenangan)', 'menit/plg', 117.22, 6, v_unit_id),
    (1, 2026, 'NPS', 'Pencapaian Rata-Rata Saldo Tanggal 20', 'Rp. Juta', 1203.7, 4, v_unit_id),
    (1, 2026, 'TEL', 'Tindak Lanjut LKBK', 'Pelanggan', 100, 4, v_unit_id),
    (1, 2026, 'TEL', 'Perolehan Temuan P2TL', '%', 100, 3, v_unit_id),
    (1, 2026, 'TEL', 'Sisa Stand Bongkar Migrasi', '%', 100, 3, v_unit_id),
    (1, 2026, 'NPS', 'Penjualan Tenaga Listrik', 'GWh', 297.65, 14, v_unit_id),
    (1, 2026, 'JAR', 'Gangguan TM ≤ 5 Menit', 'kali', 23.03, 3, v_unit_id),
    (1, 2026, 'NPS', 'Rating PLN Mobile', 'Rating', 0.01, 2, v_unit_id),
    (1, 2026, 'JAR', 'Feedback Rating Negatif pada PLN Mobile', '%', 0.03, 2, v_unit_id),
    (1, 2026, 'JAR', 'Gangguan TM > 5 Menit', 'kali', 14, 4, v_unit_id),
    (1, 2026, 'TEL', 'Jumlah Pengguna Swa Cam', 'Pelanggan', 7853, 4, v_unit_id),
    (1, 2026, 'JAR', 'Kerusakan Peralatan Distribusi (PHB TM <', 'Unit', 2, 3, v_unit_id),
    (1, 2026, 'JAR', 'ENS (sesuai kewenangan)', 'MVh', 40.87, 2, v_unit_id),
    (1, 2026, 'NPS', 'Jumlah Kali Transaksi Keuangan melalui', 'Kali Transaksi', 64911, 2, v_unit_id),
    (1, 2026, 'JAR', 'Pengaduan Gangguan Berulang pada PLN', '%', 0.01, 2, v_unit_id),
    (1, 2026, 'JAR', 'MV Outage Duration', '%', 100, 3, v_unit_id),
    (1, 2026, 'NPS', 'Jumlah Penambahan Pelanggan Produk T', 'Pelanggan', 703.97, 2, v_unit_id),
    (1, 2026, 'TEL', 'Susut Distribusi Tanpa E-min (sesuai kewenangan)', '%', 5.7, 4, v_unit_id),
    (1, 2026, 'NPS', 'Penyelesaian Temuan P2TL', '%', 100, 3, v_unit_id),
    (1, 2026, 'NPS', 'Pencapaian Pelunasan PRR', 'Rp. Juta', 32.46, 3, v_unit_id),
    (1, 2026, 'JAR', 'SAIFI (sesuai kewenangan)', 'kali/plg', 1.47, 6, v_unit_id),
    (1, 2026, 'NPS', 'Pencapaian Saldo Rata-Rata Akhir Bulan', 'Rp. Juta', 526.31, 3, v_unit_id),
    (1, 2026, 'JAR', 'Response Time atas Gangguan (di luar Cle', 'Menit', 30, 3, v_unit_id),
    (1, 2026, 'NPS', 'Penambahan Jumlah Pelanggan', 'Pelanggan', 5087, 3, v_unit_id),
    (1, 2026, 'NPS', 'Penambahan Daya Tersambung', 'MVA', 13.5, 3, v_unit_id),
    (1, 2026, 'TEL', 'Penyelesaian Ganti Meter', 'Unit', 2694, 2, v_unit_id);

    RAISE NOTICE 'Successfully inserted % rows into monthly_targets for Unit ID %', 26, v_unit_id;

END $$;

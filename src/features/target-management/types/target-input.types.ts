/**
 * Target Input - Type definitions
 * Types for monthly target setting by Kabid
 */

/**
 * Division options for targets (Using abbreviations)
 */
export const DIVISIONS = [
    'JAR',  // Jaringan
    'NPS',  // Pemasaran
    'TEL',  // Transaksi Energi
] as const;

export type Division = typeof DIVISIONS[number];

/**
 * Indicator definition with default unit and weight
 */
export interface IndicatorDefinition {
    name: string;
    unit: string;
    weight: number;
}

/**
 * Indicator options mapped by division with default values
 * Based on real NKO Master Data from database
 */
export const INDICATORS_BY_DIVISION: Record<Division, IndicatorDefinition[]> = {
    'JAR': [
        { name: 'SAIDI (sesuai kewenangan)', unit: 'menit/plg', weight: 6.0 },
        { name: 'SAIFI (sesuai kewenangan)', unit: 'kali/plg', weight: 6.0 },
        { name: 'ENS (sesuai kewenangan)', unit: 'MWh', weight: 2.0 },
        { name: 'Gangguan TM > 5 Menit', unit: 'kali', weight: 4.0 },
        { name: 'Gangguan TM ≤ 5 Menit', unit: 'kali', weight: 3.0 },
        { name: 'Kerusakan Peralatan Distribusi (PHB TM dan Trafo)', unit: 'Unit', weight: 3.0 },
        { name: 'Feedback Rating Negatif pada PLN Mobile - Gangguan', unit: '%', weight: 4.0 },
        { name: 'Pengaduan Gangguan Berulang pada PLN Mobile', unit: '%', weight: 4.0 },
        { name: 'Response Time atas Gangguan (diluar Clear Tamper)', unit: 'Menit', weight: 10.0 },
        { name: 'MV Outage Duration', unit: '%', weight: 5.0 },
        { name: 'Penormalan Siaga 1 Gangguan TM', unit: '%', weight: 5.0 },
    ],
    'NPS': [
        { name: 'Penjualan Tenaga Listrik', unit: 'GWh', weight: 14.0 },
        { name: 'Penyelesaian Temuan P2TL', unit: '%', weight: 3.0 },
        { name: 'Rating PLN Mobile', unit: 'Rating', weight: 2.0 },
        { name: 'Jumlah Kali Transaksi Keuangan melalui PLN Mobile', unit: 'Kali Transaksi', weight: 2.0 },
        { name: 'Penambahan Daya Tersambung', unit: 'MVA', weight: 4.0 },
        { name: 'Penambahan Jumlah Pelanggan', unit: 'Pelanggan', weight: 3.0 },
        { name: 'Implementasi Kesesuaian Sektor Bisnis (KBLI 2020)', unit: 'Pelanggan', weight: 3.0 },
        { name: 'Jumlah Penambahan Pelanggan Produk Tematik', unit: 'Pelanggan', weight: 2.0 },
        { name: 'Pencapaian Rata-Rata Saldo Tanggal 20 (Non Instansi)', unit: 'Rp. Juta', weight: 4.0 },
        { name: 'Pencapaian Saldo Rata-Rata Akhir Bulan (Non Instansi)', unit: 'Rp. Juta', weight: 3.0 },
        { name: 'Pencapaian Pelunasan PRR', unit: 'Rp. Juta', weight: 3.0 },
    ],
    'TEL': [
        { name: 'Susut Distribusi Tanpa E-min (sesuai kewenangan)', unit: '%', weight: 4.0 },
        { name: 'Perolehan Temuan P2TL', unit: '%', weight: 3.0 },
        { name: 'Penyelesaian Ganti Meter', unit: 'Unit', weight: 2.0 },
        { name: 'Penambahan Jumlah Pelanggan Rumah Tangga Lisdes', unit: 'Pelanggan', weight: 2.0 },
        { name: 'Peningkatan kWh Penjualan dari Pelanggan RT Lisdes', unit: 'kWh', weight: 2.0 },
        { name: 'Jumlah Pengguna Swa Cam', unit: 'Pelanggan', weight: 4.0 },
        { name: 'Tindak Lanjut LBKB', unit: 'Pelanggan', weight: 4.0 },
        { name: 'Sisa Stand Bongkar Migrasi', unit: '%', weight: 3.0 },
    ],
};

/**
 * Period selection for target input
 */
export interface TargetPeriod {
    month: number;  // 1-12
    year: number;   // e.g., 2026
}

/**
 * Single target input row in the form
 */
export interface TargetInputRow {
    id: string;                      // Temporary ID for React key
    divisionName: Division;
    indicatorName: string;
    unitMeasurement: string;
    targetValue: number | null;
    weight: number | null;
}

/**
 * Payload for submitting targets to Supabase
 */
export interface TargetSubmissionPayload {
    unit_id: string;
    month: number;
    year: number;
    division_name: string;
    indicator_name: string;
    unit_measurement: string;
    target_value: number;
    weight: number;
}

/**
 * Validation result for target inputs
 */
export interface TargetValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

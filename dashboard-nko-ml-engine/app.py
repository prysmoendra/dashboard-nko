from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Wajib agar Next.js bisa komunikasi dengan Python

# --- 1. SETUP & LOAD MODEL ---
print("⚙️  Sedang memuat otak AI... Tunggu sebentar...")
try:
    # Load Model & Encoder hasil training di Notebook
    model = joblib.load('model_nko_rf.pkl')
    le_unit = joblib.load('encoder_unit.pkl')
    le_div = joblib.load('encoder_div.pkl')
    le_ind = joblib.load('encoder_ind.pkl')
    print("✅ SIAP! Model AI berhasil dimuat.")
except Exception as e:
    print(f"❌ GAWAT! Gagal load model. Pastikan file .pkl ada di folder ini.\nError: {e}")

# --- 2. DATABASE TANGGUNG JAWAB (MANAJERIAL) ---
# Ini agar solusi yang diberikan spesifik menunjuk jabatan tertentu
RESPONSIBILITY_MAP = {
    "01. Penjualan Tenaga Listrik": {"bidang": "Pemasaran", "role": "Asman Pemasaran"},
    "02. SAIDI (sesuai kewenangan)": {"bidang": "Jaringan", "role": "Asman Jaringan"},
    "03. SAIFI (sesuai kewenangan)": {"bidang": "Jaringan", "role": "Asman Jaringan"},
    "06. Perolehan Temuan P2TL": {"bidang": "Transaksi Energi", "role": "Asman Transaksi Energi"},
    "29. Pencapaian Saldo Rata-Rata Akhir Bulan": {"bidang": "Keuangan", "role": "Asman Keuangan & Umum"},
    "Default": {"bidang": "Operasional", "role": "Asman Terkait"} # Fallback
}

# --- 3. OTAK "WISDOM" (HYBRID LOGIC) ---
def generate_hybrid_wisdom(indikator, status_real, persen_real, status_prediksi, persen_prediksi, role):
    """
    Fungsi ini menggabungkan Fakta (Real) dan Ramalan (Prediksi)
    untuk menghasilkan instruksi manajerial bagi Kabid.
    """
    
    # KASUS 1: Realita MERAH & Prediksi MERAH (Bahaya Nyata)
    if status_real == 'merah' and status_prediksi == 'merah':
        return (f"🚨 **PERINGATAN KRITIS**: Kinerja saat ini BURUK ({persen_real:.1f}%) dan AI memprediksi "
                f"TIDAK AKAN TERCAPAI ({persen_prediksi:.1f}%) di akhir bulan. "
                f"Sistem menyarankan Kabid segera memanggil {role} untuk intervensi taktis hari ini.")

    # KASUS 2: Realita MERAH tapi Prediksi HIJAU (Masalah Sementara)
    elif status_real == 'merah' and status_prediksi == 'hijau':
        return (f"📉 **INFO TREN**: Saat ini status MERAH ({persen_real:.1f}%), namun AI mendeteksi pola positif "
                f"menuju HIJAU ({persen_prediksi:.1f}%) nanti. "
                f"Saran: Cukup monitoring progress mingguan, belum perlu intervensi besar.")

    # KASUS 3: Realita HIJAU tapi Prediksi MERAH (Jebakan/Peringatan Dini)
    elif status_real == 'hijau' and status_prediksi == 'merah':
        return (f"⚠️ **ANOMALI TERDETEKSI**: Saat ini terlihat aman (HIJAU), TAPI AI memprediksi potensi "
                f"penurunan drastis menjadi MERAH ({persen_prediksi:.1f}%) di akhir bulan. "
                f"Saran: Instruksikan {role} untuk mengecek potensi gangguan teknis/administrasi segera.")
    
    # KASUS 4: Semua HIJAU (Aman)
    else:
        return (f"✅ **AMAN**: Kinerja On-Track. Realisasi dan prediksi konsisten HIJAU. "
                f"Tidak perlu tindakan korektif.")

# --- 4. API ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Validasi: Pastikan Frontend mengirim data 'realization' (Input Pegawai)
        if 'realization' not in data:
            return jsonify({"status": "error", "message": "Wajib menyertakan data 'realization' (input pegawai)!"}), 400

        # A. ENCODING (Ubah Teks -> Angka agar dimengerti AI)
        def safe_enc(le, val):
            return le.transform([val])[0] if val in le.classes_ else 0
            
        unit_enc = safe_enc(le_unit, data['unit_name'])
        div_enc = safe_enc(le_div, data['division_name'])
        ind_enc = safe_enc(le_ind, data['indicator_name'])

        # B. MEMINTA AI MERAMAL MASA DEPAN (Prediksi Akhir Bulan)
        # Input urutan fitur harus SAMA PERSIS dengan saat training di Notebook
        # [month, year, target, weight, unit_encoded, div_encoded, ind_encoded]
        input_ml = [[
            int(data['month']),
            int(data['year']),
            float(data['target']),
            float(data['weight']),
            unit_enc,
            div_enc,
            ind_enc
        ]]
        
        nilai_prediksi = model.predict(input_ml)[0]
        target = float(data['target'])
        
        # Hitung Status Masa Depan (Prediksi)
        persen_prediksi = (nilai_prediksi / target) * 100 if target != 0 else 0
        status_prediksi = "hijau" if persen_prediksi >= 100 else ("kuning" if persen_prediksi >= 95 else "merah")

        # C. HITUNG STATUS SAAT INI (Fakta Input Pegawai)
        nilai_real = float(data['realization'])
        persen_real = (nilai_real / target) * 100 if target != 0 else 0
        status_real = "hijau" if persen_real >= 100 else ("kuning" if persen_real >= 95 else "merah")

        # D. GENERATE WISDOM (Solusi Cerdas)
        # Cari siapa PIC-nya
        pic_info = RESPONSIBILITY_MAP.get(data['indicator_name'], RESPONSIBILITY_MAP['Default'])
        
        pesan_wisdom = generate_hybrid_wisdom(
            data['indicator_name'], 
            status_real, persen_real, 
            status_prediksi, persen_prediksi, 
            pic_info['role']
        )

        # E. KIRIM JAWABAN KE NEXT.JS
        return jsonify({
            "status": "success",
            "data": {
                "real_status": status_real,         # PENTING: Gunakan ini untuk Warna Kartu di Dashboard
                "real_percent": round(persen_real, 2),
                
                "predicted_status": status_prediksi, # Info tambahan (bisa di tooltip)
                "predicted_percent": round(persen_prediksi, 2),
                
                "wisdom": pesan_wisdom,             # Teks Solusi untuk Kabid
                "pic": pic_info['role']             # Siapa yang harus dipanggil
            }
        })

    except Exception as e:
        print(f"Error pada proses prediksi: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
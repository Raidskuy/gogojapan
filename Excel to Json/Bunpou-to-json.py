import pandas as pd
import os

# ==========================================================
# Bunpou-to-json.py
# Script untuk mengekspor data dari Excel ke JSON
# ==========================================================

# Ambil path folder tempat script ini berada
base_path = os.path.dirname(os.path.abspath(__file__))

# Nama file Excel
excel_filename = "bunpou.xlsx"

# Path lengkap file Excel
excel_path = os.path.join(base_path, excel_filename)

# Cek apakah file Excel ada
if not os.path.exists(excel_path):
    print(f"❌ File '{excel_filename}' tidak ditemukan di folder:\n{base_path}")
    print("\nPastikan file Excel berada di folder yang sama dengan script ini.")
    exit(1)

# Baca file Excel
print("📖 Membaca file Excel...")
df = pd.read_excel(excel_path)

# Tampilkan isi dataframe (opsional)
print("\n✅ Isi Data:")
print(df)

# Path output JSON
output_filename = "bunpou_export.json"
output_path = os.path.join(base_path, output_filename)

# Ekspor ke JSON
df.to_json(output_path, orient="records", force_ascii=False, indent=4)

print(f"\n🎉 Data berhasil diekspor ke file:\n{output_path}")

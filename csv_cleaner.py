import pandas as pd

# Ganti 'nama_file_anda.csv' dengan nama file CSV Anda
# Pastikan file CSV sudah diunggah ke sesi Colab Anda

csv_file = input("Masukkan nama file CSV (misal: stockx_nike.csv): ")

try:
    # 1. Muat data dari file CSV
    df = pd.read_csv('output/'+csv_file)

    # Pastikan nama kolom 'Image URL' sudah benar
    kolom_target = 'Image URL'
    parameter_baru = '?w=576&q=60&dpr=3&updated_at=1744392270&h=384%201x'
    nama_file_output = 'image_clean.csv'

    # Periksa apakah kolom 'Image URL' ada di DataFrame
    if kolom_target in df.columns:
        # 2. Terapkan perubahan pada kolom 'Image URL' (mengganti parameter)
        df[kolom_target] = df[kolom_target].apply(
            lambda x: x.split('?')[0] + parameter_baru if isinstance(x, str) and '?' in x else (x if pd.isna(x) else str(x) + parameter_baru)
        )

        print(f"Parameter pada kolom '{kolom_target}' telah diperbarui.")

        # Tampilkan beberapa baris pertama untuk verifikasi (opsional)
        print("\nBeberapa baris pertama setelah perubahan:")
        # display(df.head())

        # 3. Simpan DataFrame yang telah dimodifikasi ke file CSV baru
        df.to_csv(nama_file_output, index=False)

        print(f"\nHasil disimpan ke dalam file '{nama_file_output}'.")

    else:
        print(f"Kolom '{kolom_target}' tidak ditemukan dalam file CSV.")

except FileNotFoundError:
    print("Error: File CSV tidak ditemukan. Pastikan nama file sudah benar dan file sudah diunggah.")
except Exception as e:
    print(f"Terjadi kesalahan: {e}")

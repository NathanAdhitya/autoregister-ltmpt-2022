## Harap ketahui!
Repository ini ditujukan bagi mereka yang frustrasi kenapa API Kemdikbud error terus ketika mencoba daftar LTMPT.

## Cara penggunaan:
1. Pastikan anda memilik NodeJS v17 (inilah yang saya gunakan) dan npm/yarn
2. Clone repository ini
3. `npm install` / `yarn install`
4. Copas `.env.example` ke `.env`, dan isi sesuai data pribadi.
5. Jalankan script register.js dengan `node register.js`
6. Harap bersabar? tunggu hingga `======succeeded fully registering======` muncul
7. profit?

## Cara kerja:
1. Runs 5 fetch operations in parallel, posting the first step until next data is retrieved.
2. Once retrieved, usen JSDOM to convert to FormData.
3. Modify FormData attributes according to the .env.
4. Submit on the last step.

## Apakah Anda ingin kontribusi?
Silahkan buat Pull Request/Issue yang baik. Dokumentasikan perubahan. Saya tidak menjamin saya dapat membalas dalam waktu singkat karena beban SMA. Saya tidak menjamin script ini akan terus berhasil.

## Ide untuk mempercepat script (jika ada yang ingin membuat PR):
Scrape dari data NISN kemendikbud directly, dan precompute tanggal lahir, sehingga tidak harus menunggu langkah pertama.
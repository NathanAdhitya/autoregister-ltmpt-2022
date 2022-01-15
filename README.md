# Registrasi LTMPT Otomatis 2022
![build workflow](https://github.com/NathanAdhitya/autoregister-ltmpt-2022/actions/workflows/build.yml/badge.svg)
[![Downloads](https://img.shields.io/badge/download-win64-green)](https://github.com/NathanAdhitya/autoregister-ltmpt-2022/releases/download/latest/autoregister-ltmpt-2022.exe)
[![Donate](https://img.shields.io/badge/donate-saweria.co-yellow)](https://saweria.co/nathanadhitya)
## Harap ketahui!
Repository ini ditujukan untuk membantu mereka yang frustrasi akibat API Kemdikbud error terus / kuota penuh ketika mencoba daftar LTMPT.

## Cara penggunaan (versi awam):
Cara penggunaan ini adalah untuk Windows x64, jika anda menggunakan MacOS atau Linux, silahkan ikuti cara pengunaan **Manual Install** di bawah.
1. Klik badge download|win64 di atas, atau [klik di sini](https://github.com/NathanAdhitya/autoregister-ltmpt-2022/releases/download/latest/autoregister-ltmpt-2022.exe) dan download file tersebut.
2. Download file .env.example, [klik di sini](https://raw.githubusercontent.com/NathanAdhitya/autoregister-ltmpt-2022/master/.env.example). Klik kanan, save file as, dan beri nama/rename `.env`.
3. Letakkan file `.env` dan file `autoregister-ltmpt-2022.exe` pada folder yang sama.
4. Bukalah file `.env` dan isilah sesuai data Anda.
5. Jalankan `autoregister-ltmpt-2022.exe`.
6. Harap ditunggu. Jika terjadi masalah, silahkan buat Issue pada GitHub ini.
7. Jika berhasil, akan muncul `Part 2 registration completed. Check your email for further instructions.`
8. Cek email Anda dan selamat menikmati. Don't forget to star this repo and share it to your friends!

## Cara penggunaan (Manual Install):
1. Pastikan anda memiliki NodeJS v17 (versi node yang saya gunakan) dan npm. Node dan npm dapat di download dari [situs official NodeJS](https://nodejs.org/en/download/). Atau jika menggunakan chocolatey, dapat diinstal menggunakan `choco install nodejs -y` sebagai admin.
2. Download repository ini dengan menekan tombol hijau "Code" lalu "Download Zip". Unzip folder yang terdownload. Jika anda tidak menemukan tombol tersebut pada halaman ini, silahkan coba kunjungi halaman [link repo utama](https://github.com/NathanAdhitya/autoregister-ltmpt-2022).
3. Buka terminal anda (PowerShell atau Command Prompt di Windows), lalu gunakan command `cd Downloads/autoregister-ltmpt-2022-master` (sesuai dengan directory download anda) untuk navigasi ke root directory proyek. Pastikan anda berada pada directory yang benar dengan memastikan keberadaan file `package.json` dalam folder tersebut. Bagi yang belum bisa menggunakan command `cd`, silahkan menyimak artikel [berikut](https://www.howtogeek.com/659411/how-to-change-directories-in-command-prompt-on-windows-10/).
4. Pastikan versi Node.js Anda sesuai. Coba jalankan `node -v`, jika tidak ditemukan, berarti instalasi Node.js Anda kurang tepat. Versi yang dibutuhkan versi >15.0.0.
5. Jalankan command `npm install`
6. Rename file `.env.example` ke `.env`, dan edit isi file sesuai data pribadi anda. Pastikan anda hanya merubah nilai yang ada diantara tanda petik.
7. Jalankan script register.js dengan menuliskan command `node register.js` pada terminal anda.
8. Harap bersabar? tunggu hingga `======succeeded fully registering======` muncul.
9. profit? cek email anda untuk melanjutkan verifikasi. setelah itu anda dapat login di portal.ltmpt.ac.id

## Cara kerja:
1. Runs 5 fetch operations in parallel, posting the first step until next data is retrieved.
2. Once retrieved, usen JSDOM to convert to FormData.
3. Modify FormData attributes according to the .env.
4. Submit on the last step.

## Apakah Anda ingin kontribusi?
Silahkan buat Pull Request/Issue yang baik. Dokumentasikan perubahan. Saya tidak menjamin saya dapat membalas dalam waktu singkat karena beban SMA. Saya tidak menjamin script ini akan terus berhasil.

## Ide untuk mempercepat script (jika ada yang ingin membuat PR):
Scrape dari data NISN kemendikbud directly, dan precompute tanggal lahir, sehingga tidak harus menunggu langkah pertama.

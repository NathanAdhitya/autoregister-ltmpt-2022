# Registrasi LTMPT Otomatis 2022
## Harap ketahui!
Repository ini ditujukan bagi mereka yang frustrasi kenapa API Kemdikbud error terus ketika mencoba daftar LTMPT.

## Cara penggunaan:
1. Pastikan anda memiliki NodeJS v17 (versi node yang saya gunakan) dan npm. Node dan npm dapat di download dari [situs official NodeJS](https://nodejs.org/en/download/). Atau jika menggunakan chocolatey, dapat diinstal menggunakan `choco install nodejs -y` sebagai admin.
2. Download repository ini dengan menekan tombol hijau "Code" lalu "Download Zip". Unzip folder yang terdownload. Jika anda tidak menemukan tombol tersebut pada halaman ini, silahkan coba kunjungi halaman [link repo utama](https://github.com/NathanAdhitya/autoregister-ltmpt-2022).
3. Buka terminal anda (PowerShell atau Command Prompt di Windows), lalu gunakan command `cd Downloads/autoregister-ltmpt-2022-master` (sesuai dengan directory download anda) untuk navigasi ke root directory proyek. Pastikan anda berada pada directory yang benar dengan memastikan keberadaan file `package.json` dalam folder tersebut. Bagi yang belum bisa menggunakan command `cd`, silahkan menyimak artikel [berikut](https://www.howtogeek.com/659411/how-to-change-directories-in-command-prompt-on-windows-10/).
4. Jalankan command `npm install`
5. Rename file `.env.example` ke `.env`, dan edit isi file sesuai data pribadi anda. Pastikan anda hanya merubah nilai yang ada diantara tanda petik.
6. Jalankan script register.js dengan menuliskan command `node register.js` pada terminal anda.
7. Harap bersabar? tunggu hingga `======succeeded fully registering======` muncul.
8. profit? cek email anda untuk melanjutkan verifikasi. setelah itu anda dapat login di portal.ltmpt.ac.id

## Cara kerja:
1. Runs 5 fetch operations in parallel, posting the first step until next data is retrieved.
2. Once retrieved, usen JSDOM to convert to FormData.
3. Modify FormData attributes according to the .env.
4. Submit on the last step.

## Apakah Anda ingin kontribusi?
Silahkan buat Pull Request/Issue yang baik. Dokumentasikan perubahan. Saya tidak menjamin saya dapat membalas dalam waktu singkat karena beban SMA. Saya tidak menjamin script ini akan terus berhasil.

## Ide untuk mempercepat script (jika ada yang ingin membuat PR):
Scrape dari data NISN kemendikbud directly, dan precompute tanggal lahir, sehingga tidak harus menunggu langkah pertama.

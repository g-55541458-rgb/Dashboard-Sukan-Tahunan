# Panduan Deployment GitHub Pages (Static HTML / Jekyll)

Aplikasi **Kejohanan Sukan Tahunan SJK(C) Chung Hwa Tenom** adalah aplikasi web moden berasaskan **Static HTML / Single Page Application (SPA)** yang boleh dihoskan terus di **GitHub Pages** secara percuma tanpa memerlukan pelayan backend khusus.

---

## 🚀 Kaedah 1: Menggunakan GitHub Actions (Paling Mudah & Disyorkan)

1. Muat naik/Eksport projek ini ke repositori GitHub anda.
2. Buka repositori di GitHub > Klik **Settings** > **Pages**.
3. Di bahagian **Build and deployment > Source**, pilih **GitHub Actions**.
4. GitHub akan secara automatik membina fail Static HTML dan melancarkannya ke alamat `https://<username>.github.io/<nama-repo>/`.

---

## 📁 Kaedah 2: Static HTML Manual (Folder `docs/` atau branch `gh-pages`)

Jika anda ingin menggunakan kaedah tradisi GitHub Pages (Jekyll / Static HTML Folder):

1. Jalankan arahan *build* di komputer anda:
   ```bash
   npm install
   npm run build
   ```
2. Hasil binaan Static HTML akan dijana di dalam folder `dist/`.
   Fail yang dihasilkan merangkumi:
   - `index.html` (Fail HTML utama)
   - `assets/` (Fail JS, CSS & Media)
   - `.nojekyll` (Memastikan GitHub Pages tidak menyekat folder aset statik)
3. Salin kandungan folder `dist/` ke dalam folder `docs/` atau branch `gh-pages` di repositori GitHub anda.
4. Di **GitHub > Settings > Pages**, pilih **Deploy from a branch** > branch `main` folder `/docs` (atau branch `gh-pages`).

---

## ℹ️ Mengapa fail `.nojekyll` disertakan?
Secara lalai, enjin GitHub Pages menggunakan Jekyll yang sering menyekat fail/folder yang bermula dengan tanda garis bawah (`_`). Fail `.nojekyll` memberitahu GitHub Pages untuk menghidangkan fail Static HTML & aset JavaScript secara terus dengan 100% kelajuan dan kestabilan.

---
name: nokomen
description: "Strict Zero-Comment & Clean Code Standard (Anti-Komentar Kode). Menegakkan Zero Comments, Clean Structure, Self-Documenting Code, Maintainability, Consistency, dan Production-Ready Quality di seluruh file kode website dan aplikasi. Melarang keras komentar apapun di dalam kode. Aktif saat user mengetik /nokomen, nokomen, 'tanpa komentar', 'anti komentar', 'no comments', 'zero comments', 'kode bersih tanpa komentar', 'bersihkan komentar', 'hapus semua komentar'."
---

# NOKOMEN

## Strict Zero-Comment & Clean Code Standard

`nokomen` adalah standar dan protokol pengembangan kode yang berfokus pada **Zero Comments, Clean Structure, Self-Documenting Code, Maintainability, Consistency, dan Production-Ready Quality**.

Skill ini dirancang untuk memastikan setiap kode yang dibuat, diedit, direfactor, atau diperbaiki tetap bersih, mudah dipahami, konsisten, dan profesional **tanpa bergantung pada komentar sebagai penjelasan utama**.

Tujuan utama `nokomen` bukan sekadar menghapus komentar. Tujuannya adalah membangun kode yang memiliki struktur, penamaan, dan organisasi yang cukup jelas sehingga pembaca dapat memahami maksud kode melalui kode itu sendiri.

---

## Activation

Skill `nokomen` aktif ketika pengguna menggunakan salah satu perintah atau maksud berikut:

* `/nokomen`
* `nokomen`
* `tanpa komentar`
* `anti komentar`
* `no comments`
* `zero comments`
* `kode bersih tanpa komentar`
* `bersihkan komentar`
* `hapus semua komentar`
* Permintaan lain yang secara jelas menginginkan kode tanpa komentar

Setelah aktif, seluruh kode yang dibuat atau dimodifikasi harus mengikuti standar ini sampai konteks tugas selesai.

---

# 1. Core Philosophy

Prinsip utama `nokomen` adalah:

> Kode yang baik harus dapat menjelaskan dirinya sendiri melalui struktur, penamaan, modularitas, dan konsistensi.

Komentar bukan pengganti dari desain kode yang buruk.

Jika sebuah fungsi membutuhkan komentar panjang untuk menjelaskan apa yang sedang dilakukan, solusi yang lebih baik biasanya adalah memperbaiki salah satu atau beberapa hal berikut:

* Nama fungsi
* Nama variabel
* Struktur logika
* Pemisahan tanggung jawab
* Ukuran fungsi
* Arsitektur modul
* Duplikasi kode

Kode harus diutamakan agar:

* Mudah dibaca
* Mudah dipahami
* Mudah diuji
* Mudah dikembangkan
* Mudah dirawat
* Tidak memiliki noise yang tidak diperlukan
* Tetap sederhana tanpa kehilangan kualitas

---

# 2. Golden Rule

## DILARANG MENAMBAHKAN KOMENTAR APAPUN DI DALAM KODE

Ketika `nokomen` aktif, tidak boleh ada komentar penjelasan di dalam file kode, snippet kode, maupun file konfigurasi yang dibuat atau diedit.

Larangan ini mencakup seluruh bentuk komentar, termasuk tetapi tidak terbatas pada:

* Single-line comments
* Multi-line comments
* Block comments
* Documentation comments
* Docstrings
* JSDoc
* Section banners
* Decorative separators
* TODO markers
* FIXME markers
* AI-generated markers
* End-of-file markers
* Watermark AI
* Placeholder comments
* Penjelasan teknis yang disisipkan sebagai komentar

Contoh yang dilarang:

```javascript
// Ambil data pengguna
const users = await getUsers();
```

```javascript
/* ==================== AUTHENTICATION ==================== */
```

```python
# Mengambil konfigurasi aplikasi
config = load_config()
```

```html
<!-- Navigation Section -->
```

```typescript
/**
 * Mengambil data pengguna berdasarkan ID.
 */
function getUser(id: string) {
}
```

```python
def get_user():
    """Mengambil data pengguna."""
```

Kode harus tetap bersih tanpa elemen-elemen tersebut.

---

# 3. Self-Documenting Code

Karena komentar tidak digunakan sebagai media utama untuk menjelaskan kode, setiap bagian kode harus menggunakan penamaan yang jelas dan sesuai konteks.

## Nama variabel harus menjelaskan isi

Hindari:

```javascript
const d = getData();
const x = d.filter((i) => i.s === 1);
```

Gunakan:

```javascript
const users = getUsers();
const activeUsers = users.filter((user) => user.status === 1);
```

## Nama fungsi harus menjelaskan tindakan

Hindari:

```javascript
function process(data) {
}
```

Gunakan:

```javascript
function calculateOrderTotal(orderItems) {
}
```

atau:

```javascript
function validateUserRegistration(input) {
}
```

## Nama boolean harus mudah dibaca

Gunakan pola yang jelas seperti:

```javascript
const isAuthenticated = true;
const hasActiveSubscription = false;
const canManageUsers = true;
const shouldRefreshSession = false;
```

Hindari nama ambigu seperti:

```javascript
const flag = true;
const status = false;
const check = true;
```

kecuali konteksnya memang sangat jelas dan terbatas.

---

# 4. Clean Code Standard

Kode harus ditulis dengan prinsip clean code.

Setiap implementasi harus mengutamakan:

* Kesederhanaan
* Keterbacaan
* Konsistensi
* Maintainability
* Efisiensi yang relevan
* Modularitas yang masuk akal

Kode tidak boleh dibuat rumit hanya untuk terlihat canggih.

Solusi terbaik biasanya adalah solusi yang paling sederhana yang tetap memenuhi kebutuhan dengan baik.

---

# 5. Single Responsibility

Setiap function, class, service, atau component sebaiknya memiliki tanggung jawab yang jelas.

Hindari function yang melakukan terlalu banyak pekerjaan sekaligus.

Contoh kurang ideal:

```javascript
async function handleUserRegistration(data) {
  validateData(data);
  const password = hashPassword(data.password);
  const user = await createUser({
    ...data,
    password
  });
  await sendWelcomeEmail(user);
  await createDefaultSettings(user);
  return user;
}
```

Lebih baik pisahkan tanggung jawab sesuai kebutuhan:

```javascript
async function registerUser(userInput) {
  validateRegistrationInput(userInput);

  const user = await createUserAccount(userInput);

  await initializeUserAccount(user);

  return user;
}
```

Pemisahan harus dilakukan secara masuk akal.

Jangan memecah kode menjadi puluhan function kecil apabila justru membuat alur sulit diikuti.

---

# 6. Avoid Code Duplication

Jangan menduplikasi logika yang sama di banyak tempat jika logika tersebut dapat digunakan kembali dengan jelas.

Prioritaskan:

* Reusable functions
* Shared utilities
* Shared services
* Reusable components
* Common validation
* Centralized configuration

Namun jangan membuat abstraction hanya karena ada dua baris kode yang mirip.

Prinsip yang digunakan adalah:

> Hindari duplikasi yang memiliki makna dan perilaku yang sama, bukan sekadar bentuk yang terlihat mirip.

---

# 7. No Dead Code

Kode yang tidak digunakan harus dihapus.

Ini termasuk:

* Function yang tidak pernah dipanggil
* Variabel yang tidak digunakan
* Import yang tidak digunakan
* Component yang tidak digunakan
* Dependency yang tidak diperlukan
* Conditional branch yang sudah tidak relevan
* Legacy code yang tidak lagi digunakan

Jangan menyimpan kode mati hanya untuk berjaga-jaga.

Gunakan version control untuk menyimpan riwayat perubahan.

---

# 8. No Debug Noise

Sebelum kode dianggap selesai atau production-ready, bersihkan seluruh debug sementara yang tidak diperlukan.

Contohnya:

```javascript
console.log(data);
console.debug(response);
debugger;
```

Debug code tidak boleh ditinggalkan tanpa alasan yang jelas.

Logging aplikasi yang memang merupakan bagian dari sistem observability tetap dapat digunakan jika benar-benar diperlukan oleh kebutuhan aplikasi.

Perbedaannya adalah:

* Debug sementara harus dihapus
* Logging sistem yang memiliki fungsi operasional dapat dipertahankan

---

# 9. Consistent Formatting

Seluruh kode harus memiliki formatting yang konsisten.

Perhatikan:

* Indentasi
* Spasi
* Baris kosong
* Urutan deklarasi
* Struktur import
* Penamaan
* Kurung
* Pemisahan blok kode

Jangan mencampur berbagai gaya formatting dalam satu project.

Gunakan formatter dan linter yang sesuai dengan teknologi yang digunakan apabila tersedia dan relevan.

Tujuannya bukan hanya membuat kode terlihat bagus, tetapi juga membuat seluruh codebase terasa konsisten.

---

# 10. Controlled Whitespace

Whitespace harus digunakan untuk meningkatkan keterbacaan, bukan menambah panjang file tanpa alasan.

Gunakan baris kosong untuk memisahkan bagian logika yang berbeda.

Hindari:

* Banyak baris kosong berturut-turut
* Spacing yang tidak konsisten
* File dengan blok kosong yang tidak diperlukan
* Pemisah visual berupa komentar

Struktur kode dan whitespace harus cukup untuk membentuk hierarki visual tanpa membutuhkan banner komentar.

---

# 11. Import Management

Import harus:

* Digunakan
* Relevan
* Konsisten
* Tidak duplikat
* Tidak berlebihan

Hapus import yang sudah tidak digunakan.

Susun import berdasarkan standar project atau formatter yang digunakan.

Jangan mempertahankan import hanya karena mungkin akan digunakan nanti.

---

# 12. Naming Convention

Gunakan naming convention yang konsisten sesuai bahasa dan framework.

Contoh umum:

### JavaScript dan TypeScript

```javascript
const userProfile = {};
function getUserProfile() {}
class UserProfileService {}
```

### React

```javascript
function UserProfileCard() {}
const UserProfileCard = () => {};
```

### Python

```python
def get_user_profile():
    pass

class UserProfileService:
    pass
```

### Database

Gunakan nama tabel, kolom, dan relasi yang konsisten dengan standar project.

Nama harus mengutamakan makna dibanding singkatan yang sulit dipahami.

---

# 13. Avoid Ambiguous Names

Hindari nama seperti:

```javascript
data
item
temp
value
result
obj
arr
test
x
y
z
```

apabila konteks sebenarnya dapat dijelaskan dengan nama yang lebih baik.

Gunakan:

```javascript
userProfile
paymentTransaction
validatedOrder
activeSubscription
monthlyRevenue
```

Nama generik tetap dapat digunakan pada scope yang sangat kecil ketika konteksnya sudah sangat jelas.

Contohnya, `index` dalam iterasi atau `error` dalam blok error handling dapat diterima.

---

# 14. Modular Architecture

Project harus memiliki struktur yang logis.

Pisahkan kode berdasarkan tanggung jawab apabila kompleksitas project membutuhkannya.

Contoh kategori umum:

* Components
* Pages
* Features
* Services
* Repositories
* Utilities
* Hooks
* Types
* Configuration
* Database
* API
* Middleware

Struktur folder tidak harus mengikuti template tertentu.

Gunakan struktur yang paling sesuai dengan ukuran dan kebutuhan aplikasi.

Untuk project kecil, jangan membuat struktur folder terlalu dalam.

Untuk project besar, jangan menyimpan seluruh kode dalam satu folder.

---

# 15. Avoid Overengineering

`nokomen` tidak berarti setiap project harus menggunakan arsitektur kompleks.

Jangan menambahkan:

* Abstraction yang belum dibutuhkan
* Design pattern yang tidak memberikan manfaat nyata
* Factory hanya untuk satu object sederhana
* Interface berlebihan
* Layer service yang tidak diperlukan
* Dependency yang terlalu banyak
* Folder kosong untuk kemungkinan masa depan

Prinsip utama:

> Bangun sesuai kebutuhan saat ini, tetapi jangan membuat keputusan yang menghambat pengembangan di masa depan.

---

# 16. Small and Focused Functions

Function harus memiliki tujuan yang jelas.

Jika function menjadi terlalu panjang dan menangani banyak tanggung jawab yang berbeda, pertimbangkan untuk memecahnya.

Namun ukuran function bukan satu-satunya indikator kualitas.

Jangan memecah function hanya untuk mencapai jumlah baris tertentu.

Prioritasnya adalah:

* Alur mudah dipahami
* Tanggung jawab jelas
* Mudah diuji
* Tidak memiliki logika yang tidak berhubungan

---

# 17. Clear Component Structure

Untuk frontend dan component-based architecture:

* Component harus memiliki tujuan yang jelas
* Logic kompleks dapat dipisahkan bila meningkatkan keterbacaan
* UI yang dapat digunakan ulang sebaiknya tidak diduplikasi
* Component tidak boleh memiliki terlalu banyak tanggung jawab
* Props dan state harus memiliki nama yang jelas

Hindari component besar yang mencampurkan:

* API calls
* Business logic
* State kompleks
* UI besar
* Validation
* Transformasi data

dalam satu file apabila pemisahan dapat membuat kode lebih mudah dirawat.

---

# 18. Error Handling

Error handling harus jelas dan sesuai kebutuhan aplikasi.

Jangan menyembunyikan error tanpa alasan.

Hindari:

```javascript
try {
  await processData();
} catch {
}
```

Error harus:

* Ditangani
* Diteruskan
* Dikonversi menjadi respons yang sesuai
* Dicatat apabila memang diperlukan oleh sistem

Penanganan error harus mempertimbangkan konteks aplikasi dan keamanan.

Jangan menampilkan detail sensitif kepada pengguna.

---

# 19. Security and Validation

Clean code tidak boleh mengorbankan keamanan.

Kode harus tetap mempertimbangkan:

* Input validation
* Authentication
* Authorization
* Secure environment variables
* Data sanitization
* Error exposure
* Access control

Jangan menghapus validasi atau security check hanya untuk membuat kode lebih pendek.

Kode bersih berarti kode yang jelas dan aman, bukan sekadar sedikit baris.

---

# 20. Performance with Purpose

Optimasi performa harus dilakukan berdasarkan kebutuhan nyata.

Jangan melakukan micro-optimization yang membuat kode sulit dibaca tanpa manfaat yang jelas.

Prioritaskan:

1. Algoritma yang tepat
2. Struktur data yang tepat
3. Menghindari operasi mahal yang tidak diperlukan
4. Mengurangi request berlebihan
5. Mengoptimalkan query dan resource
6. Mengukur sebelum melakukan optimasi kompleks

Keterbacaan dan maintainability tetap penting.

---

# 21. Production-Ready Standard

Kode yang dianggap selesai harus sebisa mungkin:

* Bebas dari debug sementara
* Bebas dari import tidak terpakai
* Bebas dari dead code
* Memiliki error handling yang sesuai
* Memiliki validasi yang relevan
* Mengikuti struktur project
* Konsisten secara formatting
* Tidak memiliki komentar noise
* Tidak memiliki AI markers
* Tidak memiliki placeholder yang tidak diperlukan
* Siap dikembangkan oleh developer lain

---

# 22. Rules for Existing Code Refactoring

Ketika pengguna meminta `nokomen` pada kode atau project yang sudah ada:

1. Pahami struktur dan perilaku kode terlebih dahulu.
2. Jangan mengubah fitur secara sembarangan.
3. Hapus komentar yang tidak diperlukan sesuai Zero Comments Policy.
4. Bersihkan whitespace bekas komentar.
5. Hapus import yang benar-benar tidak digunakan.
6. Hapus debug sementara jika tidak dibutuhkan.
7. Rapikan formatting dan struktur.
8. Kurangi duplikasi jika dapat dilakukan tanpa risiko yang tidak perlu.
9. Pertahankan compatibility.
10. Pastikan sintaks tetap valid.

Prinsip utama saat refactoring adalah:

> Preserve behavior unless the user explicitly requests behavioral changes.

Refactoring bertujuan memperbaiki kualitas internal kode, bukan diam-diam mengubah cara aplikasi bekerja.

---

# 23. Comment Removal Safety

Menghapus komentar harus dilakukan dengan hati-hati.

Tidak semua pola yang terlihat seperti komentar benar-benar komentar.

Contoh:

```javascript
const url = "https://example.com";
```

Karakter `//` di dalam string bukan komentar dan tidak boleh dihapus.

Contoh lain:

```python
pattern = r"#\d+"
```

Karakter `#` di dalam string bukan komentar.

Saat membersihkan codebase, struktur dan sintaks bahasa harus diperhatikan agar proses penghapusan komentar tidak merusak kode.

---

# 24. Documentation Boundary

`nokomen` melarang komentar penjelasan di dalam kode, tetapi tidak melarang dokumentasi di luar kode.

Dokumentasi dapat dibuat melalui:

* README
* Documentation website
* API documentation
* Architecture documentation
* User guide
* Setup guide

Penjelasan kepada pengguna juga dapat diberikan dalam chat.

Perbedaannya:

**Kode harus tetap bersih dan self-documenting.**

**Dokumentasi tingkat project dapat menjelaskan hal-hal yang memang tidak cocok ditempatkan di dalam struktur kode.**

---

# 25. External Requirements Exception

Apabila sebuah framework, compiler, build tool, atau sistem eksternal secara teknis membutuhkan directive tertentu yang berbentuk seperti komentar, kebutuhan tersebut dapat dipertimbangkan hanya jika:

* Benar-benar diperlukan agar aplikasi berjalan
* Tidak ada alternatif konfigurasi yang setara
* Menghapusnya menyebabkan build atau runtime gagal

Pengecualian ini bukan alasan untuk menambahkan komentar penjelasan biasa.

Prioritasnya tetap mencari solusi tanpa komentar terlebih dahulu.

---

# 26. Language and File Coverage

Aturan `nokomen` berlaku untuk seluruh jenis kode dan konfigurasi yang relevan, termasuk:

| Teknologi  | Contoh File                       |
| ---------- | --------------------------------- |
| HTML       | `.html`, `.htm`                   |
| CSS        | `.css`, `.scss`, `.sass`, `.less` |
| JavaScript | `.js`, `.mjs`, `.cjs`             |
| TypeScript | `.ts`, `.mts`, `.cts`             |
| React      | `.jsx`, `.tsx`                    |
| Vue        | `.vue`                            |
| Svelte     | `.svelte`                         |
| Python     | `.py`                             |
| PHP        | `.php`, `.blade.php`              |
| Java       | `.java`                           |
| C          | `.c`, `.h`                        |
| C++        | `.cpp`, `.hpp`                    |
| C#         | `.cs`                             |
| Go         | `.go`                             |
| Rust       | `.rs`                             |
| Shell      | `.sh`, `.bash`                    |
| PowerShell | `.ps1`                            |
| SQL        | `.sql`                            |
| YAML       | `.yaml`, `.yml`                   |
| TOML       | `.toml`                           |
| JSON       | `.json`                           |
| XML        | `.xml`                            |
| SVG        | `.svg`                            |

Aturan berlaku juga untuk framework dan teknologi lain yang menggunakan pola komentar serupa.

---

# 27. Prohibited Code Noise

Hal-hal berikut tidak boleh ditinggalkan dalam hasil akhir tanpa alasan yang jelas:

```text
TODO
FIXME
HACK
XXX
Generated by AI
Generated automatically
End of file
Temporary code
Debug only
```

Jika sesuatu belum selesai, selesaikan sesuai permintaan pengguna atau komunikasikan keterbatasannya di luar kode.

Jangan menyembunyikan pekerjaan yang belum selesai di dalam komentar.

---

# 28. Code Review Checklist

Sebelum kode diberikan atau dianggap selesai, lakukan pemeriksaan berikut.

## Zero Comments

* [ ] Tidak ada single-line comments
* [ ] Tidak ada block comments
* [ ] Tidak ada HTML comments
* [ ] Tidak ada docstrings penjelasan
* [ ] Tidak ada JSDoc
* [ ] Tidak ada section banners
* [ ] Tidak ada TODO atau FIXME yang tidak diperlukan
* [ ] Tidak ada AI markers atau watermark

## Cleanliness

* [ ] Tidak ada import yang tidak digunakan
* [ ] Tidak ada variabel yang tidak digunakan
* [ ] Tidak ada function mati yang tidak diperlukan
* [ ] Tidak ada kode duplikat yang mudah disederhanakan
* [ ] Tidak ada debug sementara
* [ ] Tidak ada whitespace berlebihan

## Readability

* [ ] Nama variabel memiliki makna yang jelas
* [ ] Nama function menjelaskan tindakan
* [ ] Nama boolean mudah dibaca
* [ ] Struktur kode konsisten
* [ ] Alur utama mudah dipahami tanpa komentar

## Architecture

* [ ] Tanggung jawab kode dipisahkan secara masuk akal
* [ ] Tidak ada file yang terlalu kompleks tanpa alasan
* [ ] Tidak ada abstraction berlebihan
* [ ] Struktur folder sesuai ukuran project

## Quality

* [ ] Kode tetap valid
* [ ] Perilaku lama tetap terjaga saat refactoring
* [ ] Error handling sesuai kebutuhan
* [ ] Validasi tidak dihilangkan
* [ ] Tidak ada perubahan fitur yang tidak diminta

---

# 29. Final Standard

Ketika mode `nokomen` aktif, setiap hasil coding harus mengikuti prinsip berikut:

> Write code that explains itself through clear naming, clean structure, focused responsibilities, consistent formatting, and sensible architecture.

Kode tidak harus sempurna secara teoritis.

Kode harus tepat untuk kebutuhan.

Kode tidak harus memiliki arsitektur paling kompleks.

Kode harus mudah dirawat.

Kode tidak harus memiliki banyak abstraction.

Kode harus memiliki abstraction ketika abstraction benar-benar memberikan manfaat.

Kode tidak membutuhkan komentar untuk menjelaskan setiap baris.

Kode harus cukup jelas sehingga struktur dan penamaannya menjelaskan maksud utama.

---

# NOKOMEN QUALITY PROMISE

Standar akhir `nokomen` adalah:

**Zero Comments. Zero Noise. Clear Intent. Clean Structure. Minimal Duplication. Consistent Code. Production-Oriented. No Unnecessary Complexity.**

Saat `nokomen` aktif, prioritas utama adalah menghasilkan kode yang:

1. Bersih
2. Rapi
3. Mudah dibaca
4. Self-documenting
5. Konsisten
6. Modular
7. Mudah dirawat
8. Aman sesuai kebutuhan
9. Tidak over-engineered
10. Bebas dari komentar dan noise yang tidak diperlukan

**The goal is not code with fewer comments. The goal is code that does not need comments to compensate for poor structure.**

# RANCANG BANGUN APLIKASI WEB GENERATOR

# UNTUK AVATAR DAN KOMIK DIGITAL

# BERBASIS GENERATIVE AI

# TUGAS AKHIR

```
Diajukan guna memenuhi sebagian pernyataan dalam rangka menyelesaikan
Pendidikan Sarjana Strata Satu (S1) Program Studi Teknologi Informasi
```

#### PROGRAM STUDI TEKNOLOGI INFORMASI

#### FAKULTAS TEKNIK

#### UNIVERSITAS UDAYANA


```
i
```
#### KATA PENGANTAR


```
ii
```
#### ABSTRAK

Seiring meningkatnya kebutuhan terhadap konten video kreatif, proses
produksi manual menjadi tidak efisien, sementara solusi berbasis _Artificial
Intelligence_ (AI) generatif yang ada seringkali terkendala oleh alur kerja yang rumit
bagi pengguna awam. Penelitian ini bertujuan untuk merancang dan membangun
sebuah antarmuka pengguna ( _frontend_ ) yang intuitif untuk aplikasi web video
generator otomatis, guna menyederhanakan proses pembuatan konten _storytelling_
dengan mengintegrasikan teknologi LLM, _Text-to-Speech_ , dan _Text-to-Image_.
Pengembangan antarmuka ini akan memanfaatkan teknologi web modern seperti
React untuk mengimplementasikan berbagai fitur utama, termasuk formulir
masukan ide cerita, tampilan pratinjau, dan sebuah _Asset Picker & Editor_ yang
interaktif untuk kustomisasi aset visual serta audio. Melalui integrasi dengan sistem
_backend_ via API, hasil yang diharapkan adalah sebuah antarmuka aplikasi web yang
fungsional dan ramah pengguna, yang memungkinkan kreator tanpa keahlian teknis
untuk menghasilkan video berkualitas tinggi secara efisien dan efektif.

Keyword: Video Generator Otomatis, Kecerdasan Buatan, Antarmuka Pengguna,
Frontend, _Text-to-Speech_ , _Text-to-Image_ , _Storytelling_ , dan React.


```
iii
```
#### ABSTRACT


```
iv
```
#### DAFTAR ISI

KATA PENGANTAR ............................................................................................... i

ABSTRAK .............................................................................................................. ii

ABSTRACT ........................................................................................................... iii

DAFTAR ISI .......................................................................................................... iv

DAFTAR GAMBAR ........................................................................................... viii

DAFTAR TABEL ................................................................................................... ix

DAFTAR KODE PROGRAM ................................................................................ x

BAB I PENDAHULUAN ...................................................................................... 1

```
1.1 Latar Belakang .......................................................................................... 1
1.2 Rumusan Masalah ..................................................................................... 3
1.3 Tujuan Penelitian ...................................................................................... 3
1.4 Manfaat Penelitian .................................................................................... 4
1.5 Batasan Masalah ....................................................................................... 5
1.6 Sistematika Penulisan ............................................................................... 6
```
BAB II KAJIAN PUSTAKA ............................................................................... 7

```
2.1 State of the Art .......................................................................................... 7
2.2 Konsep Dasar Sistem .............................................................................. 12
2.2.1 Arsitektur Client-Server ..................................................................... 13
2.2.2 Single Page Application ..................................................................... 13
2.2.3 Client-Side Rendering ........................................................................ 14
2.2.4 Server-Side Rendering ....................................................................... 14
2.2.5 Static Site Generation ......................................................................... 15
2.2.6 Hybrid Rendering dan React Server Components ............................. 15
```

## v


```
vi
```
```
2.7 Teknologi Integrasi dengan Backend ...................................................... 29
2.7.1 RESTful API ...................................................................................... 29
2.7.2 Axios .................................................................................................. 30
2.7.3 Asynchronous JavaScript ................................................................... 31
2.7.4 Polling Mechanism ............................................................................. 31
2.8 Metode Pengujian ................................................................................... 32
2.8.1 Unit Testing ........................................................................................ 32
2.8.2 Integration Testing .............................................................................. 33
2.8.3 Black Box Testing .............................................................................. 33
2.8.4 White Box Testing .............................................................................. 34
```
BAB III METODOLOGI PENELITIAN .......................................................... 35

```
3.1 Tempat dan Waktu................................................................................... 35
3.2 Alur Penelitian ........................................................................................ 35
3.3 Sumber Data............................................................................................ 36
3.4 Instrumen Pembuatan Sistem .................................................................. 37
3.5 Gambaran Umum Sistem ........................................................................ 38
3.6 Diagram Konteks .................................................................................... 41
3.7 Data Flow Diagram Level 0 .................................................................... 42
3.8 Standar Operating Procedure .................................................................. 43
3.8.1 Authentication dan Session Management Error! Bookmark not
defined.
3.8.2 Upload dan Kustomisasi Avatar .......... Error! Bookmark not defined.
3.8.3 Generasi Avatar ................................... Error! Bookmark not defined.
3.8.4 Persiapan Proyek Komik ..................... Error! Bookmark not defined.
3.8.5 Konfigurasi Referensi Gambar............ Error! Bookmark not defined.
```

## vii

3.8.7 _Comic Editor_ ....................................... **Error! Bookmark not defined.**

3.9.1 Wireframe Landing Page ..................... **Error! Bookmark not defined.**

   - 2.2.7 App Router dan File-based Routing
   - 2.2.8 Web API dan RESTful Services
   - 2.2.9 JavaScript Object Notation.................................................................
   - 2.2.10 Middleware dan Request Interception
- 2.3 Pemodelan Sistem
   - 2.3.1 Diagram Konteks................................................................................
   - 2.3.2 Use Case Diagram
   - 2.3.3 Data Flow Diagram
   - 2.3.4 Standard Operating Procedure
- 2.4 Perangkat Lunak Penelitian
   - 2.4.1 Visual Studio Code
   - 2.4.2 Git dan Github
   - 2.4.3 Node.js dan npm
   - 2.4.4 Postman
- 2.5 Teknologi Penelitian
   - 2.5.1 React
   - 2.5.2 Next.js
   - 2.5.3 TypeScript
   - 2.5.4 Tailwind CSS
- 2.6 Teknologi State Management
   - 2.6.1 React Context API
   - 2.6.2 React Hooks
   - 2.6.3 React DnD
   - 2.6.4 React RnD
   - 2.6.5 Framer Motion....................................................................................
      - 3.8.6 Visualisasi Adegan
   - 3.9 Low-Fidality Wireframe 3.8.8 Review Hasil Komik Error! Bookmark not defined.
      - 3.9.3 Wireframe Avatar Generator 3.9.2 Wireframe Halaman Home Error! Bookmark not defined.
   - 3.10 Rancangan Pengujian
      - 3.10.1 Pengujian Authentikasi
      - 3.10.2 Pengujian Pembuatan Avatar
      - 3.10.3 Pengujian Pembuatan Avatar Menggunakan Template Library
      - 3.10.4 Pengujian Penampilan History Avatar
      - 3.10.5 Pengujian Pembuatan Project Komik Baru
      - 3.10.6 Pengujian Penambahan Reference untuk Komik
      - 3.10.7 Pengujian Pembuatan Gambar Adegan
      - 3.10.8 Pengujian Editing Kanvas Komik
      - 3.10.9 Pengujian Preview dan Export Komik
- BAB IV HASIL SEMENTARA
   - 4.1 Hasil A
   - 4.2 Hasil B
   - 4.3 Hasil C
- BAB V TIMELINE PENELITIAN
   - 5.1 Simpulan
   - 5.2 Saran
- DAFTAR PUSTAKA


```
viii
```
#### DAFTAR GAMBAR


```
ix
```
#### DAFTAR TABEL


```
x
```
#### DAFTAR KODE PROGRAM


#### BAB I

#### PENDAHULUAN

Bab I berisi latar belakang penelitian, rumusan masalah, tujuan penelitian,
manfaat penelitian, batasan masalah, serta sistematika penulisan laporan yang
menjadi dasar dan arah dari penelitian yang dilakukan.
**1.1 Latar Belakang**
Industri konten digital saat ini sedang mengalami transformasi
fundamental yang didorong oleh kemajuan pesat _Artificial Intelligence Generated
Content_ (AIGC), yang telah berevolusi dari _Generative Adversarial Networks_
(GAN) awal hingga model Transformer canggih (Cao et al., 2023). Dalam
ekosistem ini, permintaan terhadap pembuatan avatar yang ekspresif dan narasi
visual berbentuk komik digital menunjukkan tren pertumbuhan eksponensial,
didukung oleh inovasi model yang memungkinkan kontrol emosi berbasis teks (Y.
Wang et al., 2024) serta generasi karakter yang konsisten (Zhou et al., 2025).
Meskipun teknologi dasar telah tersedia, integrasi layanan _generative AI_ ke dalam
antarmuka pengguna yang intuitif masih menghadapi kendala signifikan. Platform
_existing_ sering kali membatasi pengguna pada pola interaksi yang kaku atau gagal
menyediakan alur kerja kolaboratif yang mulus antara manusia dan AI, sehingga
menghambat potensi kreativitas pengguna dalam menghasilkan karya yang koheren
(Bieniek et al., 2024; Ling et al., 2024).
Tantangan utama dalam pengembangan aplikasi modern bukan lagi
sekadar pada akurasi model AI, melainkan pada kompleksitas arsitektural untuk
mengintegrasikan layanan tersebut ke dalam lingkungan web yang skalabel.
Penerapan arsitektur _micro-frontend_ menjadi solusi strategis untuk memecah
aplikasi monolitik menjadi modul-modul independen, namun pendekatan ini
membawa tantangan teknis tersendiri terkait orkestrasi komunikasi antar-aplikasi
dan konsistensi antarmuka (Guguloth, 2025; Taibi & Mezzalira, 2022). Selain itu,
penanganan proses _asynchronous_ yang berat seperti _polling mechanism_ untuk
generasi gambar, manajemen _state_ yang kompleks, serta optimasi performa
_rendering_ antara _Client-Side_ dan _Server-Side_ menjadi hambatan kritis yang belum


sepenuhnya teratasi dalam kerangka kerja pengembangan aplikasi AI saat ini
(Ardiyanto & Ardhianto, 2024; Veeri, 2024).
Pengembangan antarmuka berbasis React yang dirancang khusus untuk
memfasilitasi interaksi _generative AI_ menjadi pendekatan solusi yang diusulkan
dalam penelitian ini guna mengatasi kesenjangan teknis tersebut. Sistem ini
menerapkan _feature-based architecture_ yang mencakup _workflow_ bertahap untuk
pembuatan avatar dan _editor_ kanvas interaktif untuk penyusunan panel komik,
menjembatani kompleksitas model _backend_ dengan kebutuhan antarmuka
pengguna (Subramanian et al., 2025). Melalui pemanfaatan _Context API_ untuk
manajemen _state_ global dan pola desain antarmuka multimodal yang adaptif, sistem
ini memungkinkan pengguna untuk melakukan kustomisasi, seperti penyuntingan
dialog dan tata letak tanpa mengorbankan performa aplikasi (Luera et al., 2024;
Schier et al., 2024). Pendekatan ini tidak hanya menawarkan efisiensi teknis tetapi
juga meningkatkan estetika dan kegunaan sistem melalui desain antarmuka yang
responsif terhadap intensi pengguna (Duan et al., 2024).
Berdasarkan kebutuhan tersebut, penelitian ini difokuskan pada
perancangan dan pembangunan sebuah sistem generator berbasis web yang secara
spesifik mengintegrasikan teknologi _generative AI_ untuk keperluan penciptaan
avatar dan komik digital. Kontribusi utama dari studi ini terletak pada formulasi
kerangka kerja antarmuka yang mampu mengelola siklus hidup pembuatan konten
secara _end-to-end_ , mulai dari akuisisi _input_ , pemrosesan generatif, hingga
manipulasi hasil akhir dalam satu platform terpadu. Signifikansi penelitian ini tidak
hanya terbatas pada penyediaan alat bantu kreativitas, melainkan juga menawarkan
model referensi arsitektural bagi pengembangan aplikasi web modern yang
menuntut integrasi layanan cerdas yang adaptif (Costa et al., 2024). Dengan
demikian, sistem ini diharapkan dapat menjadi solusi praktis dalam menjembatani
kesenjangan antara kemampuan komputasi model AI dengan kebutuhan interaksi
pengguna yang intuitif (Razaque et al., 2025; Salim et al., 2024).


**1.2 Rumusan Masalah**
Berdasarkan analisis terhadap permasalahan yang telah diuraikan pada
latar belakang, maka dirumuskan beberapa pokok permasalahan yang akan dibahas
dalam penelitian ini sebagai berikut.

1. Bagaimana merancang aplikasi web yang terstruktur dan modular untuk
    memfasilitasi pembuatan avatar dan komik digital berbasis _Generative AI_?
2. Bagaimana mengimplementasikan antarmuka pengguna yang mendukung
    alur kerja bertahap serta manipulasi visual pada editor komik maupun
    pengaturan parameter pada pembuatan avatar?
3. Bagaimana performa dan fungsionalitas aplikasi web yang dihasilkan
    dalam memfasilitasi interaksi pengguna dengan layanan _Generative AI_
    untuk pembuatan konten digital?

**1.3 Tujuan Penelitian**
Berdasarkan rumusan permasalahan yang telah diuraikan sebelumnya,
maka tujuan yang ingin dicapai melalui penelitian ini adalah sebagai berikut.

1. Merancang aplikasi web dengan pendekatan berbasis komponen untuk
    mengelola pembuatan avatar dan komik digital secara terorganisir.
2. Membangun komponen antarmuka interaktif yang memfasilitasi
    penyusunan panel komik melalui editor kanvas visual dan pembuatan
    avatar melalui formulir input dinamis.
3. Melakukan evaluasi kinerja sistem dan fungsionalitas antarmuka yang
    telah dibangun untuk memastikan keandalan aplikasi dalam menghasilkan
    aset digital sesuai masukan pengguna.


**1.4 Manfaat Penelitian**
Penelitian ini diharapkan dapat memberikan manfaat, baik secara teoritis
maupun praktis. Berikut merupakan manfaat dari dilakukannya penelitian ini.

1. Manfaat Teoritis
    Hasil penelitian ini diharapkan dapat menambah referensi dan wawasan
pada bidang teknologi informasi, khususnya mengenai strategi perancangan
antarmuka yang terstruktur dan modular untuk aplikasi berbasis _Generative AI_.
Hasil dari perancangan sistem ini dapat menjadi landasan teoretis bagi penelitian
selanjutnya yang berfokus pada pengembangan pola interaksi manusia dan
komputer ( _Human-Computer Interaction_ ) dalam konteks alat bantu kreativitas
digital, khususnya terkait manajemen _state_ yang kompleks dan integrasi layanan
kecerdasan buatan pada platform web.
2. Manfaat Praktis
    Hasil penelitian ini diharapkan dapat menghasilkan kerangka acuan teknis
dan solusi implementatif bagi pengembang perangkat lunak dalam membangun
aplikasi web generator untuk avatar dan komik digital berbasis _Generative AI_.
Arsitektur berbasis komponen yang dikembangkan dapat dimanfaatkan sebagai
referensi praktis untuk mengelola kompleksitas antarmuka dan alur kerja
pembuatan konten. Selain itu, aplikasi yang dihasilkan diharapkan dapat
meningkatkan pengalaman pengguna dalam proses kreatif, menyediakan
antarmuka yang terstruktur untuk menjembatani pengguna dengan teknologi
_Generative AI_ tanpa hambatan teknis yang berarti.


**1.5 Batasan Masalah**
Batasan masalah pada penelitian digunakan untuk menghindari adanya
penyimpangan atau pelebaran pokok pembahasan sehingga penelitian tetap terarah
dan dapat mencapai tujuan yang telah ditetapkan. Adapun batasan masalah dari
penelitian ini adalah sebagai berikut.

1. Penelitian difokuskan pada perancangan dan pengembangan antarmuka
    pengguna untuk aplikasi web generator untuk avatar dan komik digital,
    tidak mencakup pengembangan atau evaluasi model _Generative AI_ ,
    pengembangan _backend_ API, infrastruktur server, maupun konfigurasi
    layanan _cloud_ yang digunakan. Layanan _Generative AI_ digunakan sebagai
    layanan eksternal melalui API tanpa melakukan modifikasi atau pelatihan
    ulang terhadap model yang mendasarinya.
2. Sistem dibatasi pada pengembangan fitur utama pembuatan untuk avatar
    dan komik digital yang mencakup alur kerja bertahap serta editor kanvas
    visual yang dioptimalkan untuk perangkat _desktop_. Fitur tambahan seperti
    kolaborasi pengguna secara _real-time_ dan sistem manajemen hak akses
    tingkat lanjut tidak disertakan dalam pengembangan sistem ini.
3. Evaluasi penelitian dipusatkan pada pengujian fungsionalitas antarmuka
    dan kinerja aplikasi dalam memfasilitasi interaksi pengguna. Analisis
    mendalam mengenai kualitas estetika, akurasi artistik, maupun koherensi
    narasi dari konten visual yang dihasilkan oleh model _Generative AI_ berada
    di luar lingkup pengujian sistem.


**1.6 Sistematika Penulisan**
Sistematika penulisan memberikan gambaran umum mengenai susunan
laporan sehingga memudahkan pembaca dalam memahami alur isi penelitian.
Laporan Tugas Akhir ini disusun ke dalam lima bab utama sebagai berikut.

```
BAB I PENDAHULUAN Bab I berisi tentang latar belakang,
rumusan masalah, tujuan, manfaat dan
batasan masalah, serta sistematika
penulisan dari laporan.
```
```
BAB II TINJAUAN PUSTAKA Bab II berisi pembahasan mengenai
teori-teori yang mendasari
pembahasan, permasalahan, dan
penelitian terkait dengan Tugas Akhir
yang dikerjakan.
BAB III METODE DAN
PERANCANGAN SISTEM
```
```
Bab III berisi metodologi penelitian
yang dilakukan, sumber data,
instrumen pembuatan sistem, dan
perancangan sistem.
BAB IV HASIL DAN
PEMBAHASAN
```
```
Bab IV berisi hasil, pembahasan
sistem, serta pengujian yang dilakukan
pada sistem, sehingga dapat
memperoleh hasil yang sesuai dengan
tujuan yang diharapkan.
BAB V PENUTUP Bab V berisi kesimpulan dari hasil
penelitian dan berbagai saran untuk
perbaikan lebih lanjut terkait dengan
penelitian dikerjakan.
```

#### BAB II

#### KAJIAN PUSTAKA

Bab II menguraikan tinjauan pustaka dari penelitian terdahulu yang
relevan serta landasan teori mengenai arsitektur aplikasi web modern dan interaksi
manusia-komputer yang menjadi fondasi ilmiah dalam perancangan sistem
**2.1 State of the Art**
_State of the Art_ berfungsi sebagai landasan teoretis yang mendalam untuk
memperkaya konteks pembahasan dalam penelitian ini. Tinjauan ini menguraikan
perkembangan teknologi terkini dalam domain _Generative AI_ , desain sistem
antarmuka aplikasi web modern, serta prinsip interaksi pengguna. Kajian literatur
mencakup analisis komprehensif terhadap metode generasi avatar digital, sistem
pembuatan komik otomatis, dan evolusi teknologi antarmuka yang mendukung
interaktivitas tinggi. Selain itu, pembahasan juga menyoroti tren integrasi layanan
kecerdasan buatan ke dalam platform berbasis web yang semakin kompleks.
Tinjauan ini bertujuan untuk mengidentifikasi _research gap_ yang belum terjamah
oleh studi terdahulu. Identifikasi tersebut kemudian menjadi dasar argumentasi
ilmiah dalam pengembangan kontribusi teknis dan perancangan antarmuka yang
ditawarkan oleh penelitian ini.
Perkembangan teknologi _generative AI_ untuk pembuatan avatar digital
telah mencapai kemajuan signifikan, terutama dalam kemampuan menghasilkan
animasi yang realistis dari input data yang minimal. Metode terbaru memungkinkan
pembuatan avatar kepala yang dapat dianimasikan secara konsisten dari satu
gambar referensi menggunakan teknik difusi video (Zhou et al., 2025). Kemajuan
lain terlihat pada rekonstruksi avatar fotorealistik secara _real-time_ dari input video
tunggal yang menyeimbangkan kualitas visual dengan efisiensi komputasi(L. Wang
et al., 2023). Inovasi antarmuka bahasa alami kini juga memungkinkan kontrol
mendetail terhadap emosi dan gerakan mikro avatar melalui instruksi teks,
memberikan fleksibilitas ekspresi yang lebih tinggi (Y. Wang et al., 2024). Selain
itu, integrasi model difusi gambar-teks telah diterapkan untuk menghasilkan avatar
3D dengan berbagai gaya visual yang tetap mempertahankan konsistensi geometri


(Zhang et al., 2023). Meskipun demikian, fokus utama penelitian-penelitian
tersebut masih terpusat pada optimasi algoritma generasi dan fidelitas visual, belum
menyentuh aspek perancangan antarmuka yang memberikan kontrol granular
kepada pengguna terhadap parameter konfigurasi dalam sebuah aplikasi web.
Industri komik digital sedang mengalami transformasi fundamental
dengan hadirnya sistem generasi berbasis AI yang berkembang dari alat bantu
sederhana menjadi platform produksi yang komprehensif. Pendekatan _full-stack_
telah diusulkan untuk mendemokratisasi pembuatan komik sekuensial dengan
memanfaatkan kerangka kerja React.js yang dinamis (Subramanian et al., 2025). Di
sisi lain, alat bantu _authoring_ seperti CodeToon memperkenalkan mekanisme
pemetaan struktur untuk menghubungkan elemen cerita abstrak menjadi panel
visual secara otomatis (Suh et al., 2022). Integrasi pipa kerja yang menggabungkan
_Large Language Models_ (LLM) untuk naskah dan _Stable Diffusion_ untuk
visualisasi telah terbukti mampu menjaga koherensi narasi karakter (Jin & Song,
2023). Lebih jauh, pengembangan sistem interaktif kini mencakup algoritma
penempatan otomatis untuk elemen grafis dan karakter guna mendukung
komunikasi digital yang ekspresif (Schier et al., 2024). Namun, literatur yang ada
belum secara spesifik mengeksplorasi implementasi arsitektur antarmuka yang
mampu mengorkestrasi alur kerja bertahap dengan fitur editor kanvas visual yang
memberikan kendali penuh terhadap konsistensi karakter lintas panel.
Desain antarmuka untuk aplikasi web modern telah berevolusi secara
signifikan dari struktur monolitik menuju paradigma _micro-frontend_ yang
menawarkan modularitas dan skalabilitas independen. Prinsip dasar dekomposisi
aplikasi menjadi modul-modul kecil memungkinkan tim pengembang untuk
bekerja secara otonom tanpa mengganggu integritas sistem secara keseluruhan
(Taibi & Mezzalira, 2022). Studi komparatif menunjukkan bahwa pemilihan antara
pendekatan tanpa kerangka kerja ( _frameworkless_ ) dan berbasis kerangka kerja
sangat bergantung pada kebutuhan efisiensi organisasi (Männistö, 2023).
Implementasi spesifik menggunakan perpustakaan React telah menjadi standar
industri karena kemampuannya dalam menangani _routing_ dan manajemen _state_
yang kompleks antar-aplikasi (Veeri, 2024). Analisis kelayakan juga menunjukkan


bahwa arsitektur ini memberikan keuntungan strategis bagi perusahaan rintisan
dalam hal fleksibilitas pengembangan fitur meskipun memiliki kompleksitas awal
yang lebih tinggi (Sutharsica, 2025). Dengan demikian, fondasi teknis arsitektur
_micro-frontend_ yang ada saat ini belum banyak membahas tantangan spesifik
penerapannya dalam konteks aplikasi _generative AI_ yang menuntut integrasi
layanan eksternal dengan latensi tinggi.
Strategi _rendering_ memegang peranan krusial dalam pengembangan
antarmuka aplikasi web modern karena berdampak langsung pada performa
pemuatan halaman dan efisiensi interaksi pengguna (Ardiyanto & Ardhianto,
2024). Analisis komparatif antara metode _Client-Side Rendering_ (CSR), _Server-
Side Rendering_ (SSR), dan _Incremental Static Regeneration_ (ISR) menunjukkan
karakteristik yang berbeda, di mana CSR menawarkan interaktivitas tinggi yang
esensial untuk aplikasi berbasis komponen React, sementara SSR memberikan
keunggulan pada kecepatan pemuatan awal (Veeri, 2024). Dalam konteks arsitektur
yang terdistribusi, pengelolaan strategi _rendering_ menjadi semakin kompleks
karena perlunya orkestrasi pemuatan modul-modul independen agar tidak
membebani _main thread_ peramban (Guguloth, 2025; Taibi & Mezzalira, 2022).
Tantangan ini semakin nyata pada antarmuka multimodal berbasis AI, yang
menuntut mekanisme adaptif untuk menangani latensi respons dari model generatif
eksternal tanpa mengorbankan responsivitas visual (Bieniek et al., 2024). Meskipun
teori mengenai optimasi _rendering_ telah banyak dibahas, literatur yang ada belum
memberikan panduan spesifik mengenai strategi _hybrid_ yang ideal untuk aplikasi
_generator_ konten, khususnya dalam menyeimbangkan beban komputasi antara fitur
editor kanvas di sisi klien dan galeri aset yang membutuhkan kecepatan statis.
Integrasi layanan kecerdasan buatan ke dalam arsitektur _micro-frontend_
menghadirkan tantangan teknis tersendiri terkait orkestrasi komponen dan
konsistensi data lintas modul. Pendekatan arsitektur _micro-frontend_ berbasis AI
telah diusulkan sebagai solusi untuk menciptakan sistem yang adaptif dan mampu
mengoptimalkan pemuatan komponen cerdas secara dinamis guna meningkatkan
performa aplikasi (Guguloth, 2025). Model integrasi modular memungkinkan tim
pengembang untuk menyematkan fitur canggih seperti mesin rekomendasi atau


generator konten dalam unit terisolasi tanpa mengganggu stabilitas sistem utama
(Annela, 2025). Strategi ini terbukti meningkatkan skalabilitas aplikasi perusahaan
dengan memisahkan logika pemrosesan AI yang berat dari lapisan antarmuka
pengguna yang memerlukan responsivitas tinggi (Guguloth, 2025). Selain itu,
penggunaan pola federasi modul mendukung pemeliharaan sistem jangka panjang
dengan memungkinkan pembaruan layanan AI secara independen tanpa _downtime_
pada keseluruhan sistem (Annela, 2025). Meskipun konsep integrasi ini
menjanjikan secara teoretis, literatur yang ada belum melakukan implementasi
teknis pada aplikasi pembuatan konten kreatif yang menuntut penanganan proses
asinkron yang kompleks dan integrasi banyak layanan sekaligus.
Perancangan antarmuka pengguna untuk aplikasi berbasis _Generative AI_
menuntut pendekatan desain spesifik yang memprioritaskan kontrol pengguna dan
transparansi mekanisme sistem. Survei komprehensif terhadap teknik interaksi
menunjukkan bahwa pola desain yang efektif harus mengakomodasi berbagai
modalitas _input_ , mulai dari teks _prompt_ hingga manipulasi visual langsung pada
objek (Luera et al., 2024). Tantangan utama dalam antarmuka multimodal terletak
pada dilema antarmuka untuk menyeimbangkan kemudahan penggunaan fitur suara
atau obrolan dengan presisi kontrol grafis yang dibutuhkan desainer (Bieniek et al.,
2024). Konsep antarmuka yang generatif dan lunak ( _malleable_ ) diperkenalkan
untuk memungkinkan tampilan beradaptasi secara dinamis sesuai dengan intensi
dan kebutuhan informasi pengguna yang berubah-ubah selama proses kreasi (Cao
et al., 2025). Penerapan elemen interaktif seperti _slider_ parameter dan area kanvas
yang responsif menjadi krusial untuk menjembatani kesenjangan antara _input_
abstrak manusia dan _output_ konkret AI (Luera et al., 2024). Namun, fokus
penelitian-penelitian tersebut mayoritas masih pada tataran prinsip desain umum
dan belum mengeksplorasi implementasi alur kerja bertahap yang spesifik untuk
pembuatan narasi visual kompleks seperti komik digital.
Hubungan interaksi manusia dan komputer dalam ekosistem sistem cerdas
memerlukan pertimbangan mendalam untuk memastikan teknologi tetap dapat
dipahami dan dikendalikan sepenuhnya oleh pengguna. Refleksi terhadap desain
sistem AI menekankan pentingnya menempatkan manusia sebagai pemegang


kendali keputusan ( _human-in-the-loop_ ) untuk memitigasi kesalahan interpretasi
model dan memastikan hasil yang sesuai harapan (Kristensson & Patterson, 2025).
Evaluasi terhadap rancangan antarmuka modern menunjukkan bahwa transparansi
dalam proses pengambilan keputusan AI berbanding lurus dengan tingkat
kepercayaan dan kepuasan pengguna terhadap sistem tersebut (Salim et al., 2024).
Prinsip dasar interaksi manusia dan komputer menyoroti perlunya umpan balik
sistem yang jelas dan _affordance_ visual yang intuitif untuk memandu pengguna
dalam mengoperasikan fitur-fitur kompleks (Agung & Rosmasari, 2025).
Keseimbangan antara otomatisasi cerdas dan intervensi manual menjadi kunci
dalam menciptakan pengalaman pengguna yang tidak hanya efisien secara teknis
tetapi juga memberdayakan kreativitas pengguna (Kristensson & Patterson, 2025).
Beberapa studi tersebut memberikan fondasi teoretis yang kokoh, namun belum
menyentuh aplikasi spesifik pada antarmuka editor visual yang memerlukan
manipulasi objek secara _real-time_ dan presisi tinggi.
Evaluasi terhadap aspek kegunaan dan estetika antarmuka memegang
peranan krusial dalam menentukan penerimaan pengguna terhadap aplikasi web
berbasis kecerdasan buatan. Pemanfaatan algoritma pembelajaran mendalam dalam
pembuatan antarmuka terbukti mampu menghasilkan desain yang tidak hanya
efisien secara fungsional tetapi juga memiliki nilai estetika tinggi yang menarik
bagi pengguna (Duan et al., 2024). Prinsip desain antarmuka berbasis AI untuk
aplikasi web menekankan pada penyediaan pengalaman yang intuitif guna
meminimalkan kurva pembelajaran pengguna dalam mengadopsi teknologi baru
(Costa et al., 2024). Selain itu, elemen desain yang mendukung pengembangan
keterampilan digital pengguna menjadi faktor penting dalam meningkatkan
keterlibatan jangka panjang pada platform yang bersifat edukatif maupun kreatif
(Razaque et al., 2025). Persepsi psikologis terhadap elemen visual seperti tipografi
dalam komik digital juga mempengaruhi bagaimana emosi dan narasi diterima oleh
pembaca di era digitalisasi konten (Mansoor et al., 2022). Penelitian terdahulu
cenderung berfokus pada metode evaluasi umum, sehingga belum tersedia
kerangka evaluasi spesifik untuk aplikasi generator konten yang menuntut
keseimbangan antara otomatisasi generatif dan kebebasan artistik pengguna.


Berdasarkan tinjauan komprehensif terhadap literatur terdahulu,
teridentifikasi kemajuan pesat dalam teknologi _generative AI_ , evolusi arsitektur
_micro-frontend_ , serta prinsip desain antarmuka modern. Dengan demikian, masih
terdapat celah penelitian yang signifikan mengenai perancangan antarmuka yang
secara spesifik mengintegrasikan layanan _generative AI_ dengan fokus utama pada
pengalaman pengguna dan kontrol kreatif granular. Penelitian sebelumnya
umumnya menitikberatkan pada pengembangan algoritma model dasar,
peningkatan kualitas visual _output_ , atau teori desain antarmuka secara terpisah
tanpa integrasi sistem yang utuh. Belum terdapat implementasi konkret yang
membahas orkestrasi komponen interaktif kompleks seperti editor kanvas visual
dan alur kerja bertahap dalam satu kerangka kerja aplikasi web yang terpadu.
Penelitian ini diposisikan untuk mengisi kesenjangan tersebut dengan merancang
bangun aplikasi web generator yang menitikberatkan pada struktur antarmuka dan
mekanisme interaksi pengguna. Berbeda dengan studi yang mengembangkan
model kecerdasan buatan, fokus utama penelitian ini adalah pada pengembangan
solusi teknis antarmuka untuk menjembatani kapabilitas model generatif dengan
kebutuhan fungsional pengguna akhir.

**2.2 Konsep Dasar Sistem**
Perancangan aplikasi web modern bertumpu pada integrasi berbagai
paradigma arsitektural guna menjamin efisiensi kinerja, skalabilitas, dan
pengalaman pengguna yang optimal. Pembahasan mencakup paradigma arsitektur
_Client-Server_ dan implementasi _Single Page Application_ (SPA), serta evaluasi
komparatif berbagai strategi rendering mulai dari _Client-Side Rendering_ (CSR),
_Server-Side Rendering_ (SSR), _Static Site Generation_ (SSG), hingga pendekatan
hibrida menggunakan _React Server Components_ (RSC). Selain itu, bagian ini juga
meninjau mekanisme navigasi melalui sistem _App Router_ , standar pertukaran data
menggunakan _Web API_ berbasis REST dan format JSON, serta pengelolaan alur
permintaan yang aman dan efisien melalui implementasi _Middleware_.


**2.2.1 Arsitektur Client-Server**
Arsitektur _client-server_ didefinisikan sebagai model komputasi
terdistribusi di mana satu atau lebih komputer klien meminta sumber daya atau
layanan dari komputer server melalui jaringan komunikasi (Nyabuto et al., 2024).
Model ini terdiri dari komponen utama berupa klien yang menyediakan antarmuka
ramah pengguna dan server yang memproses permintaan serta mengembalikan
respons yang sesuai (Nyabuto et al., 2024). Dalam perkembangannya, arsitektur ini
memiliki beberapa jenis implementasi, mulai dari _two-tier_ hingga _multi-tier_ , yang
dirancang untuk meningkatkan efisiensi dan kemampuan adaptasi dalam
lingkungan komersial (Singh, 2024). Keunggulan utama dari pendekatan ini adalah
pemisahan tanggung jawab ( _separation of concerns_ ) dan skalabilitas, yang
memungkinkan distribusi beban kerja yang dinamis antara sisi klien dan server
(Heil & Gaedke, 2024). Dalam konteks aplikasi generator ini, arsitektur _client-
server_ memfasilitasi alur kerja di mana klien mengirimkan permintaan pembuatan
avatar atau komik, yang kemudian diproses oleh server menggunakan algoritma
_Generative AI_ sebelum hasilnya dikirimkan kembali ke klien (Singh, 2024).

**2.2.2 Single Page Application**
_Single Page Application_ (SPA) merupakan jenis aplikasi web modern yang
memuat satu dokumen HTML tunggal dan memperbarui konten secara dinamis
tanpa perlu memuat ulang seluruh halaman saat pengguna berinteraksi
(Świątkowski & Ścibior, 2022). Karakteristik utama SPA adalah pemisahan yang
tegas antara _front-end_ dan _back-end_ , di mana logika tampilan ditangani sepenuhnya
di sisi klien menggunakan kerangka kerja populer seperti React.js atau Next.js
(Lazuardy & Anggraini, 2022). Pendekatan ini menawarkan pengalaman pengguna
yang lebih mulus dan responsif menyerupai aplikasi desktop, karena navigasi antar
halaman terjadi secara instan tanpa _refresh_ browser (Ekpobimi, 2024). Penggunaan
teknologi SPA sangat penting dalam pembangunan aplikasi berkinerja tinggi yang
memprioritaskan kecepatan dan efisiensi interaksi pengguna (Ekpobimi, 2024).
Relevansi SPA dalam penelitian ini diterapkan pada modul editor komik dan


konfigurator avatar, yang memungkinkan pengguna melakukan perubahan visual
secara _real-time_ tanpa gangguan _loading_ halaman (Świątkowski & Ścibior, 2022).

**2.2.3 Client-Side Rendering**
_Client-Side Rendering_ (CSR) adalah metode rendering di mana konten
halaman web diproses dan ditampilkan sepenuhnya oleh _browser_ menggunakan
JavaScript, alih-alih menerima dokumen HTML lengkap dari server (Lokhande et
al., 2023). Proses CSR dimulai dengan mengunduh kerangka HTML minimal dan
berkas JavaScript, yang kemudian dieksekusi oleh _browser_ untuk mengambil data
dan merender elemen visual secara dinamis (Verma & Aland, 2024). Meskipun
metode ini menawarkan interaktivitas tinggi dan transisi yang mulus, CSR memiliki
tantangan terkait waktu muat awal ( _initial load time_ ) yang lebih lambat
dibandingkan _Server-Side Rendering_ (SSR) karena ketergantungan pada eksekusi
skrip di sisi klien (Jain, 2021). Namun, CSR tetap menjadi pilihan unggul untuk
aplikasi yang membutuhkan pembaruan konten dinamis yang intensif, karena beban
server berkurang secara signifikan setelah pemuatan awal selesai (Lokhande et al.,
2023). Dalam pengembangan aplikasi generator ini, CSR digunakan pada fitur
editor interaktif untuk memastikan setiap input pengguna pada kanvas komik atau
parameter avatar dapat dirender secara instan di layer (Verma & Aland, 2024).

**2.2.4 Server-Side Rendering**
_Server-Side Rendering_ (SSR) didefinisikan sebagai metode rendering di
mana konten halaman web, berupa dokumen HTML lengkap, dihasilkan secara
dinamis di sisi server sebagai respons terhadap setiap permintaan navigasi
pengguna(Lokhande et al., 2023; Vallamsetla, 2024). Proses ini melibatkan
pembuatan struktur HTML yang siap dirender di server yang kemudian dikirim ke
klien untuk ditampilkan segera, diikuti dengan proses _hydration_ untuk
mengaktifkan interaktivitas JavaScript (Verma & Aland, 2024). Keunggulan utama
SSR terletak pada peningkatan _Search Engine Optimization_ (SEO) melalui
_crawling_ yang lebih baik dan _First Contentful Paint_ (FCP) yang lebih cepat,
memastikan konten terlihat lebih awal oleh pengguna (Jain, 2021; Vallamsetla,


2024). Namun, metode ini memiliki kelemahan berupa beban server yang lebih
tinggi dan _Time to Interactive_ yang cenderung lebih lambat dibandingkan _Client-
Side Rendering_ karena browser harus menunggu unduhan skrip selesai sebelum
halaman menjadi interaktif (Lokhande et al., 2023). Dalam pengembangan aplikasi
generator ini, SSR diterapkan secara strategis pada halaman _landing_ untuk
memaksimalkan visibilitas di mesin pencari dan memberikan pengalaman akses
awal yang instan bagi pengguna baru (Vallamsetla, 2024).

**2.2.5 Static Site Generation**
_Static Site Generation_ (SSG) merupakan teknik _pre-rendering_ di mana
halaman HTML dihasilkan pada saat proses _build_ (kompilasi), memisahkan lapisan
presentasi _front-end_ dari layanan _back-end_ untuk mencapai kinerja yang optimal
(Jain, 2021; Kosna, 2023). Pendekatan ini memungkinkan file statis disajikan
langsung melalui _Content Delivery Network_ (CDN), yang secara signifikan
meningkatkan kecepatan muat, keamanan, dan skalabilitas global dibandingkan
arsitektur web dinamis tradisional (Kosna, 2023). Untuk mengatasi sifat statis
konten, teknologi _Incremental Static Regeneration_ (ISR) memungkinkan
pembaruan halaman tertentu secara bertahap di latar belakang tanpa perlu
membangun ulang seluruh situs, sehingga data tetap relevan (Tadi, 2024). Kerangka
kerja modern seperti Next.js memfasilitasi implementasi SSG ini untuk
menciptakan aplikasi web yang berkinerja tinggi dan efisien (Świątkowski &
Ścibior, 2022). Dalam aplikasi ini, SSG digunakan untuk galeri _explore_ dan konten
statis lainnya guna menjamin akses yang sangat cepat dan stabil bagi pengguna saat
menelusuri karya komunitas (Tadi, 2024).

**2.2.6 Hybrid Rendering dan React Server Components**
_Hybrid Rendering_ merupakan pendekatan arsitektur fleksibel yang
menggabungkan metode CSR, SSR, dan SSG dalam satu aplikasi untuk
menyeimbangkan kebutuhan kinerja sistem dan interaktivitas pengguna (Jain,
2021; Tadi, 2024). Paradigma ini diperkaya dengan teknologi _React Server
Components_ (RSC), yang memungkinkan komponen UI dirender secara eksklusif


di server untuk mengurangi ukuran _bundle_ JavaScript yang dikirim ke klien secara
signifikan (Khan, 2025). Keunggulan integrasi RSC meliputi waktu muat halaman
yang lebih cepat dan efisiensi pemrosesan data yang lebih baik, karena logika berat
tetap berjalan di server (Khan, 2025). Kombinasi strategi ini memungkinkan
pengembang menerapkan metode rendering yang paling tepat pada tingkat halaman
atau komponen, sebagaimana diimplementasikan dalam _Next.js App Router_ (Jain,
2021; Khan, 2025). Relevansi arsitektur ini dalam aplikasi generator terlihat pada
penggunaan SSG untuk galeri publik, CSR untuk editor komik yang interaktif, serta
RSC untuk pengambilan data _project_ yang efisien (Khan, 2025; Tadi, 2024).

### 2.2.7 App Router dan File-based Routing

_File-based routing_ didefinisikan sebagai sistem manajemen navigasi
modern di mana struktur direktori dan berkas dalam proyek secara otomatis
dipetakan menjadi rute URL aplikasi, menghilangkan kebutuhan akan konfigurasi
rute manual yang kompleks (Khan, 2025; Noor, 2024). Paradigma ini
diimplementasikan secara komprehensif dalam _Next.js App Router_ (v13+), yang
memanfaatkan konvensi penamaan folder dan fail untuk menciptakan hierarki
halaman yang intuitif dan terstruktur (Kosna, 2023; Noor, 2024). Keunggulan
utama dari pendekatan ini meliputi kesederhanaan ( _simplicity_ ) dan prinsip _co-
location_ , di mana logika halaman dan komponen pendukungnya berada dalam satu
lokasi, sehingga meningkatkan efisiensi pengembangan dibandingkan definisi rute
tradisional (Khan, 2025). Selain itu, arsitektur ini mendukung integrasi fitur
canggih seperti _React Server Components_ secara _native_ , yang mengoptimalkan
performa aplikasi melalui pembagian beban kerja antara klien dan server
(Vallamsetla, 2024). Dalam aplikasi web generator ini, sistem _file-based routing_
digunakan untuk mengelola akses ke modul utama seperti /comic-generator dan
/avatar-generator (Noor, 2024).


### 2.2.8 Web API dan RESTful Services

_Web API_ dengan arsitektur REST ( _Representational State Transfer_ )
didefinisikan sebagai gaya arsitektur standar untuk layanan web yang
memungkinkan komunikasi antar sistem yang berbeda melalui protokol HTTP (Liu
et al., 2022; Thooriqoh et al., 2024). Prinsip utama REST mencakup sifat _stateless_ ,
pemisahan tugas _client-server_ , dan antarmuka seragam ( _uniform interface_ ), di mana
setiap sumber daya diidentifikasi oleh URI dan dimanipulasi menggunakan metode
HTTP standar seperti GET, POST, PUT, dan DELETE (Liu et al., 2022; Singh,
2024). Keunggulan arsitektur ini terletak pada skalabilitasnya yang tinggi,
kesederhanaan desain, serta independensi platform yang memungkinkannya
diadopsi secara luas dalam ekosistem pengembangan perangkat lunak modern
(Thooriqoh et al., 2024). Arsitektur ini sangat relevan untuk aplikasi generator, di
mana _RESTful API_ berfungsi sebagai jembatan komunikasi yang efisien untuk
mengirimkan data _prompt_ pengguna ke layanan _Generative AI_ eksternal dan
menerima kembali hasil konten digital (Singh, 2024).

### 2.2.9 JavaScript Object Notation.................................................................

_JavaScript Object Notation_ (JSON) adalah format pertukaran data ringan
berbasis teks yang telah menjadi standar _de facto_ untuk transmisi data di web karena
kemudahan pembacaannya oleh manusia maupun mesin (Keiser & Lemire, 2024;
Talluri et al., 2025). Struktur JSON terdiri dari pasangan _key-value pairs_ dan _arrays_
yang terorganisir secara hierarkis, memungkinkan representasi data semi-
terstruktur yang kompleks dengan efisiensi tinggi (Agarwal & Sarangi, 2022).
Dibandingkan dengan format XML, JSON menawarkan keunggulan signifikan
berupa sintaks yang lebih ringkas, ukuran _payload_ yang lebih kecil, dan kecepatan
_parsing_ yang lebih tinggi, yang sangat krusial untuk performa aplikasi intensif data
(Keiser & Lemire, 2024; Talluri et al., 2025). Dalam konteks aplikasi generator
avatar dan komik, JSON digunakan secara ekstensif sebagai format utama untuk
pertukaran data dalam _request_ dan _response_ API, serta untuk menyimpan
konfigurasi preferensi pengguna (Agarwal & Sarangi, 2022).


### 2.2.10 Middleware dan Request Interception

_Middleware_ didefinisikan sebagai lapisan perangkat lunak perantara yang
menjembatani komunikasi antara klien dan server, berfungsi untuk memproses atau
memodifikasi _request_ sebelum mencapai penangan utama ( _handler_ ) (Singh, 2024;
Vallamsetla, 2024). Fungsi utama _middleware_ mencakup manajemen otentikasi,
otorisasi, _logging_ , serta penanganan kesalahan, yang diimplementasikan
menggunakan pola _Chain of Responsibility_ untuk memastikan setiap permintaan
diproses secara berurutan dan aman (Singh, 2024). Dalam kerangka kerja Next.js,
_middleware_ memungkinkan intersepsi permintaan di tingkat _edge_ untuk melakukan
validasi atau pengalihan rute secara dinamis sebelum konten dirender, sehingga
meningkatkan keamanan dan performa aplikasi (Vallamsetla, 2024). Relevansi
teknologi ini dalam aplikasi web generator diterapan untuk memverifikasi token
sesi pengguna, membatasi laju permintaan ( _rate limiting_ ) ke layanan AI, dan
memvalidasi integritas data input (Singh, 2024; Thooriqoh et al., 2024).

## 2.3 Pemodelan Sistem

Pemodelan sistem merupakan proses fundamental dalam rekayasa
perangkat lunak yang mentransformasikan persyaratan bahasa alami menjadi
representasi visual terstruktur untuk memfasilitasi pemahaman teknis (Molla et al.,
2024). Dalam konteks pengembangan aplikasi web yang kompleks, pemodelan ini
berperan krusial pada fase awal, seperti elisitasi kebutuhan dan spesifikasi
arsitektur, guna memastikan keselarasan antara kapabilitas sistem dan kebutuhan
pengguna (Görgen et al., 2024). Penelitian ini menerapkan beberapa jenis diagram
pemodelan standar untuk detail fungsionalitas (Ražinskas et al., 2024). Pemodelan
ini bertujuan untuk mendefinisikan batasan sistem serta interaksi pengguna secara
presisi pada aplikasi generator avatar dan komik berbasis _Generative AI_.

### 2.3.1 Diagram Konteks................................................................................

Diagram konteks didefinisikan sebagai model yang menggambarkan batas
abstraksi antara sistem dan sistem eksternal, di mana lingkungan menyediakan
kondisi input tertentu dan membatasi output yang dihasilkan oleh sistem (Salado &
Wach, 2019). Fungsi utama diagram ini adalah untuk memetakan "Dunia yang


Diminati" atau _World-Of-Interest_ (WOI), yang mencakup semua entitas seperti
sistem, lingkungan, dan situasi yang ingin diperiksa oleh insinyur sistem (Baek et
al., 2024). Elemen-elemen dalam diagram ini terdiri dari _System of Interest_ (SoI)
sebagai fokus utama, _interfacing systems_ atau sistem eksternal yang berinteraksi,
serta aliran pertukaran data dan informasi yang menghubungkan elemen fisik dan
virtual tersebut (Pasquariello et al., 2025).
Dalam perancangan sistem, diagram konteks sangat berguna untuk
menangkap dimensi lingkungan kerja yang kompleks, memastikan bahwa model
konteks mencakup lapisan proyek, organisasi, dan domain pengetahuan yang
relevan (Antunes et al., 2008). Diagram ini membantu memahami batasan sistem
dengan memodelkan persyaratan sebagai transformasi input menjadi output,
sehingga solusi ruang lingkup sistem tidak dibatasi secara tidak perlu oleh atribut
internal (Salado & Wach, 2019). Relevansinya dengan aplikasi generator avatar dan
komik digital adalah untuk memetakan bagaimana sistem berinteraksi dengan
pengguna dan sumber data eksternal sebagai satu kesatuan _Digital Twin System_
yang terintegrasi (Pasquariello et al., 2025).

### 2.3.2 Use Case Diagram

_Use case diagram_ merupakan model visual yang mendeskripsikan
perilaku fungsional sistem melalui serangkaian skenario interaksi antara pengguna
dan perangkat lunak yang dikembangkan (Molla et al., 2024). Komponen
fundamental dalam diagram ini terdiri dari aktor yang merepresentasikan peran
pengguna, _use case_ yang mewakili unit fungsionalitas diskrit, serta relasi asosiasi
yang menghubungkan aktor dengan fitur tersebut (Eisenreich et al., 2025). Notasi
standar yang digunakan dalam diagram ini meliputi simbol _stick figure_ untuk aktor,
bentuk elips untuk _use case_ , dan garis penghubung untuk menunjukkan komunikasi
aktif antar elemen (Ražinskas et al., 2024).
Diagram ini memiliki fungsi vital dalam analisis kebutuhan untuk
menangkap dan mendokumentasikan persyaratan sistem dari perspektif pengguna
akhir secara sistematis (Molla et al., 2024). _Use case diagram_ membantu
pengembang memahami bagaimana berbagai aktor berinteraksi dengan sistem


untuk mencapai tujuan spesifik, sehingga meminimalisir ambiguitas dalam
spesifikasi fitur (Eisenreich et al., 2025). Dalam konteks aplikasi web generator ini,
diagram tersebut digunakan untuk merinci aktivitas pengguna, seperti proses
inisiasi pembuatan avatar kustom dan alur kerja penyusunan panel komik digital.

### 2.3.3 Data Flow Diagram

_Data Flow Diagram_ (DFD) didefinisikan sebagai teknik pemodelan grafis
yang memvisualisasikan aliran informasi dalam suatu sistem, mulai dari sumber
data hingga ke tujuannya, serta bagaimana data tersebut ditransformasi (Aleryani,
2024). Komponen fundamental yang menyusun diagram ini meliputi entitas
eksternal sebagai sumber atau penerima informasi, proses yang mengubah _input_
menjadi _output_ , penyimpanan data, serta aliran data yang menghubungkan elemen-
elemen tersebut (Aleryani, 2024). Notasi standar yang digunakan untuk
merepresentasikan elemen-elemen ini mencakup lingkaran atau persegi panjang
untuk proses, persegi untuk entitas eksternal, garis paralel untuk penyimpanan data,
dan anak panah untuk menunjukkan arah aliran data (Schneider et al., 2024).
Secara fungsional, DFD berperan vital dalam fase analisis sistem untuk
memberikan pemahaman holistik mengenai dinamika pergerakan data dan batasan
sistem tanpa berfokus pada detail teknis implementasi (Schneider et al., 2024).
Diagram ini membantu pengembang dalam memverifikasi kebutuhan fungsional
dengan memetakan transformasi data yang terjadi dalam berbagai tingkatan proses
(Wei et al., 2023). Dalam relevansinya dengan aplikasi generator avatar dan komik
digital, DFD digunakan untuk memodelkan aliran data mulai dari _input_ parameter
visual oleh pengguna, pemrosesan data tersebut oleh model _Generative AI_ , hingga
distribusi _output_ konten digital kembali kepada pengguna (Aleryani, 2024).

### 2.3.4 Standard Operating Procedure

_Standard Operating Procedure_ (SOP) merupakan dokumen instruksi
tertulis yang dibakukan untuk memandu pelaksanaan aktivitas operasional rutin
dalam suatu organisasi agar berjalan sesuai standar yang ditetapkan (Abdullah et
al., 2022). Tujuan utama dari penyusunan SOP adalah untuk menjamin konsistensi


kualitas hasil kerja, meningkatkan efisiensi waktu operasional, serta memastikan
kepatuhan terhadap regulasi dan kebijakan internal yang berlaku (Abdullah et al.,
2022). Elemen kunci yang harus termuat dalam dokumen ini meliputi deskripsi
langkah-langkah prosedural yang sistematis, _flowchart_ aktivitas, serta definisi
tanggung jawab yang jelas bagi setiap unit kerja (Abdullah et al., 2022).
Dalam konteks pemodelan proses bisnis, SOP berfungsi sebagai instrumen
dokumentasi yang mendetailkan logika dan struktur alur kerja, sehingga
meminimalisir variabilitas dan kesalahan dalam eksekusi proses yang
kompleks(Alotaibi, 2020). Keberadaan SOP sangat penting untuk memberikan
kejelasan operasional yang mendukung kolaborasi tim dan penyelarasan strategis,
serupa dengan fungsi pemodelan visual dalam manajemen proses (Mariya et al.,
2024). Pada pengembangan aplikasi generator ini, SOP diterapkan untuk
menstandarisasi prosedur teknis seperti _workflow_ pembuatan komik yang bertahap
serta mekanisme pengisian _form input_ dinamis pada fitur avatar guna memastikan
pengalaman pengguna yang seragam.

## 2.4 Perangkat Lunak Penelitian

Implementasi teknis dalam penelitian ini didukung oleh ekosistem
perangkat lunak pengembangan yang terintegrasi guna memastikan efektifitas
penulisan kode, manajemen versi, dan pengujian sistem yang terstandarisasi.
Infrastruktur pengembangan ini mencakup penggunaan _Visual Studio Code_ sebagai
editor kode sumber utama yang didukung oleh berbagai ekstensi, serta penerapan
_Git_ dan _GitHub_ untuk keperluan kontrol versi terdistribusi dan kolaborasi tim.
Lebih lanjut, landasan operasional sistem ditopang oleh _Node.js_ dan _npm_ yang
berfungsi sebagai lingkungan eksekusi _server-side_ dan manajer dependensi,
dilengkapi dengan _Postman_ sebagai instrumen validasi dan pengujian
fungsionalitas _Web API_ secara komprehensif.

### 2.4.1 Visual Studio Code

Visual Studio Code (VS Code) didefinisikan sebagai editor kode sumber
ringan namun berdaya guna tinggi yang menyediakan lingkungan pengembangan
terintegrasi untuk berbagai bahasa pemrograman dan kerangka kerja modern (Noor,


2024; Sergeyuk et al., 2024). Perangkat lunak ini dilengkapi dengan fitur-fitur
fundamental seperti penyorotan sintaksis, _IntelliSense_ untuk pelengkapan kode
cerdas, serta alat _debugging_ bawaan yang secara signifikan meningkatkan efisiensi
dan akurasi penulisan kode (Ekpobimi, 2024). Salah satu keunggulan utama VS
Code merupakan ekosistem ekstensinya yang luas, yang memungkinkan integrasi
asisten pengodingan berbasis kecerdasan buatan untuk membantu pengembang
dalam aktivitas refaktorisasi, pembuatan unit tes, dan implementasi fitur baru secara
otomatis (Sergeyuk et al., 2024). Fleksibilitas ini menjadikan VS Code sangat
adaptif terhadap kebutuhan pengembangan lintas _platform_ dan mendukung
kustomisasi mendalam sesuai preferensi pengembang (Noor, 2024). Dalam
penelitian ini, Visual Studio Code digunakan sebagai lingkungan utama untuk
mengembangkan arsitektur _frontend_ berbasis Next.js dan TypeScript, memfasilitasi
pengelolaan kode yang kompleks untuk fitur pembuatan avatar dan komik digital
(Ekpobimi, 2024; Sergeyuk et al., 2024).

### 2.4.2 Git dan Github

Git merupakan sistem kontrol versi terdistribusi ( _Distributed Version
Control System_ ) yang dirancang untuk melacak perubahan pada kode sumber secara
efisien, memungkinkan pengelolaan riwayat pengembangan yang komprehensif
dari tahap awal hingga produksi (Mooghala, 2024). Fungsi inti Git mencakup
mekanisme _branching_ dan _merging_ yang canggih, yang memungkinkan isolasi fitur
baru dan integrasi kode yang aman tanpa mengganggu stabilitas basis kode utama,
serta meminimalkan risiko konflik teknis (Schesch et al., 2024). GitHub
melengkapi ekosistem ini sebagai platform _hosting_ repositori yang memfasilitasi
kolaborasi tim melalui fitur-fitur seperti _pull requests_ , tinjauan kode ( _code review_ ),
dan manajemen isu, yang esensial untuk menjaga transparansi proyek (Mooghala,
2024; Noor, 2024). Keunggulan arsitektur terdistribusi ini memberikan performa
tinggi dan kemampuan bekerja secara _offline_ , di mana setiap pengembang memiliki
salinan lengkap dari riwayat repositori (Schesch et al., 2024). Relevansi Git dan
GitHub dalam pengembangan aplikasi generator ini terletak pada perannya dalam
menjaga integritas versi kode modul AI, memfasilitasi kolaborasi pengembangan


fitur secara paralel, serta mendukung alur kerja penerapan otomatis ( _deployment_ )
(Mooghala, 2024; Schesch et al., 2024).

### 2.4.3 Node.js dan npm

Node.js didefinisikan sebagai _runtime environment_ asinkron berbasis
mesin JavaScript V8 yang dirancang untuk membangun aplikasi jaringan berskala
besar dengan efisiensi tinggi (Noor, 2024; Pratama & Raharja, 2023). Karakteristik
utama teknologi ini meliputi arsitektur _event-driven_ dan mekanisme _non-blocking
I/O_ , yang memungkinkannya menangani ribuan koneksi bersamaan secara efektif
tanpa membebani memori server (Pratama & Raharja, 2023). Ekosistem Node.js
didukung oleh npm ( _Node Package Manager_ ), sebuah manajer paket standar yang
memfasilitasi instalasi, pengelolaan dependensi, dan eksekusi skrip otomatis dalam
siklus pengembangan perangkat lunak (Jain, 2021; Pratama & Raharja, 2023).
Dengan repositori yang menampung jutaan paket, npm memungkinkan
pengembang untuk mengintegrasikan berbagai pustaka modern secara modular
guna mempercepat proses _development_ (Pratama & Raharja, 2023). Dalam
penelitian ini, Node.js berfungsi sebagai fondasi sisi server yang menjalankan
kerangka kerja Next.js, sementara npm digunakan untuk mengelola dependensi
proyek generator avatar dan komik digital (Noor, 2024; Pratama & Raharja, 2023).

### 2.4.4 Postman

Postman merupakan _platform_ pengembangan API komprehensif yang
menyediakan lingkungan terpadu untuk merancang, menguji, dan
mendokumentasikan antarmuka pemrograman aplikasi secara efisien (Thooriqoh et
al., 2024). Alat ini dilengkapi dengan fitur utama seperti pembuatan _request_ HTTP,
pengorganisasian pengujian dalam _Collections_ , serta pengelolaan variabel
_environments_ yang memudahkan simulasi interaksi klien-server (Liu et al., 2022;
Thooriqoh et al., 2024). Postman juga mendukung otomatisasi pengujian melalui
integrasi Newman CLI, yang memungkinkan eksekusi skrip pengujian secara
terprogram dalam saluran CI/CD untuk memvalidasi fungsionalitas dan kinerja API
(Thooriqoh et al., 2024). Kemampuan kolaborasinya memungkinkan tim


pengembang berbagi ruang kerja dan dokumentasi API secara _real-time_ ,
memastikan konsistensi dalam pengujian integrasi sistem (Thooriqoh et al., 2024).
Dalam pengembangan aplikasi generator ini, Postman digunakan secara intensif
untuk menguji keandalan _RESTful API_ yang menjembatani komunikasi antara
antarmuka pengguna dan layanan _Generative AI_ eksternal (Liu et al., 2022;
Thooriqoh et al., 2024).

## 2.5 Teknologi Penelitian

Perancangan aplikasi web dalam penelitian ini didasarkan pada pemilihan
teknologi modern yang dirancang untuk mengoptimalkan interaktivitas dan
performa sistem secara menyeluruh. Fondasi pengembangan antarmuka pengguna
dibangun menggunakan pustaka _React_ yang diintegrasikan ke dalam kerangka kerja
_Next.js_ guna mendukung mekanisme rendering _hybrid_ yang efisien dan skalabel.
Stabilitas serta pemeliharaan kode diperkuat melalui penerapan _TypeScript_ sebagai
standar pengetikan statis, sementara aspek visual dan responsivitas desain ditangani
menggunakan pendekatan _utility-first_ yang ditawarkan oleh _Tailwind CSS_.

### 2.5.1 React

React didefinisikan sebagai pustaka JavaScript berbasis komponen yang
bersifat deklaratif, dirancang khusus untuk membangun antarmuka pengguna yang
interaktif dan efisien (Lazuardy & Anggraini, 2022; Reddy & Mishra, 2021).
Arsitektur utamanya bertumpu pada penggunaan _Virtual DOM_ , sebuah representasi
memori dari DOM asli, yang memungkinkan pembaruan tampilan dilakukan secara
optimal tanpa membebani kinerja peramban (Lazuardy & Anggraini, 2022;
Świątkowski & Ścibior, 2022). Ekosistem React didukung oleh komunitas yang
besar dan berbagai pustaka komponen eksternal, memberikan fleksibilitas tinggi
bagi pengembang untuk menyusun elemen visual yang kompleks dan dapat
digunakan kembali ( _reusable_ ) (Rajala, 2024; Reddy & Mishra, 2021). Keunggulan
teknologi ini terletak pada kemudahan pemeliharaan kode ( _maintainability_ ) dan
strukturisasi logika tampilan yang terisolasi, yang sangat krusial dalam
pengembangan aplikasi berskala besar (Rajala, 2024; Świątkowski & Ścibior,
2022). Dalam penelitian ini, React digunakan sebagai fondasi utama untuk


mengembangkan komponen antarmuka aplikasi web generator avatar dan komik
digital, memastikan interaksi pengguna berjalan mulus (Reddy & Mishra, 2021).

### 2.5.2 Next.js

Next.js merupakan kerangka kerja React tingkat produksi yang
menyediakan infrastruktur lengkap untuk pengembangan aplikasi web modern
dengan performa tinggi dan skalabilitas optimal (Ardiyanto & Ardhianto, 2024;
Ekpobimi, 2024). Kerangka kerja ini mengintegrasikan berbagai strategi rendering
canggih, termasuk _Server-Side Rendering_ (SSR), _Client-Side Rendering_ (CSR), dan
_Incremental Static Regeneration_ (ISR), yang dapat dikonfigurasi secara _hybrid_
sesuai kebutuhan spesifik setiap halaman (Ardiyanto & Ardhianto, 2024;
Vallamsetla, 2024). Fitur bawaan seperti sistem _routing_ berbasis berkas, optimasi
citra otomatis, dan dukungan _middleware_ menjadikan Next.js solusi unggul untuk
mengatasi tantangan SEO dan waktu muat awal yang sering dihadapi aplikasi
_Single Page Application_ (Ekpobimi, 2024; Kosna, 2023). Implementasi Next.js
terbukti secara empiris mampu meningkatkan skor performa web dan pengalaman
pengguna melalui mekanisme _code splitting_ otomatis (Ardiyanto & Ardhianto,
2024; Vallamsetla, 2024). Pada sistem generator ini, Next.js berfungsi sebagai
tulang punggung arsitektur yang menangani logika _backend_ , navigasi, dan
penyajian konten visual hasil generasi AI (Ekpobimi, 2024).

### 2.5.3 TypeScript

TypeScript merupakan superset dari bahasa pemrograman JavaScript yang
memperkenalkan sistem _static typing_ untuk meningkatkan keandalan dan struktur
kode dalam pengembangan perangkat lunak (Bogner & Merkel, 2022; Noor, 2024).
Melalui fitur-fitur seperti anotasi tipe data, antarmuka, dan _generics_ , TypeScript
memungkinkan deteksi kesalahan logika dan sintaksis dilakukan pada tahap
kompilasi, jauh sebelum kode dijalankan (Bogner & Merkel, 2022). Penggunaan
bahasa ini secara signifikan meningkatkan kualitas kode dan produktivitas
pengembang melalui dukungan _IntelliSense_ yang lebih akurat pada editor kode,
memudahkan refaktorisasi dan pemahaman alur data (Bogner & Merkel, 2022;


Noor, 2024). Integrasinya yang mulus dengan ekosistem React dan Next.js
menjadikan TypeScript standar industri untuk menjaga konsistensi kode dalam
proyek kolaboratif yang kompleks (Bogner & Merkel, 2022; Noor, 2024). Dalam
pengembangan aplikasi generator, TypeScript diterapkan secara menyeluruh untuk
menjamin keamanan tipe data ( _type safety_ ) pada setiap modul, mulai dari komponen
UI hingga integrasi API (Bogner & Merkel, 2022).

### 2.5.4 Tailwind CSS

Tailwind CSS didefinisikan sebagai kerangka kerja CSS yang mengadopsi
pendekatan _utility-first_ , memungkinkan pengembang merancang antarmuka
pengguna secara cepat langsung melalui kelas-kelas utilitas dalam _markup_ HTML
(Noor, 2024; Rajala, 2024). Berbeda dengan kerangka kerja UI konvensional,
Tailwind menawarkan fleksibilitas desain yang tinggi tanpa membatasi
pengembang pada komponen pracetak, sekaligus menghasilkan ukuran berkas CSS
yang sangat kecil di tahap produksi (Ekpobimi, 2024; Rajala, 2024). Pendekatan ini
mendukung konsistensi visual dan mempercepat siklus pengembangan, karena
pengembang tidak perlu beralih antara berkas HTML dan lembar gaya eksternal
secara berulang (Noor, 2024; Rajala, 2024). Fitur konfigurasi yang ekstensif juga
memfasilitasi penerapan desain responsif dan mode gelap secara efisien di seluruh
bagian aplikasi (Ekpobimi, 2024). Relevansi Tailwind CSS dalam penelitian ini
digunakan untuk menata seluruh elemen visual aplikasi web generator, memastikan
tampilan yang estetis dan modern (Noor, 2024; Rajala, 2024).

## 2.6 Teknologi State Management

Pengembangan aplikasi web menuntut strategi manajemen _state_ yang
terstruktur demi menjamin konsistensi data. Pembahasan ini mencakup penggunaan
_React Context API_ dan _React Hooks_ untuk pengelolaan aliran informasi global
maupun lokal, serta penerapan pustaka _React DnD_ dan _React RnD_ yang
memfasilitasi interaksi elemen visual secara langsung. Lebih lanjut, integrasi
_Framer Motion_ diuraikan sebagai solusi deklaratif dalam menciptakan dinamika
animasi antarmuka yang optimal.


### 2.6.1 React Context API

_React Context API_ didefinisikan sebagai mekanisme bawaan dalam
pustaka React yang memungkinkan data dibagikan secara global ke seluruh _tree_
komponen tanpa perlu meneruskannya secara manual melalui _props_ di setiap
tingkat ( _prop drilling_ ) (Lazuardy & Anggraini, 2022; Reddy & Mishra, 2021).
Mekanisme ini bekerja melalui _provider_ yang membungkus komponen induk dan
_hook_ useContext yang memungkinkan komponen anak mengakses data tersebut
secara langsung, menyederhanakan arsitektur manajemen _state_ untuk kompleksitas
tingkat menengah (Noor, 2024). Keunggulan utama pendekatan ini adalah eliminasi
ketergantungan pada pustaka pihak ketiga yang berat, menjaga ukuran berkas
aplikasi tetap kecil dan performa tetap optimal (Świątkowski & Ścibior, 2022).
Dalam konteks aplikasi web generator ini, _Context API_ digunakan secara ekstensif
untuk mengelola _state_ global yang persisten seperti preferensi tema antarmuka,
status otentikasi pengguna, dan konfigurasi _comic editor_ (Lazuardy & Anggraini,
2022; Noor, 2024).

### 2.6.2 React Hooks

_React Hooks_ merupakan fitur revolusioner yang memungkinkan
penggunaan _state_ dan _lifecycle methods_ di dalam komponen fungsional tanpa perlu
menulis _class components_ (Reddy & Mishra, 2021; Świątkowski & Ścibior, 2022).
Terdapat tiga _hooks_ fundamental yang digunakan: useState untuk manajemen
_state_ lokal, useEffect untuk menangani efek samping seperti pengambilan data
atau manipulasi DOM, dan useReducer untuk logika perubahan _state_ yang lebih
kompleks dengan pola _reducer_ (Lazuardy & Anggraini, 2022). Penerapan _hooks_
menghasilkan kode yang lebih bersih, modular, dan dapat digunakan kembali, serta
memfasilitasi komposisi logika antar komponen yang lebih baik (Reddy & Mishra,
2021). Relevansi teknologi ini dalam aplikasi web generator terlihat pada
penggunaan useState untuk mengelola input formulir dinamis, useEffect untuk
sinkronisasi data dengan layanan AI, dan useReducer untuk mengontrol transisi
status kompleks pada _comic editor_ (Świątkowski & Ścibior, 2022).


### 2.6.3 React DnD

_React DnD_ adalah pustaka utilitas tingkat lanjut yang dirancang untuk
membangun antarmuka _drag-and-drop_ yang kompleks dengan tetap
mempertahankan arsitektur deklaratif React (Noor, 2024; Rajala, 2024). Pustaka ini
menyediakan seperangkat _hook_ seperti useDrag dan useDrop yang membungkus
komponen menjadi _drag sources_ atau _drop targets_ , memungkinkan interaksi
elemen yang fleksibel dan dapat dikustomisasi sepenuhnya (Rajala, 2024).
Keunggulan utamanya terletak pada abstraksi logika interaksi yang memisahkan
definisi tampilan dari perilaku seret, sehingga mendukung berbagai skenario
penggunaan mulai dari pengurutan daftar hingga pemindahan aset visual (Reddy &
Mishra, 2021). Dalam penelitian ini, _React DnD_ diimplementasikan pada modul
_comic editor_ untuk memungkinkan pengguna menyusun tata letak panel,
memindahkan karakter, dan mengatur posisi _bubble dialog_ secara intuitif pada
kanvas (Noor, 2024; Rajala, 2024).

### 2.6.4 React RnD

_React RnD_ didefinisikan sebagai pustaka komponen yang menggabungkan
fungsionalitas pengubahan ukuran ( _resizing_ ) dan pemindahan posisi ( _dragging_ )
dalam satu elemen antarmuka (Ekpobimi, 2024; Rajala, 2024). Teknologi ini
memungkinkan manipulasi elemen DOM secara langsung melalui pegangan
kontrol ( _handles_ ) dan batasan area gerak ( _bounds_ ), baik dalam mode terkontrol
maupun tidak terkontrol (Rajala, 2024). Fleksibilitas yang ditawarkan _React RnD_
sangat peting dalam pengembangan aplikasi _visual editor_ , karena memberikan
kebebasan penuh kepada pengguna untuk menyesuaikan dimensi dan koordinat
elemen secara presisi (Reddy & Mishra, 2021). Pada aplikasi web generator ini,
_React RnD_ diterapkan untuk memberikan kontrol interaktif pada elemen-elemen di
dalam kanvas komik, memungkinkan pengguna mengubah ukuran panel gambar
atau memposisikan teks dialog sesuai kebutuhan komposisi visual (Ekpobimi,
2024; Reddy & Mishra, 2021).


### 2.6.5 Framer Motion....................................................................................

_Framer Motion_ merupakan pustaka animasi siap produksi untuk ekosistem
React yang menyediakan API deklaratif untuk menciptakan transisi antarmuka
yang halus dan interaksi berbasis gestur (Lazuardy & Anggraini, 2022; Rajala,
2024). Pustaka ini menyederhanakan pembuatan animasi kompleks melalui
komponen motion dan sistem varian, yang secara otomatis menangani _spring
physics_ untuk menghasilkan pergerakan elemen yang terlihat natural dan realistis
(Rajala, 2024). Selain meningkatkan estetika visual, penggunaan animasi yang
terukur juga berfungsi untuk memberikan umpan balik interaksi yang jelas dan
memandu fokus pengguna selama navigasi aplikasi (Ekpobimi, 2024). Relevansi
_Framer Motion_ dalam aplikasi web generator mencakup implementasi transisi
halaman dan animasi mikro pada setiap elemen antarmuka editor untuk
meningkatkan pengalaman pengguna secara keseluruhan (Ekpobimi, 2024;
Lazuardy & Anggraini, 2022).

**2.7 Teknologi Integrasi dengan Backend**
Interaksi antara antarmuka pengguna dan layanan server menuntut
penerapan standar komunikasi serta mekanisme pertukaran data yang handal guna
mendukung kinerja aplikasi. Kerangka kerja integrasi ini dibangun di atas arsitektur
_RESTful API_ yang memfasilitasi interoperabilitas sistem, didukung oleh
penggunaan pustaka _Axios_ untuk manajemen permintaan HTTP yang terstruktur.
Selanjutnya, paradigma pemrograman asinkron berbasis _async/await_ dan strategi
_polling_ diterapkan guna menjamin kelancaran eksekusi proses serta pemantauan
status generasi konten secara berkala tanpa mengganggu responsivitas aplikasi.
**2.7.1 RESTful API**
_RESTful API_ ( _Representational State Transfer_ ) didefinisikan sebagai gaya
arsitektur perangkat lunak yang menyediakan standar komunikasi antara sistem
klien dan server melalui protokol HTTP yang bersifat _stateless_ (Liu et al., 2022;
Thooriqoh et al., 2024). Prinsip utama arsitektur ini meliputi antarmuka yang
seragam dan orientasi pada sumber daya, di mana manipulasi data dilakukan
menggunakan metode HTTP standar seperti GET untuk pengambilan data, POST


untuk pembuatan, PUT untuk pembaruan, dan DELETE untuk penghapusan
(Singh, 2024; Thooriqoh et al., 2024). Komunikasi ini juga mengandalkan kode
status HTTP standar, seperti 200 ( _Success_ ), 201 ( _Created_ ), dan 500 ( _Server Error_ ),
untuk memberikan indikasi hasil operasi yang jelas kepada klien (Thooriqoh et al.,
2024). Keunggulan _RESTful API_ terletak pada skalabilitasnya yang tinggi,
kemudahan integrasi lintas _platform_ , serta kemampuannya memanfaatkan
mekanisme _caching_ web untuk meningkatkan efisiensi (Liu et al., 2022; Singh,
2024). Dalam pengembangan aplikasi web generator ini, _RESTful API_ berfungsi
sebagai jembatan komunikasi yang mengirimkan _prompt_ pengguna ke layanan
_backend_ AI dan menerima kembali aset digital yang dihasilkan (Liu et al., 2022).

**2.7.2 Axios**
Axios merupakan klien HTTP berbasis _Promise_ yang populer dalam
ekosistem JavaScript, dirancang untuk menyederhanakan proses pengiriman
permintaan asinkron ke _endpoint_ REST (Noor, 2024; Thooriqoh et al., 2024). Fitur
unggulan pustaka ini mencakup transformasi otomatis data JSON, kemampuan
intersepsi permintaan dan _respons_ untuk menyisipkan konfigurasi global seperti
token otentikasi, serta dukungan bawaan untuk perlindungan terhadap serangan
CSRF (Ekpobimi, 2024; Thooriqoh et al., 2024). Dibandingkan dengan API fetch
bawaan browser, Axios menawarkan sintaks yang lebih ringkas, penanganan
kesalahan yang lebih intuitif, dan dukungan lintas _platform_ yang konsisten baik di
sisi browser maupun Node.js (Noor, 2024; Pratama & Raharja, 2023). Kemampuan
ini menjadikannya alat yang ideal untuk menangani skenario kompleks seperti
pembatalan permintaan dan pemantauan _upload progress_ (Thooriqoh et al., 2024).
Penelitian ini melakukan implementasikan Axios untuk mengelola seluruh transaksi
data dengan _backend_ AI, memastikan transmisi parameter pembuatan avatar dan
komik digital berjalan dengan baik (Ekpobimi, 2024).


**2.7.3 Asynchronous JavaScript**
_Asynchronous JavaScript_ dengan sintaks async/await adalah paradigma
pemrograman modern yang menyederhanakan penulisan kode asinkron agar
terlihat dan berperilaku seperti kode sinkron, meningkatkan keterbacaan dan
pemeliharaan logika program (Noor, 2024; Pratama & Raharja, 2023). Konsep ini
dibangun di atas objek _Promise_ , di mana kata kunci async mendefinisikan fungsi
yang mengembalikan _Promise_ , sementara await menunda eksekusi kode
selanjutnya hingga operasi asinkron selesai, menghindari masalah _callback hell_
yang umum terjadi pada pola lama (Ekpobimi, 2024; Pratama & Raharja, 2023).
Keunggulan utamanya meliputi penanganan kesalahan yang lebih terstruktur
menggunakan blok try-catch standar dan alur kontrol yang lebih linier, yang
sangat penting dalam operasi intensif I/O seperti pemanggilan API atau akses basis
data (Noor, 2024; Pratama & Raharja, 2023). Dalam penelitian ini, async/await
digunakan untuk menangani komunikasi dengan layanan _Generative AI_ ,
memastikan antarmuka pengguna tidak membeku ( _blocking_ ) saat menunggu proses
generasi konten yang memakan waktu (Pratama & Raharja, 2023).

**2.7.4 Polling Mechanism**
Mekanisme _polling_ didefinisikan sebagai teknik komunikasi di mana klien
secara berkala mengirimkan permintaan ke server untuk memeriksa status
pembaruan atau ketersediaan data baru pada interval waktu tertentu (Nyabuto et al.,
2024; Thooriqoh et al., 2024). Terdapat dua pendekatan utama, yaitu _short polling_
yang melakukan permintaan frekuensi tinggi secara sederhana, dan _long polling_
yang mempertahankan koneksi terbuka hingga data tersedia, keduanya bertujuan
untuk mensimulasikan interaksi _real-time_ (Nyabuto et al., 2024; Singh, 2024).
Implementasi teknik ini, sering kali menggunakan fungsi setInterval atau rekursi
asinkron, berguna untuk memantau proses latar belakang yang berjalan lama tanpa
memerlukan protokol kompleks seperti WebSocket (Pratama & Raharja, 2023).
Meskipun memiliki _trade-off_ berupa peningkatan beban server, _polling_
menawarkan solusi yang tangguh dan mudah diimplementasikan untuk skenario
pelacakan status pekerjaan (Thooriqoh et al., 2024). Relevansi mekanisme ini


dalam aplikasi web generator adalah untuk memantau progres pembuatan video
avatar atau panel komik dgital secara berkala, memberikan umpan balik visual
status proses hingga selesai kepada pengguna (Nyabuto et al., 2024).

**2.8 Metode Pengujian**
Metode pengujian dalam penelitian ini dirancang secara sistematis untuk
memverifikasi fungsionalitas dan keandalan perangkat lunak melalui berbagai
tingkatan uji. Proses validasi diawali dengan _Unit Testing_ yang berfokus pada
kebenaran logika komponen individual, diikuti oleh _Integration Testing_ untuk
memeriksa keterhubungan dan pertukaran data antar modul yang berbeda.
Selanjutnya, pengujian diperluas ke ranah fungsional menggunakan _Black Box
Testing_ guna mengevaluasi respons sistem terhadap input pengguna berdasarkan
spesifikasi kebutuhan, serta dilengkapi dengan _White Box Testing_ untuk meninjau
struktur internal dan alur eksekusi kode.
**2.8.1 Unit Testing**
_Unit testing_ merupakan metode pengujian perangkat lunak tingkat dasar di
mana setiap komponen atau modul kode individual diuji secara terisolasi untuk
memverifikasi kebenaran logika internalnya (Isharah et al., 2023; Thooriqoh et al.,
2024). Tujuan utama dari pendekatan ini adalah untuk memastikan bahwa unit
terkecil dari aplikasi berfungsi sesuai spesifikasi tanpa dipengaruhi oleh dependensi
eksternal, yang sering kali dicapai menggunakan teknik _mocking_ atau _stubbing_
(Isharah et al., 2023). Karakteristik utama _unit testing_ meliputi eksekusi yang sangat
cepat dan isolasi ketat, yang memungkinkan pengembang mendeteksi _bug_ sejak
dini dalam siklus pengembangan (Liu et al., 2022). Penggunaan alat modern seperti
Jest atau React Testing Library memfasilitasi penulisan skenario uji yang
komprehensif, yang pada akhirnya berkontribusi pada penurunan densitas cacat
perangkat lunak secara signifikan (Isharah et al., 2023; Liu et al., 2022). Dalam
penelitian ini, _unit testing_ diterapkan secara intensif untuk memvalidasi
fungsionalitas komponen antarmuka React, _hooks_ , dan fungsi utilitas sebelum
diintegrasikan ke dalam sistem yang lebih besar (Thooriqoh et al., 2024).


**2.8.2 Integration Testing**
_Integration testing_ merupakan tahap pengujian yang berfokus pada
verifikasi interaksi dan pertukaran data antar modul yang berbeda untuk
memastikan bahwa mereka berfungsi secara harmonis sebagai satu kesatuan system
(Sani & Jan, 2024). Metode ini bertujuan untuk mendeteksi kesalahan pada
antarmuka komunikasi yang mungkin tidak teridentifikasi selama pengujian unit,
terutama pada titik sambungan antara lapisan _frontend_ dan _backend_ (Thooriqoh et
al., 2024). Pendekatan ini dapat dilakukan secara bertahap atau sekaligus, namun
fokus utamanya tetap pada validasi aliran data dan integritas sinyal antar komponen
(Liu et al., 2022; Sani & Jan, 2024). Dalam arsitektur aplikasi web, pengujian ini
sangat penting untuk menjamin bahwa permintaan API ditangani dengan benar dan
respons dari server diproses sesuai harapan oleh antarmuka pengguna (Sani & Jan,
2024). Pada penelitian ini, _integration testing_ digunakan untuk memvalidasi
keandalan komunikasi antara formulir _input generator_ dan layanan _RESTful API_
eksternal yang menangani proses kecerdasan buatan (Liu et al., 2022).

**2.8.3 Black Box Testing**
_Black box testing_ adalah pendekatan pengujian fungsional di mana penguji
mengevaluasi kinerja aplikasi berdasarkan spesifikasi kebutuhan tanpa memiliki
pengetahuan mengenai struktur kode internal atau logika implementasi (Pandy et
al., 2024; Sani & Jan, 2024). Fokus utama metode ini adalah pada perspektif
pengguna akhir, dengan memeriksa kesesuaian antara _input_ yang diberikan dan
_output_ yang dihasilkan sistem untuk memvalidasi alur kerja bisnis (Pandy et al.,
2024). Teknik sistematis seperti _equivalence partitioning_ dan analisis nilai batas
sering diterapkan untuk mengidentifikasi celah fungsional dan memastikan aplikasi
menangani berbagai skenario data dengan benar (Thooriqoh et al., 2024).
Keunggulan pendekatan ini terletak pada objektivitas pengujian yang bebas dari
bias teknis pengembang, serta kemampuannya untuk mensimulasikan pengalaman
pengguna yang sebenarnya (Pandy et al., 2024). Dalam aplikasi web generator
avatar dan komik, _black box testing_ diterapkan untuk menguji seluruh fitur


antarmuka, mulai dari konfigurasi parameter hingga validasi hasil visual yang
ditampilkan kepada pengguna (Sani & Jan, 2024).

**2.8.4 White Box Testing**
_White box testing_ , atau pengujian struktural, didefinisikan sebagai metode
validasi yang dilakukan dengan memeriksa logika internal, struktur kode, dan aliran
eksekusi program secara mendalam (Garousi et al., 2024). Pendekatan ini menuntut
pemahaman teknis terhadap kode sumber untuk merancang kasus uji yang dapat
mencakup seluruh jalur logika ( _path coverage_ ), percabangan ( _branch coverage_ ),
dan pernyataan kondisi (Isharah et al., 2023). Dengan menelusuri cara kerja internal
sistem, metode ini memungkinkan pengembang untuk melakukan optimasi kode,
mendeteksi kode yang tidak terjangkau ( _dead code_ ), dan memverifikasi keamanan
algoritma (Garousi et al., 2024; Pandy et al., 2024). Integrasi alat otomatisasi
berbasis AI sering digunakan dalam metode ini untuk meningkatkan efisiensi
deteksi anomali dan memastikan cakupan pengujian yang menyeluruh pada
komponen kritis (Garousi et al., 2024). Relevansi _white box testing_ dalam penelitian
ini mencakup verifikasi logika pemrosesan data sensitif di sisi server dan validasi
algoritma manipulasi kanvas pada _comic editor_ (Pandy et al., 2024).


#### BAB III

#### METODOLOGI PENELITIAN

Metodologi penelitian ini menguraikan kerangka kerja sistematis yang
mencakup spesifikasi lokasi dan waktu penelitian, strategi akuisisi data, instrumen
pengembangan perangkat lunak, serta tahapan perancangan arsitektur sistem yang
meliputi pemodelan visual hingga skenario pengujian fungsionalitas aplikasi.
**3.1 Tempat dan Waktu**
Pelaksanaan penelitian mengenai Rancang Bangun Aplikasi Web
Generator untuk Avatar dan Komik Digital Berbasis Generative AI berlokasi di
lingkungan Kampus Universitas Udayana, Fakultas Teknik, Program Studi
Teknologi Informasi. Seluruh rangkaian kegiatan penelitian, mulai dari tahap
identifikasi masalah hingga dokumentasi hasil akhir, dijadwalkan berlangsung
secara efektif sejak bulan Februari 202 sampai dengan bulan Mei 2026.

**3.2 Alur Penelitian**
Pelaksanaan penelitian ini mengikuti kerangka kerja sistematis untuk
menjamin pengembangan aplikasi web _generator_ untuk avatar dan komik digital
mencapai validitas ilmiah dan fungsional yang diharapkan. Prosedur tersebut
mencakup serangkaian langkah logis yang terintegrasi, mulai dari pendefinisian
masalah fundamental hingga evaluasi komprehensif terhadap artefak perangkat
lunak yang dihasilkan. Pemetaan langkah strategis ini berperan vital sebagai
panduan operasional dalam menjaga konsistensi arah pengembangan sistem selama
periode studi berlangsung. Visualisasi skematis mengenai urutan pelaksanaan
aktivitas penelitian diilustrasikan melalui diagram alir berikut.


Diagram tersebut mendeskripsikan lintasan penelitian yang dimulai
dengan fase pendahuluan berupa studi literatur dan perumusan masalah guna
menetapkan landasan teoretis pengembangan fitur berbasis _Generative AI_. Proses
berlanjut ke tahap teknis yang meliputi analisis kebutuhan, perancangan arsitektur
sistem, _Setup Environment_ , serta eksekusi implementasi antarmuka yang
terintegrasi dengan layanan _backend_. Siklus pengembangan menerapkan
mekanisme iteratif pada tahap pengujian, di mana sistem yang belum memenuhi
kriteria fungsional akan mengalami revisi ulang pada tahap implementasi sebelum
memasuki fase akhir analisis performa dan penyusunan dokumentasi.

**3.3 Sumber Data**
Penelitian ini memanfaatkan pertukaran data dinamis yang bersumber dari
integrasi tiga layanan _Application Programming Interface_ (API) eksternal sebagai
fondasi utama fungsionalitas sistem. Ketiga entitas penyedia data tersebut terdiri
dari _Avatar Generator Backend API_ , _Comic Generator Backend API_ , serta layanan
_Storage Service API_ yang berperan dalam manajemen aset media. Secara kolektif,
layanan-layanan ini berfungsi sebagai mesin pemrosesan di sisi _backend_ yang
menerima parameter input dari antarmuka pengguna dan mengembalikan aset
digital tergenerasi melalui protokol pertukaran data berbasis JSON.


Secara spesifik, _Avatar Generator Backend API_ bertugas memproduksi
video _talking avatar_ dengan memproses input gambar referensi, berkas audio, dan
parameter konfigurasi untuk menghasilkan tautan video beserta status
pemrosesannya. Sementara itu, _Comic Generator Backend API_ memfasilitasi
manajemen autentikasi dan pembuatan adegan visual berdasarkan _prompt_ teks serta
referensi karakter, yang kemudian mengembalikan struktur data proyek dan URL
gambar hasil generasi. Terakhir, _Storage Service API_ menangani mekanisme
pengunggahan berkas media mentah dari pengguna untuk dikonversi menjadi URL
publik yang valid agar dapat digunakan sebagai masukan bagi kedua generator
_Artificial Intelligence_ tersebut.

**3.4 Instrumen Pembuatan Sistem**
Instrumen pembuatan sistem mencakup seperangkat perangkat keras
( _hardware_ ) dan perangkat lunak ( _software_ ) yang dimanfaatkan sebagai sarana
utama dalam merealisasikan rancangan aplikasi web generator untuk avatar dan
komik digital. Ketersediaan infrastruktur komputasi yang memadai serta
lingkungan pengembangan yang terintegrasi menjadi faktor penting untuk
menjamin kelancaran proses pengkodean, pengujian, dan eksekusi logika aplikasi.
Spesifikasi teknis dari masing-masing kategori perangkat yang digunakan dalam
penelitian ini diuraikan dengan rinci pada bagian berikut.
**3.4.1 Perangkat Keras**
Pengembangan sistem dilakukan menggunakan unit komputasi bergerak
ROG Zephyrus M16 yang ditenagai oleh prosesor 12th Gen Intel(R) Core i7-
12700H berkecepatan 2.30 GHz serta memori RAM sebesar 16.0 GB. Kinerja
pemrosesan visual dan manajemen data didukung oleh kartu grafis diskrit
NVIDIA® GeForce RTX™ 3050 Ti Laptop GPU dan media penyimpanan berbasis
_Solid State Drive_ (SSD) dengan total kapasitas 1.5 TB yang terpartisi menjadi tiga
bagian logis. Konfigurasi perangkat keras berkinerja tinggi ini dipilih untuk
mengakomodasi beban komputasi intensif selama proses kompilasi kode dan
_rendering_ antarmuka pengguna yang kompleks.


**3.4.2 Perangkat Lunak**
Lingkungan pengembangan perangkat lunak dibangun di atas _Visual
Studio Code_ sebagai editor kode sumber utama yang terintegrasi dengan _Git_ dan
_GitHub_ untuk keperluan manajemen versi terdistribusi kode. Implementasi
antarmuka dan logika aplikasi memanfaatkan ekosistem _Node.js_ yang menjalankan
kerangka kerja _Next.js_ berbasis _React_ , serta _Tailwind CSS_ untuk penataan gaya
visual yang responsif dan modern. Selain itu, validasi fungsionalitas pertukaran
data antara antarmuka pengguna dan layanan eksternal dilakukan menggunakan
_Postman_ sebagai instrumen pengujian _RESTful API_ secara komprehensif.

**3.5 Gambaran Umum Sistem**
Visualisasi gambaran umum sistem ini dirancang untuk memetakan
interaksi menyeluruh antara antarmuka pengguna dengan layanan _Generative AI_
eksternal dalam ekosistem aplikasi. Mengacu pada kerangka kerja pengembangan
web modern yang telah dipaparkan pada Bab II, khususnya terkait implementasi
arsitektur berbasis komponen dan efisiensi _Server-Side Rendering_ (Vallamsetla,
2024), sistem ini mengadopsi pendekatan modular untuk memisahkan logika
presentasi dari logika bisnis yang kompleks. Representasi skematis berikut
mengilustrasikan struktur fundamental serta aliran data utama yang menopang
fungsionalitas generator avatar dan komik digital tersebut.


Pada diagram tersebut mendeskripsikan mekanisme orkestrasi sistem di
mana pengguna berinteraksi melalui lapisan antarmuka yang dibangun
menggunakan teknologi Next.js dan React untuk menjamin pengalaman pengguna
yang responsif. Permintaan pembuatan konten dari pengguna diproses melalui _API
Routes_ yang berfungsi sebagai _secure gateway_ untuk meneruskan instruksi _prompt_
menuju berbagai layanan _Third-Party AI Services_ yang terintegrasi. Hasil
komputasi generatif, baik berupa aset visual maupun audio, selanjutnya dikelola
oleh manajemen _state_ aplikasi sebelum disajikan kembali ke pengguna atau
disimpan ke dalam layanan penyimpanan. Alur arsitektur ini menegaskan
penerapan prinsip _separation of concerns_ , di mana aplikasi web fokus pada
manajemen interaksi dan integrasi, sementara beban komputasi kecerdasan buatan
didelegasikan kepada penyedia layanan khusus.


**3.6 Use Case Diagram**
Diagram pemodelan fungsional disusun untuk mendefinisikan batasan
sistem serta memetakan skenario interaksi dinamis antara pengguna dengan
perangkat lunak yang dikembangkan. Rancangan ini berfokus pada spesifikasi
perilaku sistem dalam menangani dua kapabilitas utama, yaitu modul Generasi
Avatar dan Komik Digital yang terintegrasi dengan teknologi kecerdasan buatan.
Representasi grafis ini mengilustrasikan cakupan fungsionalitas yang tersedia bagi
aktor dalam ekosistem aplikasi untuk memastikan setiap kebutuhan bisnis
terakomodasi dalam arsitektur sistem.

Konfigurasi sistem menempatkan Pengguna sebagai aktor primer yang
memiliki otorisasi untuk menginisiasi seluruh _use case_ melalui relasi asosiasi, mulai
dari manajemen aset hingga proses generasi konten. Interaksi sistem didukung oleh
dua aktor sekunder, yaitu _Avatar Generator Backend API_ dan _Comic Generator
Backend API_ , yang bertugas memproses logika komputasi berdasarkan pemicu dari


pengguna. Alur kerja dispesifikasikan lebih lanjut menggunakan relasi _include_
untuk sub-proses yang bersifat wajib dijalankan sebagai prasyarat fungsi utama.

**3.7 Diagram Konteks**
Pemetaan batasan sistem pada tingkat abstraksi divisualisasikan melalui
Diagram Konteks guna mendefinisikan ruang lingkup pengembangan perangkat
lunak secara presisi. Mengacu pada konsep analisis terstruktur yang telah diuraikan
dalam tinjauan pustaka, model ini merepresentasikan aplikasi sebagai proses
pemroses tunggal yang menjadi pusat pertukaran informasi dengan lingkungan
eksternalnya. Identifikasi aliran data global antara sistem utama dengan entitas-
entitas pendukung digambarkan melalui skema arsitektur berikut.

Konfigurasi diagram menempatkan Pengguna sebagai inisiator utama
yang mentransmisikan instruksi berupa _prompt_ teks dan konfigurasi parameter ke
dalam aplikasi web. Aliran data tersebut selanjutnya didistribusikan oleh sistem
menuju entitas eksternal, yakni _Avatar Generator Backend API_ dan _Comic_


_Generator Backend API_ , untuk memproses kebutuhan komputasi generatif yang
kompleks. Respon balik berupa aset digital dari kedua layanan _backend_ tersebut
diterima kembali oleh aplikasi untuk dirender pada antarmuka, yang menegaskan
peran sistem sebagai orkestrator dalam menjembatani interaksi pengguna dengan
teknologi kecerdasan buatan.

**3.8 Data Flow Diagram Level 0**
Diagram Alir Data Level 0 merepresentasikan dekomposisi sistem ke
dalam proses-proses utama yang menangani transformasi data antara antarmuka
pengguna dan layanan eksternal. Model ini mengilustrasikan aliran informasi
secara menyeluruh, mencakup mekanisme autentikasi, manajemen antarmuka
generator, hingga sinkronisasi _state_ aplikasi yang kompleks. Visualisasi interaksi
antar proses fungsional dan entitas eksternal dalam arsitektur sistem dipetakan
melalui diagram berikut.


Sistem terdiri dari lima proses fundamental, di mana proses Autentikasi
(1.0) memvalidasi akses pengguna, sementara Manajemen UI Avatar Generator
(2.0) dan Manajemen UI Comic Generator (3.0) menangani interaksi visual serta
input parameter kreatif. Pengelolaan data sementara difasilitasi oleh proses
Manajemen _State Global_ dan _Lokal_ (4.0) yang berinteraksi dengan penyimpanan
data _Local State_ (D2) dan _Data Project_ (D3) untuk menjaga konsistensi tampilan
kanvas maupun formulir. Seluruh pertukaran data dengan ekosistem luar dikelola
melalui proses Integrasi API (5.0), yang bertugas meneruskan _payload_ generasi ke
_Avatar Generator Backend_ dan _Comic Generator Backend_ , serta menerima kembali
aset digital hasil pemrosesan tersebut. Aliran data yang terstruktur ini memastikan
bahwa setiap _request_ dari Pengguna diproses secara asinkron dan _respons_ status
generasi dapat dipantau secara _real-time_ melalui pembaruan pada sesi pengguna.

**3.9 Standar Operating Procedure**
_Standard Operating Procedure_ (SOP) dirancang sebagai panduan teknis
yang membakukan alur interaksi pengguna dengan sistem untuk menjamin
konsistensi eksekusi proses bisnis dalam aplikasi. Dokumen ini memetakan
langkah-langkah prosedural secara berurutan, mulai dari mekanisme validasi akses
hingga tahapan produksi konten digital yang melibatkan layanan kecerdasan
buatan. Rincian prosedur operasional untuk setiap modul fungsional utama dalam
aplikasi diuraikan melalui diagram alir berikut.
**3.9.1 SOP Autentikasi dan Manajemen Sesi**
Prosedur autentikasi dan manajemen sesi berfungsi sebagai gerbang
keamanan utama yang memvalidasi identitas pengguna sebelum memberikan akses
ke fitur internal sistem. Mekanisme ini mencakup pengecekan status sesi lokal,
proses pendaftaran akun baru, hingga verifikasi kredensial masuk yang terintegrasi
dengan basis data _backend_. Alur logika validasi dan percabangan keputusan dalam
proses autentikasi divisualisasikan pada gambar berikut.


Proses dimulai dengan verifikasi keberadaan token pada _localStorage_
untuk menentukan apakah pengguna diarahkan langsung ke _dashboard_ atau
halaman masuk. Apabila pengguna belum terautentikasi, sistem menyediakan jalur
pendaftaran dan _login_ yang menuntut validasi format input sebelum data dikirimkan
ke server untuk verifikasi kredensial. Setelah respons sukses diterima dari _backend_ ,
sistem menyimpan token akses ke dalam _User Session_ dan memperbarui status
autentikasi global untuk memberikan hak akses penuh kepada pengguna.


**3.9.2 SOP Unggah dan Kustomisasi Aset Avatar**
Tahapan persiapan aset merupakan proses penting di mana pengguna
menyediakan materi dasar berupa citra visual dan data audio yang diperlukan untuk
pembuatan video avatar. Prosedur ini memfasilitasi pengunggahan berkas referensi
gambar serta pemilihan metode input suara, baik melalui fitur _Text-to-Speech_ (TTS)
maupun perekaman langsung. Mekanisme validasi dan alur konfigurasi aset
tersebut digambarkan secara skematis pada diagram alir berikut.



Prosedur diawali dengan verifikasi ketersediaan identitas pengguna, yang
dilanjutkan dengan pemilihan dan validasi berkas gambar referensi untuk diunggah
ke _server_ guna mendapatkan URL publik yang disimpan dalam _Local State_.
Pengguna kemudian diberikan fleksibilitas untuk menentukan sumber audio, baik
melalui pembangkitan suara sintetis menggunakan model _Text-to-Speech_ maupun
melalui pengunggahan atau perekaman berkas suara pribadi. Apabila opsi berkas
audio eksternal dipilih, sistem secara otomatis melakukan pemeriksaan validitas
format audio untuk meminimalisir risiko kegagalan integrasi pada tahap
selanjutnya. Setelah seluruh aset media terpenuhi, pengguna diwajibkan
menetapkan parameter konfigurasi tambahan yang kemudian divalidasi secara
menyeluruh untuk memastikan integritas seluruh data masukan. Alur kerja ini
diakhiri dengan eksekusi perintah pembuatan avatar oleh pengguna, yang
menandakan bahwa seluruh data telah siap untuk diproses oleh sistem.

**3.9.3 SOP Generasi dan Pengambilan Hasil Avatar**
Prosedur generasi avatar menangani komunikasi asinkron yang kompleks
antara antarmuka pengguna dan layanan _Generative AI_ untuk memproses
permintaan pembuatan video. Mekanisme ini melibatkan pengiriman _payload_ data,
pemantauan status pemrosesan melalui teknik _polling_ , hingga pengambilan hasil
akhir yang siap unduh. Urutan eksekusi proses dari inisiasi permintaan hingga
penyelesaian produk akhir diilustrasikan pada gambar berikut.



Proses inisiasi dimulai dengan pengambilan data aset dari _Local State_ dan
identitas dari _User Session_ untuk menyusun _payload_ permintaan yang kemudian
dikirimkan ke _Avatar Backend API_. Setelah permintaan berhasil diterima oleh
server, sistem akan menangkap _Job ID_ sebagai pengenal unik transaksi dan segera
mengaktifkan indikator progres visual pada antarmuka pengguna. Mekanisme
_polling_ kemudian dijalankan secara siklikal untuk memeriksa status pemrosesan di
server, memastikan aplikasi dapat mendeteksi perubahan status dari proses menjadi
selesai atau menangkap pesan kesalahan jika terjadi kegagalan. Apabila status
pemrosesan terkonfirmasi selesai, sistem secara otomatis mengambil URL video
hasil generasi, menyimpannya ke dalam _Data Project_ , dan memperbarui riwayat
aktivitas proyek pengguna. Rangkaian proses ini ditutup dengan penayangan
pratinjau video yang memfasilitasi pengguna untuk mengunduh hasil karya, yang
secara simultan memicu pembaruan penghitung kuota unduhan pada sistem.

**3.9.4 SOP Inisiasi Proyek Komik**
Prosedur inisiasi proyek berfungsi sebagai langkah awal yang
memfasilitasi pengguna untuk mendefinisikan parameter fundamental dari karya
komik yang akan dibuat. Proses ini mencakup konfigurasi metadata proyek seperti
genre, gaya artistik, serta spesifikasi teknis halaman yang menjadi acuan bagi
algoritma generatif. Alur sistematis mulai dari input data hingga pembentukan
entitas proyek baru dalam basis data digambarkan pada diagram berikut.


Proses inisiasi diawali dengan validasi keunikan nama proyek serta
pemilihan parameter visual esensial meliputi genre, bahasa, _art style_ , dan ukuran
halaman yang menentukan format luaran. Setelah validasi input deskripsi terpenuhi,
sistem mengeksekusi pembuatan proyek dengan menyertakan identitas pengguna
aktif, menyimpan data ke basis data, dan menetapkannya sebagai proyek aktif saat
ini. Rangkaian prosedur ini diakhiri dengan pembaruan status proyek yang secara
otomatis membuka akses pengguna menuju tahapan manajemen referensi visual
maupun pembuatan adegan komik.


**3.9.5 SOP Manajemen Referensi Visual**
Manajemen referensi visual dirancang untuk menjaga konsistensi karakter
dan latar belakang di seluruh panel komik dengan menyediakan pustaka aset yang
terpusat. Prosedur ini memungkinkan pengguna untuk menambahkan entitas
referensi baru baik melalui mekanisme pengunggahan berkas manual maupun
pembangkitan otomatis berbasis _prompt_. Logika percabangan untuk kedua metode
akuisisi aset tersebut divisualisasikan secara rinci dalam diagram alir di bawah ini.

Sistem memuat data proyek aktif dan menampilkan galeri referensi yang
memungkinkan pengguna untuk menambah entitas baru berupa karakter atau latar
belakang. Dalam formulir penambahan, pengguna dihadapkan pada dua opsi
metode input, yaitu mengunggah berkas gambar eksternal atau melakukan generasi


gambar baru menggunakan layanan _backend_. Jika opsi generasi dipilih, sistem
memproses _prompt_ teks pengguna, sedangkan opsi unggah akan memproses
validasi berkas fisik sebelum dikirim ke penyimpanan. Seluruh data referensi yang
berhasil dibuat kemudian disimpan ke _Comic Backend_ dan daftar referensi lokal
diperbarui secara _real-time_ untuk ditampilkan kembali pada galeri. Pengguna dapat
mengulangi siklus penambahan ini sesuai kebutuhan produksi sebelum
menyelesaikan sesi manajemen referensi.

**3.9.6 SOP Visualisasi Adegan**
Prosedur visualisasi adegan merupakan inti dari proses produksi yang
mentransformasikan deskripsi naratif menjadi ilustrasi visual dengan
memanfaatkan referensi karakter yang telah dikonfigurasi sebelumnya. Tahapan ini
melibatkan konstruksi _payload_ yang kompleks, pengiriman permintaan ke layanan
kecerdasan buatan, serta mekanisme pemantauan status pengerjaan secara berkala.
Rangkaian aktivitas dari input _prompt_ hingga visualisasi hasil generasi diuraikan
pada diagram berikut.


Proses dimulai dengan pemuatan data proyek dan referensi, diikuti oleh
pengisian formulir di mana pengguna memasukkan _prompt_ adegan dan menautkan
referensi karakter yang relevan. Setelah parameter gaya diatur dan input divalidasi,
sistem menyusun _payload_ generasi yang mencakup _embeddings_ referensi serta ID


proyek untuk dikirimkan ke _Comic Backend_. Sistem kemudian memasuki fase
tunggu aktif menggunakan mekanisme _polling_ untuk memantau status pekerjaan
berdasarkan _Job ID_ yang diterima hingga layanan _AI_ menyelesaikan proses
rendering. Apabila status pemrosesan terkonfirmasi sukses, sistem mengambil
metadata serta URL gambar hasil generasi untuk membentuk objek _scene_ baru
dalam penyimpanan lokal. Alur ini ditutup dengan pembaruan daftar adegan dan
penayangan pratinjau visual pada antarmuka pengguna, menandakan aset siap
digunakan dalam kompilasi panel.

**3.9.7 SOP Penyuntingan Tata Letak**
Penyuntingan tata letak menyediakan lingkungan kerja interaktif yang
memungkinkan pengguna untuk menyusun panel komik, mengatur komposisi
gambar, serta menambahkan elemen naratif seperti balon teks. SOP ini mencakup
berbagai operasi manipulasi objek visual, termasuk pemindahan posisi, pengubahan
ukuran, penambahan aset baru, dan penghapusan elemen yang tidak diinginkan.
Dinamika interaksi pengguna dengan kanvas _editor_ digambarkan secara lengkap
melalui skema diagram berikut.


Sistem menginisialisasi editor dengan memuat status kanvas terakhir dari
penyimpanan lokal dan memeriksa ketersediaan panel sebelum menampilkan
antarmuka kerja utama. Dalam mode edit, pengguna dapat melakukan aksi _drag-
and-drop_ untuk memindahkan panel menggunakan pustaka _React DnD_ , yang secara
otomatis memicu fungsi penyimpanan otomatis ( _auto-save_ ) setelah posisi
diperbarui. Fitur pengubahan ukuran ( _resize_ ) memfasilitasi penyesuaian dimensi
panel secara fleksibel, sementara proses penambahan aset memungkinkan
penyisipan elemen gelembung teks atau adegan baru ke dalam kanvas. Mekanisme
penghapusan panel dilengkapi dengan dialog konfirmasi untuk mencegah
hilangnya data secara tidak sengaja sebelum memperbarui tampilan kanvas.
Seluruh perubahan visual pada kanvas disinkronisasi secara terus-menerus ke
penyimpanan data proyek untuk menjamin keamanan progres kerja pengguna.


**3.9.8 SOP Ekspor Hasil Akhir**
Prosedur ekspor hasil akhir memfasilitasi konversi susunan panel digital
menjadi format berkas dokumen yang dapat didistribusikan, seperti PDF atau CBZ.
Tahapan ini memastikan integritas seluruh halaman komik, melakukan _rendering_
pratinjau final, dan menangani pengunduhan berkas yang dihasilkan oleh layanan
_backend_. Alur finalisasi proyek dari validasi konten hingga pemicu unduhan
peramban diilustrasikan pada gambar di bawah ini.

Sistem memulai prosedur dengan memuat seluruh halaman komik dari
data proyek dan memverifikasi keberadaan konten pada kanvas sebelum
mengizinkan proses ekspor. Jika validasi berhasil, sistem melakukan _rendering_
pratinjau untuk setiap halaman dan mengunggahnya ke _backend_ guna mendapatkan


URL referensi yang stabil. Pengguna kemudian memilih format berkas yang
diinginkan melalui dialog ekspor, yang memicu pengiriman permintaan kompilasi
dokumen ke layanan _backend_. Setelah server menyelesaikan proses konversi dan
mengembalikan berkas hasil serta metadata terkait, sistem memperbarui riwayat
ekspor proyek. Proses diakhiri dengan mekanisme pemicu unduhan pada _browser_
yang mengirimkan berkas komik final ke perangkat lokal pengguna.

**3.10 Low-Fidality Wireframe**
_Low-fidelity wireframe_ dirancang sebagai kerangka visual dasar untuk
memetakan struktur tata letak dan hierarki informasi aplikasi tanpa terdistraksi oleh
detail estetika desain. Representasi skematis ini berfungsi strategis dalam fase awal
perancangan untuk memvalidasi alur navigasi serta penempatan komponen
fungsional utama sebelum pengembangan antarmuka presisi tinggi dilakukan.
Visualisasi rancangan antarmuka untuk berbagai modul aplikasi, mulai dari
halaman muka hingga area kerja pengguna, diuraikan pada bagian-bagian berikut.
**3.10.1 Wireframe Landing Page Aplikasi Web Generator**
Halaman _landing page_ didesain sebagai titik masuk utama yang bertujuan
untuk memperkenalkan kapabilitas sistem sekaligus mengarahkan pengunjung
menuju fitur penciptaan konten. Struktur halaman disusun secara vertikal untuk
memandu alur baca pengguna mulai dari proposisi nilai utama hingga demonstrasi
visual hasil generasi _Artificial Intelligence_. Konfigurasi elemen visual dan navigasi
pada halaman muka ini diilustrasikan melalui rancangan _wireframe_ berikut ini.


Bagian atas antarmuka didominasi oleh area _hero_ yang memuat judul
persuasif dan tombol aksi utama ( _Call to Action_ ) untuk segera memulai proses
pembuatan avatar atau komik. Segmen berikutnya menampilkan blok fitur "visory
capabilities" dan demonstrasi video yang disusun secara _grid_ untuk memberikan
gambaran komprehensif mengenai fungsionalitas sistem kepada pengguna baru.
Tata letak diakhiri dengan galeri yang menampilkan ragam karya komunitas serta
area _footer_ yang memuat tautan navigasi sekunder dan informasi legal aplikasi.


**3.10.2 Wireframe Halaman Autentikasi Pengguna**
Antarmuka autentikasi dirancang untuk memfasilitasi mekanisme
verifikasi identitas pengguna yang aman namun tetap mempertahankan kemudahan
aksesibilitas. Desain halaman menerapkan pola tata letak terbagi ( _split-screen_ ) yang
menyeimbangkan elemen visual _branding_ dengan formulir input kredensial yang
fungsional. Skema penataan elemen pada gerbang akses aplikasi ini
divisualisasikan pada gambar berikut.

Pada gambar terlihat pada bagian sisi kiri layar didedikasikan untuk
menampilkan aset visual statis atau dinamis yang memperkuat identitas merek,
sementara sisi kanan memuat formulir interaktif "Welcome Back" untuk input data
akun. Komponen formulir disusun secara linear mencakup kolom isian identitas,
tombol aksi utama untuk masuk, serta opsi pemulihan akses yang diletakkan secara
strategis. Selain metode konvensional, antarmuka ini juga menyediakan alternatif
akses cepat melalui tombol autentikasi sosial ( _social login_ ) yang ditempatkan di
bagian bawah formulir untuk efisiensi pengguna.


**3.10.3 Wireframe Halaman Beranda Pengguna**
Halaman beranda pengguna berfungsi sebagai pusat kendali utama
( _dashboard_ ) yang menyajikan ringkasan aktivitas serta akses cepat menuju seluruh
modul fungsional aplikasi. Tata letak halaman mengadopsi struktur navigasi
samping ( _sidebar navigation_ ) yang persisten guna memaksimalkan area kerja
konten utama dan memudahkan perpindahan antar fitur. Rancangan struktur
antarmuka untuk halaman pusat ini digambarkan melalui diagram kerangka berikut.

Panel navigasi di sisi kiri mengelompokkan menu utama seperti _Home_ ,
_Explore_ , dan _Project_ , serta menyediakan akses langsung ke perkakas spesifik yaitu
_Avatar Generator_ dan _Comic Generator_. Area konten utama menampilkan _banner_
promosi fitur terkini di bagian atas, diikuti oleh ikon kategori yang memfasilitasi
eksplorasi aset visual secara intuitif. Bagian bawah antarmuka didedikasikan untuk
daftar proyek terbaru yang menampilkan kartu pratinjau proyek terakhir,
memungkinkan pengguna melanjutkan pekerjaan mereka dengan efisiensi tinggi.


**3.10.4 Wireframe Halaman Eksplorasi Konten Publik**
Halaman eksplorasi dirancang sebagai etalase digital yang memfasilitasi
penemuan konten kreatif hasil karya komunitas pengguna platform. Antarmuka ini
menerapkan tata letak _grid_ responsif untuk memaksimalkan visibilitas aset visual
sekaligus menyediakan mekanisme interaksi sosial. Tujuan utamanya adalah
membangun ekosistem kolaboratif di mana pengguna dapat mencari inspirasi dari
repositori publik yang tersedia.

Area konten utama menampilkan berupa kartu untuk thumbnail yang
memuat pratinjau visual beserta metadata relevan seperti judul karya dan identitas
pembuatnya. Fitur pencarian dan penyaringan ditempatkan pada bilah atas untuk
memudahkan navigasi pengguna dalam menelusuri kategori konten spesifik. Selain
itu, mekanisme _toggle_ disediakan di sudut kanan atas untuk mengatur preferensi
tampilan galeri dan melakukan filter sesuai kebutuhan eksplorasi pengguna.


**3.10.5 Wireframe Halaman Manajemen Proyek**
Antarmuka manajemen proyek berfungsi sebagai ruang kerja personal
yang mengorganisasi seluruh portofolio karya pengguna dalam struktur yang
sistematis. Desain ini memprioritaskan efisiensi aksesibilitas dokumen melalui
pengelompokan visual dan mekanisme penyortiran. Pengguna dapat memantau
status, menyunting kembali, atau mengelola siklus hidup setiap proyek komik
maupun avatar dari satu lokasi terpusat.

Pada Gambar dapat dilihat detail dari halaman manajemen proyek mulai
dari bagian atas halaman yang dilengkapi dengan tab filter kategori berbentuk _pill_
yang memungkinkan segregasi cepat antara proyek aktif, draf, atau arsip. Setiap
entitas proyek direpresentasikan dalam kartu yang memuat _thumbnail_ pratinjau,
informasi terakhir diubah, serta menu aksi kontekstual di sudut kartu. Susunan _grid_
yang konsisten diterapkan untuk menjaga keseragaman visual dan memudahkan
pemindaian informasi oleh pengguna.


**3.10.6 Wireframe Antarmuka Formulir Pembuatan Avatar**
_Wireframe_ formulir pembuatan avatar memvisualisasikan arsitektur input
data multimodal yang diperlukan untuk mengonfigurasi parameter generasi video
sintetik. Tata letak halaman dibagi menjadi dua panel utama untuk memisahkan
konfigurasi proyek esensial dengan pengaturan parameter teknis tingkat lanjut.
Pendekatan ini bertujuan untuk mereduksi beban kognitif pengguna saat mengisi
variabel kompleks yang dibutuhkan oleh model _Generative AI_.

Panel utama memfasilitasi input deskriptif serta pemilihan aset inti melalui
tiga blok area khusus untuk _Source Image_ , _Voice Input_ , dan _Quality Preset_. Sisi
kanan antarmuka didedikasikan untuk _Advanced Settings_ yang berisi serangkaian
_slider_ dan _toggle_ untuk penyesuaian parameter model secara presisi. Tombol
eksekusi generasi ditempatkan secara prominen di bagian bawah panel pengaturan
untuk memicu proses pengiriman data ke _backend_.


**3.10.7 Wireframe Antarmuka Riwayat Proyek Avatar**
Antarmuka riwayat proyek didesain untuk menyajikan riwayat dari
seluruh aktivitas generasi avatar yang telah berhasil dieksekusi oleh sistem.
Tampilan ini berfungsi sebagai galeri hasil keluaran yang memungkinkan pengguna
meninjau, memutar ulang, menghapus atau mengunduh aset video final. Struktur
visual yang digunakan berfokus pada penyajian konten media dengan minimal
gangguan antarmuka.

Bagian "Recent Generations" menampilkan susunan _grid_ kartu video yang
masing-masing dilengkapi dengan indikator tombol putar ( _play button_ ) di tengah
_thumbnail_. Bilah kendali di atas galeri menyediakan opsi penyaringan dan
pencarian untuk memudahkan penelusuran aset historis berdasarkan waktu atau
kriteria tertentu. Desain ini memastikan aksesibilitas cepat terhadap hasil karya
tanpa perlu menavigasi ke halaman detail proyek secara terpisah.


**3.10.8 Wireframe Modal Pratinjau Video Hasil Generasi Avatar**
Antarmuka pratinjau dirancang sebagai lapisan modal yang muncul secara
otomatis segera setelah proses _rendering_ video avatar diselesaikan oleh layanan
_backend_. Fitur ini memberikan umpan balik visual instan bagi pengguna untuk
memverifikasi akurasi sinkronisasi bibir dan ekspresi wajah sebelum aset disimpan
secara permanen ke dalam proyek. Mekanisme _overlay_ ini memastikan efisiensi
alur kerja dengan memungkinkan evaluasi kualitas hasil tanpa mengharuskan
pengguna meninggalkan halaman editor utama.

Pada visualisasi rancangan melalui Gambar, elemen pemutar video
ditempatkan secara sentral dengan dimensi dominan untuk memfokuskan perhatian
pengguna sepenuhnya pada konten hasil generasi. Antarmuka ini dilengkapi dengan
kontrol navigasi minimalis serta tombol aksi sekunder di bagian bawah untuk
keperluan pengunduhan berkas atau berbagi konten ke platform lain. Judul proyek
ditampilkan di sudut kiri atas modal untuk memberikan konteks identitas aset yang
sedang ditinjau oleh pengguna.


**3.10.9 Wireframe Modal Galeri Pemilihan Template Avatar**
Modal galeri pemilihan templat berfungsi sebagai repositori visual yang
menyediakan akses cepat terhadap koleksi avatar siap pakai untuk mempercepat
proses produksi konten. Antarmuka ini mengorganisasi aset karakter ke dalam
struktur kisi yang responsif, dilengkapi dengan fitur penyaringan untuk
memudahkan pencarian berdasarkan kategori atau gaya visual tertentu. Desain ini
bertujuan untuk menyederhanakan proses pengambilan keputusan pengguna
dengan menyajikan perbandingan visual karakter secara berdampingan.

Mengacu pada desain antarmuka Gambar, struktur galeri menampilkan
susunan kartu templat yang masing-masing memuat representasi ikonik dari
karakter avatar yang tersedia. Bagian _header_ modal memfasilitasi navigasi aset
melalui bilah pencarian teks dan serangkaian tombol filter kategori yang disusun
secara horizontal. Interaksi pemilihan dirancang intuitif, di mana pengguna cukup
menekan salah satu kartu aset untuk menerapkan karakteristik templat tersebut ke
dalam konfigurasi proyek yang sedang aktif.


**3.10.10 Wireframe Modal Formulir Unggah Template Avatar**
Fitur unggah templat difasilitasi melalui formulir modal terdedikasi yang
memungkinkan pengguna untuk menambahkan aset karakter kustom ke dalam
pustaka sistem. Mekanisme ini dirancang untuk mendukung personalisasi konten
dengan menyediakan antarmuka validasi data input, mencakup penamaan identitas
templat serta verifikasi integritas berkas citra. Pemisahan fungsi ini ke dalam
jendela modal bertujuan untuk menjaga fokus pengguna pada tugas administratif
penambahan aset tanpa mendistraksi alur kerja utama.

Seperti yang diilustrasikan pada Gambar, komponen utama antarmuka
terdiri dari kolom input teks untuk definisi nama templat dan area unggah berkas
( _dropzone_ ) yang diletakkan secara prominen di tengah layar. Indikator visual
berupa ikon media ditempatkan di dalam area unggah untuk memberikan
_affordance_ yang jelas bagi pengguna saat melakukan interaksi _drag-and-drop_
berkas gambar. Bagian bawah modal memuat tombol konfirmasi dan pembatalan
yang diletakkan berdampingan untuk memudahkan navigasi penyelesaian atau
pembatalan tugas.


**3.10.11 Wireframe Modal Perpustakaan Suara**
Antarmuka generator suara berbasis kecerdasan buatan menyediakan
kendali komprehensif bagi pengguna untuk memproduksi narasi audio dari input
teks ( _Text-to-Speech_ ). Modal ini mengintegrasikan fungsi penulisan naskah dengan
pemilihan model suara, memungkinkan pengguna untuk melakukan eksperimen
variasi intonasi dan dialek sebelum finalisasi aset audio. Desain yang ringkas ini
memusatkan seluruh parameter konfigurasi vital dalam satu tampilan layar guna
meningkatkan efisiensi operasional.

Berdasarkan rancangan wireframe pada Gambar, pengguna disajikan
dengan area input teks multi-baris ("Script") yang berfungsi sebagai kanvas utama
untuk penulisan narasi dialog. Sektor bagian atas memuat serangkaian elemen
seleksi untuk memilih model suara yang diinginkan dari pustaka, sementara bagian
bawah menyediakan area unggah untuk referensi pendukung. Tombol eksekusi
ditempatkan di sudut kanan bawah modal untuk memicu proses konversi teks
menjadi audio sintetik sesuai parameter yang telah dikonfigurasi.


**3.10.12 Wireframe Antarmuka Konfigurasi Proyek Komik**
Antarmuka konfigurasi proyek berfungsi sebagai fondasi awal di mana
pengguna mendefinisikan parameter naratif dan batasan stilistik untuk karya komik
mereka. Desain ini memfasilitasi input metadata esensial seperti judul, genre, dan
preferensi gaya seni sebelum proses generasi konten dimulai. Tata letak elemen
input dan seleksi visual pada halaman ini diilustrasikan melalui rancangan berikut.

Berdasarkan perancangan antarmuka yang dapat dilihat pada Gambar, area
kerja utama dibagi menjadi kolom input tekstual di sisi kiri dan kisi seleksi visual
untuk _Art Style_ dan _Page Size_ di sisi kanan. Panel samping kanan menampilkan
indikator _Timeline Progress_ yang memberikan orientasi visual mengenai tahapan
produksi yang sedang berlangsung. Susunan elemen formulir yang terstruktur ini
bertujuan untuk meminimalkan ambiguitas pengguna dalam menetapkan
spesifikasi dasar proyek.


**3.10.13 Wireframe Antarmuka Pengelolaan Referensi Visual**
Bagian pengelolaan referensi dirancang untuk menjaga konsistensi visual
karakter dan latar belakang di seluruh panel komik melalui sentralisasi aset.
Antarmuka ini memungkinkan pengguna untuk mengkurasi pustaka visual proyek
dengan mengelompokkan aset berdasarkan kategori karakter dan latar tempat
secara terpisah. Struktur visual untuk manajemen aset referensi ini digambarkan
dalam diagram kerangka di bawah ini.

Berdasarkan visualisasi desain Gambar, aset referensi diorganisasikan ke
dalam dua segmen utama yaitu _Characters_ dan _Background_ yang masing-masing
menampilkan kisi kartu pratinjau. Panel ringkasan di sisi kanan _Selection Summary_
memberikan informasi instan mengenai jumlah aset yang telah dikonfigurasi dalam
proyek aktif. Tombol aksi utama untuk menambah referensi baru ditempatkan
secara strategis di bagian atas setiap segmen kategori untuk aksesibilitas cepat.


**3.10.14 Wireframe Modal Formulir Penambahan Referensi Gambar**
Modal formulir penambahan referensi menyediakan mekanisme input
yang baik untuk mendefinisikan atribut fisik dan identitas karakter secara spesifik.
Penggunaan jendela modal bertujuan untuk memfokuskan perhatian pengguna pada
detail deskriptif aset tanpa memutus konteks dari halaman manajemen utama.
Konfigurasi setiap elemen formulir untuk definisi referensi ditunjukkan pada
gambar berikut ini.

Mengacu pada Gambar, formulir memuat serangkaian kolom input teks
yang mencakup identitas referensi, jenis kelamin, kelompok usia, serta deskripsi
penampilan fisik. Bidang input tambahan untuk detail pakaian dan gaya ( _Clothing
& Styles_ ) disediakan di bagian bawah untuk memperkaya konteks visual bagi model
generatif. Tombol konfirmasi dan pembatalan diletakkan di sudut kanan bawah
modal sebagai navigasi penyelesaian tugas input data.


**3.10.15 Wireframe Antarmuka Visualisasi Gambar Adegan**
Antarmuka visualisasi adegan berfungsi sebagai ruang kerja utama untuk
mentransformasikan _prompt_ naratif menjadi ilustrasi visual panel menggunakan
parameter sinematik. Desain ini mengintegrasikan area pratinjau hasil generasi
dengan panel kontrol konfigurasi yang memungkinkan manipulasi aspek visual
secara granular. Tata letak setiap komponen untuk visualisasi gambar adegan
diilustrasikan melalui rancangan _wireframe_ berikut ini.

Pada rancangan antarmuka Gambar, dimulai dari bagian atas kartu yang
menyajikan kisi beberapa komponen aksi yang akan diterapkan. Kemudian pada
area tengah didominasi oleh kanvas pratinjau gambar besar yang dikelilingi oleh
_film_ strip atau galeri adegan kecil di sisi kiri. Panel bawah memuat parameter teknis
gambar seperti rasio aspek, tipe pengambilan gambar ( _shot type_ ), sudut pandang,
pencahayaan, dan komposisi visual. Sisi kanan menyediakan akses ke pustaka
referensi konteks untuk memastikan hasil generasi tetap selaras dengan aset
karakter yang telah ditetapkan.


**3.10.16 Wireframe Antarmuka Editor Canvas Penyusunan Panel Komik**
_Wireframe_ editor kanvas merepresentasikan lingkungan kerja interaktif
tempat pengguna menyusun komposisi akhir halaman komik dari aset yang telah
digenerasi. Antarmuka ini dirancang untuk mendukung manipulasi objek secara
langsung, memungkinkan penataan panel, balon teks, dan elemen grafis dalam satu
tampilan terpadu. Struktur tata letak editor komposisi panel ini divisualisasikan
melalui gambar di bawah ini.

Berdasarkan visualisasi antarmuka pada Gambar, area kerja editor
diorganisasikan ke dalam tata letak tiga kolom yang memisahkan manajemen aset,
kanvas komposisi, dan pengaturan properti. Kolom kiri berfungsi sebagai panel
pustaka yang menyajikan koleksi aset visual dalam format _grid_ serta memfasilitasi
navigasi antar halaman komik melalui _thumbnail_ di bagian bawah. Di bagian atas,
terdapat _toolbar_ yang menyediakan akses instan terhadap fungsi esensial seperti
manipulasi objek, penambahan teks, serta kontrol lapisan ( _layering_ ) untuk efisiensi
penyuntingan. Area tengah didedikasikan sebagai kanvas penyusunan utama yang
memberikan ruang visual luas bagi pengguna untuk menata panel dan elemen
naratif secara presisi. Sementara itu, panel properti di sisi kanan memungkinkan
penyesuaian parameter spesifik secara mendetail untuk elemen atau halaman yang
sedang aktif, mencakup pengaturan dimensi dan gaya visual.


**3.10.17 Wireframe Antarmuka Pratinjau Hasil Akhir Komik**
Antarmuka pratinjau hasil akhir berfungsi sebagai tahap validasi terakhir
yang menampilkan representasi visual halaman komik secara utuh sebelum proses
ekspor dilakukan. Tampilan ini memberikan kesempatan bagi pengguna untuk
meninjau keterbacaan teks dan koherensi alur visual tanpa gangguan elemen editor.
Rancangan visual untuk peninjauan ini divisualisasikan melalui gambar berikut.

Dalam visualisasi desain antarmuka melalui Gambar, halaman komik
ditampilkan secara sentral dengan bingkai minimalis untuk mensimulasikan
pengalaman pembaca yang sebenarnya. Indikator progres di bilah samping kanan
menyoroti tahapan _Preview and Export_ , memberikan konteks posisi pengguna
dalam alur kerja keseluruhan. Tombol aksi di bagian atas memungkinkan pengguna
untuk kembali ke mode editor jika diperlukan revisi atau melanjutkan ke bagian
konfigurasi ekspor.


**3.10.18 Wireframe Antarmuka Konfigurasi Ekspor Komik**
Antarmuka konfigurasi ekspor dirancang untuk memfasilitasi proses
pengemasan proyek digital menjadi berkas distribusi standar yang kompatibel
dengan berbagai platform pembaca. Halaman ini menyediakan opsi pemilihan
format keluaran serta ringkasan properti berkas sebelum unduhan diinisiasi.
Mekanisme finalisasi proyek ini diilustrasikan pada diagram kerangka berikut.

Mengacu pada rancangan _wireframe_ Gambar, panel tengah menampilkan
kartu opsi format ekspor utama seperti PDF atau CBZ yang dilengkapi dengan ikon
representatif. Bagian bawah panel memuat tombol unduhan utama yang akan aktif
setelah pengguna memilih format yang diinginkan. Struktur antarmuka tetap
mempertahankan konsistensi visual dengan panel progres di sisi kanan untuk
menandakan penyelesaian siklus produksi komik.


### 3.10 Rancangan Pengujian

Rancangan pengujian disusun sebagai pedoman sistematis untuk
memverifikasi fungsionalitas setiap modul aplikasi terhadap spesifikasi kebutuhan
yang telah ditetapkan. Skenario uji ini mencakup serangkaian langkah logis dan
kondisi batas yang dirancang untuk mendeteksi potensi kegagalan sistem sebelum
tahap penyebaran ( _deployment_ ). Detail mekanisme pengujian untuk setiap fitur
utama, mulai dari autentikasi hingga ekspor konten, diuraikan pada sub-bab berikut.
**3.11.1 Pengujian Authentikasi**
Pengujian autentikasi bertujuan memastikan keamanan akses sistem
melalui validasi kredensial pengguna yang ketat. Proses ini mengevaluasi respons
sistem terhadap berbagai skenario masukan, baik yang valid maupun tidak valid,
untuk mencegah akses tidak sah. Alur logika verifikasi identitas pengguna
divisualisasikan dalam diagram pengujian di bawah ini.


Skenario dimulai dengan navigasi pengguna ke halaman masuk, di mana
sistem memverifikasi keberhasilan pemuatan halaman sebelum mengizinkan
interaksi lebih lanjut. Pengguna kemudian memilih metode masuk dan
memasukkan kredensial, yang selanjutnya divalidasi formatnya secara lokal untuk
menyaring input yang tidak sesuai standar. Apabila format valid, data dikirimkan
ke _backend API_ untuk proses verifikasi tingkat lanjut yang menentukan keabsahan
hak akses pengguna. Sistem dirancang untuk menangani dua kondisi akhir:
menampilkan pesan kesalahan jika _login_ gagal atau melakukan pengalihan ke
_dashboard_ utama jika autentikasi berhasil. Pengujian ini dinyatakan lulus apabila
token valid diterima dan sesi pengguna berhasil diinisiasi tanpa kendala teknis.


**3.11.2 Pengujian Pembuatan Avatar**
Validasi fitur pembuatan avatar difokuskan pada keandalan sistem dalam
memproses aset multimedia menjadi konten video sintetis. Pengujian ini mencakup
verifikasi integritas data masukan, komunikasi asinkron dengan server, serta
kualitas luaran akhir. Rangkaian tahapan pengujian fungsionalitas generator ini
digambarkan pada diagram berikut.


Proses pengujian diawali dengan validasi format berkas gambar dan audio
yang diunggah pengguna untuk memastikan kompatibilitas dengan model
_Generative AI_. Setelah parameter konfigurasi ditetapkan dan permintaan dikirim,
sistem memasuki fase pemantauan status melalui mekanisme _polling_ untuk melacak
progres pengerjaan di sisi server. Skenario uji mencakup verifikasi terhadap
penanganan respons sukses maupun kegagalan generasi, memastikan antarmuka
memberikan umpan balik yang tepat kepada pengguna. Tahap akhir pengujian
mengevaluasi kemampuan pemutar video dalam menayangkan pratinjau hasil serta
fungsionalitas fitur pengunduhan berkas. Keseluruhan tes dianggap berhasil jika
video dapat diputar dengan lancar dan berkas final terunduh tanpa korupsi data.

**3.11.3 Pengujian Pembuatan Avatar Menggunakan Template Library**
Pengujian fitur pustaka templat bertujuan memverifikasi efisiensi alur
kerja pembuatan avatar yang memanfaatkan aset pre-fabrikasi. Fokus utama
pengujian meliputi responsivitas antarmuka modal, akurasi pemilihan data templat,
dan integrasi dengan modul audio. Alur verifikasi penggunaan templat cepat ini
diilustrasikan dalam diagram di bawah ini.


Skenario dimulai dengan aksi pembukaan modal pustaka, di mana sistem
harus menampilkan galeri aset yang tersedia secara visual kepada pengguna.
Penguji kemudian melakukan seleksi terhadap salah satu templat avatar, dan sistem
wajib memvalidasi bahwa pilihan tersebut telah tercatat dengan benar sebelum
melanjutkan ke tahap audio. Setelah aset suara ditentukan, proses generasi dipicu
untuk menguji kemampuan sistem dalam menggabungkan templat statis dengan
input audio dinamis. Keberhasilan pengujian ditentukan oleh munculnya pratinjau
video yang sesuai dengan kombinasi templat dan audio yang dipilih tanpa
memunculkan pesan kesalahan sistem. Setiap kegagalan pada titik atau proses
_rendering_ akan dicatat sebagai cacat fungsional yang memerlukan perbaikan.


**3.11.4 Pengujian Penampilan History Avatar**
Evaluasi fitur riwayat proyek dilakukan untuk memastikan integritas
penyimpanan data dan kemudahan akses kembali terhadap aset yang telah dibuat.
Pengujian ini menyoroti kinerja fungsi pencarian, mekanisme penyaringan data,
serta aksesibilitas berkas arsip. Diagram berikut memetakan langkah-langkah
pengujian manajemen riwayat proyek avatar.


Pengujian diawali dengan memverifikasi bahwa daftar kartu proyek
berhasil dimuat secara lengkap saat pengguna mengakses halaman riwayat. Fungsi
pencarian dan filter kemudian diuji dengan memasukkan kata kunci tertentu untuk
memastikan sistem mampu menyaring hasil tampilan secara akurat sesuai kriteria.
Interaksi pengguna terhadap kartu proyek dievaluasi untuk memastikan modal
pratinjau video terbuka dan memuat konten media yang relevan. Tahap krusial
selanjutnya melibatkan pengujian tombol unduhan di dalam modal untuk
mengonfirmasi bahwa berkas aset dapat diambil kembali dari penyimpanan awan.
Tes dinyatakan lulus apabila seluruh siklus navigasi, pencarian, dan pengambilan
kembali data berjalan mulus tanpa insiden kegagalan muat.

**3.11.5 Pengujian Pembuatan Project Komik Baru**
Validasi inisiasi proyek komik bertujuan menjamin bahwa metadata dasar
proyek tersimpan dengan benar dan lingkungan kerja terkonfigurasi sesuai
preferensi pengguna. Aspek yang diuji mencakup validasi formulir input,
pembuatan entitas data di _database_ , dan transisi alur kerja. Skema pengujian untuk
tahap persiapan proyek ini digambarkan pada diagram berikut.


Skenario uji dimulai dengan pengisian kelengkapan metadata proyek
seperti nama, deskripsi, genre, dan gaya artistik untuk memastikan sistem
menangkap spesifikasi awal. Validasi sisi klien diaktifkan untuk memeriksa apakah
seluruh kolom wajib telah terisi sebelum tombol pembuatan proyek menjadi aktif.
Setelah perintah pembuatan dieksekusi, pengujian memverifikasi apakah sistem
berhasil membentuk objek proyek baru dalam basis data tanpa mengembalikan
pesan galat. Keberhasilan proses ditandai dengan pembaruan indikator _timeline_ ke
tahap selanjutnya dan pengalihan otomatis pengguna menuju halaman pengaturan
referensi. Kegagalan pada tahap navigasi atau penyimpanan data akan
dikategorikan sebagai isu kritis yang menghambat alur produksi.


**3.11.6 Pengujian Penambahan Reference Visual**
Pengujian manajemen referensi visual difokuskan pada kemampuan
sistem dalam mengelola aset karakter dan latar belakang yang menjamin
konsistensi narasi visual. Tes ini mengevaluasi fungsi input data karakter, integrasi
layanan generasi gambar, serta pembaruan status proyek secara _real-time_. Alur
verifikasi penambahan aset referensi divisualisasikan melalui diagram di bawah ini.

Pengujian dimulai dengan interaksi pembukaan modal penambahan
referensi untuk memastikan antarmuka input data muncul sebagaimana mestinya.
Penguji kemudian memasukkan deskripsi detail karakter atau latar belakang dan


memicu proses generasi untuk menguji responsivitas layanan _backend_. Poin
verifikasi utama terletak pada konfirmasi bahwa entitas referensi baru berhasil
dibuat dan disimpan ke dalam struktur data proyek. Selanjutnya, sistem diuji
kemampuannya dalam memperbarui ringkasan jumlah referensi pada antarmuka
pengguna secara otomatis setelah penambahan berhasil. Skenario ini memastikan
bahwa aset visual siap digunakan untuk tahap visualisasi adegan tanpa kendala
ketersediaan data.

**3.11.7 Pengujian Visualisasi Gambar Adegan**
Evaluasi fitur visualisasi adegan bertujuan memvalidasi kemampuan
sistem menerjemahkan _prompt_ teks menjadi ilustrasi panel komik yang koheren.
Pengujian mencakup integrasi referensi karakter atau latar belakang, penanganan
permintaan asinkron, dan manajemen tampilan hasil generasi. Rangkaian langkah
pengujian untuk modul visualisasi ini diuraikan pada diagram berikut.



Skenario diawali dengan input deskripsi adegan dan pemilihan parameter
gaya, serta verifikasi logika kondisional terkait penggunaan referensi karakter yang
telah ada. Sistem diuji kemampuannya dalam mengirimkan permintaan generasi
yang valid dan menampilkan _loading state_ selama proses berlangsung. Mekanisme
_polling_ dipantau untuk memastikan status pengerjaan diperbarui secara akurat dari
'proses' menjadi 'sukses' tanpa terjebak dalam _loop_ tak berujung. Setelah generasi
selesai, verifikasi dilakukan terhadap penampilan gambar pada kanvas pratinjau
dan penambahan otomatis aset tersebut ke dalam daftar adegan ( _filmstrip_ ).
Kegagalan dalam menampilkan gambar atau memperbarui daftar aset akan
dianggap sebagai cacat fungsional utama pada modul ini.

**3.11.8 Pengujian Editing Kanvas Komik**
Pengujian editor kanvas difokuskan pada interaktivitas dan manipulasi
objek visual yang menjadi inti dari penyusunan tata letak komik. Aspek yang diuji
meliputi fungsi _drag-and-drop_ , pengubahan ukuran panel, penambahan elemen
teks, serta mekanisme penyimpanan perubahan. Alur validasi interaksi editor visual
ini digambarkan dalam skema pengujian berikut.


Pengujian dimulai dengan memverifikasi fungsi _drag-and-drop_ ,
memastikan panel yang ditarik dari _sidebar_ berhasil ditempatkan dan dirender pada
area kanvas utama. Selanjutnya, kemampuan manipulasi objek diuji melalui
perubahan posisi dan dimensi panel, dengan memvalidasi bahwa koordinat baru
tersimpan secara akurat di _state_ aplikasi. Fitur penambahan elemen naratif diuji


dengan menyisipkan balon teks, memastikan dialog muncul dan dapat disunting
sesuai input pengguna. Mekanisme penyimpanan otomatis atau manual diverifikasi
untuk menjamin bahwa setiap perubahan tata letak tersimpan ke basis data tanpa
kehilangan informasi. Tes dinyatakan lulus jika seluruh operasi manipulasi visual
berjalan responsif dan sinkronisasi data terjadi tanpa hambatan.

**3.11.9 Pengujian Preview dan Export Komik**
Tahap akhir pengujian memvalidasi proses finalisasi proyek, mulai dari
pratinjau keseluruhan halaman hingga konversi menjadi format berkas distribusi.
Pengujian ini memastikan integritas visual komik terjaga saat diekspor dan
mekanisme pengunduhan berfungsi dengan baik. Prosedur verifikasi untuk fitur
ekspor dan tinjauan ini diilustrasikan pada diagram di bawah ini.


Proses pengujian dimulai dengan inisiasi mode tinjauan untuk
memverifikasi _rendering_ halaman komik, yang diikuti oleh validasi fungsi
pemilihan format berkas dan respons tombol pada panel ekspor. Selama kompilasi
dokumen berjalan di server, sistem dipantau kemampuannya dalam menyajikan
indikator progres yang akurat kepada pengguna. Verifikasi dilanjutkan pada
mekanisme pemicu unduhan otomatis di peramban untuk memastikan berkas
diserahkan segera setelah proses ekspor rampung. Skenario dianggap sukses
apabila berkas hasil unduhan dapat dibuka dan memuat konten visual yang
konsisten dengan tata letak pada editor.


## BAB IV HASIL SEMENTARA

### 4.1 Hasil A

### 4.2 Hasil B

### 4.3 Hasil C


## BAB V TIMELINE PENELITIAN

### 5.1 Simpulan

### 5.2 Saran


## DAFTAR PUSTAKA

Abdullah, A. I. N. F., Atrinawati, L. H., & Wiranti, Y. T. (2022). _Designing
Business Process Model and Standard Operating Procedures ( SOP ) of
Integrated Laboratory Management At XYZ_. _3_ (2), 169–182.
https://doi.org/10.12928/ijemi.v3i2.5795
Agarwal, S., & Sarangi, S. R. (2022). HAJPAQUE : Hardware Accelerator for
JSON Parsing, Querying and Schema Validation. _IEEE_ , 1–7.
Agung, M. W. L., & Rosmasari. (2025). _Human-Computer Interaction in User
Interface Design_. 31–46.
Aleryani, A. Y. (2024). _Analyzing Data Flow: A Comparison between Data Flow
Diagrams (DFD) and User Case Diagrams (UCD) in Information Systems
Development_. _8_ (1), 313–320. https://doi.org/10.59573/emsj.8(1).2024.28
Alotaibi, Y. (2020). _A Comprehensive Analysis on Business Process Modelling
Standards , Techniques and Languages_. _20_ (9), 233–250.
https://doi.org/10.22937/IJCSNS.2020.20.09.29
Annela, L. (2025). _Modular AI Integration : Micro frontend architecture enabling
scalable intelligence_. _15_ (April), 464–474.
Antunes, B., Correia, F., & Gomes, P. (2008). _Towards a Software Developer
Context Model_. 1–12.
Ardiyanto, R., & Ardhianto, E. (2024). _Analisa Peformasi Metode Rendering
Website : Client Side , Server Side , dan Incremental Static Regeneration_. _4_ (1),
19 – 27.
Baek, Y., Cho, E., Shin, D., & Bae, D. (2024). _Article : An Extensible Modeling
Method Supporting Ontology-based Scenario Specification and Domain-
specific Extension_.
Bieniek, J., Rahouti, M., & Verma, D. C. (2024). _Generative AI in Multimodal User
Interfaces : Trends , Challenges , and Cross-Platform Adaptability_.
Bogner, J., & Merkel, M. (2022). To Type or Not to Type ? A Systematic
Comparison of the Software Quality of JavaScript and TypeScript
Applications on GitHub. In _Proceedings of MSR ’22: Proceedings of the 19th_


_International Conference on Mining Software Repositories (MSR 2022)_ (Vol.
1, Issue 1). Association for Computing Machinery.
Cao, Y., Jiang, P., & Xia, H. (2025). Generative and Malleable User Interfaces with
Generative and Evolving Task-Driven Data Model. In _CHI Conference on
Human Factors in Computing Systems (CHI ’25), April 26-May 1, 2025,
Yokohama, Japan_ (Vol. 1, Issue 1). Association for Computing Machinery.
https://doi.org/10.1145/3706598.3713285
Cao, Y., Li, S., Liu, Y., Yan, Z., Dai, Y., Yu, P. S., & Sun, L. (2023). A
Comprehensive Survey of AI-Generated Content ( AIGC ): A History of
Generative AI from GAN to ChatGPT. _Journal of the ACM_ , _37_ (4).
Costa, A., Silva, F., & Moreira, J. J. (2024). Towards an AI-Driven User for
Interface Design. _Procedia Computer Science_ , _237_ , 179–186.
https://doi.org/10.1016/j.procs.2024.05.094
Duan, S., Zhang, R., Chen, M., Wang, Z., & Wang, S. (2024). _Efficient and
Aesthetic UI Design with a Deep Learning-Based Interface Generation Tree
Algorithm_.
Eisenreich, T., Friedlaender, N., & Wagner, S. (2025). _Leveraging Large Language
Models for Use Case Model Generation from Software Requirements_.
Ekpobimi, H. O. (2024). _Building high-performance web applications with NextJS_.
_5_ (8), 1963–1977. https://doi.org/10.51594/csitrj.v5i8.1459
Garousi, V., Keleş, A. B., & Joy, N. (2024). _AI-powered test automation tools : A
systematic review and empirical evaluation_.
Görgen, L., Eric, M., Triller, M., Nast, B., & Sandkuhl, K. (2024). _Large Language
Models in Enterprise Modeling : Case Study and Experiences_. _Modelsward_ ,
978 – 989. https://doi.org/10.5220/0012387000003645
Guguloth, P. K. (2025). _AI-powered micro-frontend architecture : The future of
enterprise applications_. _15_ (May), 804–810.
Heil, S., & Gaedke, M. (2024). _DCM : Dynamic Client-Server Code Migration_.
Isharah, I., Ahamad, A., Munasinghe, & Faraj. (2023). _An Empirical Study of the
Impact of Automated Testing on Software Quality_.
Jain, V. (2021). _Server-Side Rendering vs. Client-Side Rendering : A_


_Comprehensive Analysis_. _7_ (2), 1–5.
Jin, Z., & Song, Z. (2023). _Generating coherent comic with rich story using
ChatGPT and Stable Diffusion_.
Keiser, J., & Lemire, D. (2024). _On-Demand JSON: A Better Way to Parse
Documents?_ 1 – 15. https://doi.org/https://doi.org/10.1002/spe.3313
Khan, N. H. (2025). _A Comparative Performance Optimization Analysis between
React and Angular_.
Kosna, S. R. (2023). _The Rise of Jamstack : Revolutionizing Static Site
Development_.
Kristensson, P. O., & Patterson, E. (2025). _Human – Computer Interaction for AI
Systems Design : Reflections on an Online Course on Human – AI Interaction
for Professionals_.
Lazuardy, M. F. S., & Anggraini, D. (2022). _Modern Front End Web Architectures
with React. Js and Next. Js_. _7_ (1), 132–141.
Ling, L., Chen, X., Wen, R., Li, T. J., & Lc, R. (2024). Sketchar: Supporting
Character Design and Illustration Prototyping Using Generative AI.
_Proceedings of the ACM on Human-Computer Interaction_ , _8_ (CHI PLAY).
https://doi.org/10.1145/3677102
Liu, Y., Li, Y., Deng, G., Liu, Y., Wan, R., Wu, R., Ji, D., Xu, S., & Bao, M. (2022).
_Morest : Model-based RESTful API Testing with Execution Feedback_ (Vol. 1,
Issue 1). Association for Computing Machinery.
https://doi.org/10.1145/3510003.3510133
Lokhande, J., Mantri, S., & Hande, Y. (2023). A Comparative Analysis of Client
Side Rendering and Server Side Rendering. _IEEE_.
Luera, R., Rossi, R. A., Siu, A., Kim, S., & Chen, X. (2024). _Survey of User
Interface Design and Interaction Techniques in Generative AI Applications_.
1 – 42.
Männistö, J. (2023). Experiences on a Frameworkless Micro-Frontend Architecture
in a Small Organization. _IEEE_.
Mansoor, A. Z., Ahmad, H. A., Rizal, M. D. F., Kurniawan, E. D., Johanes, Rahayu,
H., Suminto, M. A., Renzina, Y. D., Pratama, N. E., Bangsa, P. G., Arifianto,


P. F., Setiawan, B., Ayuswantana, A. C., Romadhona, M., Kholida, P., & Nur,
M. H. A. (2022). _COMICS IN THE AGE OF DIGITALIZATION:
CHALLENGES AND OPPORTUNITIES_.
Mariya, K., Sofiia, Z., Ganna, W., & Kateryna, M. (2024). _BPMN Diagrams as an
Essential Tool for Enhancing Business Process Management and Team
Collaboration: Vol. XXVII_.
Molla, M. I., Ahmad, J., Mohd, W., & Wan, N. (2024). _A Comparison of
Transforming the User Stories and Functional Requirements into UML Use
Case Diagram_. _14_ (1), 29–36.
Mooghala, S. (2024). _An In-Depth Analysis of the Historical Progression and
Future Trends in Source Control Management within Software Development_.
_6_ (1), 13–24.
Noor, J. H. (2024). _The Effects of Architectural Design Decisions on Framework
Adoption : A Comparative Evaluation of Meta-Frameworks in Modern Web
Development_.
Nyabuto, G. M., Mony, V., & Mbugua, S. (2024). _Architectural Review of Client-
Server Models_. _10_ (1), 139–143.
Pandy, G., Pugazhenthi, V. J., & Murugan, A. (2024). _Advances in Software Testing
in 2024 : Experimental Insights , Frameworks , and Future Directions_. _13_ (11),
40 – 45. https://doi.org/10.17148/IJARCCE.2024.131103
Pasquariello, A., Bouhali, I., Leherbauer, D., & Rega, A. (2025). _Model-Based
Systems Engineering for Digital Twin System Development applied to an
Aircraft Seat Test Bench_. _4_. https://doi.org/10.1109/ACCESS.2025.3562932
Pratama, I. P. A. E., & Raharja, I. M. S. (2023). _Node. js Performance
Benchmarking and Analysis at Virtualbox , Docker , and Podman
Environment Using Node-Bench Method_. _7_ (December), 2240–2246.
Rajala, O. (2024). _Impact of React component libraries on developer experience_.
Razaque, A., Hariri, S., & Yoo, J. (2025). AI-Driven User Interface Design:
Enhancing Digital Learning and Skill Development. _International Journal of
Human-Computer Studies_.
Ražinskas, M., Unas, B. M., & Jurgelaitis, M. (2024). _Transforming Sketches of_


_UML Use Case Diagrams to Models_. _12_ (October).
https://doi.org/10.1109/ACCESS.2024.3514455
Reddy, M. P., & Mishra, S. P. (2021). _Analysis of Component Libraries for React
JS_. _8_ (6), 43–46. https://doi.org/10.17148/IARJSET.2021.8607
Salado, A., & Wach, P. (2019). _Constructing True Model-Based Requirements in
SysML_. https://doi.org/10.3390/systems7020019
Salim, S. N., Wirawan, A., & Wardhani, P. (2024). _Evaluasi Rancangan Antarmuka
HCI Modern Berbasis Kecerdasan Buatan Pendahuluan Metode Penelitian_.
_23_ , 531–538.
Sani, B., & Jan, S. (2024). _EAI Endorsed Transactions Empirical Analysis of
Widely Used Website Automated Testing Tools_. _3_ , 1–11.
https://doi.org/10.4108/airo.7285
Schesch, B., Featherman, R., Yang, K. J., Roberts, B. R., & Ernst, M. D. (2024).
_Evaluation of Version Control Merge Tools_.
https://doi.org/10.1145/3691620.3695075
Schier, A., Schmitz, C., & Klein, R. (2024). _Computers & Graphics Improving
Digital Communication with Personalized Expressive Characters in
Interactive Comic Scenes_.
Schneider, S., D, E., Zdun, U., & Scandariato, R. (2024). _How Dataflow Diagrams
Impact Software Security Analysis : an Empirical Experiment_. _16_ , 189–205.
Sergeyuk, A., Golubev, Y., Bryksin, T., & Ahmed, I. (2024). _Using AI-Based
Coding Assistants in Practice : State of Affairs , Perceptions , and Ways
Forward_. 1–32.
Singh, A. (2024). _Evolutionary Architectures in Web Applications : A
Comprehensive Study of Client-Server , Multi- Tier , and Service-Oriented
Approaches_. _6_ (2), 1–12.
Subramanian, M. E., Suriyavel, M. M., & Vignesh, M. V. (2025). _AI-POWERED
SEQUENTIAL COMIC GENERATION USING GENERATIVE
ADVERSARIAL NETWORKS AND TRANSFORMER MODELS_. 1–9.
Suh, S., Zhao, J., & Law, E. (2022). _CodeToon : Story Ideation , Auto Comic
Generation , and Structure Mapping for Code-Driven Storytelling Abstract_


_Concrete_.
Sutharsica, A. (2025). _Micro-Frontend Architecture : A Comparative Study of
Startups and Large Established Companies- Suitability , Benefits , Challenges
, and Practical Insights_.
Świątkowski, A., & Ścibior, K. (2022). _Comparative analysis of React , Next and
Gatsby programming frameworks for creating SPA applications Analiza
porównawcza szkieletów programistycznych React , Next oraz Gatsby do
tworzenia aplikacji typu SPA_. _24_ (June), 224–227.
Tadi, S. R. C. C. T. (2024). _Modern Dynamic Rendering Techniques : Incremental
Static Regeneration in React and_. _13_ (5), 1874–1880.
Taibi, D., & Mezzalira, L. (2022). _Micro-Frontends : Principles , Implementations
, and Pitfalls_. _47_ (4), 25–29. https://doi.org/10.1145/3561846.3561853
Talluri, S., Donato, G. W. Di, Vlaswinkel, K. R., Delamare, M. A. A.,
Santambrogio, M. D., & Bonetta, D. (2025). _GpJSON : High-performance
JSON Data Processing on GPUs_. _18_ (9), 3216–3229.
https://doi.org/10.14778/3746405.3746439
Thooriqoh, H. A., Mulyo, B. M., & Rakhmadi, A. (2024). _Advanced RESTful API
Testing : Leveraging Newman ’ s Command-Line Capabilities with Postman
Collections_. 188–193.
Vallamsetla, K. (2024). _The Impact of Server-Side Rendering on UI Performance
and SEO_. _10_ (5), 795–803.
Veeri, V. (2024). _MICRO-FRONTEND ARCHITECTURE WITH REACT : A
COMPREHENSIVE GUIDE_. _15_ (6), 130–153.
Verma, D., & Aland, P. (2024). _A Comparative Review of Server Rendering and
Client Side Rendering in Web Development_. _10_ (2), 521–530.
Wang, L., Zhang, Y., Zhao, X., Zhang, H., Sun, J., Liu, Y., & Yu, T. (2023).
StyleAvatar : Real-time Photo-realistic Portrait Avatar from a Single Video.
In _StyleAvatar: Real-time Photo-realistic Portrait Avatar from a Single Video_
(Vol. 1, Issue 1). Association for Computing Machinery.
https://doi.org/10.1145/3588432.3591517
Wang, Y., Guo, J., Bai, J., Yu, R., He, T., & Tan, X. (2024). _InstructAvatar: Text-_


_Guided Emotion and Motion Control for Avatar Generation_. 1–30.
Wei, X., Wang, Z., & Yang, S. (2023). _An Automatic Generation and Verification
Method of Software Requirements Specification_. _16_ , 189–205.
Zhang, C., Chen, Y., Fu, B., Fu, Y., Zhou, Z., & Lin, G. (2023). _StyleAvatar3D :
Leveraging Image-Text Diffusion Models for High-Fidelity 3D Avatar
Generation_. 1–18.
Zhou, Z., Fan, H., & Chua, T. (2025). _Zero- 1 - to-A: Zero-Shot One Image to
Animatable Head Avatars Using Video Diffusion_.



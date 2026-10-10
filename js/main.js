// Initialize AOS Animation
document.addEventListener("DOMContentLoaded", function() {
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle 
const mobileBtn = document.querySelector('.mobile-menu-btn');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        alert('Fitur menu mobile akan segera hadir!');
    });
}

/// Generic emoji wrapper: emoji melayang di luar card tanpa saling menimpa
function initEmojiWrapper(id) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;

    const emojis = Array.from(wrapper.querySelectorAll('.floating-emoji'));
    if (emojis.length === 0) return;

    // Deteksi ukuran layar
    const isMobile = window.innerWidth <= 768;

    // Jarak dasar dari titik tengah (center)
    const baseX = isMobile ? 110 : 170;
    const baseY = isMobile ? 90 : 120;

    // Buat "Slot/Grid" posisi aman di sekitar foto: [pengali X, pengali Y]
    const slots = [
        [-1, -1], // 1. Kiri Atas
        [-1.15, 0], // 2. Kiri Tengah (agak lebih melebar keluar)
        [-1, 1], // 3. Kiri Bawah
        [1, -1], // 4. Kanan Atas
        [1.15, 0], // 5. Kanan Tengah (agak lebih melebar keluar)
        [1, 1] // 6. Kanan Bawah
    ];

    // Acak urutan slot agar posisinya berbeda-beda tiap saat
    slots.sort(() => Math.random() - 0.5);

    emojis.forEach((emoji, index) => {
        // Ambil slot berdasarkan index (pasti tidak akan ada slot yang sama yang dipakai 2x)
        const slot = slots[index % slots.length];

        // Berikan sedikit nilai acak (jitter) agar tidak terlalu kaku seperti robot
        // +/- 15px untuk X, dan +/- 20px untuk Y
        const jitterX = (Math.random() - 0.5) * 30;
        const jitterY = (Math.random() - 0.5) * 40;

        // Hitung posisi final TX dan TY
        const tx = (slot[0] * baseX) + jitterX;
        const ty = (slot[1] * baseY) + jitterY;

        emoji.style.setProperty('--tx', tx + 'px');
        emoji.style.setProperty('--ty', ty + 'px');

        // Ukuran dasar diperbesar: 1.8 untuk HP, 2.5 untuk Laptop/PC
        const baseSize = isMobile ? 1.8 : 2.5;

        // Variasi ukuran acak juga diperbesar sedikit agar perbedaannya terlihat
        const randSize = isMobile ? 0.5 : 0.8;

        emoji.style.fontSize = (Math.random() * randSize + baseSize) + 'rem';
        // Animasi melayang berkesinambungan
        const inner = emoji.querySelector('.emoji-inner');
        if (inner) inner.style.animationDelay = (Math.random() * 2) + 's';
    });

    // Efek klik untuk memunculkan emoji secara manual di perangkat touch/mobile
    wrapper.addEventListener('click', function() {
        wrapper.classList.toggle('active');
    });
}

// Inisialisasi otomatis untuk SEMUA elemen kartu yang punya class .chairman-wrapper
document.querySelectorAll('.chairman-wrapper').forEach((wrapper, index) => {
    // Berikan ID unik otomatis jika kartu belum memiliki ID
    if (!wrapper.id) {
        wrapper.id = 'emoji-wrapper-' + index;
    }
    initEmojiWrapper(wrapper.id);
});
// Modal Logic untuk Detail Program
// ==========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Kunci scroll halaman belakang
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Buka kunci scroll halaman belakang
        document.body.style.overflow = 'auto';
    }
}

// Tutup modal jika user mengklik area gelap di luar kotak putih
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ==========================================
// Auto-Slider Gambar Modal Olahraga (Smooth & Preload)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const slider = document.getElementById('olahraga-slider');
    if (slider) {
        let currentImg = 1;
        const totalImgs = 20; // Total gambar

        setInterval(() => {
            // Tentukan nomor gambar selanjutnya
            let nextImg = currentImg + 1;
            if (nextImg > totalImgs) nextImg = 1;

            // PRELOAD: Muat gambar selanjutnya di belakang layar terlebih dahulu
            const imgPreload = new Image();
            imgPreload.src = `stroge/olahraga/${nextImg}.jpeg`;

            // Hanya lakukan transisi JIKA gambar selanjutnya sudah siap dimuat
            imgPreload.onload = () => {
                // Fade out (Hilangkan gambar perlahan)
                slider.style.opacity = '0';

                setTimeout(() => {
                    // Ganti foto saat layarnya sedang transparan (0 opacity)
                    slider.src = imgPreload.src;
                    currentImg = nextImg;

                    // Fade in (Munculkan kembali perlahan)
                    slider.style.opacity = '1';
                }, 500); // 500ms mengikuti durasi transisi di CSS (0.5s)
            };
        }, 3500); // Berganti setiap 3,5 detik
    }
});

// ==========================================
// Modal Logic untuk Detail Program (Auto Play/Reset Video)
// ==========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Kunci scroll halaman belakang
        document.body.style.overflow = 'hidden';

        // Cari video di dalam modal ini dan putar
        const video = modal.querySelector('video');
        if (video) {
            video.play();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Buka kunci scroll halaman belakang
        document.body.style.overflow = 'auto';

        // Cari video di dalam modal ini, hentikan, dan reset ke awal
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0; // Reset ke detik 0
        }
    }
}

// Tutup modal jika user mengklik area gelap di luar kotak putih
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';

            // Cari video di dalam modal ini, hentikan, dan reset ke awal
            const video = this.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0; // Reset ke detik 0
            }
        }
    });
});

// ==========================================
// Toggle Daftar Anggota (Buka/Tutup)
// ==========================================
function toggleMembers() {
    const memberSection = document.getElementById('daftar-anggota');
    const btn = document.getElementById('btn-toggle-anggota');

    if (memberSection.style.display === 'none') {
        memberSection.style.display = 'block';
        btn.innerHTML = '<i class="ph-bold ph-caret-up"></i> Sembunyikan Anggota';

        // Panggil ulang inisialisasi emoji agar animasi memuat dengan benar saat elemen ditampilkan
        document.querySelectorAll('#daftar-anggota .chairman-wrapper').forEach((wrapper, index) => {
            if (!wrapper.id) wrapper.id = 'member-emoji-' + index;
            initEmojiWrapper(wrapper.id);
        });
    } else {
        memberSection.style.display = 'none';
        btn.innerHTML = '<i class="ph-fill ph-users-three"></i> Lihat Anggota Lainnya';
    }
}

// ==========================================
// Tutup CTA Banner (Siap Berkontribusi)
// ==========================================
function closeCTA() {
    const cta = document.getElementById('cta-banner');
    if (cta) {
        // Menyembunyikan banner saat tombol X ditekan
        cta.style.display = 'none';
    }
}
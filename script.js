/* ========================================================================
  DAFTAR DATABASE KEY (Urutan Atas ke Bawah / Antrean Penggunaan)
  ========================================================================
*/
const KEY_DATABASE = [
  "VIPQNKF2HSI"
];

/* Catatan Penting Front-End Only:
  Karena berjalan 100% di sisi klien tanpa database backend cloud, pelacakan key dilakukan menggunakan:
  - 'sessionStorage' untuk mereset status klik verifikasi kembali ke nol saat browser direfresh/reload.
  - 'localStorage' untuk menandai indeks key yang sudah pernah diberikan pada sesi browser ini, 
    sehingga user berikutnya (atau saat user menekan kembali) akan mendapatkan key berikutnya secara berurutan.
*/

// State Status Verifikasi Klik (Akan Reset Saat Reload karena memakai SessionStorage)
let state = {
  ch1_clicked: false,
  ch2_clicked: false
};

// Saat Aplikasi Pertama Kali Dimuat
window.addEventListener('DOMContentLoaded', () => {
  // RESET status klik saluran di sessionStorage setiap kali halaman dimuat ulang (Memenuhi Syarat Wajib)
  sessionStorage.removeItem('ch1_clicked');
  sessionStorage.removeItem('ch2_clicked');
  
  // Setup Event Listeners
  const btnStart = document.getElementById('btn-start');
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');

  btnStart.addEventListener('click', () => {
    // Efek transisi sederhana saat beralih halaman
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
    renderStatusUI();
  });

  // Event listener tombol utama dapatkan key
  const btnGetKey = document.getElementById('btn-get-key');
  btnGetKey.addEventListener('click', generateAndDisplayKey);
});

// Menangani Klik Saluran WA dengan Countdown Delay 5 Detik
function handleChannelClick(channelNum, url) {
  // 1. Tampilkan animasi loading & countdown timer overlay
  const overlay = document.getElementById(`loading-overlay-${channelNum}`);
  const countdownSpan = document.getElementById(`countdown-${channelNum}`);
  overlay.classList.remove('hidden');

  let timerValue = 5;
  countdownSpan.textContent = `${timerValue}s`;

  // Buka tautan WhatsApp di tab baru secara langsung
  window.open(url, '_blank');

  // 2. Jalankan hitung mundur 5 detik
  const countdownInterval = setInterval(() => {
    timerValue--;
    countdownSpan.textContent = `${timerValue}s`;

    if (timerValue <= 0) {
      clearInterval(countdownInterval);
      
      // Tandai status sukses klik
      if (channelNum === 1) {
        state.ch1_clicked = true;
        sessionStorage.setItem('ch1_clicked', 'true');
      } else if (channelNum === 2) {
        state.ch2_clicked = true;
        sessionStorage.setItem('ch2_clicked', 'true');
      }

      // Sembunyikan loading overlay
      overlay.classList.add('hidden');
      
      // Update Status Tampilan UI
      renderStatusUI();
    }
  }, 1000);
}

// Melakukan Render Ulang UI berdasarkan State Saat Ini
function renderStatusUI() {
  const statusCh1 = document.getElementById('status-ch1');
  const statusCh2 = document.getElementById('status-ch2');
  const badgeCh1 = document.getElementById('badge-ch1');
  const badgeCh2 = document.getElementById('badge-ch2');
  const btnCh1 = document.getElementById('btn-ch1');
  const btnCh2 = document.getElementById('btn-ch2');
  const btnGetKey = document.getElementById('btn-get-key');
  const textKeyStatus = document.getElementById('text-key-status');

  // Update UI Saluran 1
  if (state.ch1_clicked) {
    statusCh1.innerHTML = `<i class="fa-solid fa-circle-check text-brand-success mr-1"></i> <span class="text-brand-success">Selesai</span>`;
    badgeCh1.innerHTML = `<i class="fa-solid fa-check text-brand-success text-sm"></i>`;
    badgeCh1.className = "text-xs bg-brand-success/10 text-brand-success px-2.5 py-1 rounded-md font-semibold";
    btnCh1.classList.add('border-brand-success/30');
  }

  // Update UI Saluran 2
  if (state.ch2_clicked) {
    statusCh2.innerHTML = `<i class="fa-solid fa-circle-check text-brand-success mr-1"></i> <span class="text-brand-success">Selesai</span>`;
    badgeCh2.innerHTML = `<i class="fa-solid fa-check text-brand-success text-sm"></i>`;
    badgeCh2.className = "text-xs bg-brand-success/10 text-brand-success px-2.5 py-1 rounded-md font-semibold";
    btnCh2.classList.add('border-brand-success/30');
  }

  // Validasi Apakah Kedua Saluran Sudah Diklik
  if (state.ch1_clicked && state.ch2_clicked) {
    // Buka Kunci Tombol Utama
    btnGetKey.disabled = false;
    btnGetKey.className = "w-full py-4 bg-brand-accent hover:bg-brand-accentHover text-white font-gaming font-bold text-lg rounded-xl transition duration-300 shadow-neon-red tracking-wider uppercase flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer glow-effect";
    textKeyStatus.innerHTML = `<i class="fa-solid fa-lock-open mr-1.5 text-[10px] text-brand-success"></i> <span class="text-brand-success">Terbuka</span>`;
  }
}

// Mengambil Key dari Database secara Berurutan (Mekanisme Penyimpanan Berbasis LocalStorage)
function generateAndDisplayKey() {
  // Mengambil data indeks key saat ini dari localStorage, jika tidak ada set ke 0
  let currentKeyIndex = parseInt(localStorage.getItem('hifin_key_index')) || 0;

  // Jika indeks sudah melebihi jumlah database key, putar kembali ke indeks awal 0 atau berikan pesan
  if (currentKeyIndex >= KEY_DATABASE.length) {
    // Opsional: Untuk simulasi tanpa batas, kita bisa mengulang dari awal jika key habis
    currentKeyIndex = 0; 
  }

  const selectedKey = KEY_DATABASE[currentKeyIndex];

  // Update Element UI dengan Key Terpilih
  document.getElementById('key-output').innerText = selectedKey;
  document.getElementById('key-index-indicator').innerText = `#${currentKeyIndex + 1}`;
  
  // Sembunyikan tombol get key setelah berhasil agar tidak di-spam
  const btnGetKey = document.getElementById('btn-get-key');
  btnGetKey.disabled = true;
  btnGetKey.classList.add('hidden');

  // Tampilkan Box Hasil Key
  const keyContainer = document.getElementById('key-container');
  keyContainer.classList.remove('hidden');

  // Tambahkan index satu langkah agar user berikutnya di perangkat ini mendapatkan antrean key selanjutnya
  localStorage.setItem('hifin_key_index', currentKeyIndex + 1);
}

// Fungsi Menyalin Teks Key ke Clipboard (Kompatibilitas Luas)
function copyToClipboard() {
  const keyText = document.getElementById('key-output').innerText;
  
  // Metode fallback aman untuk iframe di browser modern
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = keyText;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast();
    }
  } catch (err) {
    console.error("Gagal menyalin key", err);
  }
  
  document.body.removeChild(tempTextArea);
}

// Memunculkan Toast Notifikasi Kustom
function showToast() {
  const toast = document.getElementById('toast');
  const copyText = document.getElementById('copy-text');
  
  // Ubah teks tombol secara interaktif
  copyText.innerText = "Tersalin!";
  
  // Tampilkan toast notification
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
    copyText.innerText = "Salin Key";
  }, 2500);
}

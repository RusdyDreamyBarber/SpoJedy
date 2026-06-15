<template>
<div style="max-width:600px; margin:0 auto; padding:40px 24px;">
  <div class="fade-in" style="margin-bottom:36px;">
    <p style="color:var(--accent); font-size:0.8rem; letter-spacing:3px; text-transform:uppercase; font-weight:600; margin-bottom:8px;">Account</p>
    <h1 style="font-size:2.5rem; font-weight:800; color:var(--text-primary); font-family:'Syne', sans-serif;">Your Profile</h1>
  </div>

  <div style="display:flex; flex-direction:column; gap:28px;">
    
    <div class="card fade-in-1" style="padding:28px; display:flex; flex-direction:column; align-items:center; gap:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px;">
      <div style="position:relative;">
        <div :style="{
          width:'110px', height:'110px', borderRadius:'50%', overflow:'hidden',
          border:'3px solid var(--accent)', boxShadow:'0 0 20px var(--accent-glow)',
          background:'var(--bg-hover)', display:'flex', alignItems:'center', justifyContent:'center',
        }">
          <div v-if="imgLoading" class="skeleton" style="position:absolute; inset:0; border-radius:50%;" />
          <img v-if="store.profile.profileImage && !imgLoading" :src="store.profile.profileImage" alt="Profile" style="width:100%; height:100%; object-fit:cover;" />
          <svg v-if="!store.profile.profileImage && !imgLoading" width="50" height="50" viewBox="0 0 24 24" fill="var(--text-secondary)">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
      </div>
      <label style="cursor:pointer;">
        <input type="file" accept="image/*" @change="handleImageUpload" style="display:none;" />
        
        <span class="btn-accent" data-bs-toggle="tooltip" data-bs-placement="top" title="Format JPG/PNG, Maks 1MB">
          Change Photo
        </span>
      </label>
    </div>

    <div class="card fade-in-2" style="padding:28px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px;">
      <label style="display:block; color:var(--text-secondary); font-size:0.82rem; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px;">Username</label>
      <div style="display:flex; gap:12px; margin-bottom:12px;">
        <input v-model="usernameInput" type="text" :style="{
          flex:1, background:'var(--bg-hover)', border:'1px solid var(--border)',
          borderRadius:'10px', padding:'10px 14px', color:'var(--text-primary)', outline:'none',
          fontFamily:'DM Sans, sans-serif'
        }" />
        <button @click="saveUsernameInstantly" class="btn-accent">Save</button>
      </div>

      <div v-if="showAlert" class="alert alert-success alert-dismissible fade show" role="alert" style="margin:0; font-size:0.88rem; border-radius:10px; background-color:#198754; color:#fff; border:none;">
         <strong>Success!</strong> Username berhasil diperbarui.
        <button type="button" class="btn-close" @click="showAlert = false" aria-label="Close" style="filter:invert(1); padding:1.05rem 1rem;"></button>
      </div>
    </div>

    <div class="card fade-in-3" style="padding:28px; display:flex; flex-direction:row; justify-content:space-between; align-items:center; background:var(--bg-card); border:1px solid var(--border); border-radius:16px;">
      <div>
        <label style="display:block; color:var(--text-secondary); font-size:0.82rem; text-transform:uppercase; letter-spacing:1px;">Theme Preference</label>
        <p style="margin:0; font-weight:600; color:var(--text-primary);">{{ store.profile.theme === 'dark' ? 'Dark Mode' : 'Light Mode' }}</p>
      </div>
      
      <div @click="toggleTheme" :style="{
        width: '64px', height: '34px', borderRadius: '20px', 
        background: store.profile.theme === 'dark' ? 'var(--accent)' : '#ccc',
        position: 'relative', cursor: 'pointer', transition: '0.3s',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }">
        <div :style="{
          width: '26px', height: '26px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '4px', 
          left: store.profile.theme === 'dark' ? '34px' : '4px',
          transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', userSelect: 'none'
        }">
          {{ store.profile.theme === 'dark' ? '🌚' : '🌝' }}
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store } from '@/stores/appStore.js' // Mengimpor global state manajemen lokal
import { Tooltip } from 'bootstrap'         // Mengimpor modul JavaScript Tooltip resmi Bootstrap

const usernameInput = ref(store.profile.username)
const imgLoading = ref(false)
const showAlert = ref(false)

// Aktifkan fungsionalitas interaktif Bootstrap Tooltip saat halaman dimuat
onMounted(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach(el => new Tooltip(el))
})

// Fungsi simpan instan sekali klik (Tanpa pop-up konfirmasi)
function saveUsernameInstantly() {
  if (!usernameInput.value.trim()) return
  store.setUsername(usernameInput.value.trim())
  
  // Nyalakan Alert Bootstrap, otomatis disembunyikan setelah 3 detik
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}

// Fungsi pengubah tema (Light / Dark)
function toggleTheme() {
  const newTheme = store.profile.theme === 'dark' ? 'light' : 'dark'
  store.setTheme(newTheme)
}

// Fungsi pemroses unggahan gambar profil ke Base64 data string
function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  imgLoading.value = true
  const reader = new FileReader()
  reader.onload = (ev) => {
    store.setProfileImage(ev.target.result)
    imgLoading.value = false
  }
  reader.readAsDataURL(file)
}
</script>
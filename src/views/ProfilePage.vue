<template>
  <div style="max-width:600px; margin:0 auto; padding:40px 24px;">
    <div class="fade-in" style="margin-bottom:36px;">
      <p style="color:var(--accent); font-size:0.8rem; letter-spacing:3px; text-transform:uppercase; font-weight:600; margin-bottom:8px;">Account</p>
      <h1 style="font-size:2.5rem; font-weight:800; color:var(--text-primary);">Your Profile</h1>
    </div>

    <div style="display:flex; flex-direction:column; gap:28px;">

      <!-- Profile Image -->
      <div class="card fade-in-1" style="padding:28px; display:flex; flex-direction:column; align-items:center; gap:20px;">
        <div style="position:relative;">
          <div :style="{
            width:'110px', height:'110px', borderRadius:'50%', overflow:'hidden',
            border:'3px solid var(--accent)', boxShadow:'0 0 20px var(--accent-glow)',
            background:'var(--bg-hover)', display:'flex', alignItems:'center', justifyContent:'center',
          }">
            <div v-if="imgLoading" class="skeleton" style="position:absolute; inset:0; border-radius:50%;" />
            <img v-if="store.profile.profileImage && !imgLoading"
              :src="store.profile.profileImage" alt="Profile"
              style="width:100%; height:100%; object-fit:cover;" />
            <svg v-if="!store.profile.profileImage && !imgLoading"
              width="50" height="50" viewBox="0 0 24 24" fill="var(--text-secondary)">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
          <label style="cursor:pointer;">
            <input type="file" accept="image/*" @change="handleImageUpload" style="display:none;" />
            <span class="btn-accent" style="display:inline-block;">Upload Photo</span>
          </label>
          <p style="color:var(--text-secondary); font-size:0.78rem;">Max 1 MB · compressed automatically</p>
          <p v-if="imgError" style="color:#ff6b6b; font-size:0.78rem;">{{ imgError }}</p>
        </div>
      </div>

      <!-- Username -->
      <div class="card fade-in-2" style="padding:28px;">
        <label style="display:block; color:var(--text-secondary); font-size:0.82rem; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px;">Username</label>
        <div style="display:flex; gap:12px;">
          <input v-model="usernameInput" type="text" placeholder="Enter username"
            @keyup.enter="saveUsername"
            :style="{
              flex:1, background:'var(--bg-hover)', border:'1px solid var(--border)',
              borderRadius:'10px', padding:'10px 14px', color:'var(--text-primary)',
              fontSize:'1rem', outline:'none', fontFamily:'DM Sans, sans-serif',
            }"
            @focus="e=>e.target.style.borderColor='var(--accent)'"
            @blur="e=>e.target.style.borderColor='var(--border)'"
          />
          <button @click="saveUsername" class="btn-accent">Save</button>
        </div>
        <p v-if="usernameSaved" style="color:var(--accent); font-size:0.8rem; margin-top:8px;">✓ Username updated!</p>
      </div>

      <!-- Theme -->
      <div class="card fade-in-3" style="padding:28px;">
        <label style="display:block; color:var(--text-secondary); font-size:0.82rem; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px;">Theme</label>
        <div style="display:flex; gap:12px;">
          <button @click="store.setTheme('dark')"
            :style="{
              flex:1, padding:'14px', borderRadius:'12px', cursor:'pointer',
              border: store.profile.theme==='dark' ? '2px solid var(--accent)' : '1px solid var(--border)',
              background: store.profile.theme==='dark' ? 'var(--accent-glow)' : 'var(--bg-hover)',
              color:'var(--text-primary)', fontFamily:'Syne,sans-serif', fontWeight:'600',
            }">🌙 Dark Mode</button>
          <button @click="store.setTheme('light')"
            :style="{
              flex:1, padding:'14px', borderRadius:'12px', cursor:'pointer',
              border: store.profile.theme==='light' ? '2px solid var(--accent)' : '1px solid var(--border)',
              background: store.profile.theme==='light' ? 'var(--accent-glow)' : 'var(--bg-hover)',
              color:'var(--text-primary)', fontFamily:'Syne,sans-serif', fontWeight:'600',
            }">☀️ Light Mode</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '@/stores/appStore.js'

const usernameInput = ref(store.profile.username)
const usernameSaved = ref(false)
const imgLoading    = ref(false)
const imgError      = ref('')

function saveUsername() {
  if (!usernameInput.value.trim()) return
  store.setUsername(usernameInput.value.trim())
  usernameSaved.value = true
  setTimeout(() => usernameSaved.value = false, 2000)
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  imgError.value   = ''
  imgLoading.value = true

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (ev) => {
    const img = new Image()
    img.src = ev.target.result
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      const maxDim = 800
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim }
        else { width = Math.round(width * maxDim / height); height = maxDim }
      }
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      let quality = 0.9
      let dataUrl = canvas.toDataURL('image/jpeg', quality)
      while (dataUrl.length > 1048576 && quality > 0.1) {
        quality -= 0.1
        dataUrl = canvas.toDataURL('image/jpeg', quality)
      }
      if (dataUrl.length > 1048576) {
        imgError.value = 'Image too large. Please use a smaller image.'
        imgLoading.value = false
        return
      }
      store.setProfileImage(dataUrl)
      imgLoading.value = false
    }
  }
}
</script>
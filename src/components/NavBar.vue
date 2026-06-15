<template>
  <nav :style="navStyle">
    <router-link to="/" style="text-decoration:none; display:flex; align-items:center; gap:8px;">
      <div :style="logoBox">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
      <span style="font-family:'Syne',sans-serif; font-weight:800; font-size:1.2rem; color:var(--text-primary);">
        Spo<span style="color:var(--accent);">Je</span>Dy
      </span>
    </router-link>

    <div style="display:flex; gap:6px;">
      <router-link
        v-for="l in links" :key="l.to" :to="l.to"
        :class="['nav-link', { active: isActive(l.to) }]">
        {{ l.label }}
      </router-link>
    </div>

    <router-link to="/profile" style="text-decoration:none; display:flex; align-items:center; gap:10px;">
      <span style="color:var(--text-secondary); font-size:0.88rem;">{{ store.profile.username }}</span>
      <div :style="avatarBox">
        <img v-if="store.profile.profileImage" :src="store.profile.profileImage"
          alt="Profile" style="width:100%; height:100%; object-fit:cover;" />
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { store } from '@/stores/appStore.js'

const route = useRoute()
// Note: Profile page tetap bisa diakses via klik username/foto profil di navbar kanan
// Playlist ditambahkan sebagai fitur tambahan menggantikan link Profile di navbar
const links = [
  { to: '/',          label: 'Home' },
  { to: '/videos',    label: 'Music Videos' },
  { to: '/playlist',  label: 'Playlist' },
]
function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
const navStyle = {
  position:'fixed', top:0, left:0, right:0, zIndex:1000,
  background:'var(--nav-bg)', backdropFilter:'blur(20px)',
  borderBottom:'1px solid var(--border)', height:'70px',
  display:'flex', alignItems:'center', padding:'0 24px',
  justifyContent:'space-between',
}
const logoBox = {
  width:'32px', height:'32px', borderRadius:'8px',
  background:'var(--accent)', display:'flex',
  alignItems:'center', justifyContent:'center',
  boxShadow:'0 0 15px var(--accent-glow)',
}
const avatarBox = {
  width:'36px', height:'36px', borderRadius:'50%', overflow:'hidden',
  border:'2px solid var(--accent)', boxShadow:'0 0 10px var(--accent-glow)',
  background:'var(--bg-hover)', display:'flex', alignItems:'center', justifyContent:'center',
}
</script>

<style scoped>
.nav-link {
  text-decoration:none; padding:6px 16px; border-radius:50px;
  font-size:0.88rem; font-family:'Syne',sans-serif; font-weight:500;
  color:var(--text-secondary); transition:all 0.2s ease;
}
.nav-link:hover { background:var(--bg-hover); color:var(--text-primary); }
.nav-link.active { background:var(--accent); color:white; box-shadow:0 0 15px var(--accent-glow); }
</style>
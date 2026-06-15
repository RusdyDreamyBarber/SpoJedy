<template>
  <div v-if="video" style="max-width:820px; margin:0 auto; padding:40px 24px;">
    <button @click="$router.push('/videos')" class="back-btn">← Back to Videos</button>

    <div class="fade-in" style="display:flex; flex-direction:column; gap:24px;">
      <div style="border-radius:16px; overflow:hidden; border:1px solid var(--border); background:#000;">
        <video ref="vid" :src="video.videoUrl"
          @timeupdate="cur = vid.currentTime"
          @loadedmetadata="dur = vid.duration"
          @ended="onEnded"
          @click="togglePlay"
          style="width:100%; display:block; max-height:450px; object-fit:contain;"
          playsinline />
      </div>

      <div>
        <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary);">{{ video.title }}</h1>
        <p style="color:var(--text-secondary); margin-top:4px;">{{ video.artist }}</p>
      </div>

      <div>
        <input type="range" min="0" :max="dur||100" :value="cur"
          @input="e => { vid.currentTime = e.target.value; cur = +e.target.value }" />
        <div style="display:flex; justify-content:space-between; color:var(--text-secondary); font-size:0.78rem; margin-top:4px;">
          <span>{{ fmt(cur) }}</span><span>{{ fmt(dur) }}</span>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <button @click="goPrev" class="ctrl-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
        </button>
        <button @click="togglePlay" class="play-btn">
          <svg v-if="!playing" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else           width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <button @click="goNext" class="ctrl-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z"/></svg>
        </button>
        <button @click="goFS" class="ctrl-btn" title="Fullscreen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        </button>
        <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:150px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
          <input type="range" min="0" max="1" step="0.01" :value="vol"
            @input="e => { vol=+e.target.value; vid.volume=vol }" style="flex:1;" />
        </div>
        <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
  <!-- Shuffle -->
  <button @click="isShuffle = !isShuffle"
    :style="{
      background: 'none', border: 'none', cursor: 'pointer',
      color: isShuffle ? 'var(--accent)' : 'var(--text-secondary)',
      transition: 'color 0.2s',
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '0.82rem', fontFamily: 'Syne, sans-serif',
    }">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
    </svg>
    Shuffle
  </button>

  <!-- Repeat -->
  <button @click="repeatMode = (repeatMode + 1) % 3"
    :style="{
      background: 'none', border: 'none', cursor: 'pointer',
      color: repeatMode > 0 ? 'var(--accent)' : 'var(--text-secondary)',
      transition: 'color 0.2s',
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '0.82rem', fontFamily: 'Syne, sans-serif',
    }">
    <div style="position:relative; width:20px; height:20px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
      </svg>
      <span v-if="repeatMode === 2"
        style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
               font-size:0.55rem; font-weight:800; color:var(--accent);
               font-family:'Syne',sans-serif; line-height:1;">
        1
      </span>
    </div>
    Repeat
  </button>
</div>
      </div>

      <div>
        <button @click="$router.push(`/song/${video.songId}`)" class="btn-accent"
          style="display:inline-flex; align-items:center; gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          Listen to Song
        </button>
      </div>
    </div>
  </div>

  <div v-else style="text-align:center; padding:80px 24px; color:var(--text-secondary);">
    Video not found. <button @click="$router.push('/videos')" class="btn-accent" style="margin-left:12px;">Back</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/stores/appStore.js'

const route   = useRoute()
const router  = useRouter()
const vid     = ref(null)
const playing = ref(false)
const cur     = ref(0)
const dur     = ref(0)
const vol     = ref(1)
const isShuffle  = ref(false)
const repeatMode = ref(0) // 0=off, 1=repeat all, 2=repeat one

const video = computed(() => store.getVideoById(route.params.id))

// Fungsi auto play video — tunggu siap baru play
function autoPlay() {
  if (!vid.value) return
  vid.value.load()
  vid.value.addEventListener('canplay', () => {
    vid.value.play()
      .then(() => { playing.value = true })
      .catch(() => { playing.value = false })
  }, { once: true })
}
// Shortcuts Keyboard
function handleKeyboard(e) {
  if (e.target.tagName === 'INPUT') return
  if (e.code === 'Space') { e.preventDefault(); togglePlay() }
  if (e.code === 'ArrowRight') { e.preventDefault(); if(vid.value) { vid.value.currentTime = Math.min(dur.value, vid.value.currentTime + 10); cur.value = vid.value.currentTime } }
  if (e.code === 'ArrowLeft') { e.preventDefault(); if(vid.value) { vid.value.currentTime = Math.max(0, vid.value.currentTime - 10); cur.value = vid.value.currentTime } }
  if (e.code === 'ArrowUp') { e.preventDefault(); vol.value = Math.min(1, vol.value + 0.1); if(vid.value) vid.value.volume = vol.value }
  if (e.code === 'ArrowDown') { e.preventDefault(); vol.value = Math.max(0, vol.value - 0.1); if(vid.value) vid.value.volume = vol.value }
  if (e.code === 'KeyN') goNext()
  if (e.code === 'KeyP') goPrev()
}
// Auto play saat pertama kali halaman dibuka
onMounted(() => {
  autoPlay()
  window.addEventListener('keydown', handleKeyboard)
})

// Auto play saat video berubah karena next/prev
watch(() => route.params.id, () => {
  cur.value = 0
  dur.value = 0
  playing.value = false
  setTimeout(() => { autoPlay() }, 100)
})

function togglePlay() {
  if (!vid.value) return
  playing.value ? vid.value.pause() : vid.value.play()
  playing.value = !playing.value
}
function goNext() {
  if (isShuffle.value) {
    const others = store.videos.filter(v => v.id !== Number(route.params.id))
    const random = others[Math.floor(Math.random() * others.length)]
    router.push(`/video/${random.id}`)
  } else {
    router.push(`/video/${store.getNextVideo(route.params.id).id}`)
  }
}

function goPrev() {
  if (isShuffle.value) {
    const others = store.videos.filter(v => v.id !== Number(route.params.id))
    const random = others[Math.floor(Math.random() * others.length)]
    router.push(`/video/${random.id}`)
  } else {
    router.push(`/video/${store.getPrevVideo(route.params.id).id}`)
  }
}

function onEnded() {
  if (repeatMode.value === 2) {
    vid.value.currentTime = 0
    vid.value.play()
  } else if (repeatMode.value === 1) {
    goNext()
  } else {
    const currentIndex = store.videos.findIndex(v => v.id === Number(route.params.id))
    if (currentIndex < store.videos.length - 1) {
      goNext()
    } else {
      playing.value = false
    }
  }
}
function goFS() {
  if (vid.value?.requestFullscreen) vid.value.requestFullscreen()
  else if (vid.value?.webkitRequestFullscreen) vid.value.webkitRequestFullscreen()
}
function fmt(s) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
}
onUnmounted(() => {
  if (vid.value) { vid.value.pause(); vid.value.src = '' }
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
.back-btn {
  background:none; border:none; color:var(--text-secondary); cursor:pointer;
  font-size:0.88rem; margin-bottom:28px; padding:0; display:block;
}
.back-btn:hover { color:var(--text-primary); }
.play-btn {
  width:60px; height:60px; border-radius:50%;
  background:var(--accent); border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 0 25px var(--accent-glow); transition:transform 0.15s;
}
.play-btn:active { transform:scale(0.93); }
</style>
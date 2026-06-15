<template>
  <div v-if="song" style="max-width:680px; margin:0 auto; padding:40px 24px;">
    <audio ref="audioEl" :src="song.audio"
      @timeupdate="currentTime = audioEl.currentTime"
      @loadedmetadata="duration = audioEl.duration"
      @ended="onEnded" />

    <button @click="$router.push('/')" class="back-btn">← Back to Songs</button>

    <div class="fade-in" style="display:flex; flex-direction:column; gap:28px; align-items:center;">
      <div @click="openFS" style="cursor:zoom-in; position:relative; display:inline-block;">
        <img :src="song.cover" :alt="song.title" :class="['cover', { playing: isPlaying }]" />
        <span style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.6); color:white; font-size:0.72rem; padding:3px 8px; border-radius:6px;">⤢ Fullscreen</span>
      </div>

      <div style="text-align:center;">
        <h1 style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">{{ song.title }}</h1>
        <p style="color:var(--text-secondary); margin-top:4px;">{{ song.artist }}</p>
      </div>
      
      <button @click="store.toggleFavorite(song.id)"
        style="background:none; border:none; cursor:pointer; font-size:1.5rem;">
        {{ store.isFavorite(song.id) ? '❤️' : '🤍' }}
      </button>

      <div style="width:100%;">
        <input type="range" min="0" :max="duration||100" :value="currentTime"
          @input="e => { audioEl.currentTime = e.target.value; currentTime = +e.target.value }" />
        <div style="display:flex; justify-content:space-between; color:var(--text-secondary); font-size:0.78rem; margin-top:4px;">
          <span>{{ fmt(currentTime) }}</span><span>{{ fmt(duration) }}</span>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:20px;">
        <button @click="goPrev" class="ctrl-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
        </button>
        <button @click="togglePlay" class="play-btn">
          <svg v-if="!isPlaying" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          <svg v-else             width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        <button @click="goNext" class="ctrl-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z"/></svg>
        </button>
      </div>

      <!-- Repeat & Shuffle buttons -->
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
  <!-- Logo repeat dengan angka 1 di dalam nya -->
  <div style="position:relative; width:20px; height:20px;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
    </svg>
    <!-- Angka 1 di tengah logo -->
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
      <!-- Tombol trigger modal -->
<button data-bs-toggle="modal" data-bs-target="#playlistModal"
  style="background:var(--bg-hover); border:1px solid var(--border); padding:10px 20px; border-radius:50px; cursor:pointer; color:var(--text-primary); font-size:0.85rem; font-family:'Syne',sans-serif; font-weight:600; display:flex; align-items:center; gap:8px; transition:all 0.2s;"
  @mouseover="e=>e.currentTarget.style.borderColor='var(--accent)'"
  @mouseleave="e=>e.currentTarget.style.borderColor='var(--border)'">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
  Add to Playlist
</button>

<!-- Bootstrap Modal -->
<Teleport to="body">
  <div class="modal fade" id="playlistModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" :style="{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        color: 'var(--text-primary)',
      }">
        <div class="modal-header" style="border-bottom:1px solid var(--border); padding:20px 24px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img :src="song.cover" style="width:44px; height:44px; border-radius:8px; object-fit:cover;" />
            <div>
              <h5 style="margin:0; font-family:'Syne',sans-serif; font-weight:700; color:var(--text-primary);">Add to Playlist</h5>
              <p style="margin:0; font-size:0.78rem; color:var(--text-secondary);">{{ song.title }} — {{ song.artist }}</p>
            </div>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
            :style="{ filter: 'invert(1)', opacity: '0.6' }"></button>
        </div>

        <div class="modal-body" style="padding:16px 24px;">
          <!-- Kalau tidak ada playlist -->
          <div v-if="store.playlists.length === 0" style="text-align:center; padding:24px; color:var(--text-secondary);">
            <p style="margin-bottom:12px;">No playlists yet!</p>
            <button data-bs-dismiss="modal" @click="$router.push('/playlist')" class="btn-accent">
              Create Playlist
            </button>
          </div>

          <!-- List playlist -->
          <div v-for="playlist in store.playlists" :key="playlist.id"
            @click="addToPlaylist(playlist.id)"
            :style="{
              display:'flex', alignItems:'center', gap:'12px',
              padding:'12px', borderRadius:'10px', cursor:'pointer',
              background: addedTo === playlist.id ? 'rgba(255,85,0,0.1)' : 'transparent',
              border: addedTo === playlist.id ? '1px solid var(--accent)' : '1px solid transparent',
              transition:'all 0.2s', marginBottom:'8px',
            }"
            class="playlist-item">
            <!-- Cover playlist -->
            <div style="width:44px; height:44px; border-radius:8px; overflow:hidden; background:var(--bg-hover); flex-shrink:0;">
              <img v-if="store.getPlaylistSongs(playlist.id)[0]"
                :src="store.getPlaylistSongs(playlist.id)[0].cover"
                style="width:100%; height:100%; object-fit:cover;" />
              <div v-else style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              </div>
            </div>
            <div style="flex:1;">
              <p style="font-family:'Syne',sans-serif; font-weight:600; font-size:0.9rem; color:var(--text-primary); margin:0;">{{ playlist.name }}</p>
              <p style="color:var(--text-secondary); font-size:0.75rem; margin:2px 0 0;">{{ playlist.songs.length }} songs</p>
            </div>
            <!-- Checkmark kalau sudah ditambah -->
            <span v-if="addedTo === playlist.id" style="color:var(--accent); font-size:1.2rem;">✓</span>
            <span v-else style="color:var(--text-secondary); font-size:1.2rem;">+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</Teleport>
      <div style="display:flex; align-items:center; gap:10px; width:100%;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
        <input type="range" min="0" max="1" step="0.01" :value="volume"
          @input="e => { volume = +e.target.value; audioEl.volume = volume }" style="flex:1;" />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/></svg>
      </div>

      <button @click="$router.push(`/video/${song.videoId}`)" class="btn-accent"
        style="display:flex; align-items:center; gap:8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        Watch Music Video
      </button>
    </div>

    <Teleport to="body">
      <div v-if="fs" @click.self="fs=false"
        style="position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.92);
               display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;">
        <img :src="song.cover" :alt="song.title"
          :style="{ width:zoom+'px', height:zoom+'px', objectFit:'cover', borderRadius:'12px', transition:'width 0.2s, height 0.2s', maxWidth:'90vw', maxHeight:'75vh' }" />
        <div style="display:flex; gap:12px; align-items:center;">
          <button @click="zoom = Math.max(150, zoom-80)" class="ctrl-btn">−</button>
          <span style="color:white; min-width:50px; text-align:center; font-size:0.85rem;">{{ Math.round(zoom/3) }}%</span>
          <button @click="zoom = Math.min(900, zoom+80)" class="ctrl-btn">+</button>
          <button @click="fs=false" class="btn-accent" style="margin-left:8px;">✕ Exit</button>
        </div>
      </div>
    </Teleport>
  </div>

  <div v-else style="text-align:center; padding:80px 24px; color:var(--text-secondary);">
    Song not found. <button @click="$router.push('/')" class="btn-accent" style="margin-left:12px;">Home</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '@/stores/appStore.js'

const route       = useRoute()
const router      = useRouter()
const audioEl     = ref(null)
const isPlaying   = ref(false)
const currentTime = ref(0)
const duration    = ref(0)
const volume      = ref(1)
const fs          = ref(false)
const zoom        = ref(300)
const isShuffle  = ref(false)
const repeatMode = ref(0)  // 0=off, 1=repeat all, 2=repeat one
const song = computed(() => store.getSongById(route.params.id))
const addedTo = ref(null)

function addToPlaylist(playlistId) {
  store.addSongToPlaylist(playlistId, song.value.id)
  addedTo.value = playlistId
  setTimeout(() => { addedTo.value = null }, 1500)
}

// Fungsi auto play — tunggu audio siap baru play
function autoPlay() {
  if (!audioEl.value) return
  audioEl.value.load()
  audioEl.value.addEventListener('canplay', () => {
    audioEl.value.play()
      .then(() => { isPlaying.value = true })
      .catch(() => { isPlaying.value = false })
  }, { once: true })
}

//keyboard shortcut
function handleKeyboard(e) {
  if (e.target.tagName === 'INPUT') return
  if (e.code === 'Space') { e.preventDefault(); togglePlay() }
  if (e.code === 'ArrowRight') { e.preventDefault(); if(audioEl.value) { audioEl.value.currentTime = Math.min(duration.value, audioEl.value.currentTime + 10); currentTime.value = audioEl.value.currentTime } }
  if (e.code === 'ArrowLeft') { e.preventDefault(); if(audioEl.value) { audioEl.value.currentTime = Math.max(0, audioEl.value.currentTime - 10); currentTime.value = audioEl.value.currentTime } }
  if (e.code === 'ArrowUp') { e.preventDefault(); volume.value = Math.min(1, volume.value + 0.1); if(audioEl.value) audioEl.value.volume = volume.value }
  if (e.code === 'ArrowDown') { e.preventDefault(); volume.value = Math.max(0, volume.value - 0.1); if(audioEl.value) audioEl.value.volume = volume.value }
  if (e.code === 'KeyN') goNext()
  if (e.code === 'KeyP') goPrev()
}
// Auto play saat pertama kali halaman dibuka
onMounted(() => {
  autoPlay()
  window.addEventListener('keydown', handleKeyboard)
})


// Auto play saat lagu berubah karena next/prev
watch(() => route.params.id, () => {
  currentTime.value = 0
  duration.value = 0
  isPlaying.value = false
  setTimeout(() => { autoPlay() }, 100)
})

function togglePlay() {
  if (!audioEl.value) return
  isPlaying.value ? audioEl.value.pause() : audioEl.value.play()
  isPlaying.value = !isPlaying.value
}

function goNext() {
  if (isShuffle.value) {
    const list = store.currentPlaylistId 
      ? store.getPlaylistSongs(store.currentPlaylistId)
      : store.songs
    const others = list.filter(s => s.id !== Number(route.params.id))
    const random = others[Math.floor(Math.random() * others.length)]
    router.push(`/song/${random.id}`)
  } else if (store.currentPlaylistId) {
    // Pakai urutan playlist
    const songs = store.getPlaylistSongs(store.currentPlaylistId)
    const idx = songs.findIndex(s => s.id === Number(route.params.id))
    const next = songs[(idx + 1) % songs.length]
    router.push(`/song/${next.id}`)
  } else {
    router.push(`/song/${store.getNextSong(route.params.id).id}`)
  }
}

function goPrev() {
  if (isShuffle.value) {
    const list = store.currentPlaylistId
      ? store.getPlaylistSongs(store.currentPlaylistId)
      : store.songs
    const others = list.filter(s => s.id !== Number(route.params.id))
    const random = others[Math.floor(Math.random() * others.length)]
    router.push(`/song/${random.id}`)
  } else if (store.currentPlaylistId) {
    const songs = store.getPlaylistSongs(store.currentPlaylistId)
    const idx = songs.findIndex(s => s.id === Number(route.params.id))
    const prev = songs[(idx - 1 + songs.length) % songs.length]
    router.push(`/song/${prev.id}`)
  } else {
    router.push(`/song/${store.getPrevSong(route.params.id).id}`)
  }
}

function onEnded() {
  if (repeatMode.value === 2) {
    // Repeat One — putar lagu yang sama terus
    audioEl.value.currentTime = 0
    audioEl.value.play()
  } else if (repeatMode.value === 1) {
    // Repeat All — lanjut next, kalau sudah lagu terakhir balik ke pertama
    goNext()
  } else {
    // Off — lanjut next, kalau lagu terakhir stop
    const currentIndex = store.songs.findIndex(s => s.id === Number(route.params.id))
    if (currentIndex < store.songs.length - 1) {
      goNext()
    } else {
      isPlaying.value = false
    }
  }
}

function openFS() { fs.value = true; zoom.value = 300 }
function fmt(s) {
  if (!s || isNaN(s)) return '0:00'
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
}
onUnmounted(() => {
  if (audioEl.value) { audioEl.value.pause(); audioEl.value.src = '' }
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
.cover {
  width:260px; height:260px; object-fit:cover; border-radius:20px;
  box-shadow:0 20px 60px rgba(0,0,0,0.5), 0 0 30px var(--accent-glow);
}
.cover.playing { animation: glow 2s ease-in-out infinite; }
@keyframes glow {
  0%,100% { box-shadow:0 20px 60px rgba(0,0,0,0.5), 0 0 20px var(--accent-glow); }
  50%      { box-shadow:0 20px 60px rgba(0,0,0,0.5), 0 0 55px var(--accent-glow); }
}
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
.playlist-item:hover {
  background: var(--bg-hover) !important;
}
</style>
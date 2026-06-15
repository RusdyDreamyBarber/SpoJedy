<template>
  <div style="min-height:100vh; background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 300px);">
    <div style="max-width:1200px; margin:0 auto; padding:40px 24px;">

      <!-- Hero Carousel -->
      <div class="fade-in" style="margin-bottom:48px; position:relative;">
        <p style="color:var(--accent); font-size:0.8rem; letter-spacing:3px; text-transform:uppercase; font-weight:600; margin-bottom:12px;">🎵 Featured</p>

        <div style="position:relative; overflow:hidden; border-radius:16px;">
          <!-- Slider -->
          <div :style="{
            display:'flex',
            transform: `translateX(-${activeSlide * 100}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          }">
            <div
              v-for="song in featuredSongs" :key="song.id"
              @click="$router.push(`/song/${song.id}`)"
              style="min-width:100%; cursor:pointer; position:relative; overflow:hidden; border:1px solid rgba(255,85,0,0.2);">

              <!-- Blurred background -->
              <div :style="{
                position:'absolute', inset:0,
                background: `url(${song.cover})`,
                backgroundSize:'cover', backgroundPosition:'center',
                filter:'blur(60px) brightness(0.25)',
                zIndex:0,
              }"/>

              <!-- Content -->
              <div style="position:relative; z-index:1; display:flex; align-items:center; gap:28px; padding:40px;">
                <img :src="song.cover" :alt="song.title"
                  style="width:120px; height:120px; object-fit:cover; border-radius:12px; box-shadow:0 8px 32px rgba(0,0,0,0.6); flex-shrink:0;" />
                <div style="flex:1;">
                  <p style="color:var(--accent); font-size:0.78rem; font-weight:600; margin-bottom:6px; text-transform:uppercase; letter-spacing:2px;">Now Trending</p>
                  <h2 style="font-size:clamp(1.4rem,3vw,2.2rem); font-weight:800; color:white; margin-bottom:4px;">{{ song.title }}</h2>
                  <p style="color:rgba(255,255,255,0.7); font-size:1rem;">{{ song.artist }}</p>
                </div>
                <div style="width:56px; height:56px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; box-shadow:0 0 30px var(--accent-glow); flex-shrink:0;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Arrow Prev -->
          <button @click.stop="prevSlide" class="arrow-btn" style="left:12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <!-- Arrow Next -->
          <button @click.stop="nextSlide" class="arrow-btn" style="right:12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>

        <!-- Dot indicators -->
        <div style="display:flex; justify-content:center; gap:8px; margin-top:14px;">
          <div v-for="(_, i) in featuredSongs" :key="i"
            @click="activeSlide = i"
            :style="{
              width: activeSlide === i ? '24px' : '8px',
              height:'8px', borderRadius:'4px',
              background: activeSlide === i ? 'var(--accent)' : 'var(--border-hover)',
              cursor:'pointer', transition:'all 0.3s ease',
            }" />
        </div>
      </div>

      <!-- All Songs -->
      <div class="fade-in-1" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
        <div>
          <h2 style="font-size:1.4rem; font-weight:800; color:var(--text-primary);">All Songs</h2>
        </div>
        <!-- Waveform decoration -->
        <div style="display:flex; align-items:flex-end; gap:3px; height:24px;">
          <div v-for="h in [8,14,20,12,18,10,16,22,8,14]" :key="h"
            :style="{ width:'3px', height:h+'px', background:'var(--accent)', borderRadius:'2px', opacity:0.6 }" />
        </div>
      </div>
      
      <!-- Search Bar -->
<div class="fade-in-1" style="margin-bottom:24px;">
  <div style="position:relative; max-width:400px;">
    <svg style="position:absolute; left:14px; top:50%; transform:translateY(-50%); pointer-events:none;"
      width="18" height="18" viewBox="0 0 24 24" fill="var(--text-secondary)">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
    <input v-model="search" type="text" placeholder="Search songs or artists..."
      :style="{
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '50px',
        padding: '10px 16px 10px 42px',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        outline: 'none',
        fontFamily: 'DM Sans, sans-serif',
        transition: 'border-color 0.2s',
      }"
      @focus="e => e.target.style.borderColor = 'var(--accent)'"
      @blur="e => e.target.style.borderColor = 'var(--border)'"
    />
    <!-- Clear button -->
    <button v-if="search" @click="search = ''"
      style="position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1rem;">
      ✕
    </button>
  </div>
  <!-- Hasil search info -->
  <p v-if="search" style="color:var(--text-secondary); font-size:0.8rem; margin-top:8px; margin-left:4px;">
    {{ filteredSongs.length }} result{{ filteredSongs.length !== 1 ? 's' : '' }} for "<span style="color:var(--accent);">{{ search }}</span>"
  </p>
</div>

      <!-- Song Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px;">
        <div
          v-for="(song, i) in filteredSongs" :key="song.id"
          :class="['card', `fade-in-${Math.min(i+1,4)}`]"
          @click="$router.push(`/song/${song.id}`)"
          style="cursor:pointer;">

          <div style="position:relative; padding-top:100%; background:var(--bg-hover);">
            <img :src="song.cover" :alt="song.title"
              @load="loaded[song.id] = true"
              :style="{
                position:'absolute', top:0, left:0, width:'100%', height:'100%',
                objectFit:'cover',
                opacity: loaded[song.id] ? 1 : 0,
                transition:'opacity 0.4s, transform 0.4s'
              }"
              class="cover-img" />
            <div v-if="!loaded[song.id]" class="skeleton" style="position:absolute; inset:0;" />
            <div class="play-overlay">
              <div class="play-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>

          <div style="padding:12px 14px 14px;">
  <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ song.title }}</p>
  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:3px;">
    <p style="color:var(--text-secondary); font-size:0.78rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ song.artist }}</p>
    <!-- Tombol Like -->
    <button @click.stop="store.toggleFavorite(song.id)"
      :style="{
        background: 'none', border: 'none', cursor: 'pointer',
        color: store.isFavorite(song.id) ? '#ff4d4d' : 'var(--text-secondary)',
        transition: 'color 0.2s, transform 0.15s',
        padding: '4px',
        fontSize: '1rem',
      }"
      @mousedown="e => e.currentTarget.style.transform='scale(0.85)'"
      @mouseup="e => e.currentTarget.style.transform='scale(1)'">
      {{ store.isFavorite(song.id) ? '❤️' : '🤍' }}
    </button>
  </div>
</div>
        </div>
      </div>
<!--kalau gak ada lagu nya-->
<div v-if="filteredSongs.length === 0"
  style="text-align:center; padding:60px 24px; color:var(--text-secondary);">
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.3; margin-bottom:12px;">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
  <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; color:var(--text-primary);">No songs found</p>
  <p style="margin-top:6px; font-size:0.85rem;">Try searching with different keywords</p>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { store } from '@/stores/appStore.js'

const loaded = reactive({})
const activeSlide = ref(0)
const search = ref('')

const filteredSongs = computed(() => {
  if (!search.value) return store.songs
  return store.songs.filter(s =>
    s.title.toLowerCase().includes(search.value.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.value.toLowerCase())
  )
})
// Featured songs — random 3 lagu setiap kali app dijalankan
const featuredSongs = ref(
  [...store.songs].sort(() => Math.random() - 0.5).slice(0, 3)
)

function nextSlide() {
  activeSlide.value = (activeSlide.value + 1) % featuredSongs.value.length
}
function prevSlide() {
  activeSlide.value = (activeSlide.value - 1 + featuredSongs.value.length) % featuredSongs.value.length
}

// Auto slide setiap 4 detik
let timer = null
onMounted(() => { timer = setInterval(nextSlide, 4000) })
onUnmounted(() => { clearInterval(timer) })
</script>

<style scoped>
.arrow-btn {
  position:absolute; top:50%; transform:translateY(-50%);
  width:36px; height:36px; border-radius:50%;
  background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2);
  color:white; display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:all 0.2s; z-index:10;
}
.arrow-btn:hover { background:var(--accent); border-color:var(--accent); }
.card:hover .cover-img { transform: scale(1.05); }
.play-overlay {
  position:absolute; inset:0;
  display:flex; align-items:flex-end; justify-content:flex-end;
  padding:10px; opacity:0; transition:opacity 0.3s;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
}
.card:hover .play-overlay { opacity:1; }
.play-circle {
  width:48px; height:48px; border-radius:50%;
  background:#1db954;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 20px rgba(29,185,84,0.5);
  transform:translateY(8px); transition:transform 0.2s ease;
}
.card:hover .play-circle { transform: translateY(0); }
</style>
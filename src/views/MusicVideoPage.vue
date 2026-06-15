<template>
 <div style="min-height:100vh; background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 300px);">
    <div style="max-width:1200px; margin:0 auto; padding:40px 24px;">

      <!-- Header -->
      <div class="fade-in" style="margin-bottom:36px;">
        <p style="color:var(--accent); font-size:0.8rem; letter-spacing:3px; text-transform:uppercase; font-weight:600; margin-bottom:8px;">Watch</p>
        <h1 style="font-size:clamp(2rem,5vw,3.5rem); font-weight:800; color:var(--text-primary);">
          Music <span style="color:var(--accent);">Videos</span>
        </h1>
      </div>

      <!-- Search Bar -->
<div class="fade-in-1" style="margin-bottom:24px;">
  <div style="position:relative; max-width:400px;">
    <svg style="position:absolute; left:14px; top:50%; transform:translateY(-50%); pointer-events:none;"
      width="18" height="18" viewBox="0 0 24 24" fill="var(--text-secondary)">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
    <input v-model="search" type="text" placeholder="Search videos or artists..."
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
    <button v-if="search" @click="search = ''"
      style="position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1rem;">
      ✕
    </button>
  </div>
  <p v-if="search" style="color:var(--text-secondary); font-size:0.8rem; margin-top:8px; margin-left:4px;">
    {{ filteredVideos.length }} result{{ filteredVideos.length !== 1 ? 's' : '' }} for "<span style="color:var(--accent);">{{ search }}</span>"
  </p>
</div>
      <!-- SPOTLIGHT -->
      <div class="fade-in-1" style="margin-bottom:48px;">
        <p style="color:var(--text-secondary); font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px;">🎬 Spotlight</p>
        <div style="display:grid; grid-template-columns:1fr 280px; gap:16px;">
          <div @click="$router.push(`/video/${spotlightVideo.id}`)"
            style="position:relative; border-radius:14px; overflow:hidden; cursor:pointer; aspect-ratio:16/9; background:#000;"
            class="spotlight-card">
            <img :src="spotlightVideo.cover" :alt="spotlightVideo.title"
              style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s;" class="spotlight-img"/>
            <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%);" />
            <div style="position:absolute; bottom:0; left:0; right:0; padding:24px;">
              <p style="color:var(--accent); font-size:0.72rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">Featured</p>
              <h3 style="font-size:1.5rem; font-weight:800; color:white; margin-bottom:4px;">{{ spotlightVideo.title }}</h3>
              <p style="color:rgba(255,255,255,0.7);">{{ spotlightVideo.artist }}</p>
            </div>
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);" class="big-play">
              <div style="width:64px; height:64px; border-radius:50%; background:rgba(255,85,0,0.9); display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px rgba(255,85,0,0.5);">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div style="display:flex; flex-direction:column; gap:12px; overflow:hidden;">
            <div v-for="v in sideVideos" :key="v.id"
              @click="$router.push(`/video/${v.id}`)"
              style="display:flex; gap:10px; cursor:pointer; border-radius:10px; padding:8px; transition:background 0.2s;"
              class="side-item">
              <div style="width:90px; height:54px; flex-shrink:0; border-radius:6px; overflow:hidden; background:var(--bg-hover);">
                <img :src="v.cover" :alt="v.title" style="width:100%; height:100%; object-fit:cover;" />
              </div>
              <div style="flex:1; overflow:hidden; display:flex; flex-direction:column; justify-content:center;">
                <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:0.82rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ v.title }}</p>
                <p style="color:var(--text-secondary); font-size:0.72rem; margin-top:2px;">{{ v.artist }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- NETFLIX ROW -->
      <div class="fade-in-2" style="margin-bottom:48px;">
        <p style="color:var(--text-secondary); font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px;">🔥 All Videos</p>
        <div style="display:flex; gap:14px; overflow-x:auto; padding-bottom:12px;" class="scroll-row">
          <div v-for="v in store.videos" :key="v.id"
            @click="$router.push(`/video/${v.id}`)"
            style="flex-shrink:0; width:220px; cursor:pointer; border-radius:10px; overflow:hidden; background:var(--bg-card); border:1px solid var(--border); transition:all 0.25s;"
            class="netflix-card">
            <div style="position:relative; padding-top:56.25%;">
              <img :src="v.cover" :alt="v.title"
                @load="loaded[v.id]=true"
                :style="{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', opacity:loaded[v.id]?1:0, transition:'opacity 0.4s, transform 0.4s' }"
                class="vid-img"/>
              <div v-if="!loaded[v.id]" class="skeleton" style="position:absolute; inset:0;" />
              <div class="vid-overlay">
                <div style="width:40px; height:40px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
            <div style="padding:10px 12px 12px;">
              <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:0.85rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ v.title }}</p>
              <p style="color:var(--text-secondary); font-size:0.75rem; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ v.artist }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- BROWSE — masonry -->
      <div class="fade-in-3">
        <p style="color:var(--text-secondary); font-size:0.78rem; letter-spacing:2px; text-transform:uppercase; margin-bottom:14px;">🎵 Browse</p>
        <div style="columns:3; column-gap:14px;">
          <div v-for="(v, i) in filteredVideos" :key="v.id"
            @click="$router.push(`/video/${v.id}`)"
            style="break-inside:avoid; margin-bottom:14px; cursor:pointer; border-radius:10px; overflow:hidden; background:var(--bg-card); border:1px solid var(--border); transition:all 0.25s;"
            class="masonry-card">
            <div style="position:relative; overflow:hidden;"
              :style="{ paddingTop: masonryRatios[i % masonryRatios.length] }">
              <img :src="v.cover" :alt="v.title"
                style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; transition:transform 0.4s;"
                class="masonry-img"/>
              <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);"/>
              <div style="position:absolute; bottom:0; left:0; right:0; padding:12px;">
                <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:0.85rem; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ v.title }}</p>
                <p style="color:rgba(255,255,255,0.6); font-size:0.72rem; margin-top:2px;">{{ v.artist }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredVideos.length === 0"
  style="text-align:center; padding:60px 24px; color:var(--text-secondary);">
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.3; margin-bottom:12px; display:block; margin-left:auto; margin-right:auto;">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
  <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; color:var(--text-primary);">No videos found</p>
  <p style="margin-top:6px; font-size:0.85rem;">Try searching with different keywords</p>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { store } from '@/stores/appStore.js'

const loaded         = reactive({})
const masonryRatios  = ['75%', '56.25%', '90%', '56.25%', '75%', '100%']
const spotlightVideo = computed(() => store.videos[0])
const sideVideos     = computed(() => store.videos.slice(1, 4))
const search = ref('')
const filteredVideos = computed(() => {
  if (!search.value) return store.videos
  return store.videos.filter(v =>
    v.title.toLowerCase().includes(search.value.toLowerCase()) ||
    v.artist.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
.spotlight-card:hover .spotlight-img { transform: scale(1.03); }
.big-play { opacity:0; transition:opacity 0.3s; }
.spotlight-card:hover .big-play { opacity:1; }
.side-item:hover { background: var(--bg-hover); }
.netflix-card:hover { transform:translateY(-4px); box-shadow:0 12px 30px rgba(0,0,0,0.4); border-color:var(--accent); }
.netflix-card:hover .vid-img { transform:scale(1.05); }
.vid-overlay {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity 0.3s; background:rgba(0,0,0,0.4);
}
.netflix-card:hover .vid-overlay { opacity:1; }
.scroll-row::-webkit-scrollbar { height:4px; }
.scroll-row::-webkit-scrollbar-thumb { background:var(--accent); border-radius:2px; }
.masonry-card:hover .masonry-img { transform:scale(1.05); }
@media (max-width: 768px) {
  .masonry { columns: 2 !important; }
}
</style>
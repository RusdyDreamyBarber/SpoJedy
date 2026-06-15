<template>
  <div :style="{
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)',
    backgroundImage: store.profile.theme === 'dark' 
      ? 'linear-gradient(180deg, #0a0a0f 0%, var(--bg-main) 300px)' 
      : 'linear-gradient(180deg, #f4f4f6 0%, var(--bg-main) 300px)',
    transition: 'background 0.3s, color 0.3s'
  }">
    <div style="max-width:1100px; margin:0 auto; padding:40px 24px;">

      <div class="fade-in" style="margin-bottom:40px;">
        <p style="color:var(--accent); font-size:0.8rem; letter-spacing:3px; text-transform:uppercase; font-weight:600; margin-bottom:8px;">Your Music</p>
        <h1 style="font-size:clamp(2rem,5vw,3.5rem); font-weight:800; color:var(--text-primary);">
          My <span style="color:var(--accent);">Playlists</span>
        </h1>
      </div>

      <div class="card fade-in-1" style="padding:24px; margin-bottom:28px; cursor:pointer;"
        @click="showFavorites = !showFavorites">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="width:56px; height:56px; border-radius:12px; background:linear-gradient(135deg, #ff4d4d, #ff8080); display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
              ❤️
            </div>
            <div>
              <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:1.1rem; color:var(--text-primary);">Liked Songs</p>
              <p style="color:var(--text-secondary); font-size:0.82rem; margin-top:2px;">{{ store.favorites.length }} songs</p>
            </div>
          </div>
          <svg :style="{ transform: showFavorites ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.3s' }"
            width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>

        <div v-if="showFavorites && favoriteSongs.length > 0" style="margin-top:20px; display:flex; flex-direction:column; gap:8px;">
          <div v-for="song in favoriteSongs" :key="song.id"
             @click.stop="$router.push(`/song/${song.id}`)"
            style="display:flex; align-items:center; gap:12px; padding:8px; border-radius:8px; cursor:pointer; transition:background 0.2s;"
            class="song-row">
            <img :src="song.cover" :alt="song.title"
              style="width:44px; height:44px; border-radius:6px; object-fit:cover; flex-shrink:0;" />
            <div style="flex:1; overflow:hidden;">
              <p style="font-family:'Syne',sans-serif; font-weight:600; font-size:0.9rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ song.title }}</p>
              <p style="color:var(--text-secondary); font-size:0.78rem; margin-top:2px;">{{ song.artist }}</p>
            </div>
            <button @click.stop="store.toggleFavorite(song.id)"
              style="background:none; border:none; cursor:pointer; font-size:1rem; padding:4px;">
              ❤️
            </button>
          </div>
        </div>

        <div v-if="showFavorites && favoriteSongs.length === 0"
          style="margin-top:16px; text-align:center; padding:24px; color:var(--text-secondary);">
          <p>No liked songs yet. Like a song to add it here!</p>
          <button @click.stop="$router.push('/')" class="btn-accent" style="margin-top:12px;">Browse Songs</button>
        </div>
      </div>

      <div class="fade-in-2" style="margin-bottom:28px;">
        <div v-if="!showCreate" @click="showCreate = true"
          style="display:flex; align-items:center; gap:12px; padding:16px; border:2px dashed var(--border); border-radius:12px; cursor:pointer; transition:all 0.2s;"
          class="create-btn">
          <div style="width:44px; height:44px; border-radius:10px; background:var(--bg-hover); display:flex; align-items:center; justify-content:center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent)"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </div>
          <p style="font-family:'Syne',sans-serif; font-weight:600; color:var(--text-secondary);">Create New Playlist</p>
        </div>

        <div v-if="showCreate" class="card" style="padding:20px;">
          <p style="font-family:'Syne',sans-serif; font-weight:700; color:var(--text-primary); margin-bottom:14px;">New Playlist</p>
          <div style="display:flex; gap:12px;">
            <input v-model="newPlaylistName" type="text" placeholder="Playlist name..."
              @keyup.enter="createPlaylist"
              :style="{
                flex:1, background:'var(--bg-hover)', border:'1px solid var(--border)',
                borderRadius:'10px', padding:'10px 14px', color:'var(--text-primary)',
                fontSize:'0.9rem', outline:'none', fontFamily:'DM Sans, sans-serif',
              }"
              @focus="e=>e.target.style.borderColor='var(--accent)'"
              @blur="e=>e.target.style.borderColor='var(--border)'"
            />
            <button @click="createPlaylist" class="btn-accent">Create</button>
            <button @click="showCreate=false; newPlaylistName=''"
              style="background:var(--bg-hover); border:1px solid var(--border); color:var(--text-secondary); padding:10px 16px; border-radius:10px; cursor:pointer;">
              Cancel
            </button>
          </div>
          <p v-if="nameError" style="color:#ff6b6b; font-size:0.78rem; margin-top:8px;">{{ nameError }}</p>
        </div>
      </div>

      <div class="fade-in-3">
        <div v-if="store.playlists.length === 0 && !showCreate"
          style="text-align:center; padding:40px; color:var(--text-secondary);">
          <p style="font-size:0.9rem;">No playlists yet. Create one!</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          <div v-for="playlist in store.playlists" :key="playlist.id" class="card" style="padding:0; overflow:hidden;">
            <div style="padding:20px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
              @click="togglePlaylist(playlist.id)">
              <div style="display:flex; align-items:center; gap:16px;">
                <div style="width:56px; height:56px; border-radius:12px; overflow:hidden; background:var(--bg-hover); flex-shrink:0;">
                  <img v-if="store.getPlaylistSongs(playlist.id)[0]"
                    :src="store.getPlaylistSongs(playlist.id)[0].cover"
                    style="width:100%; height:100%; object-fit:cover;" />
                  <div v-else style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                </div>
                <div>
                  <div v-if="editingId !== playlist.id" style="display:flex; align-items:center; gap:8px;">
                    <p style="font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; color:var(--text-primary);">{{ playlist.name }}</p>
                    <button @click.stop="startEdit(playlist)"
                      style="background:none; border:none; cursor:pointer; color:var(--text-secondary); padding:2px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </button>
                  </div>
                  <div v-else style="display:flex; align-items:center; gap:8px;" @click.stop>
                    <input v-model="editName" type="text"
                      @keyup.enter="saveEdit(playlist.id)"
                      :style="{
                        background:'var(--bg-hover)', border:'1px solid var(--accent)',
                        borderRadius:'6px', padding:'4px 8px', color:'var(--text-primary)',
                        fontSize:'0.9rem', outline:'none', fontFamily:'DM Sans, sans-serif',
                      }" />
                    <button @click.stop="saveEdit(playlist.id)" class="btn-accent" style="padding:4px 10px; font-size:0.8rem;">Save</button>
                  </div>
                  <p style="color:var(--text-secondary); font-size:0.78rem; margin-top:2px;">{{ playlist.songs.length }} songs · {{ playlist.createdAt }}</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <button @click.stop="store.deletePlaylist(playlist.id)"
                  style="background:none; border:none; cursor:pointer; color:var(--text-secondary); padding:4px; transition:color 0.2s;"
                  @mouseover="e=>e.currentTarget.style.color='#ff4d4d'"
                  @mouseleave="e=>e.currentTarget.style.color='var(--text-secondary)'">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
                <svg :style="{ transform: openPlaylistId === playlist.id ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.3s' }"
                  width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>

            <div v-if="openPlaylistId === playlist.id">
              <div v-if="store.getPlaylistSongs(playlist.id).length === 0"
                style="padding:16px 20px 20px; color:var(--text-secondary); font-size:0.85rem; text-align:center;">
                No songs yet.
                <button @click="$router.push('/')" class="btn-accent" style="margin-left:8px; padding:6px 14px; font-size:0.78rem;">Add Songs</button>
              </div>
              <div v-for="song in store.getPlaylistSongs(playlist.id)" :key="song.id"
                style="display:flex; align-items:center; gap:12px; padding:10px 20px; border-top:1px solid var(--border); cursor:pointer; transition:background 0.2s;"
                class="song-row"
                @click="playSong(playlist.id, song.id)">
                <img :src="song.cover" :alt="song.title"
                  style="width:40px; height:40px; border-radius:6px; object-fit:cover; flex-shrink:0;" />
                <div style="flex:1; overflow:hidden;">
                  <p style="font-family:'Syne',sans-serif; font-weight:600; font-size:0.88rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ song.title }}</p>
                  <p style="color:var(--text-secondary); font-size:0.75rem; margin-top:2px;">{{ song.artist }}</p>
                </div>
                <button @click.stop="store.removeSongFromPlaylist(playlist.id, song.id)"
                  style="background:none; border:none; cursor:pointer; color:var(--text-secondary); padding:4px; transition:color 0.2s;"
                  @mouseover="e=>e.currentTarget.style.color='#ff4d4d'"
                  @mouseleave="e=>e.currentTarget.style.color='var(--text-secondary)'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'  
import { store } from '@/stores/appStore.js'

const router = useRouter()  

const showFavorites   = ref(false)
const showCreate      = ref(false)
const newPlaylistName = ref('')
const nameError       = ref('')
const openPlaylistId  = ref(null)
const editingId       = ref(null)
const editName        = ref('')

function playSong(playlistId, songId) {
  store.currentPlaylistId = playlistId  // set playlist aktif
  router.push(`/song/${songId}`)
}

// Liked songs
const favoriteSongs = computed(() =>
  store.favorites.map(id => store.getSongById(id)).filter(Boolean)
)

function createPlaylist() {
  if (!newPlaylistName.value.trim()) {
    nameError.value = 'Playlist name cannot be empty!'
    return
  }
  store.createPlaylist(newPlaylistName.value.trim())
  newPlaylistName.value = ''
  showCreate.value = false
  nameError.value = ''
}

function togglePlaylist(id) {
  openPlaylistId.value = openPlaylistId.value === id ? null : id
}

function startEdit(playlist) {
  editingId.value = playlist.id
  editName.value  = playlist.name
}

function saveEdit(id) {
  if (!editName.value.trim()) return
  const playlist = store.playlists.find(p => p.id === id)
  if (playlist) {
    playlist.name = editName.value.trim()
    store.savePlaylists()
  }
  editingId.value = null
}
</script>

<style scoped>
.song-row:hover { background: var(--bg-hover); }
.create-btn:hover { border-color: var(--accent); background: var(--bg-hover); }
</style>
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import SongDetailPage from '@/views/SongDetailPage.vue'
import MusicVideoPage from '@/views/MusicVideoPage.vue'
import MusicVideoDetailPage from '@/views/MusicVideoDetailPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import PlaylistPage from '@/views/PlaylistPage.vue'
export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/',          name: 'Home',        component: HomePage },
    { path: '/song/:id',  name: 'SongDetail',  component: SongDetailPage },
    { path: '/videos',    name: 'Videos',      component: MusicVideoPage },
    { path: '/video/:id', name: 'VideoDetail', component: MusicVideoDetailPage },
    { path: '/profile',   name: 'Profile',     component: ProfilePage },
    { path: '/playlist', name: 'Playlist', component: PlaylistPage },
    { path: '/profile',  name: 'Profile',  component: ProfilePage },
  ],
})
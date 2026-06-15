import { reactive } from 'vue'

const defaultSongs = [
  {
    id: 1,
    title: 'Starlight',
    artist: 'Ultra Chotokkyu',
    cover: 'https://res.cloudinary.com/dxptxrrgh/image/upload/v1780382062/Cover1_eubqcl.png',
    audio: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382070/STARLIGHT_Ultraman_Ginga_Ending_Lyrics_ktye2g.mp4',
    videoId: 1,
  },
  {
    id: 2,
    title: 'livedevil',
    artist: 'Da-iCE ft 木村昴 ',
    cover: 'https://res.cloudinary.com/dxptxrrgh/image/upload/v1780382004/Cover2_l2qdje.png',
    audio: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382084/LiveDevil_Da-iCE_feat._%E6%9C%A8%E6%9D%91%E6%98%B4_ngzicm.mp4',
    videoId: 2,
  },
  {
    
  id: 3,
  title: 'Arteri',
  artist: 'Feast',
  cover: 'https://i.scdn.co/image/ab67616d00001e0242a3ddf2017cbcb3b2a2e9d1',
  audio: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382307/Feast_-_Arteri_pjccsa.mp3',
  videoId: 3,

  },
  {
    id: 4,
    title: 'Paper Plane',
    artist: 'Aemeath',
    cover: 'https://images.genius.com/39b7958c2a693be9652bb98c075cd02f.1000x1000x1.png',
    audio: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382097/paper-plane_rcweli.mp4',
    videoId: 4,
  },
  {
   id: 5,
    title: 'Chasing Daylight',
    artist: 'Wuthering Waves - Topic',
    cover: 'https://res.cloudinary.com/dxptxrrgh/image/upload/v1780382057/Cover5_vxxjxn.png',
    audio: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382224/Chasing_Daylight_fbiemv.mp4',
    videoId: 5,
  },
  {
   id: 6,
    title: 'Everything U Are',
    artist: 'Hindia',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT13zMpYy55f-L8o6ZIBKbLhFtC6-bnsufDuw&s',
    audio: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382330/Everything_u_are_yd4fn4.mp3',
    videoId: 6,
  },
]

const defaultVideos = [
  {
    id: 1,
    title: 'Starlight',
    artist: 'Ultra Chotokkyu',
    cover: 'https://res.cloudinary.com/dxptxrrgh/image/upload/v1780382062/Cover1_eubqcl.png',
    videoUrl: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382319/starlight_bdplxx.mp4',
    songId: 1,
  },
  {
    id: 2,
    title: 'liveDevil',
    artist: 'Da-iCE ft 木村昴 ',
    cover: 'https://i.ytimg.com/vi/I1WBg0R-BYU/maxresdefault.jpg',
    videoUrl: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382301/livedevil_x4zcph.mp4',
    songId: 2,
  },
  {
   id: 3,
    title: 'Arteri',
    artist: 'Feast',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3naKkiNwV44bCxG6JXxBO0iwuEWKg7VYMQ&s',
    videoUrl: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382371/arteri_wrkgil.mp4',
    songId: 3,
  },
  {
    id: 4,
    title: 'Paper Plane',
    artist: 'Wuthering Waves - Topic',
    cover: 'https://i.ytimg.com/vi/lla6KQIXGKg/maxresdefault.jpg',
    videoUrl: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382271/paper-plane_xfylms.mp4',
    songId: 4,
  },
  {
    id: 5,
    title: 'Chasing Daylight',
    artist: 'Wuthering Waves - Topic',
    cover: 'https://res.cloudinary.com/dxptxrrgh/image/upload/v1780382057/Cover5_vxxjxn.png',
    videoUrl: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382333/chasing-daylight_nqhfp4.mp4',
    songId: 5,
  },
  {
    id: 6,
    title: 'Everything U Are',
    artist: 'Hindia',
    cover: 'https://lpmneraca.com/wp-content/uploads/2025/05/1b3eb1d6-1f05-41b0-b144-1287f10be744.jpg',
    videoUrl: 'https://res.cloudinary.com/dxptxrrgh/video/upload/v1780382408/Everything-u-are_kdbspw.mp4',
    songId: 6,
  },
]


const saved = JSON.parse(localStorage.getItem('spojedy_profile') || 'null')

export const store = reactive({
  songs: defaultSongs,
  videos: defaultVideos,
  profile: {
    username:     saved?.username     || 'Guest User',
    profileImage: saved?.profileImage || null,
    theme:        saved?.theme        || 'dark',
  },
  getSongById(id)  { return defaultSongs.find(s => s.id === Number(id)) },
  getVideoById(id) { return defaultVideos.find(v => v.id === Number(id)) },
  getNextSong(id) {
    const i = defaultSongs.findIndex(s => s.id === Number(id))
    return defaultSongs[(i + 1) % defaultSongs.length]
  },
  getPrevSong(id) {
    const i = defaultSongs.findIndex(s => s.id === Number(id))
    return defaultSongs[(i - 1 + defaultSongs.length) % defaultSongs.length]
  },
  getNextVideo(id) {
    const i = defaultVideos.findIndex(v => v.id === Number(id))
    return defaultVideos[(i + 1) % defaultVideos.length]
  },
  getPrevVideo(id) {
    const i = defaultVideos.findIndex(v => v.id === Number(id))
    return defaultVideos[(i - 1 + defaultVideos.length) % defaultVideos.length]
  },
  saveProfile() {
    localStorage.setItem('spojedy_profile', JSON.stringify(this.profile))
  },
  setTheme(t) {
    this.profile.theme = t
    document.documentElement.setAttribute('data-theme', t)
    this.saveProfile()
  },
  setUsername(name) { this.profile.username = name; this.saveProfile() },
  setProfileImage(blob) { this.profile.profileImage = blob; this.saveProfile() },
})

document.documentElement.setAttribute('data-theme', store.profile.theme)
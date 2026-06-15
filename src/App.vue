<template>
  <div :data-theme="store.profile.theme"
    style="min-height:100vh; background-color:var(--bg-primary); color:var(--text-primary);">
    <NavBar />
    <main style="padding-top:70px;">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { store } from '@/stores/appStore.js'
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
<script setup lang="ts">
import ProfileView from '@/views/ProfileView.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
</script>

<template>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="app-header">
    <div class="app-header__inner">
      <img src="@/assets/brand/htw-logo.svg" alt="HTW Berlin" class="app-header__logo" width="132" height="40" />
      <span class="app-header__portal">Hochschulportal</span>
    </div>
  </header>
  <main id="main" class="app-main">
    <ProfileView />
  </main>
  <ToastHost />
</template>

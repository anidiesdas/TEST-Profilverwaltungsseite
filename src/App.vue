<script setup lang="ts">
import ProfileView from '@/views/ProfileView.vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
</script>

<template>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="app-header">
    <div class="app-header__inner">
      <a class="app-header__brand" href="/" aria-label="HTW Berlin Hochschulportal – Startseite">
        <BrandLogo :height="32" />
        <span class="app-header__divider" aria-hidden="true" />
        <span class="app-header__portal">Hochschulportal</span>
      </a>
      <nav class="app-header__nav" aria-label="Hauptnavigation">
        <span class="app-header__link is-disabled" title="Nicht Teil dieses Übungsprojekts">Lehrveranstaltungen</span>
        <span class="app-header__link is-disabled" title="Nicht Teil dieses Übungsprojekts">Prüfungen</span>
        <a href="#main" class="app-header__link is-active" aria-current="page">Mein Profil</a>
      </nav>
    </div>
  </header>
  <main id="main" class="app-main" tabindex="-1">
    <ProfileView />
  </main>
  <footer class="app-footer">
    <span>HTW Berlin · Hochschule für Technik und Wirtschaft Berlin</span>
    <span>Übungsprojekt – fiktive Daten</span>
  </footer>
  <ToastHost />
</template>

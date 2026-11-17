<script setup lang="ts">
/** Demo-Komponente für die Stylelint-Präsentation – Styles in src/styles/notice.css */
</script>

<template>
  <aside class="deadline-notice" aria-labelledby="deadline-notice-title">
    <span class="deadline-notice__icon" aria-hidden="true">!</span>
    <div class="deadline-notice__body">
      <h2 id="deadline-notice-title" class="deadline-notice__title">Rückmeldung zum Sommersemester 2027</h2>
      <p class="deadline-notice__text">Bitte überweise den Semesterbeitrag bis zum 15. Februar 2027.</p>
    </div>
    <button type="button" class="deadline-notice__action">Zahlungsdaten anzeigen</button>
  </aside>
</template>

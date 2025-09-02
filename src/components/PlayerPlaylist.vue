<template>
  <div
    v-if="playlist.length"
    class="mw:absolute mw:right-8 mw:bottom-full mw:z-40 mw:inline-block mw:w-2xs mw:border mw:border-mw-primary-border mw:bg-mw-primary mw:!transition-all mw:sm:right-40 mw:tablet:right-48"
    :class="{
      'mw:!-bottom-4 mw:sm:!-bottom-24 mw:tablet:!-bottom-44': !showPlaylistPopup,
    }"
  >
    <div
      ref="el"
      class="mw:flex mw:h-14 mw:items-center mw:justify-between mw:gap-4 mw:bg-mw-primary-dark/75 mw:px-4"
    >
      <div class="mw:space-x-2 mw:truncate mw:text-xs">
        <div class="mw:text-mw-primary-active">Next up:</div>
        <div class="animate-marquee mw:whitespace-nowrap">
          <span class="mw:px-2 mw:font-medium">{{ returnNextTrack?.title }}</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="mw:flex mw:cursor-pointer mw:items-center mw:justify-center mw:hover:text-mw-primary-hover"
          aria-label="Minimize playlist popup"
          @click="showPlaylistPopup = !showPlaylistPopup"
        >
          <IconCollapse class="mw:size-6" v-if="showPlaylistPopup" />
          <IconExpand class="mw:size-6" v-else />
        </button>
      </div>
    </div>
    <ul class="scrollbar mw:max-h-62 mw:overflow-x-hidden mw:overflow-y-auto">
      <li
        v-for="track in playlist"
        :key="track.id"
        :class="{
          'mw:sticky mw:bottom-0 mw:bg-mw-secondary/50': returnTrack?.id === track.id,
        }"
      >
        <button
          class="mw:group mw:flex mw:w-full mw:cursor-pointer mw:items-center mw:gap-2 mw:px-2 mw:py-1 mw:hover:bg-mw-secondary/50"
          :class="{
            'mw:sticky mw:bottom-0 mw:bg-mw-secondary/50': returnTrack?.id === track.id,
          }"
          type="button"
          :aria-label="isTrackPlaying(track.id) ? 'Pause' : 'Play'"
          :aria-pressed="isTrackPlaying(track.id) ? 'true' : 'false'"
          @click.stop.prevent="onPlayAsPlaylist(playlist, track)"
        >
          <span class="mw:relative mw:block">
            <img
              class="mw:size-12 mw:rounded mw:border mw:border-mw-primary-border mw:bg-mw-secondary mw:object-cover mw:p-0.5"
              :src="track.artwork"
              :alt="track.title"
              loading="lazy"
            />
            <span
              class="mw:absolute mw:inset-0 mw:flex mw:items-center mw:justify-center mw:group-hover:bg-mw-primary/50"
            >
              <span
                class="mw:group-focus:text-primary-hover mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:group-hover:text-mw-primary-hover"
              >
                <IconPlay class="mw:size-10" v-if="!isTrackPlaying(track.id)" />
                <IconPause class="mw:size-10" v-else />
              </span>
            </span>
          </span>
          <span class="mw:block mw:min-w-0 mw:flex-1 mw:text-left">
            <span class="mw:block mw:truncate mw:text-sm mw:font-semibold">
              {{ track.title }}
            </span>
            <span class="mw:block mw:truncate mw:text-xs mw:text-mw-secondary-typography">{{
              track.artist
            }}</span>
          </span>
          <span class="mw:block" v-if="isTrackPlaying(track.id)">
            <IconLoadingWaveform class="mw:size-4" />
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import IconLoadingWaveform from '../components/Icons/IconLoadingWaveform.vue'
import { ref } from 'vue'
import IconPlay from '../components/Icons/IconPlay.vue'
import IconPause from '../components/Icons/IconPause.vue'
import usePlayer from '../composables/usePlayer'
import IconExpand from '../components/Icons/IconExpand.vue'
import IconCollapse from '../components/Icons/IconCollapse.vue'

const showPlaylistPopup = ref(true)

const { onPlayAsPlaylist, isTrackPlaying, playlist, returnTrack, returnNextTrack } = usePlayer()
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 6s ease-in-out infinite;
}

.scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: var(--scroll-bar-shadow);
  background-color: var(--scroll-bar-background);
}

.scrollbar::-webkit-scrollbar {
  width: var(--scroll-bar-width);
  background-color: var(--scroll-bar-background-light);
}

.scrollbar::-webkit-scrollbar-thumb {
  -webkit-box-shadow: var(--scroll-bar-shadow);
  background-color: var(--scroll-bar-slider);
}
</style>

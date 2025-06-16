<template>
  <div
    v-if="playlist.length"
    class="absolute right-8 bottom-full z-40 inline-block w-2xs border border-primary-border bg-primary !transition-all sm:right-40 tablet:right-48"
    :class="{
      '!-bottom-4 sm:!-bottom-24 tablet:!-bottom-44': !showPlaylistPopup,
    }"
  >
    <div ref="el" class="flex h-14 items-center justify-between gap-4 bg-primary-dark/75 px-4">
      <div class="space-x-2 truncate text-xs">
        <div class="text-primary-active">Next up:</div>
        <div class="animate-marquee whitespace-nowrap">
          <span class="px-2 font-medium">{{ returnNextTrack?.title }}</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center hover:text-primary-hover"
          aria-label="Minimize playlist popup"
          @click="showPlaylistPopup = !showPlaylistPopup"
        >
          <IconCollapse class="size-6" v-if="showPlaylistPopup" />
          <IconExpand class="size-6" v-else />
        </button>
      </div>
    </div>
    <ul class="scrollbar max-h-62 overflow-x-hidden overflow-y-auto">
      <li
        v-for="track in playlist"
        :key="track.id"
        :class="{
          'sticky bottom-0 bg-secondary/50': returnTrack?.id === track.id,
        }"
      >
        <button
          class="group flex w-full cursor-pointer items-center gap-2 px-2 py-1 hover:bg-secondary/50"
          :class="{
            'sticky bottom-0 bg-secondary/50': returnTrack?.id === track.id,
          }"
          type="button"
          :aria-label="isTrackPlaying(track.id) ? 'Pause' : 'Play'"
          :aria-pressed="isTrackPlaying(track.id) ? 'true' : 'false'"
          @click.stop.prevent="onPlayAsPlaylist(playlist, track)"
        >
          <span class="relative block">
            <img
              class="size-12 rounded border border-primary-border bg-secondary object-cover p-0.5"
              :src="track.artwork"
              :alt="track.title"
              loading="lazy"
            />
            <span
              class="absolute inset-0 flex items-center justify-center group-hover:bg-primary/50"
            >
              <span
                class="flex size-10 cursor-pointer items-center justify-center rounded p-2 group-hover:text-primary-hover group-focus:text-primary-hover"
              >
                <IconPlay v-if="!isTrackPlaying(track.id)" />
                <IconPause v-else />
              </span>
            </span>
          </span>
          <span class="block min-w-0 flex-1 text-left">
            <span class="block truncate text-sm font-semibold">
              {{ track.title }}
            </span>
            <span class="block truncate text-xs text-secondary-typography">{{ track.artist }}</span>
          </span>
          <span class="block" v-if="isTrackPlaying(track.id)">
            <IconLoadingWaveform class="size-4" />
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

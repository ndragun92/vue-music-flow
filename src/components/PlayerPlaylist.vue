<template>
  <div
    v-if="playlist.length"
    class="border-mw-primary-border bg-mw-primary absolute right-8 bottom-full z-40 inline-block w-2xs border !transition-all sm:right-40 tablet:right-48"
    :class="{
      '!-bottom-4 sm:!-bottom-24 tablet:!-bottom-44': !showPlaylistPopup,
    }"
  >
    <div ref="el" class="bg-mw-primary-dark/75 flex h-14 items-center justify-between gap-4 px-4">
      <div class="space-x-2 truncate text-xs">
        <div class="text-mw-primary-active">Next up:</div>
        <div class="animate-marquee whitespace-nowrap">
          <span class="px-2 font-medium">{{ returnNextTrack?.title }}</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="hover:text-mw-primary-hover flex cursor-pointer items-center justify-center"
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
          'bg-mw-secondary/50 sticky bottom-0': returnTrack?.id === track.id,
        }"
      >
        <button
          class="group hover:bg-mw-secondary/50 flex w-full cursor-pointer items-center gap-2 px-2 py-1"
          :class="{
            'bg-mw-secondary/50 sticky bottom-0': returnTrack?.id === track.id,
          }"
          type="button"
          :aria-label="isTrackPlaying(track.id) ? 'Pause' : 'Play'"
          :aria-pressed="isTrackPlaying(track.id) ? 'true' : 'false'"
          @click.stop.prevent="onPlayAsPlaylist(playlist, track)"
        >
          <span class="relative block">
            <img
              class="border-mw-primary-border bg-mw-secondary size-12 rounded border object-cover p-0.5"
              :src="track.artwork"
              :alt="track.title"
              loading="lazy"
            />
            <span
              class="group-hover:bg-mw-primary/50 absolute inset-0 flex items-center justify-center"
            >
              <span
                class="group-hover:text-mw-primary-hover flex size-10 cursor-pointer items-center justify-center rounded p-2 group-focus:text-primary-hover"
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
            <span class="text-mw-secondary-typography block truncate text-xs">{{
              track.artist
            }}</span>
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

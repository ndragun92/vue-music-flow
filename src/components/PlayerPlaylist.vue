<template>
  <div
    v-if="playlist.length"
    class="absolute right-8 bottom-full z-40 inline-block w-2xs border border-neutral-900 bg-neutral-800 !transition-all sm:right-40 md:right-48"
    :class="{
      '!-bottom-4 sm:!-bottom-24 md:!-bottom-44': !showPlaylistPopup,
    }"
  >
    <div ref="el" class="flex h-14 items-center justify-between gap-4 bg-neutral-950/72 px-4">
      <div class="space-x-2 truncate text-xs">
        <div class="text-orange-300">Next up:</div>
        <div class="animate-marquee whitespace-nowrap">
          <span class="px-2 font-medium">{{ returnNextTrack?.title }}</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center hover:text-red-400"
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
        class="flex w-full cursor-pointer items-center gap-2 px-2 py-1 hover:bg-neutral-700/50"
        :class="{
          'sticky bottom-0 bg-neutral-700/50': returnTrack?.id === track.id,
        }"
      >
        <div class="group relative">
          <img
            class="size-12 rounded border border-neutral-900 bg-neutral-700 object-cover p-0.5"
            :src="track.artwork"
            :alt="track.title"
            loading="lazy"
          />
          <div
            class="absolute inset-0 flex items-center justify-center group-hover:bg-neutral-900/50"
          >
            <button
              :style="{ gridArea: 'controls' }"
              class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-orange-300"
              type="button"
              :aria-label="isTrackPlaying(track.id) ? 'Pause' : 'Play'"
              :aria-pressed="isTrackPlaying(track.id) ? 'true' : 'false'"
              @click.stop.prevent="onPlayAsPlaylist(playlist, track)"
            >
              <IconPlay v-if="!isTrackPlaying(track.id)" />
              <IconPause v-else />
            </button>
          </div>
        </div>
        <div class="min-w-0 flex-1 text-left">
          <div class="truncate text-sm font-semibold">
            {{ track.title }}
          </div>
          <div class="truncate text-xs text-neutral-400">{{ track.artist }}</div>
        </div>
        <div v-if="isTrackPlaying(track.id)">
          <IconLoadingWaveform class="size-4" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import IconLoadingWaveform from '../components/Icons/IconLoadingWaveform.vue'
import { ref } from 'vue'
import type { TPlayerTrack } from '../composables/usePlayer'
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
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: oklch(0.269 0 0);
}

.scrollbar::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.scrollbar::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: oklch(0.205 0 0);
}
</style>

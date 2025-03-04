<template>
  <div
    v-if="showPlaylistPopup"
    :style="style"
    class="fixed z-40 inline-block w-2xs border border-neutral-900 bg-neutral-800"
  >
    <div
      ref="el"
      class="flex h-14 cursor-move items-center justify-between gap-4 bg-neutral-950/72 pr-2 pl-4"
    >
      <div class="space-x-2 truncate text-xs">
        <div class="text-orange-300">Next up:</div>
        <div class="animate-marquee whitespace-nowrap">
          <span class="px-2 font-medium">{{ playlist?.[1]?.title }} and end of life</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="flex cursor-pointer items-center justify-center hover:text-red-400"
          aria-label="Close playlist popup"
          @click="showPlaylistPopup = false"
        >
          <IconClose class="size-8" />
        </button>
      </div>
    </div>
    <ul class="scrollbar max-h-62 overflow-x-hidden overflow-y-auto">
      <li v-for="track in playlist" :key="track.id">
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-2 px-2 py-1 hover:bg-neutral-700/50"
          :class="{
            'bg-neutral-700/50': isTrackPlaying(track.id),
          }"
        >
          <span class="relative">
            <img
              class="size-12 rounded border border-neutral-900 bg-neutral-700 object-cover p-0.5"
              :src="track.artwork"
              :alt="track.title"
              loading="lazy"
            />
            <span class="absolute inset-0 flex items-center justify-center bg-neutral-900/50">
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
            </span>
          </span>
          <span class="min-w-0 flex-1 text-left">
            <span class="block truncate text-sm font-semibold">
              {{ track.title }}
            </span>
            <span class="block truncate text-xs text-gray-400">{{ track.artist }}</span>
          </span>
          <span v-if="isTrackPlaying(track.id)">
            <IconLoadingWaveform class="size-4" />
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import IconLoadingWaveform from '../components/Icons/IconLoadingWaveform.vue'
import { ref, useTemplateRef } from 'vue'
import type { TPlayerTrack } from '../composables/usePlayer'
import usePlayerPlaylist from '../composables/usePlayerPlaylist'
import IconPlay from '../components/Icons/IconPlay.vue'
import IconPause from '../components/Icons/IconPause.vue'
import usePlayer from '../composables/usePlayer'
import IconClose from '../components/Icons/IconClose.vue'
import { useDraggable, useLocalStorage, watchDebounced } from '@vueuse/core'

const showPlaylistPopup = ref(true)

const { onPlayAsPlaylist, isTrackPlaying } = usePlayer()

const { playlist } = usePlayerPlaylist()

const windowHeight = window.innerHeight // 306
const windowWidth = window.innerWidth
let storageSuffix = 'desktop'
const initialXPosition = windowWidth - 326
let initialYPosition = 0

if (windowWidth < 480) {
  initialYPosition += 240
  storageSuffix = 'mobile'
} else if (windowWidth < 768) {
  initialYPosition += 160
  storageSuffix = 'tablet'
} else {
  initialYPosition += 80
}

initialYPosition = windowHeight - (306 + initialYPosition)

const el = useTemplateRef<HTMLElement>('el')
const xPosition = useLocalStorage(`play:xPosition:${storageSuffix}`, initialXPosition)
const yPosition = useLocalStorage(`play:yPosition:${storageSuffix}`, initialYPosition)

// TODO: Check if off screen and correct position in that case
const { x, y, style } = useDraggable(el, {
  initialValue: { x: xPosition.value, y: yPosition.value },
})

watchDebounced(
  x,
  (_x) => {
    xPosition.value = _x
  },
  {
    debounce: 250,
  },
)

watchDebounced(
  y,
  (_y) => {
    yPosition.value = _y
  },
  {
    debounce: 250,
  },
)

const tracks = ref<TPlayerTrack[]>([])
fetch('/data.json')
  .then((response) => response.json())
  .then((data) => (tracks.value = data))
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
  animation: marquee 10s ease-in-out infinite;
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

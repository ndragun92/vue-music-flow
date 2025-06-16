<template>
  <main>
    <h1 class="mw:bg-neutral-950 mw:p-4 mw:text-3xl">Playground</h1>
    <div>
      <ul class="mw:space-y-4 mw:bg-neutral-800 mw:p-8">
        <li class="mw:mb-6 mw:font-semibold mw:text-orange-400">Play single track example</li>
        <li v-for="track in tracks" :key="track.id" class="mw:flex mw:items-center mw:gap-4">
          <button
            class="mw:flex mw:cursor-pointer mw:items-center mw:justify-center mw:hover:text-orange-500"
            type="button"
            @click="onPlaySingleTrack(track)"
          >
            <IconPlay class="mw:size-6" v-if="!isTrackPlaying(track.id)" />
            <IconPause class="mw:size-6" v-else />
          </button>
          <span>{{ track.title }}</span>
        </li>
      </ul>
      <hr class="mw:border-neutral-600" />
      <ul class="mw:space-y-4 mw:bg-neutral-800 mw:p-8">
        <li class="mw:mb-6 mw:font-semibold mw:text-orange-400">Play track as playlist example</li>
        <li v-for="track in tracks" :key="track.id" class="mw:flex mw:items-center mw:gap-4">
          <button
            class="mw:flex mw:cursor-pointer mw:items-center mw:justify-center mw:hover:text-orange-500"
            type="button"
            @click="onPlayAsPlaylist(tracks, track)"
          >
            <IconPlay class="mw:size-6" v-if="!isTrackPlaying(track.id)" />
            <IconPause class="mw:size-6" v-else />
          </button>
          <span>{{ track.title }}</span>
        </li>
      </ul>
    </div>
    <AudioPlayer
      :options="{
        // waveColor: '#ffffff',
        // progressColor: '#ffa045',
        // height: 50,
        autoplay: true,
      }"
    >
      <template #actions="{ track }">
        <button
          type="button"
          class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:hover:text-red-500"
          aria-label="Mark as favorite"
          @click="onMarkTrackAsFavorite(track)"
        >
          <IconHeart />
        </button>
      </template>
    </AudioPlayer>
  </main>
</template>

<script setup lang="ts">
import AudioPlayer from './components/AudioPlayer.vue'
import usePlayer, { type TPlayerTrack } from './composables/usePlayer'
import { ref } from 'vue'
import IconHeart from './components/Icons/IconHeart.vue'
import IconPlay from './components/Icons/IconPlay.vue'
import IconPause from './components/Icons/IconPause.vue'

defineOptions({
  name: 'PagePlayground',
})

const { isTrackPlaying, onPlaySingleTrack, onPlayAsPlaylist } = usePlayer()

const onMarkTrackAsFavorite = (track: TPlayerTrack | null) => {
  console.log(track)
  alert(`Market track ${track?.title} as favorite`)
}

const tracks = ref<TPlayerTrack[]>([])
fetch('/data.json')
  .then((response) => response.json())
  .then((data) => (tracks.value = data))
</script>

<style>
body {
  background: #181818;
  color: #ffffff;
}
</style>

<template>
  <main>
    <h1 class="bg-neutral-950 p-4 text-3xl">Playground</h1>
    <div>
      <ul class="space-y-4 bg-neutral-800 p-8">
        <li class="mb-6 font-semibold text-orange-400">Play single track example</li>
        <li v-for="track in tracks" :key="track.id" class="flex items-center gap-4">
          <button
            class="flex cursor-pointer items-center justify-center hover:text-orange-500"
            type="button"
            @click="onPlaySingleTrack(track)"
          >
            <IconPlay class="size-6" v-if="!isTrackPlaying(track.id)" />
            <IconPause class="size-6" v-else />
          </button>
          <span>{{ track.title }}</span>
        </li>
      </ul>
      <hr class="border-neutral-600" />
      <ul class="space-y-4 bg-neutral-800 p-8">
        <li class="mb-6 font-semibold text-orange-400">Play track as playlist example</li>
        <li v-for="track in tracks" :key="track.id" class="flex items-center gap-4">
          <button
            class="flex cursor-pointer items-center justify-center hover:text-orange-500"
            type="button"
            @click="onPlayAsPlaylist(tracks, track)"
          >
            <IconPlay class="size-6" v-if="!isTrackPlaying(track.id)" />
            <IconPause class="size-6" v-else />
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
          class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-red-500"
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

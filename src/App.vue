<template>
  <main>
    <h1>Tracks</h1>
    <div>
      <button type="button" @click="onPlayAsPlaylist(tracks)">Play all tracks</button>
    </div>
    <div>
      <ul>
        <li v-for="track in tracks" :key="track.id">
          <button
            class="cursor-pointer hover:text-red-500"
            type="button"
            @click="onPlaySingleTrack(track)"
          >
            {{ isTrackPlaying(track.id) ? 'Pause' : 'Play' }}
          </button>
          {{ track.title }}
        </li>
      </ul>
      <hr />
      <ul>
        <li v-for="track in tracks" :key="track.id">
          <button
            class="cursor-pointer hover:text-red-500"
            type="button"
            @click="onPlayAsPlaylist(tracks, track)"
          >
            {{ isTrackPlaying(track.id) ? 'Pause' : 'Play' }}
          </button>
          {{ track.title }}
        </li>
      </ul>
    </div>
    <hr />
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

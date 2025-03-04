<template>
  <div
    class="fixed right-0 bottom-0 left-0 z-40 text-white"
    :class="{
      'pointer-events-none opacity-0': !audioSource,
      'opacity-100 transition-opacity duration-700': audioSource,
    }"
  >
    <PlayerPlaylist
      v-if="!props.hidePlaylistPopup"
      :class="{
        'pointer-events-none opacity-0': !audioSource,
        'opacity-100 duration-700': audioSource,
      }"
    />
    <div
      class="relative z-50 grid h-60 min-w-72 items-center gap-x-2 border-t border-neutral-900 bg-neutral-800 px-2 whitespace-nowrap text-white sm:h-40 md:h-20 md:gap-x-4"
      :class="[returnGrid]"
    >
      <div
        :style="{
          gridArea: 'image',
        }"
      >
        <div v-if="returnTrack?.artwork" class="p-1.5">
          <img
            class="size-14 rounded border border-neutral-900 bg-neutral-700 object-cover p-0.5"
            :key="returnTrack?.artwork"
            :src="returnTrack?.artwork"
            :alt="returnTrack?.title"
            loading="lazy"
          />
        </div>
      </div>
      <div
        class="md:w-80 md:max-w-[initial]"
        :style="{
          gridArea: 'metadata',
        }"
      >
        <h3 class="truncate font-semibold">
          {{ returnTrack?.title }}
        </h3>
        <h4 class="truncate text-sm text-gray-400">{{ returnTrack?.artist }}</h4>
      </div>
      <slot name="controls" v-bind="{ togglePlayback, isPlaying }">
        <div class="flex items-center gap-1" :style="{ gridArea: 'controls' }">
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-orange-400"
            :class="{
              'text-orange-300': shuffle,
            }"
            type="button"
            aria-label="Toggle shuffle"
            @click="onToggleShuffle"
          >
            <IconShuffle />
          </button>
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-orange-300"
            type="button"
            aria-label="Play previous track"
            @click="onPlayPreviousTrack"
          >
            <IconPrevious />
          </button>
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-orange-300"
            type="button"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
            :aria-pressed="isPlaying ? 'true' : 'false'"
            @click.stop.prevent="togglePlayback"
          >
            <IconPlay v-if="!isPlaying" />
            <IconPause v-else />
          </button>
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-orange-300"
            type="button"
            aria-label="Play next track"
            @click="onPlayNextTrack"
          >
            <IconNext />
          </button>
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 text-neutral-500 hover:text-orange-400"
            :class="{
              '!text-orange-300': ['all', 'single'].includes(playlistOptions.repeat),
            }"
            type="button"
            aria-label="Toggle repeat"
            @click="onToggleRepeat"
          >
            <IconRepeatAll v-if="playlistOptions.repeat === 'all'" />
            <IconRepeatOne v-else-if="playlistOptions.repeat === 'single'" />
            <IconRepeatAll v-else />
          </button>
        </div>
      </slot>
      <div
        class="text-center text-sm"
        :style="{
          gridArea: 'currentDuration',
        }"
      >
        {{ formattedCurrentDuration }}
      </div>
      <div :style="{ gridArea: 'waveform' }" class="relative min-w-0 flex-1">
        <div ref="wavesurferElement" class="w-full" />
        <div
          v-if="initializing"
          class="absolute inset-0 z-50 flex items-center justify-center bg-neutral-800/85 text-center text-white"
        >
          <IconLoadingWaveform class="size-8" />
        </div>
      </div>
      <div
        class="text-center text-sm"
        :style="{
          gridArea: 'endDuration',
        }"
      >
        {{ formattedDuration }}
      </div>
      <div
        :style="{
          gridArea: 'volume',
        }"
        class="relative"
      >
        <PlayerVolume class="absolute" />
      </div>
      <div
        :style="{
          gridArea: 'actions',
        }"
        class="flex items-center gap-x-2 md:gap-x-4"
      >
        <slot name="actions" v-bind="{ track: returnTrack }" />
        <button
          type="button"
          class="flex size-10 cursor-pointer items-center justify-center rounded p-1 hover:text-red-400"
          aria-label="Close player"
          @click.stop.prevent="onClosePlayer"
        >
          <IconClose />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted } from 'vue'
import usePlayer, { type TOptions } from '../composables/usePlayer'
import IconPlay from '../components/Icons/IconPlay.vue'
import IconPause from '../components/Icons/IconPause.vue'
import IconClose from '../components/Icons/IconClose.vue'
import IconLoadingWaveform from '../components/Icons/IconLoadingWaveform.vue'
import PlayerVolume from '../components/PlayerVolume.vue'
import PlayerPlaylist from '../components/PlayerPlaylist.vue'
import IconNext from '../components/Icons/IconNext.vue'
import IconPrevious from '../components/Icons/IconPrevious.vue'
import IconRepeatAll from '../components/Icons/IconRepeatAll.vue'
import IconRepeatOne from '../components/Icons/IconRepeatOne.vue'
import IconShuffle from '../components/Icons/IconShuffle.vue'
import usePlayerPlaylist from '../composables/usePlayerPlaylist'

type Props = {
  options?: TOptions
  grid?: string
  cols?: string
  hidePlaylistPopup?: boolean
}

const emit = defineEmits(['close'])

const props = defineProps<Props>()

const returnGrid = computed(() => {
  return (
    props.grid ||
    `[grid-template-areas:'image_metadata_metadata_metadata'_'currentDuration_waveform_waveform_endDuration'_'controls_controls_volume_actions'] grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:[grid-template-areas:'image_metadata_controls_volume_actions'_'currentDuration_waveform_waveform_waveform_endDuration'] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] md:[grid-template-areas:'image_metadata_controls_currentDuration_waveform_endDuration_volume_actions'] md:grid-cols-[auto_auto_auto_auto_minmax(0,1fr)_auto_auto_auto_auto]`
  )
})

const {
  wavesurferElement,
  initializing,
  isPlaying,
  audioSource,
  togglePlayback,
  onClose,
  destroy,
  formattedCurrentDuration,
  formattedDuration,
  returnTrack,
  onPlayNextTrack,
  onPlayPreviousTrack,
} = usePlayer(props.options)

const { onToggleRepeat, onToggleShuffle, playlistOptions, shuffle } = usePlayerPlaylist()

onUnmounted(() => {
  destroy()
})

const onClosePlayer = () => {
  emit('close')
  onClose()
  console.log('onClosePlayer')
}
</script>

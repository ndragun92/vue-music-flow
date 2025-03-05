<template>
  <div
    class="fixed right-0 bottom-0 left-0 z-40 text-primary-typography"
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
      class="relative z-50 grid h-60 min-w-72 items-center gap-x-2 border-t border-primary-border bg-primary px-2 whitespace-nowrap text-primary-typography phone:h-40 tablet:h-20 tablet:gap-x-4"
      :class="[returnGrid]"
    >
      <div
        :style="{
          gridArea: 'image',
        }"
      >
        <slot name="image" v-bind="{ track: returnTrack }">
          <div v-if="returnTrack?.artwork" class="p-1.5">
            <img
              class="size-14 rounded border border-primary-border bg-secondary object-cover p-0.5"
              :key="returnTrack?.artwork"
              :src="returnTrack?.artwork"
              :alt="returnTrack?.title"
              loading="lazy"
            />
          </div>
        </slot>
      </div>
      <div
        class="tablet:w-80 tablet:max-w-[initial]"
        :style="{
          gridArea: 'metadata',
        }"
      >
        <slot name="metadata" v-bind="{ track: returnTrack }">
          <h3 class="truncate font-semibold">
            {{ returnTrack?.title }}
          </h3>
          <h4 class="truncate text-sm text-secondary-typography">{{ returnTrack?.artist }}</h4>
        </slot>
      </div>
      <div class="flex items-center gap-1" :style="{ gridArea: 'controls' }">
        <slot
          name="controls"
          v-bind="{
            togglePlayback,
            isPlaying,
            playlist,
            onPlayPreviousTrack,
            onPlayNextTrack,
            onToggleRepeat,
            playlistOptions,
          }"
        >
          <button
            v-if="playlist.length"
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-primary-hover"
            :class="{
              'text-primary-active': shuffle,
            }"
            type="button"
            aria-label="Toggle shuffle"
            @click="onToggleShuffle"
          >
            <IconShuffle />
          </button>
          <button
            v-if="playlist.length"
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-primary-hover"
            type="button"
            aria-label="Play previous track"
            @click="onPlayPreviousTrack"
          >
            <IconPrevious />
          </button>
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-primary-hover"
            type="button"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
            :aria-pressed="isPlaying ? 'true' : 'false'"
            @click.stop.prevent="togglePlayback"
          >
            <IconPlay v-if="!isPlaying" />
            <IconPause v-else />
          </button>
          <button
            v-if="playlist.length"
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-primary-hover"
            type="button"
            aria-label="Play next track"
            @click="onPlayNextTrack"
          >
            <IconNext />
          </button>
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded p-2 hover:text-primary-hover"
            :class="{
              'text-primary-active': ['all', 'single'].includes(playlistOptions.repeat),
            }"
            type="button"
            aria-label="Toggle repeat"
            @click="onToggleRepeat"
          >
            <IconRepeatAll v-if="playlistOptions.repeat === 'all'" />
            <IconRepeatOne v-else-if="playlistOptions.repeat === 'single'" />
            <IconRepeatAll v-else />
          </button>
        </slot>
      </div>
      <div
        class="text-center text-sm"
        :style="{
          gridArea: 'currentDuration',
        }"
      >
        <slot name="currentDuration" v-bind="{ currentDuration: formattedCurrentDuration }">
          {{ formattedCurrentDuration }}
        </slot>
      </div>
      <div :style="{ gridArea: 'waveform' }" class="relative min-w-0 flex-1">
        <slot name="waveform" v-bind="{ initializing }">
          <div ref="wavesurferElement" class="w-full" />
          <div
            v-if="initializing"
            class="absolute inset-0 z-50 flex items-center justify-center bg-primary/85 text-center text-primary-typography"
          >
            <IconLoadingWaveform class="size-8" />
          </div>
        </slot>
      </div>
      <div
        class="text-center text-sm"
        :style="{
          gridArea: 'endDuration',
        }"
      >
        <slot name="endDuration" v-bind="{ endDuration: formattedDuration }">
          {{ formattedDuration }}
        </slot>
      </div>
      <div
        :style="{
          gridArea: 'volume',
        }"
        class="relative"
      >
        <slot name="volume">
          <PlayerVolume class="absolute" />
        </slot>
      </div>
      <div
        :style="{
          gridArea: 'actions',
        }"
        class="flex items-center gap-x-2 tablet:gap-x-4"
      >
        <slot name="actions" v-bind="{ track: returnTrack }" />
        <slot name="close" v-bind="{ onClosePlayer }">
          <button
            type="button"
            class="flex size-10 cursor-pointer items-center justify-center rounded p-1 hover:text-primary-hover"
            aria-label="Close player"
            @click.stop.prevent="onClosePlayer"
          >
            <IconClose />
          </button>
        </slot>
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
    `[grid-template-areas:'image_metadata_metadata_metadata'_'currentDuration_waveform_waveform_endDuration'_'controls_controls_volume_actions'] grid-cols-[auto_minmax(0,1fr)_auto_auto] phone:[grid-template-areas:'image_metadata_controls_volume_actions'_'currentDuration_waveform_waveform_waveform_endDuration'] phone:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] tablet:[grid-template-areas:'image_metadata_controls_currentDuration_waveform_endDuration_volume_actions'] tablet:grid-cols-[auto_auto_auto_auto_minmax(0,1fr)_auto_auto_auto_auto]`
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
  playlist,
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

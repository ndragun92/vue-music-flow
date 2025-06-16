<template>
  <div
    class="mw:fixed mw:right-0 mw:bottom-0 mw:left-0 mw:z-40 mw:text-mw-primary-typography"
    :class="{
      'mw:pointer-events-none mw:opacity-0': !audioSource,
      'mw:opacity-100 mw:transition-opacity mw:duration-700': audioSource,
    }"
  >
    <PlayerPlaylist
      v-if="!props.hidePlaylistPopup"
      :class="{
        'mw:pointer-events-none mw:opacity-0': !audioSource,
        'mw:opacity-100 mw:duration-700': audioSource,
      }"
    />
    <div
      class="mw:relative mw:z-50 mw:grid mw:h-60 mw:min-w-72 mw:items-center mw:gap-x-2 mw:border-t mw:border-mw-primary-border mw:bg-mw-primary mw:px-2 mw:whitespace-nowrap mw:text-mw-primary-typography mw:phone:h-40 mw:tablet:h-20 mw:tablet:gap-x-4"
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
              class="mw:size-14 mw:rounded mw:border mw:border-mw-primary-border mw:bg-mw-secondary mw:object-cover mw:p-0.5"
              :key="returnTrack?.artwork"
              :src="returnTrack?.artwork"
              :alt="returnTrack?.title"
              loading="lazy"
            />
          </div>
        </slot>
      </div>
      <div
        class="mw:tablet:w-80 mw:tablet:max-w-[initial]"
        :style="{
          gridArea: 'metadata',
        }"
      >
        <slot name="metadata" v-bind="{ track: returnTrack }">
          <h3 class="mw:truncate mw:font-semibold">
            {{ returnTrack?.title }}
          </h3>
          <h4 class="mw:truncate mw:text-sm mw:text-mw-secondary-typography">
            {{ returnTrack?.artist }}
          </h4>
        </slot>
      </div>
      <div class="mw:flex mw:items-center mw:gap-1" :style="{ gridArea: 'controls' }">
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
            class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:hover:text-mw-primary-hover"
            :class="{
              'mw:text-mw-primary-active': shuffle,
            }"
            type="button"
            aria-label="Toggle shuffle"
            @click="onToggleShuffle"
          >
            <IconShuffle />
          </button>
          <button
            v-if="playlist.length"
            class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:hover:text-mw-primary-hover"
            type="button"
            aria-label="Play previous track"
            @click="onPlayPreviousTrack"
          >
            <IconPrevious />
          </button>
          <button
            class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:hover:text-mw-primary-hover"
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
            class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:hover:text-mw-primary-hover"
            type="button"
            aria-label="Play next track"
            @click="onPlayNextTrack"
          >
            <IconNext />
          </button>
          <button
            class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:hover:text-mw-primary-hover"
            :class="{
              'mw:text-mw-primary-active': ['all', 'single'].includes(playlistOptions.repeat),
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
        class="mw:text-center mw:text-sm"
        :style="{
          gridArea: 'currentDuration',
        }"
      >
        <slot name="currentDuration" v-bind="{ currentDuration: formattedCurrentDuration }">
          {{ formattedCurrentDuration }}
        </slot>
      </div>
      <div :style="{ gridArea: 'waveform' }" class="mw:relative mw:min-w-0 mw:flex-1">
        <slot name="waveform" v-bind="{ initializing }">
          <div ref="wavesurferElement" class="mw:w-full" />
          <div
            v-if="initializing"
            class="mw:absolute mw:inset-0 mw:z-50 mw:flex mw:items-center mw:justify-center mw:bg-mw-primary/85 mw:text-center mw:text-mw-primary-typography"
          >
            <IconLoadingWaveform class="mw:size-8" />
          </div>
        </slot>
      </div>
      <div
        class="mw:text-center mw:text-sm"
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
        class="mw:relative"
      >
        <slot name="volume">
          <PlayerVolume class="mw:absolute" />
        </slot>
      </div>
      <div
        :style="{
          gridArea: 'actions',
        }"
        class="mw:flex mw:items-center mw:gap-x-2 mw:tablet:gap-x-4"
      >
        <slot name="actions" v-bind="{ track: returnTrack }" />
        <slot name="close" v-bind="{ onClosePlayer }">
          <button
            type="button"
            class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-1 mw:hover:text-mw-primary-hover"
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
  hidePlaylistPopup?: boolean
}

const emit = defineEmits(['close'])

const props = defineProps<Props>()

const returnGrid = computed(() => {
  return (
    props.grid ||
    `mw:[grid-template-areas:'image_metadata_metadata_metadata'_'currentDuration_waveform_waveform_endDuration'_'controls_controls_volume_actions'] mw:grid-cols-[auto_minmax(0,1fr)_auto_auto] mw:phone:[grid-template-areas:'image_metadata_controls_volume_actions'_'currentDuration_waveform_waveform_waveform_endDuration'] mw:phone:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] mw:tablet:[grid-template-areas:'image_metadata_controls_currentDuration_waveform_endDuration_volume_actions'] mw:tablet:grid-cols-[auto_auto_auto_minmax(0,3rem)_minmax(0,1fr)_minmax(0,3rem)_auto_auto_auto]`
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

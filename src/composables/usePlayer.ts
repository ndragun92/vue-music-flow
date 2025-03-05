import WaveSurfer, { type WaveSurferOptions } from 'wavesurfer.js'
import { computed, ref, toRaw, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import usePlayerPlaylist from './usePlayerPlaylist'

export type TOptions = Omit<WaveSurferOptions, 'container' | 'url'>
export type TPlayerTrack = {
  id: number
  audio: string
  title: string
  artist: string
  artwork: string
  album: string
  original?: Record<string, unknown>
}
type MediaMetadataOptions = {
  title: TPlayerTrack['title']
  artist?: TPlayerTrack['artist']
  album?: TPlayerTrack['album']
  artwork?: { src: TPlayerTrack['artwork']; sizes: string; type: string }[]
}

const DEFAULT_ARTWORK_SRC = 'https://placehold.co/512x512'

const track = ref<TPlayerTrack | null>(null)
const wavesurfer = ref<WaveSurfer>()
const initializing = ref(true)
const currentDuration = ref(0)
const duration = ref(0)
const isPlaying = ref(false)
const options = ref<TOptions>({})
const wavesurferElement = ref<HTMLElement | null>(null)

export default function usePlayer(_options?: TOptions) {
  if (_options) {
    options.value = Object(_options)
  }

  const volume = useLocalStorage('player:volume', 75)
  const audioSource = computed(() => track.value?.audio)

  const { onSetPlaylist, onResetPlaylist, playlist, playlistOptions } = usePlayerPlaylist()

  const init = () => {
    const el = wavesurferElement.value
    if (!el || !audioSource.value) {
      console.error(el ? 'Missing audio URL' : 'HTMLElement not found')
      return
    }

    initializing.value = true
    updateMediaMetadata({
      title: track.value?.title || '',
      artist: track.value?.artist || '',
      album: track.value?.album || '',
      artwork: [
        {
          src: track.value?.artwork || DEFAULT_ARTWORK_SRC,
          sizes: '512x512',
          type: 'image/jpeg',
        },
      ],
    })

    const {
      waveColor = '#e7e7e7',
      progressColor = '#ffb86a',
      barWidth = 3,
      barRadius = 2,
      barGap = 3,
      barHeight = 0.8,
      height = 50,
      dragToSeek = { debounceTime: 1000 },
      ...filteredOptions
    } = toRaw(options.value) as TOptions

    wavesurfer.value = WaveSurfer.create({
      container: el,
      waveColor,
      progressColor,
      barWidth,
      barRadius,
      barGap,
      barHeight,
      height,
      dragToSeek,
      url: audioSource.value,
      ...filteredOptions,
    })

    setupWaveSurferListeners()
  }

  const setupWaveSurferListeners = () => {
    wavesurfer.value?.on('init', () => {
      wavesurfer.value?.setVolume(volume.value / 100)
    })
    wavesurfer.value?.on('ready', () => {
      initializing.value = false
      duration.value = wavesurfer.value?.getDuration() || 0
    })
    wavesurfer.value?.on('play', () => (isPlaying.value = true))
    wavesurfer.value?.on('pause', () => (isPlaying.value = false))
    wavesurfer.value?.on('audioprocess', (time: number) => {
      currentDuration.value = time || 0
    })
    wavesurfer.value?.on('finish', () => {
      const { repeat } = playlistOptions.value
      if (playlist.value?.length) {
        if (repeat === 'single') {
          wavesurfer.value?.play()
        } else if (repeat === 'all') {
          onPlayNextTrack()
        }
      } else {
        if (repeat === 'single') {
          wavesurfer.value?.play()
        } else {
          wavesurfer.value?.stop()
        }
      }
    })
    wavesurfer.value?.on('destroy', cleanupAfterDestroy)
  }

  const cleanupAfterDestroy = () => {
    wavesurfer.value = undefined
    duration.value = 0
    currentDuration.value = 0
    track.value = null
    resetMediaMetadata()
    isPlaying.value = false
  }

  const handleTrackPlay = (_track: TPlayerTrack) => {
    if (!_track) {
      console.error('Invalid track data')
      return
    }
    if (track.value?.id === _track.id) {
      togglePlayback()
    } else {
      destroy()
      track.value = _track
      init()
    }
  }

  const togglePlayback = () => {
    wavesurfer.value?.playPause()
  }

  const destroy = () => {
    wavesurfer.value?.destroy()
  }

  const formattedCurrentDuration = computed(() => formatDuration(currentDuration.value))
  const formattedDuration = computed(() => formatDuration(duration.value))
  const returnTrack = computed(() => track.value)

  const isTrackPlaying = (_id: TPlayerTrack['id']): boolean => {
    return returnTrack.value?.id === _id && isPlaying.value
  }

  watch(volume, (_value) => {
    wavesurfer.value?.setVolume(_value / 100)
  })

  const onPlayAsPlaylist = (tracks: TPlayerTrack[], track?: TPlayerTrack) => {
    if (!tracks?.length) {
      alert('Missing tracks data')
      return
    }
    onSetPlaylist(tracks)
    if (track) {
      handleTrackPlay(track)
    } else {
      handleTrackPlay(tracks[0])
    }
  }

  const onPlaySingleTrack = (track: TPlayerTrack) => {
    if (!track) {
      alert('Missing track data')
      return
    }
    onResetPlaylist()
    handleTrackPlay(track)
  }

  const formatDuration = (seconds: number) => {
    const totalSeconds = Math.floor(seconds)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  const updateMediaMetadata = (data: MediaMetadataOptions) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: data.title,
        artist: data.artist || '',
        album: data.album || '',
        artwork: data.artwork || [],
      })
    } else {
      console.warn('Media Session API not supported.')
    }
  }

  const resetMediaMetadata = () => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null
    } else {
      console.warn('Media Session API not supported.')
    }
  }

  const returnCurrentTrackIndex = computed(() => {
    if (!playlist.value.length) return null
    return playlist.value.findIndex((track) => track.id === returnTrack.value?.id)
  })

  const returnPreviousTrack = computed(() => {
    if (returnCurrentTrackIndex.value == null) return
    const findPreviousTrack = playlist.value[returnCurrentTrackIndex.value - 1]
    return findPreviousTrack || playlist.value[playlist.value.length - 1]
  })

  const returnNextTrack = computed(() => {
    if (returnCurrentTrackIndex.value == null) return
    const findNextTrack = playlist.value[returnCurrentTrackIndex.value + 1]
    return findNextTrack || playlist.value[0]
  })

  const onPlayPreviousTrack = () => {
    onPlayAsPlaylist(playlist.value, returnPreviousTrack.value)
  }

  const onPlayNextTrack = () => {
    onPlayAsPlaylist(playlist.value, returnNextTrack.value)
  }

  return {
    wavesurferElement,
    wavesurfer,
    init,
    destroy,
    onPlaySingleTrack,
    onPlayAsPlaylist,
    togglePlayback,
    onClose: destroy,
    audioSource,
    initializing,
    isPlaying,
    formattedCurrentDuration,
    formattedDuration,
    returnTrack,
    isTrackPlaying,
    playlist,
    returnNextTrack,
    onPlayPreviousTrack,
    onPlayNextTrack,
  }
}

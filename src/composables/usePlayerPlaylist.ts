import { type TPlayerTrack } from './usePlayer'
import { ref, toRaw } from 'vue'
import { useLocalStorage } from '@vueuse/core'

type TPlaylistOptions = {
  repeat: 'none' | 'single' | 'all'
}

const playlist = ref<TPlayerTrack[] | []>([])
const shuffle = ref(false)
const playlistOriginal = ref<TPlayerTrack[] | []>([])
const playlistShuffled = ref<TPlayerTrack[] | []>([])

const playlistOptions = useLocalStorage<TPlaylistOptions>('player:playlist:options', {
  repeat: 'all',
})

export default function usePlayerPlaylist() {
  const onSetPlaylist = (tracks: TPlayerTrack[]) => {
    shuffle.value = false
    playlist.value = tracks
  }

  const onResetPlaylist = () => {
    playlist.value = []
  }

  const onToggleRepeat = () => {
    const { repeat } = playlistOptions.value

    switch (repeat) {
      case 'none':
        playlistOptions.value.repeat = 'single'
        break
      case 'single':
        playlistOptions.value.repeat = playlist.value.length ? 'all' : 'none'
        break
      case 'all':
        playlistOptions.value.repeat = 'none'
        break
    }
  }

  const shuffleArray = (array: TPlayerTrack[] | []) => {
    // Create a copy of the array to avoid mutating the original
    const shuffled = [...array]

    for (let i = shuffled.length - 1; i > 0; i--) {
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * (i + 1))

      // Swap the current element with the random index element
      ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
    }

    return shuffled
  }

  const onToggleShuffle = () => {
    shuffle.value = !shuffle.value

    if (shuffle.value) {
      playlistOriginal.value = toRaw(playlist.value)
      playlistShuffled.value = shuffleArray(toRaw(playlist.value))
      playlist.value = toRaw(playlistShuffled.value)
    } else {
      playlist.value = toRaw(playlistOriginal.value)
    }
  }

  return {
    onSetPlaylist,
    onResetPlaylist,
    playlist,
    playlistOptions,
    shuffle,
    onToggleRepeat,
    onToggleShuffle,
  }
}

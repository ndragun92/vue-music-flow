<template>
  <div class="mw:relative mw:inline-block">
    <button
      type="button"
      class="mw:flex mw:size-10 mw:cursor-pointer mw:items-center mw:justify-center mw:rounded mw:p-2 mw:text-mw-primary-typography mw:hover:text-mw-primary-hover"
      :aria-expanded="showVolume"
      aria-controls="volume-slider"
      aria-label="Toggle Volume Control"
      @click.stop.prevent="showVolume = true"
    >
      <span v-html="returnVolumeIcon" class="mw:size-full" />
    </button>
    <div
      ref="el-volume-dropdown"
      class="mw:absolute mw:bottom-[3.75rem] mw:left-1 mw:h-46 mw:w-8 mw:border-t mw:border-r mw:border-l mw:border-mw-primary-border mw:bg-mw-primary mw:transition-opacity"
      :class="{
        'mw:opacity-100': showVolume,
        'mw:opacity-0': !showVolume,
      }"
    >
      <div
        class="mw:group mw:relative mw:-bottom-22 mw:-left-[4.05rem] mw:h-2 mw:w-40 mw:-rotate-90 mw:rounded-full mw:bg-mw-secondary"
      >
        <input
          id="volume-slider"
          type="range"
          :min="0"
          :max="100"
          v-model.number="volume"
          class="mw:absolute mw:-top-1 mw:left-0 mw:h-4 mw:w-full mw:cursor-pointer mw:opacity-0"
          :aria-valuenow="volume"
          :aria-valuemin="0"
          :aria-valuemax="100"
          aria-label="Volume Slider"
        />
        <div class="mw:pointer-events-none mw:absolute mw:inset-0 mw:z-10 mw:flex mw:items-center">
          <div
            class="mw:absolute mw:h-2 mw:rounded-full mw:bg-mw-primary-active"
            :style="{ width: `${volume}%` }"
            aria-hidden="true"
          />
          <div
            class="mw:relative mw:size-6 mw:rotate-90 mw:rounded-full mw:bg-mw-primary-active mw:p-0.5 mw:group-focus-within:ring-2"
            :style="{ left: `calc(${volume}% - 0.75rem)` }"
            :aria-label="`Volume: ${volume}%`"
            :aria-valuemin="1"
            :aria-valuemax="100"
            :aria-valuenow="volume"
            aria-controls="volume-slider"
            role="slider"
          >
            <span v-html="returnVolumeIcon" class="mw:rotate-90 mw:text-mw-primary-typography" />
            <div
              class="mw:text-primary-typography mw:absolute mw:top-0 mw:right-[calc(100%+0.5rem)] mw:rounded mw:border mw:border-mw-primary-border mw:bg-mw-primary mw:px-2 mw:py-0.5 mw:text-sm mw:font-semibold mw:opacity-0 mw:transition-opacity mw:group-hover:opacity-100"
              aria-hidden="true"
            >
              {{ volume }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { onClickOutside, useLocalStorage } from '@vueuse/core'
const volume = useLocalStorage('player:volume', 75)

const showVolume = ref(false)

const elVolumeDropdown = useTemplateRef<HTMLElement>('el-volume-dropdown')

onClickOutside(elVolumeDropdown, () => {
  showVolume.value = false
})

const returnVolumeIcon = computed(() => {
  if (volume.value <= 0) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m19.1 21.9l-2.325-2.325q-.35.2-.7.387q-.35.188-.725.338q-.5.2-.925-.125q-.425-.325-.425-.9q0-.275.163-.487q.162-.213.412-.313q.2-.075.388-.163q.187-.087.362-.187L12 14.8v2.775q0 .675-.613.937q-.612.263-1.087-.212L7 15H4q-.425 0-.712-.288Q3 14.425 3 14v-4q0-.425.288-.713Q3.575 9 4 9h2.2L2.1 4.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l17 17q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275ZM15.35 3.65q2.55 1.025 4.1 3.275Q21 9.175 21 11.975q0 1.325-.362 2.55q-.363 1.225-1.038 2.275l-1.45-1.45q.425-.775.638-1.625q.212-.85.212-1.75q0-2.2-1.212-3.95q-1.213-1.75-3.213-2.55q-.275-.1-.425-.325q-.15-.225-.15-.5q0-.55.425-.875q.425-.325.925-.125Zm.9 9.8L14 11.2V7.95q1.175.55 1.838 1.65q.662 1.1.662 2.4q0 .375-.062.738q-.063.362-.188.712ZM12 9.2L9.4 6.6l.9-.9q.475-.475 1.087-.213q.613.263.613.938Z"/></svg>'
  } else if (volume.value <= 25) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8 15q-.425 0-.713-.288Q7 14.425 7 14v-4q0-.425.287-.713Q7.575 9 8 9h3l3.3-3.3q.475-.475 1.087-.213q.613.263.613.938v11.15q0 .675-.613.937q-.612.263-1.087-.212L11 15Z"/></svg>'
  } else if (volume.value <= 75) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6 15q-.425 0-.713-.288Q5 14.425 5 14v-4q0-.425.287-.713Q5.575 9 6 9h3l3.3-3.3q.475-.475 1.087-.213q.613.263.613.938v11.15q0 .675-.613.937q-.612.263-1.087-.212L9 15Zm10 1V7.95q1.125.525 1.812 1.625q.688 1.1.688 2.425q0 1.325-.688 2.4Q17.125 15.475 16 16Z"/></svg>'
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.35 20.3q-.5.2-.925-.125q-.425-.325-.425-.9q0-.275.163-.487q.162-.213.412-.313q2-.8 3.213-2.55Q19 14.175 19 11.975t-1.212-3.95q-1.213-1.75-3.213-2.55q-.275-.1-.425-.325q-.15-.225-.15-.5q0-.55.425-.875q.425-.325.925-.125q2.55 1.025 4.1 3.275Q21 9.175 21 11.975t-1.55 5.05q-1.55 2.25-4.1 3.275ZM4 15q-.425 0-.712-.288Q3 14.425 3 14v-4q0-.425.288-.713Q3.575 9 4 9h3l3.3-3.3q.475-.475 1.087-.213q.613.263.613.938v11.15q0 .675-.613.937q-.612.263-1.087-.212L7 15Zm10 1V7.95q1.125.525 1.812 1.625q.688 1.1.688 2.425q0 1.325-.688 2.4Q15.125 15.475 14 16Z"/></svg>'
})
</script>

# vue-music-flow

Modern Vue 3 / Nuxt 3 audio player component with playlist and waveform visualization.

[Documentation](https://vue-music-flow-docs.vercel.app/)
[GitHub Repository](https://github.com/ndragun92/vue-music-flow)

## Compatibility
>vue-music-flow works with version Vue 3+ or Nuxt 3+

## How to install
>Recommended Node.js version is v22.x or higher

```sh
npm i vue-music-flow
```

## How to use

### Vue 3

###### Component.vue
```html
<template>
  <MusicFlow
    :options="{
      autoplay: true,
    }"
  />
</template>

<script setup lang="ts">
import "vue-music-flow/dist/vue-music-flow.css";
import { MusicFlow } from "vue-music-flow";
</script>
```

### Nuxt 3

###### nuxt.confg.ts
```javascript
export default defineNuxtConfig({
  build: {
    transpile: ["vue-music-flow"],
  },
});
```
### For more advanced customization visit documentation
[Click here to visit documentation](https://vue-music-flow-docs.vercel.app/)

___

## Development

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Want to support my work?
<a href="https://www.buymeacoffee.com/ndragun92"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=ndragun92&button_colour=40DCA5&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00" /></a>

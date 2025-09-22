# vue-music-flow

Modern Vue 3 / Nuxt 3 audio player component with playlist and waveform visualization.

![Preview](https://ik.imagekit.io/ltdassets/public/social.jpg?updatedAt=1741803287465)

[Documentation](https://vue-music-flow-docs.vercel.app/getting-started)

[GitHub Repository](https://github.com/ndragun92/vue-music-flow)

## Compatibility
>vue-music-flow works with version Vue 3+ or Nuxt 3+

## How to install
>Recommended Node.js version is v22.x or higher

### Vue 3
```sh
npm i vue-music-flow
```

### Nuxt 3
```sh
npx nuxi module add nuxt-music-flow
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

###### Component.vue
```html
<template>
  <MusicFlow
    :options="{
      autoplay: true,
    }"
  />
</template>
```

### For more advanced customization visit documentation
[Click here to visit documentation](https://vue-music-flow-docs.vercel.app/getting-started)

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

### CSS scoping to avoid Tailwind collisions

The generated CSS is fully scoped to the library under the `.vue-music-flow` namespace so it won’t collide with your app’s Tailwind setup. The component already renders with this wrapper class, so you don’t need to add it manually. Just import `vue-music-flow.css` as shown above.

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

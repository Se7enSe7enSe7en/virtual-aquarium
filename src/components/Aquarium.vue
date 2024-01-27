<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import Fish from './Fish.vue'
import type { AquariumState } from '@/views/Home.vue'

const emits = defineEmits(['decompose'])

export interface AquariumProps {
  aquariumState: AquariumState[]
}
const props = defineProps<AquariumProps>()

computed(() => console.log(props.aquariumState.values))

function onDecompose(fishId) {
  emits('decompose', fishId)
}
</script>

<template>
  <div class="h-full w-full border-2 border-white">
    <img class="fixed -z-10 h-full w-full object-cover" src="/bg.jpg" />
    <Fish
      v-for="fish of aquariumState"
      :key="fish.id"
      :name="fish.name"
      :img-src="fish.imgSrc"
      @decompose="onDecompose(fish.id)"
    />
  </div>
</template>

<style scoped></style>

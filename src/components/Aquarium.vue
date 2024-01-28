<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Fish from './Fish.vue';
import type { AquariumState } from '@/views/Home.vue';

const emits = defineEmits(['decompose']);

export interface AquariumProps {
  aquariumState: AquariumState[];
}
const props = defineProps<AquariumProps>();

function onDecompose(fishId) {
  emits('decompose', fishId);
}
</script>

<template>
  <div class="h-screen w-full overflow-hidden bg-aquarium bg-cover">
    <TransitionGroup name="fade">
      <Fish
        v-for="fish of aquariumState"
        :key="fish.id"
        :name="fish.name"
        :img-src="fish.imgSrc"
        @decompose="onDecompose(fish.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

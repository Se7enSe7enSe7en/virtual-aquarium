<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import FishForm from '@/components/FishForm.vue'
import Aquarium from '@/components/Aquarium.vue'
export interface AquariumState {
  id: string
  name: string
  imgSrc: string
}

const aquariumState = ref<AquariumState[]>([])

const createFish = (name, imgSrc) => {
  aquariumState.value.push({
    id: Date.now().toString(),
    name,
    imgSrc
  })
  // console.log(aquariumState) // DEBUG
}

const onSubmitFishForm = ({ name, imgSrc }) => {
  createFish(name, imgSrc)
}

function onDecompose(id: string) {
  aquariumState.value.splice(
    aquariumState.value.findIndex((x) => x.id === id),
    1
  )
}
</script>
<template>
  <div class="flex">
    <div class="w-1/6">
      <FishForm @submit-fish-form="onSubmitFishForm($event)" />
    </div>
    <div class="w-5/6">
      <Aquarium :aquarium-state="aquariumState" @decompose="onDecompose($event)" />
    </div>
  </div>
</template>

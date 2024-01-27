<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['submitFishForm'])

const fishList = [
  {
    id: 1,
    type: 'golden purple fish',
    imgSrc: '/golden-purple-fish.png'
  },
  {
    id: 2,
    type: 'goldfish',
    imgSrc: '/goldfish.png'
  },
  {
    id: 3,
    type: 'guppie',
    imgSrc: '/guppie.png'
  },
  {
    id: 4,
    type: 'tropical-fish',
    imgSrc: '/tropical-fish.png'
  },
  {
    id: 5,
    type: 'tuna',
    imgSrc: '/tuna.png'
  },
  {
    id: 6,
    type: 'Nostalgic Guppy',
    imgSrc: '/guppy_flipped.png'
  }
]

const specialFishList = [
  {
    name: 'Olek',
    imgSrc: '/olek_with_scuba_mask.png'
  }
]

const selectedFishId = ref(1)
const nameInputField = ref('')
const resetForm = () => {
  nameInputField.value = ''
}

const onAddFish = () => {
  const specialFish = specialFishList.find(({ name }) => name === nameInputField.value)

  const fishFormValue = {
    name: nameInputField.value,
    imgSrc: specialFish
      ? specialFish.imgSrc
      : fishList.find((x) => x.id === selectedFishId.value).imgSrc
  }

  emit('submitFishForm', fishFormValue)
  resetForm()
}
</script>
<template>
  <div class="h-screen border-2 border-blue-600 p-4 text-white overflow-y-auto">
    <div class="mb-24">
      <div class="text-xl">Select Fish</div>
      <!-- fish list -->
      <div class="flex flex-wrap">
        <div
          class="m-4"
          v-for="fish of fishList"
          :key="fish.id"
          @click="() => (selectedFishId = fish.id)"
        >
          <img
            class="h-24 w-24 object-scale-down"
            :class="{
              'border-2 border-green-500': selectedFishId === fish.id
            }"
            :src="fish.imgSrc"
          />
          <div class="text-center">{{ fish.type }}</div>
        </div>
      </div>
    </div>

    <!-- name input field -->
    <div class="flex flex-col">
      <label for="name">Name</label>
      <input class="rounded-sm text-black" id="name" v-model="nameInputField" />
    </div>
    <!-- add fish button -->
    <button class="my-5 rounded-sm bg-blue-900 p-2 text-lg" @click="onAddFish">Add Fish</button>
  </div>
</template>
<style scoped></style>

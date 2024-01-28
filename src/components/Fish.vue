<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { getImageUrl } from "@/utils/getImageUrl.util";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
const props = defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["decompose"]);

const fish = ref<HTMLDivElement | null>(null);
const fishImage = ref(null);
const xPosition = ref(0);
const yPosition = ref(0);
const pixelsPerMove = ref(200); // px
const tickInterval = 5000; // ms (milliseconds)
const isAlive = ref(true);

const initHungerTimer = 15000; // 15000ms (15sec.)
const hungerTimer = ref(initHungerTimer); 
const hungerBar = ref<HTMLDivElement | null>(null);

const xLimit = computed(
  () => Math.floor(fish.value?.parentElement?.getBoundingClientRect().width)
);
watchEffect(() => console.log(xLimit.value))
const yLimit = computed(
  () => Math.floor(fish.value?.parentElement?.getBoundingClientRect().height)
);

function xCheckWithinLimit(x: number): boolean {
  if (xLimit.value === undefined) return false;
  return 0 < x && x < xLimit.value;
}

function yCheckWithinLimit(y: number): boolean {
  if (yLimit.value === undefined) return false;
  return 0 < y && y < yLimit.value;
}

function checkWithinLimit(x: number, y: number): boolean {
  return xCheckWithinLimit(x) && yCheckWithinLimit(y);
}

// const generatedRandomNumber = ref(0);
/**
 * - The value is no lower than min (or the next integer greater than min
 *   if min isn't an integer), and is less than (but not equal to) max.
 * - max is not included (exclusive), example:
 *   - min = 0, max = 3, possible outputs = 0, 1, 2
 * - starts from 0
 *
 * @param {number} max
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

// 8 possible directions
// 0 = N (North)
// 1 = NE
// 2 = E (East)
// 3 = SE
// 4 = S (South)
// 5 = SW
// 6 = W (West)
// 7 = NW
// input (num) should only be numbers 0 to 7
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function moveAnimation(el, x, y) {
  el.style.transform = `translateX(${x}px) translateY(${y}px)`;
  el.style.transition = `transform ${Math.floor(tickInterval / 1000)}s`;
}

// 3 possible face directions
// E (East) (right)
// W (West) (left)
// null (no change in face)
// input (dir) should only be the possible directions
function faceAnimation(el, dir) {
  if (typeof dir !== "string") return;

  if (dir.includes("E")) {
    el.style.transform = "scaleX(1)";
    // TODO: try adding "ease"
    el.style.transition = "transform 0.5s";
  } else if (dir.includes("W")) {
    el.style.transform = "scaleX(-1)";
    el.style.transition = "transform 0.5s";
  }

  return;
}

function moveFish(dir) {
  let newX = xPosition.value;
  let newY = yPosition.value;

  // calc new x and y depending on direction
  switch (dir) {
    case "N":
      newY -= pixelsPerMove.value;
      break;
    case "NE":
      newX += pixelsPerMove.value;
      newY -= pixelsPerMove.value;
      break;
    case "E":
      newX += pixelsPerMove.value;
      break;
    case "SE":
      newX += pixelsPerMove.value;
      newY += pixelsPerMove.value;
      break;
    case "S":
      newY += pixelsPerMove.value;
      break;
    case "SW":
      newX -= pixelsPerMove.value;
      newY += pixelsPerMove.value;
      break;
    case "W":
      newX -= pixelsPerMove.value;
      break;
    case "NW":
      newX -= pixelsPerMove.value;
      newY -= pixelsPerMove.value;
      break;

    default:
      break;
  }

  // if next move is out of limit do nothing
  if (!checkWithinLimit(newX, newY)) return;

  xPosition.value = newX;
  yPosition.value = newY;
  moveAnimation(fish.value, newX, newY);
  faceAnimation(fishImage.value, dir);
}

/**
 * remove the animation properly
 * - https://stackoverflow.com/a/45036752
 * 
 * @param el 
 */
function resetAnimation(el: HTMLElement) {
  el.style.animation = 'none'
  // el.offsetHeight // trigger reflow
  el.getBoundingClientRect() // trigger reflow
  el.style.transition = 'none'
}

/**
 * - animation for the hunger bar getting smaller
 * - the duration will be converted from milliseconds to seconds
 *
 * @param hungerBarRef - ref of the div element
 * @param duration - duration should be in milliseconds
 */
function hungerBarAnimation({
  duration,
}: {
  duration: number;
}) {
  if (!hungerBar.value) return console.error('hungerBarAnimation: no hunger bar ref');
  // clear animation first
  resetAnimation(hungerBar.value)
  hungerBar.value.style.animation = `hunger-bar ${duration}ms linear infinite`
}

// TODO: refactor in the future try using a composable perhaps like this: https://stackoverflow.com/a/74166482
const internalClock = setInterval(() => {
  // // randomize 0 to 7
  // generatedRandomNumber.value = getRandomInt(0, 8);
  // console.log(`${props.name} tick: `, generatedRandomNumber.value); // DEBUG

  // move fish depending on generated random number
  const generatedRandomNumber = getRandomInt(0, 8);
  console.log(`${props.name} tick: `, generatedRandomNumber); // DEBUG
  moveFish(directions[generatedRandomNumber]);
}, tickInterval);

let hungerTick = 0;
const hungerFunction = () => {
  hungerTick++;
  console.log("hungerTick: ", hungerTick);

  // 2nd phase of hunger tick: Death
  if (hungerTick === 1) {
    console.log("DEATH: ", props.name); // DEBUG
    isAlive.value = false;

    // clear main clock since fish is dead
    clearInterval(internalClock)
  }
  // 3rd phase of hunger tick: Decompose
  else if (hungerTick === 2) {
    emit("decompose");
  }
};
let hungerClock = setInterval(hungerFunction, hungerTimer.value);
const resetHungerClock = () => {
  clearInterval(hungerClock);
  hungerTick = 0;
  hungerClock = setInterval(hungerFunction, hungerTimer.value);
  hungerBarAnimation({
    duration: initHungerTimer,
  });
};

onMounted(() => {
  // // tick interval range is 1s to 5s
  // tickInterval.value = getRandomInt(1000, 5000)
  pixelsPerMove.value = getRandomInt(100, 250);
  resetHungerClock()

  // console.log(`fish.value: ${fish.value} && xLimit.value: ${xLimit.value} && yLimit.value: ${yLimit.value}`); // DEBUG
  
  // set init position center of parent
  if (fish.value && xLimit.value && yLimit.value) {
    const initXPosition = Math.floor(xLimit.value / 2)
    const initYPosition = Math.floor(yLimit.value / 2)
    xPosition.value = initXPosition
    yPosition.value = initYPosition
    fish.value.style.transform = `translateX(${initXPosition}px) translateY(${initYPosition}px)`    
  } 
});

onUnmounted(() => {
  console.log("UNMOUNT");
  clearInterval(internalClock);
  clearInterval(hungerClock);
});
</script>

<template>
  <div ref="fish" class="fixed" @click="isAlive ?  resetHungerClock() : undefined">
    <img ref="fishImage" class="h-24" :src="getImageUrl(isAlive ? imgSrc : 'dead.png')"/>
    <div class="text-center text-white bg-opacity-50 bg-black">{{ name }}</div>
    <div ref="hungerBar" class="h-2 animate-hunger-bar"></div>
    <!-- hunger bar -->
    <!-- DEBUG -->
    <!-- <div class="text-sm flex flex-col">
      <div>tick: {{ tickInterval }}ms</div>
      <div>ppm: {{ pixelsPerMove }}px</div>
    </div> -->
  </div>

</template>

<style scoped>
</style>
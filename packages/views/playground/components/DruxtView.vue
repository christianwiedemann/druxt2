<template>
  <div>
    <slot name="results"></slot>
  </div>
  <div @click="$emit('reload')">Reload</div>
</template>

<script setup lang="ts">
import type { CommonProps } from "./common.ts"
import { clsx } from "clsx"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableHeaderProps>(), {
  class: undefined,
  style: undefined,
})
</script>

<script lang="ts">
export interface TableHeaderProps extends CommonProps { }
</script>

<template>
  <Primitive as="thead" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<style scoped></style>

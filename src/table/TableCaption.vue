<script setup lang="ts">
import type { CommonProps } from "./common.ts"
import { clsx } from "clsx"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableCaptionProps>(), {
  class: undefined,
  style: undefined,
})
</script>

<script lang="ts">
export interface TableCaptionProps extends CommonProps {

}
</script>

<template>
  <Primitive as="caption" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<style scoped></style>

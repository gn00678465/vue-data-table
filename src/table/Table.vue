<script setup lang="ts">
import type { CommonProps } from "./common"
import { clsx } from "clsx"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableProps>(), {
  class: undefined,
  style: undefined,
})
</script>

<script lang="ts">
export interface TableProps extends CommonProps {

}
</script>

<template>
  <Primitive as="table" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<style scoped></style>

<script setup lang="ts">
import type { CommonProps } from "./common.ts"
import { clsx } from "clsx"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableBodyProps>(), {
  class: undefined,
  style: undefined,
})
</script>

<script lang="ts">
export interface TableBodyProps extends CommonProps {

}
</script>

<template>
  <Primitive as="tbody" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<style lang="scss" scoped></style>

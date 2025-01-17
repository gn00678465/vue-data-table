<template>
  <Primitive as="tbody" :class="clsx(props.class)" :style="props.style">
    <slot />
  </Primitive>
</template>

<script setup>
import { Primitive } from 'vue-materials/primitive'
import { clsx } from "clsx"
import type { CommonProps } from './common.ts'

const props = withDefaults(defineProps < TableBodyProps > (), {
  class: undefined,
  style: undefined
})

</script>

<script lang="ts">
export interface TableBodyProps extends CommonProps {

}

</script>

<style lang="scss" scoped></style>

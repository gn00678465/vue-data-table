<template>
  <div>
    <Primitive as="table" :class="clsx(props.class)" :style="props.style">
      <slot></slot>
    </Primitive>
  </div>
</template>

<script setup lang="ts">
import { Primitive } from "vue-materials/primitive"
import type { CommonProps } from "./common";
import { clsx } from 'clsx'

const props = withDefaults(defineProps<TableProps>(), {
  class: undefined,
  style: undefined
})

</script>

<script lang="ts">
export interface TableProps extends CommonProps {

}

</script>

<style scoped></style>

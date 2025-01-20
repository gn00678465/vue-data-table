<script setup lang="ts">
import type { CommonProps } from "./common.ts"
import { clsx } from "clsx"
import { computed } from "vue"
import { Primitive } from "vue-materials/primitive"

const props = withDefaults(defineProps<TableHeadProps>(), {
  class: undefined,
  style: undefined,
})

const delegateProps = computed(() => {
  const { class: _, style: __, ...delegated } = props
  return delegated
})
</script>

<script lang="ts">
export interface TableHeadProps extends CommonProps {
  align?: "left" | "center" | "right" | "justify" | "char"
  colspan?: number | string
  headers?: string
  rowspan?: number | string
  scope?: string
  abbr?: string
}
</script>

<template>
  <Primitive as="th" :class="clsx(props.class)" :style="props.style" v-bind="delegateProps">
    <slot />
  </Primitive>
</template>

<style scoped></style>

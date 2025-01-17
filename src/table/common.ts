import type { CSSProperties, HTMLAttributes } from "vue";

export type CommonProps = {
  class?: HTMLAttributes['class']
  style?: CSSProperties | string
}

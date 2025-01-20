import type { CSSProperties, HTMLAttributes } from "vue"

export interface CommonProps {
  class?: HTMLAttributes["class"]
  style?: CSSProperties | string
}

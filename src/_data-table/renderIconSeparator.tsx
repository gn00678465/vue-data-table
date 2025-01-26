import type { CSSProperties, HTMLAttributes, VNodeChild } from "vue"

interface IconSeparatorBaseProps {
  class?: HTMLAttributes["class"]
  style?: string | CSSProperties
}

interface IconSeparatorProps extends IconSeparatorBaseProps {
  [x: string]: unknown
}

export function renderIconSeparator(props: IconSeparatorProps = {}): VNodeChild {
  return (
    <svg {...{ ...props }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
      <rect width={1} height={24} x={11.5} rx={0.5}></rect>
    </svg>
  )
}

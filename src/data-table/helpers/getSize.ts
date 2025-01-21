import type { CSSProperties } from "vue"

function clamp(num: number, max: number, min: number): number {
  return Math.max(Math.min(num, max), min)
}

export function getSize(size?: number): string | undefined {
  if (size)
    return `${size}px`
  return undefined
}

export function getSizeToStyle(size?: number, maxSize?: number, minSize?: number): CSSProperties {
  return Object.fromEntries([
    ["--width", getSize(size)],
    ["--max-width", getSize(maxSize)],
    ["--min-width", getSize(minSize)],
  ].filter(([, v]) => Boolean(v)))
}

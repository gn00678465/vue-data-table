import type { Updater } from "@tanstack/vue-table"
import type { Ref } from "vue"

export function valueUpdater<T>(updater: Updater<T>, old: Ref<T>): void {
  old.value = updater instanceof Function ? updater(old.value) : updater
}

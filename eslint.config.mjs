import antfu from "@antfu/eslint-config"

export default antfu({
  type: "lib",
  vue: true,
  markdown: true,
  stylistic: {
    indent: 2,
    quotes: "double",
    jsx: true,
  },
  jsx: true,
  typescript: true,
  jsonc: false,
  yaml: false,
  ignores: ["**/packages/materials", "**/docs"],
})

import antfu from "@antfu/eslint-config"

export default antfu({
  type: "lib",
  vue: true,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  jsx: true,
  typescript: true,
  jsonc: false,
  yaml: false,
  ignores: ["**/packages/materials", "**/docs"],
})

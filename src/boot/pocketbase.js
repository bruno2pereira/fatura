import { boot } from 'quasar/wrappers'
import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.VITE_POCKETBASE_URL || 'https://toosag.pockethost.io')

export default boot(({ app }) => {
  app.config.globalProperties.$pb = pb
})

export { pb }

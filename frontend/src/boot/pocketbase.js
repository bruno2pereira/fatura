import { boot } from 'quasar/wrappers'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export default boot(({ app }) => {
  app.config.globalProperties.$pb = pb
})

export { pb }

import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

// Função para obter a língua do localStorage ou do navegador
const getDefaultLocale = () => {
  // Primeiro, tenta obter do localStorage
  const savedLocale = localStorage.getItem('user-locale')
  if (savedLocale && messages[savedLocale]) {
    return savedLocale
  }
  
  // Se não encontrar, usa a língua do navegador
  const browserLocale = navigator.language || navigator.userLanguage
  
  // Verifica se existe tradução exata (ex: pt-PT)
  if (messages[browserLocale]) {
    return browserLocale
  }
  
  // Verifica se existe tradução para o código de língua base (ex: pt)
  const languageCode = browserLocale.split('-')[0]
  const matchingLocale = Object.keys(messages).find(locale => 
    locale.startsWith(languageCode)
  )
  
  if (matchingLocale) {
    return matchingLocale
  }
  
  // Fallback para pt-PT
  return 'pt-PT'
}

const i18n = createI18n({
  locale: getDefaultLocale(),
  fallbackLocale: 'pt-PT',
  legacy: false, // comment this out if not using Composition API
  globalInjection: true,
  messages,
})

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }

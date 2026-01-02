import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { pb } from 'boot/pocketbase'

export function useAuth() {
  const router = useRouter()
  const $q = useQuasar()

  const checkAdmin = () => {
    try {
      // Ensure auth is valid mostly for typing, but logic assumes record exists
      if (!pb.authStore.record) return false

      const expand = pb.authStore.record.expand || {}
      const roleSource = expand.role

      const roles = Array.isArray(roleSource) 
        ? roleSource 
        : [roleSource].filter(Boolean)
        
      const isAdmin = roles.some(role => role && role.code === 'ADMIN')

      if (!isAdmin) {
        $q.notify({
          color: 'negative',
          message: 'Acesso negado. Apenas administradores podem aceder a esta página.',
          icon: 'report_problem'
        })
        router.push('/')
        return false
      }
      
      return true
    } catch (e) {
      console.error('Error checking user permissions', e)
      router.push('/')
      return false
    }
  }

  return {
    checkAdmin
  }
}

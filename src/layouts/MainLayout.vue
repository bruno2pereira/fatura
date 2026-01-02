<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title :class="$q.screen.lt.sm ? 'text-subtitle1' : ''" class="cursor-pointer" @click="router.push('/')">NeonRetreat APP</q-toolbar-title>
        
        <q-space />

        <div v-if="user" class="row items-center q-gutter-x-sm">
          <q-btn round flat>
            <q-avatar size="38px" color="white" text-color="primary">
              <img v-if="avatarUrl" :src="avatarUrl">
              <span v-else class="text-weight-bold">{{ userInitial }}</span>
            </q-avatar>
            <q-menu auto-close>
              <q-list style="min-width: 150px">
                <q-item class="text-center bg-grey-2 q-py-md">
                   <q-item-section>
                     <div class="text-weight-bold">{{ user.name || 'Utilizador' }}</div>
                     <div class="text-caption text-grey">{{ user.email }}</div>
                   </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout" class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Sair</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { pb } from 'boot/pocketbase'

const router = useRouter()

const user = computed(() => pb.authStore.model)

const avatarUrl = computed(() => {
  if (user.value && user.value.avatar) {
    return pb.files.getURL(user.value, user.value.avatar)
  }
  return null
})

const userInitial = computed(() => {
  if (user.value) {
    const name = user.value.name || user.value.email || '?'
    return name.charAt(0).toUpperCase()
  }
  return '?'
})

const logout = () => {
  pb.authStore.clear()
  router.push('/login')
}
</script>

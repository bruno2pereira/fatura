<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-gradient-primary">
      <q-toolbar class="q-py-sm">
        
        <q-toolbar-title 
          class="cursor-pointer text-weight-bold" 
          @click="router.push('/')"
          style="letter-spacing: 0.5px;"
        >
          {{ $t('app.name') }}
        </q-toolbar-title>
        
        <q-space />

        <div v-if="user" class="row items-center q-gutter-x-sm">
          <q-btn round flat class="q-pa-xs">
            <q-avatar size="40px" class="bg-white text-primary shadow-1">
              <img v-if="avatarUrl" :src="avatarUrl">
              <span v-else class="text-weight-bold">{{ userInitial }}</span>
            </q-avatar>
            <q-menu auto-close transition-show="jump-down" transition-hide="jump-up" :offset="[0, 10]">
              <q-list style="min-width: 200px" class="rounded-borders">
                <q-item class="text-center q-py-lg">
                   <q-item-section>
                     <q-avatar size="60px" class="bg-white text-primary shadow-1 q-mx-auto q-mb-sm">
                        <img v-if="avatarUrl" :src="avatarUrl">
                        <span v-else class="text-weight-bold text-h5">{{ userInitial }}</span>
                     </q-avatar>
                     <div class="text-weight-bold text-subtitle1">{{ user.name || $t('auth.user') }}</div>
                     <div class="text-caption text-grey-7">{{ user.email }}</div>
                   </q-item-section>
                </q-item>
                 <q-item clickable v-close-popup @click="router.push('/settings')" class="q-py-md">
                   <q-item-section avatar>
                     <q-icon name="settings" />
                   </q-item-section>
                   <q-item-section class="text-weight-medium">{{ $t('profile.settings') }}</q-item-section>
                 </q-item>
                 <q-separator />
                 <q-item clickable v-close-popup @click="logout" class="text-negative q-py-md">
                   <q-item-section avatar>
                     <q-icon name="logout" />
                   </q-item-section>
                   <q-item-section class="text-weight-medium">{{ $t('auth.logout') }}</q-item-section>
                 </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title :class="$q.screen.lt.sm ? 'text-subtitle1' : ''" @click="router.push('/')">NeonRetreat APP</q-toolbar-title>
        <div v-if="$q.screen.gt.xs" class="text-caption">v1.0</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

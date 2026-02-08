<template>
  <div v-if="showAd" class="adsense-container q-my-md text-center">
    <!-- AdSense Placeholder for Development -->
    <div v-if="isDev" class="ad-placeholder bg-grey-3 q-pa-md rounded-borders">
      <div class="text-caption text-grey-8">Advertisement Reference</div>
      <div class="text-bold">{{ format }} (Slot: {{ slotId }})</div>
    </div>

    <!-- Real AdSense Unit -->
    <ins v-else
         class="adsbygoogle"
         style="display:block"
         :data-ad-client="clientId"
         :data-ad-slot="slotId"
         :data-ad-format="format"
         :data-full-width-responsive="responsive ? 'true' : 'false'"></ins>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'

 defineProps({
  slotId: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: 'auto'
  },
  responsive: {
    type: Boolean,
    default: true
  }
})

// Replace with your real AdSense Main ID
const clientId = 'ca-pub-XXXXXXXXXXXXXX' 

const isDev = process.env.DEV

const showAd = computed(() => {
  // Logic to hide ads for paid users could go here in future
  return true
})

onMounted(() => {
  if (!isDev && showAd.value) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense Error:', e)
    }
  }
})
</script>

<style scoped>
.ad-placeholder {
  border: 2px dashed #ccc;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

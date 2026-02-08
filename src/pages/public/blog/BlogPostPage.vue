<template>
  <q-page padding class="container-limit q-mx-auto">
    <div v-if="post">
       <q-breadcrumbs class="q-mb-md text-grey-7" active-color="primary">
        <q-breadcrumbs-el :label="$t('public.blog.home')" to="/" />
        <q-breadcrumbs-el :label="$t('public.blog.blog')" to="/blog" />
        <q-breadcrumbs-el :label="post.title" />
      </q-breadcrumbs>

      <h1 class="text-h3 text-weight-bold q-mb-sm">{{ post.title }}</h1>
      <div class="row items-center text-grey-6 q-mb-xl">
        <q-icon name="schedule" class="q-mr-xs" />
        <span class="q-mr-md">{{ post.date }}</span>
        <q-icon name="person" class="q-mr-xs" />
        <span>{{ $t('public.blog.author') }}</span>
      </div>

      <!-- Top Ad -->
      <AdSenseBlock slotId="blog-top" />

      <div class="text-body1 q-gutter-y-md article-content" v-html="post.content"></div>

      <!-- Bottom Ad -->
      <AdSenseBlock slotId="blog-bottom" />

      <q-separator class="q-my-xl" />

      <div class="text-center">
        <h3 class="text-h5 text-weight-bold q-mb-md">{{ $t('public.blog.likedArticle') }}</h3>
        <p class="q-mb-md">{{ $t('public.blog.likedArticleDesc') }}</p>
        <q-btn color="primary" :label="$t('public.blog.createAccount')" to="/login" />
      </div>
    </div>
    <div v-else class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdSenseBlock from 'components/ads/AdSenseBlock.vue'
import { blogPosts } from './blogData.js'

const route = useRoute()
const post = ref(null)

const loadPost = () => {
  const slug = route.params.slug
  const found = blogPosts.find(p => p.slug === slug)
  if (found) {
    post.value = found
  }
}

onMounted(loadPost)
watch(() => route.params.slug, loadPost)
</script>

<style scoped>
.container-limit {
  max-width: 800px;
  width: 100%;
}
.article-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1976d2;
}
.article-content :deep(p) {
  line-height: 1.6;
  color: #424242;
}
</style>

<template>
  <q-page padding class="container-limit q-mx-auto">
    <div class="text-center q-mb-xl">
      <h1 class="text-h3 text-weight-bold q-mb-md">Blog & Literacia Financeira</h1>
      <p class="text-h6 text-grey-7">Dicas, guias e reflexões sobre como dominar o seu dinheiro.</p>
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="post in blogPosts" :key="post.id" class="col-12 col-md-6">
        <q-card class="modern-card full-height column no-wrap hover-scale cursor-pointer" @click="$router.push('/blog/' + post.slug)">
          
          <!-- Mock Cover Image -->
          <div class="h-48 bg-gradient-primary relative-position overflow-hidden">
             <div class="absolute-full flex flex-center">
                <q-icon name="article" size="40px" color="white" style="opacity: 0.3" />
             </div>
          </div>

          <q-card-section class="q-pt-md">
            <div class="text-overline text-secondary text-weight-bold">{{ post.date }}</div>
            <div class="text-h5 q-mb-sm text-weight-bold text-dark lh-tight">
              {{ post.title }}
            </div>
            <div class="text-body1 text-grey-6 ellipsis-3-lines">
               {{ post.excerpt }}
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-md q-mt-auto">
             <q-btn flat color="primary" label="Ler Artigo" icon-right="arrow_forward" no-caps class="full-width text-weight-bold" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    
     <div class="container-limit q-mx-auto q-mt-xl">
      <AdSenseBlock slotId="blog-index-bottom" />
    </div>
  </q-page>
</template>

<script setup>
import { blogPosts } from './blogData.js'
import AdSenseBlock from 'components/ads/AdSenseBlock.vue'
</script>

<style scoped>
.container-limit {
  max-width: 1000px;
  width: 100%;
}
.hover-shadow:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
.transition-swing {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>

<template>
  <div>
    <KeyHandler />
    <RouterView class="content-body" />
    <BaseDialogForm />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useWeb3, KeyHandler } from '@/gotbit-tools/vue'

import BaseDialogForm from '@/components/dialogs/BaseDialogForm.vue'

useWeb3().init()
</script>

<style></style>

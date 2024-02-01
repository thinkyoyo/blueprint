<script lang="ts" setup>
import { useForm } from './hooks'

const { myTest, onCopy, onGetFilePath } = useForm()
</script>

<template>
  <a-space direction="vertical" class="w-fill">
    <a-card title="测试页面">
      {{ myTest }}
      <a-button type="link" @click="onCopy">复制</a-button>
      <a-button type="link" @click="onGetFilePath">获取PATH</a-button>
    </a-card>
  </a-space>
</template>

<script lang="ts" setup>
import { useContextmenu, useMenu, useResize, useMove } from './hooks'

defineOptions({
  name: 'MyHeader'
})
const { menuList, modal, onMenuItem, onMenuChildItem, onClearAll, onHideDropdown, handleOk } = useMenu()
const { onContextmenu } = useContextmenu({ menuList, onClearAll, onHideDropdown })
const { resizeList } = useResize()
const { onMousedown } = useMove()
</script>

<template>
  <!-- 头部 -->
  <header class="my-header" @contextmenu.prevent="onContextmenu" @mousedown="onMousedown">
    <div class="lf">
      <!-- logo -->
      <div class="logo">
        <img src="../../assets/logo.svg" alt="图片" mode="contain" title="blueprint" />
      </div>
      <!-- 菜单 -->
      <ul class="menu-list" @click.stop>
        <li class="menu-item" :class="{ active: item.state }" v-for="item in menuList" :key="item.value" @click="onMenuItem(item)">
          {{ item.label }}(
          <span class="line">{{ item.shortcut }}</span>
          )
          <ul class="dropdown-list" v-if="item.children?.length" @click.stop>
            <li class="dropdown-item" v-for="it in item.children" :key="it.value" @click="onMenuChildItem(it)">
              <span>{{ it.label }}</span>
              <span>{{ it.shortcut }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="center">Demo</div>
    <!-- 设置大小 -->
    <ul class="resize-list" @click.stop>
      <li class="item" v-for="item in resizeList" :key="item.value" @click="item.action && item.action()"><span :class="['iconfont', item.iconName]"></span></li>
    </ul>
  </header>
  <a-modal v-model:open="modal.visible" v-bind="{ title: modal.title, cancelText: modal.cancelText, okButtonProps: modal.okButtonProps, okText: modal.okText }" @ok="handleOk">
    <p v-if="modal.content">{{ modal.content }}</p>
  </a-modal>
</template>

<style scoped lang="less">
@import './index.less';
</style>

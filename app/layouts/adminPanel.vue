<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

defineProps<Pick<SidebarProps, 'variant' | 'collapsible' | 'side'>>()
const { isOpen: open, toggle: _toggleSidebar } = useAdminSidebar()

const items: NavigationMenuItem[] = [
  {
    label: 'Homepage',
    icon: 'i-lucide-house',
    active: true
  },
  {
    label: 'Portfolio Projects',
    icon: 'i-lucide-inbox',
    badge: '4'
  },
  {
    label: 'About',
    icon: 'i-lucide-users'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-users'
  }
]
</script>

<template>
  <div
    class="flex flex-1"
    :class="[
      variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
      side === 'right' && 'flex-row-reverse'
    ]"
  >
    <USidebar
      v-model:open="open"
      variant="inset"
      :collapsible="collapsible"
      :side="side"
      :ui="{
        container: 'h-full'
      }"
    >
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </USidebar>

    <div
      class="peer-data-[variant=inset]:ring-default bg-default flex flex-1 flex-col overflow-hidden peer-data-[variant=inset]:m-4 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring lg:peer-data-[variant=floating]:my-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0"
    >
      <div class="flex-1 p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

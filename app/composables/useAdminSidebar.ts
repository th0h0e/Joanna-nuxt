// composables/useAdminSidebar.ts
export const useAdminSidebar = () => {
  const isOpen = useState('admin-sidebar-open', () => true)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return { isOpen, toggle }
}

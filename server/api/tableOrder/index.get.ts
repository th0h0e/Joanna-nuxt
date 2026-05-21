const storage = useStorage('portfolioOrder')

export default defineEventHandler(async () => {
  const order = await storage.getItem<string[]>('order')
  return order ?? []
})

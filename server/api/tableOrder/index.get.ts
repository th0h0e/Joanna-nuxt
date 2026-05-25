const storage = useStorage('portfolioOrder')

export default defineEventHandler(async event => {
  const key = getQuery(event).key as string | undefined
  const storageKey = key ? `order-${key}` : 'order'
  const order = await storage.getItem<string[]>(storageKey)
  return order ?? []
})

const storage = useStorage('portfolioOrder')

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const key = body.key as string | undefined
  const storageKey = key ? `order-${key}` : 'order'
  await storage.setItem(storageKey, body.orderedIds)
  return { success: true }
})

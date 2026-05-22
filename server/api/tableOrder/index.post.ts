const storage = useStorage('portfolioOrder')

export default defineEventHandler(async event => {
  const body = await readBody(event)
  await storage.setItem('order', body.orderedIds)
  return { success: true }
})

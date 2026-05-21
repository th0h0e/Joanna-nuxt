const storage = useStorage('portfolioOrder')

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const order = await storage.getItem<string[]>('order')
    return order ?? []
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    console.log('POST /api/tableOrder received:', body)
    await storage.setItem('order', body.orderedIds)
    return { success: true }
  }
})

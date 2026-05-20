import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)

  // Expect: { orders: [{ id: string, order: number }, ...] }
  const body = await readBody(event)
  const orders: Array<{ id: string, order: number }> = body?.orders

  if (!Array.isArray(orders) || orders.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'orders must be a non-empty array of { id, order }' })
  }

  // Update each record's Order field
  const results = await Promise.all(
    orders.map(async ({ id, order }) => {
      const formData = new FormData()
      formData.append('Order', String(order))

      const response = await fetch(
        `${pocketbaseUrl}/api/collections/Portfolio_Projects/records/${id}`,
        {
          method: 'PATCH',
          body: formData
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw createError({ statusCode: response.status, statusMessage: error.message || `Failed to update order for ${id}` })
      }

      return response.json()
    })
  )

  // Invalidate cache after mutations
  await $fetch('/api/portfolio/invalidate', { method: 'POST' })

  return { success: true, updated: results.length }
})

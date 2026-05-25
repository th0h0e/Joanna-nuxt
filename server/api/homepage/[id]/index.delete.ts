export default defineEventHandler(async event => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing homepage record ID' })
  }

  try {
    const response = await fetch(`${pocketbaseUrl}/api/collections/Homepage/records/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      let message = 'Delete failed'
      try {
        const error = await response.json()
        message = error.message || message
      } catch {
        // Body may be empty for DELETE responses
      }
      throw createError({ statusCode: response.status, statusMessage: message })
    }

    return sendNoContent(event)
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})

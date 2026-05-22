export default defineEventHandler(async event => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' })
  }

  const response = await fetch(
    `${pocketbaseUrl}/api/collections/Portfolio_Projects/records/${id}`,
    { method: 'DELETE' }
  )

  if (!response.ok) {
    const error = await response.json()
    throw createError({
      statusCode: response.status,
      statusMessage: error.message || 'Delete failed'
    })
  }

  sendNoContent(event)
})

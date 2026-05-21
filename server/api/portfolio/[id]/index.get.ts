export default defineEventHandler(async (event) => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing project ID' })
  }

  const response = await fetch(
    `${pocketbaseUrl}/api/collections/Portfolio_Projects/records/${id}`
  )

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Project not found' })
  }

  const item: {
    id: string
    Title: string
    Description: string
    Images: string[]
    Responsibility_json: unknown
    created: string
    updated: string
  } = await response.json()

  return {
    id: item.id,
    title: item.Title,
    description: item.Description,
    images: item.Images,
    responsibility: item.Responsibility_json,
    created: item.created,
    updated: item.updated
  }
})

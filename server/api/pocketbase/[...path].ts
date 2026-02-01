/**
 * PocketBase API Proxy
 * Proxies all requests to the PocketBase backend
 */

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const method = event.method
  const query = getQuery(event)
  const body = method !== 'GET' && method !== 'HEAD' ? await readBody(event).catch(() => null) : null

  const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://admin.kontext.site'

  // Get authorization header from request
  const headers = getRequestHeaders(event)
  const authHeader = headers.authorization || ''

  // Build query string
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const url = `${POCKETBASE_URL}/api/${path}${queryString ? `?${queryString}` : ''}`

  try {
    const response = await $fetch(url, {
      method,
      body,
      headers: {
        ...(authHeader && { Authorization: authHeader }),
        'Content-Type': 'application/json',
      },
      ignoreResponseError: true,
    })

    return response
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'PocketBase request failed',
      data: error.data,
    })
  }
})

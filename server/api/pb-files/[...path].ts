/**
 * PocketBase File Proxy
 * Proxies file requests to serve images and other files from PocketBase
 * Example: /api/pb-files/Homepage/abc123/hero.jpg
 */

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const query = getQuery(event)

  const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://admin.kontext.site'

  // Build the file URL
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const fileUrl = `${POCKETBASE_URL}/api/files/${path}${queryString ? `?${queryString}` : ''}`

  try {
    // Fetch the file from PocketBase
    const response = await fetch(fileUrl)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'File not found'
      })
    }

    // Get the file data
    const blob = await response.blob()
    const buffer = await blob.arrayBuffer()

    // Set appropriate headers
    setResponseHeaders(event, {
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': response.headers.get('content-length') || ''
    })

    // Return the file buffer
    return new Uint8Array(buffer)
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch file'
    })
  }
})

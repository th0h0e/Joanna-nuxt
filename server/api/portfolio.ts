/**
 * Server-side API endpoint to fetch Portfolio Projects from PocketBase
 * GET /api/portfolio
 *
 * Query parameters (optional):
 * - sort: string (e.g., 'Order', '-created')
 * - filter: string (e.g., 'Title != ""')
 * - page: number (default: 1)
 * - perPage: number (default: 50)
 * - mode: 'list' | 'full' | 'first' (default: 'list')
 */
import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Get PocketBase URL from environment or use default
  const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://admin.kontext.site'

  // Initialize PocketBase
  const pb = new PocketBase(POCKETBASE_URL)

  try {
    console.log('[Server] Fetching from PocketBase using SDK')

    // Parse query parameters
    const mode = (query.mode as string) || 'list'
    const page = Number(query.page) || 1
    const perPage = Number(query.perPage) || 50
    const sort = (query.sort as string) || 'Order'
    const filter = query.filter as string | undefined
    const expand = query.expand as string | undefined

    // Build options object
    const options: any = {}
    if (sort) options.sort = sort
    if (filter) options.filter = filter
    if (expand) options.expand = expand

    let result

    // Use different PocketBase SDK methods based on mode
    if (mode === 'full') {
      // Fetch all records at once (no pagination)
      console.log('[Server] Using getFullList with options:', options)
      result = await pb.collection('Portfolio_Projects').getFullList(options)
    }
    else if (mode === 'first' && filter) {
      // Fetch only the first record matching the filter
      console.log('[Server] Using getFirstListItem with filter:', filter)
      result = await pb.collection('Portfolio_Projects').getFirstListItem(filter, options)
    }
    else {
      // Fetch paginated list (default)
      console.log('[Server] Using getList with page:', page, 'perPage:', perPage, 'options:', options)
      result = await pb.collection('Portfolio_Projects').getList(page, perPage, options)
    }

    console.log('[Server] Successfully fetched portfolio projects')

    return result
  }
  catch (error: any) {
    console.error('[Server] Error fetching portfolio projects:', error)

    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to fetch portfolio projects',
      data: error.data
    })
  }
})

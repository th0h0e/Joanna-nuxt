export default defineEventHandler(async event => {
  const { pocketbaseUrl } = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing settings record ID' })
  }

  try {
    const response = await fetch(`${pocketbaseUrl}/api/collections/Settings/records/${id}`)

    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: 'Settings record not found' })
    }

    const item: {
      id: string
      Desktop_Font_Size?: number
      Large_Desktop_Font_Size?: number
      Mobile_Font_Size?: number
      Show_Top_Progress_Bar?: boolean
      Tablet_Font_Size?: number
      favicon?: string
      created: string
      updated: string
    } = await response.json()

    return {
      id: item.id,
      desktopFontSize: item.Desktop_Font_Size,
      largeDesktopFontSize: item.Large_Desktop_Font_Size,
      mobileFontSize: item.Mobile_Font_Size,
      showTopProgressBar: item.Show_Top_Progress_Bar,
      tabletFontSize: item.Tablet_Font_Size,
      favicon: item.favicon,
      created: item.created,
      updated: item.updated
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
    throw createError({ statusCode: 503, statusMessage: 'PocketBase is unreachable' })
  }
})

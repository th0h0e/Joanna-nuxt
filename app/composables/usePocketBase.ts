/**
 * PocketBase Client Composable
 * Provides a typed PocketBase client that proxies through Nuxt API
 *
 * Use the PocketBase SDK directly:
 * @example
 * const pb = usePocketBase()
 * const records = await pb.collection('Portfolio_Projects').getFullList({ sort: 'Order' })
 * const record = await pb.collection('Portfolio_Projects').getOne('RECORD_ID')
 * const result = await pb.collection('Portfolio_Projects').getList(1, 50, { filter: 'Order > 0' })
 */

import PocketBase from 'pocketbase'
import type {
  TypedPocketBase,
  CollectionResponses
} from '~/shared/types/pocketbase-types'

let pb: TypedPocketBase | null = null

/**
 * Get the typed PocketBase instance
 * Uses the Nuxt API proxy endpoint (/api/pocketbase)
 *
 * @example
 * const pb = usePocketBase()
 *
 * // Get all records
 * const records = await pb.collection('Portfolio_Projects').getFullList({
 *   sort: 'Order'
 * })
 *
 * // Get paginated list
 * const result = await pb.collection('Portfolio_Projects').getList(1, 50, {
 *   filter: 'Title != ""',
 *   sort: '-created'
 * })
 *
 * // Get single record
 * const record = await pb.collection('Portfolio_Projects').getOne('RECORD_ID', {
 *   expand: 'author'
 * })
 *
 * // Get first matching record
 * const first = await pb.collection('Portfolio_Projects').getFirstListItem('Order = 1')
 *
 * // Create record
 * const created = await pb.collection('Portfolio_Projects').create({
 *   Title: 'New Project',
 *   Description: 'Description here'
 * })
 *
 * // Update record
 * const updated = await pb.collection('Portfolio_Projects').update('RECORD_ID', {
 *   Title: 'Updated Title'
 * })
 *
 * // Delete record
 * await pb.collection('Portfolio_Projects').delete('RECORD_ID')
 */
export function usePocketBase(): TypedPocketBase {
  if (!pb) {
    // Use the Nuxt API proxy as the base URL
    pb = new PocketBase('/api/pocketbase') as TypedPocketBase

    // Disable auto-cancellation to prevent issues with navigation
    pb.autoCancellation(false)
  }

  return pb
}

/**
 * Get the URL for a PocketBase file (image, document, etc.)
 * Proxies through /api/pb-files for security
 *
 * @example
 * const imageUrl = usePocketBaseFileUrl(project, 'hero.jpg', { thumb: '800x600' })
 *
 * // In template:
 * <img :src="usePocketBaseFileUrl(record, record.Hero_Image, { thumb: '400x300' })" />
 */
export function usePocketBaseFileUrl<T extends keyof CollectionResponses>(
  record: CollectionResponses[T] | null | undefined,
  filename: string,
  options?: {
    thumb?: string // e.g., '100x100', '0x100', '100x0'
  }
): string {
  if (!record || !filename) {
    return ''
  }

  const collection = record.collectionName
  const recordId = record.id

  let url = `/api/pb-files/${collection}/${recordId}/${filename}`

  if (options?.thumb) {
    url += `?thumb=${options.thumb}`
  }

  return url
}

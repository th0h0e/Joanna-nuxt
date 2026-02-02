/**
 * PocketBase Realtime Composable
 * Handles real-time subscriptions to PocketBase collections
 */

import type { CollectionResponses } from '~/shared/types/pocketbase-types'
import type { RecordSubscription } from 'pocketbase'

export function usePocketBaseRealtime<T extends keyof CollectionResponses>(
  collection: T,
  options?: {
    recordId?: string
    filter?: string
  }
) {
  const pb = usePocketBase()
  const data = ref<CollectionResponses[T] | null>(null)
  const isSubscribed = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Subscribe to collection changes
   */
  const subscribe = async () => {
    try {
      const target = options?.recordId || '*'

      await pb.collection(collection).subscribe(
        target,
        (e: RecordSubscription<CollectionResponses[T]>) => {
          data.value = e.record
        },
        options?.filter ? { filter: options.filter } : undefined
      )

      isSubscribed.value = true
      error.value = null
    } catch (err: any) {
      error.value = err
      console.error('Subscription error:', err)
    }
  }

  /**
   * Unsubscribe from collection changes
   */
  const unsubscribe = async () => {
    try {
      if (options?.recordId) {
        await pb.collection(collection).unsubscribe(options.recordId)
      } else {
        await pb.collection(collection).unsubscribe()
      }
      isSubscribed.value = false
    } catch (err: any) {
      error.value = err
      console.error('Unsubscribe error:', err)
    }
  }

  // Auto cleanup on component unmount
  onUnmounted(() => {
    if (isSubscribed.value) {
      unsubscribe()
    }
  })

  return {
    data,
    isSubscribed,
    error,
    subscribe,
    unsubscribe
  }
}

/**
 * Subscribe to multiple records in a collection
 * @example
 * const { items, subscribe } = usePocketBaseRealtimeList('Portfolio_Projects')
 * await subscribe()
 */
export function usePocketBaseRealtimeList<T extends keyof CollectionResponses>(
  collection: T,
  options?: {
    filter?: string
  }
) {
  const pb = usePocketBase()
  const items = ref<Map<string, CollectionResponses[T]>>(new Map())
  const isSubscribed = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Subscribe to all records in the collection
   */
  const subscribe = async () => {
    try {
      await pb.collection(collection).subscribe(
        '*',
        (e: RecordSubscription<CollectionResponses[T]>) => {
          if (e.action === 'delete') {
            items.value.delete(e.record.id)
          } else {
            items.value.set(e.record.id, e.record)
          }
        },
        options?.filter ? { filter: options.filter } : undefined
      )

      isSubscribed.value = true
      error.value = null
    } catch (err: any) {
      error.value = err
      console.error('Subscription error:', err)
    }
  }

  /**
   * Unsubscribe from collection
   */
  const unsubscribe = async () => {
    try {
      await pb.collection(collection).unsubscribe()
      isSubscribed.value = false
    } catch (err: any) {
      error.value = err
      console.error('Unsubscribe error:', err)
    }
  }

  // Convert Map to array for easier template usage
  const itemsArray = computed(() => Array.from(items.value.values()))

  // Auto cleanup on component unmount
  onUnmounted(() => {
    if (isSubscribed.value) {
      unsubscribe()
    }
  })

  return {
    items: itemsArray,
    isSubscribed,
    error,
    subscribe,
    unsubscribe
  }
}

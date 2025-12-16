import { describe, it, expect, vi } from 'vitest'
import { 
  defaultPayloadBuilder, 
  lomkitPayloadBuilder, 
  graphqlPayloadBuilder,
  createCustomPayloadBuilder 
} from '../index'

describe('Payload Builders Index', () => {
  const params = { page: 2, itemsPerPage: 20 }

  it('defaultPayloadBuilder returns basic format', () => {
    const result = defaultPayloadBuilder(params) as any
    expect(result.page).toBe(2)
    expect(result.per_page).toBe(20)
  })

  it('lomkitPayloadBuilder returns lomkit format', () => {
    const result = lomkitPayloadBuilder(params) as any
    expect(result.pagination).toEqual({ page: 2, limit: 20 })
  })

  it('graphqlPayloadBuilder returns graphql format', () => {
    const result = graphqlPayloadBuilder(params) as any
    expect(result.pagination).toEqual({ page: 2, limit: 20 })
  })

  it('createCustomPayloadBuilder returns the provided function', () => {
    const customFn = (p: any) => ({ custom: p.page })
    const builder = createCustomPayloadBuilder(customFn)
    expect(builder(params)).toEqual({ custom: 2 })
  })
})

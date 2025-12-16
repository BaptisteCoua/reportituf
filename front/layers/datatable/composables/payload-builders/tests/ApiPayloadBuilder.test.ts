import { describe, it, expect } from 'vitest'
import { ApiPayloadBuilder } from '../ApiPayloadBuilder'

describe('ApiPayloadBuilder', () => {
  const builder = new ApiPayloadBuilder()
  const baseParams = { page: 1, itemsPerPage: 10 }

  it('build calls buildDefault', () => {
    const result = builder.build(baseParams)
    const expected = builder.buildDefault(baseParams)
    expect(result).toEqual(expected)
  })

  it('buildDefault with all params', () => {
    const params = { 
      ...baseParams, 
      sortBy: 'name', 
      sortOrder: 'desc' as const,
      search: 'test',
      filters: { status: 'active' }
    }
    const result = builder.buildDefault(params) as any
    
    expect(result).toEqual({
      page: 1,
      per_page: 10,
      sort_by: 'name',
      sort_order: 'desc',
      search: 'test',
      filters: { status: 'active' }
    })
  })

  it('buildLomkitPayload with all params', () => {
    const params = { 
      ...baseParams, 
      sortBy: 'id',
      search: 'findme',
      filters: { role: 'admin' }
    }
    const result = builder.buildLomkitPayload(params) as any

    expect(result.pagination).toEqual({ page: 1, limit: 10 })
    expect(result.sorts).toEqual([{ field: 'id', direction: 'asc' }])
    expect(result.search).toEqual({ query: 'findme' })
    expect(result.filters).toEqual([{ field: 'role', operator: '=', value: 'admin' }])
  })

  it('buildGraphQLPayload with all params', () => {
    const params = { 
      ...baseParams, 
      sortBy: 'date', 
      sortOrder: 'desc' as const,
      search: 'gql',
      filters: { category: 1 }
    }
    const result = builder.buildGraphQLPayload(params) as any

    expect(result.pagination).toEqual({ page: 1, limit: 10 })
    expect(result.sort).toEqual({ field: 'date', order: 'DESC' })
    expect(result.search).toBe('gql')
    expect(result.

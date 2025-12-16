import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DataTableSelection } from './DataTableSelection'
import { ref, computed } from 'vue'

describe('DataTableSelection', () => {
  let state: any
  let selection: DataTableSelection<any>
  const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }]

  beforeEach(() => {
    state = {
      getSelectedItems: vi.fn(() => ref([])),
      setSelectedItems: vi.fn(),
      getItems: vi.fn(() => ref(items))
    }
    selection = new DataTableSelection(state)
  })

  it('selectItem toggles selection state', () => {
    state.getSelectedItems.mockReturnValue(ref([]))
    selection.selectItem(items[0])
    expect(state.setSelectedItems).toHaveBeenCalledWith([items[0]])

    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    selection.selectItem(items[0])
    expect(state.setSelectedItems).toHaveBeenCalledWith([])
  })

  it('selectItems adds multiple items without duplicates', () => {
    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    selection.selectItems([items[0], items[1]])
    expect(state.setSelectedItems).toHaveBeenCalledWith([items[0], items[1]])
  })

  it('deselectItems removes correct items', () => {
    state.getSelectedItems.mockReturnValue(ref([items[0], items[1]]))
    selection.deselectItems([items[0]])
    expect(state.setSelectedItems).toHaveBeenCalledWith([items[1]])
  })

  it('selectAll toggles between all and empty', () => {
    state.getSelectedItems.mockReturnValue(ref([]))
    selection.selectAll()
    expect(state.setSelectedItems).toHaveBeenCalledWith(items)

    state.getSelectedItems.mockReturnValue(ref(items))
    selection.selectAll()
    expect(state.setSelectedItems).toHaveBeenCalledWith([])
  })

  it('selectPage toggles items of the current page', () => {
    const page = [items[0], items[1]]
    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    selection.selectPage(page)
    expect(state.setSelectedItems).toHaveBeenCalledWith([items[0], items[1]])

    state.getSelectedItems.mockReturnValue(ref([items[0], items[1]]))
    selection.selectPage(page)
    expect(state.setSelectedItems).toHaveBeenCalledWith([])
  })

  it('isSelected verifies by key', () => {
    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    expect(selection.isSelected(items[0])).toBe(true)
    expect(selection.isSelected(items[1])).toBe(false)
  })

  it('isAllSelected identifies complete selection', () => {
    state.getSelectedItems.mockReturnValue(ref(items))
    expect(selection.isAllSelected().value).toBe(true)

    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    expect(selection.isAllSelected().value).toBe(false)
  })

  it('isIndeterminate identifies partial selection', () => {
    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    expect(selection.isIndeterminate().value).toBe(true)

    state.getSelectedItems.mockReturnValue(ref(items))
    expect(selection.isIndeterminate().value).toBe(false)
  })

  it('handles custom itemKey as function', () => {
    const custom = new DataTableSelection(state, (i: any) => i.name)
    state.getSelectedItems.mockReturnValue(ref([items[0]]))
    expect(custom.isSelected({ id: 99, name: 'A' })).toBe(true)
  })

  it('getSelectedIds returns list of IDs', () => {
    state.getSelectedItems.mockReturnValue(ref([items[0], items[1]]))
    expect(selection.getSelectedIds().value).toEqual([1, 2])
  })

  it('clearSelection empties the state', () => {
    selection.clearSelection()
    expect(state.setSelectedItems).toHaveBeenCalledWith([])
  })
})

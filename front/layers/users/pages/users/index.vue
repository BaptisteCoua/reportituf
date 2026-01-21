<script setup lang="ts">
import { useUserTable } from '../../composables/useUserTable'
import { useUserForm } from '../../composables/useUserForm'
import { UserService } from '../../services/UserService'
import type { User } from '../../types'

const table = useUserTable()
const userForm = useUserForm()

const roleFilter = ref<'customer' | 'admin' | null>(null)

const handleSearch = (value: string) => {
  table.setSearch(value)
}

const handleRoleFilter = (value: 'customer' | 'admin' | null) => {
  roleFilter.value = value
  table.setFilter('role', value)
}

const handlePageChange = async (page: number) => {
  await table.setPage(page)
}

const handleItemsPerPageChange = async (itemsPerPage: number) => {
  await table.setItemsPerPage(itemsPerPage)
}

const handleSort = async (key: string) => {
  await table.toggleSort(key)
}

const handleEdit = (user: User) => {
  userForm.openEdit(user)
}

const handleDelete = async (user: User) => {
  if (confirm(`Delete user ${user.name}?`)) {
    await UserService.delete(user.id)
    await table.refresh()
  }
}

const handleAdd = () => {
  userForm.openCreate()
}

const handleSubmit = async () => {
  const result = await userForm.submit()
  if (result) {
    userForm.close()
    await table.refresh()
  }
}

const handleCancel = () => {
  userForm.close()
}
</script>

<template>
  <UserListTemplate
    :items="table.items.value"
    :headers="table.headers.value"
    :loading="table.isLoading.value"
    :page="table.pagination.value.page"
    :items-per-page="table.pagination.value.itemsPerPage"
    :total-items="table.pagination.value.totalItems"
    :search="table.search.value"
    :role-filter="roleFilter"
    :dialog-open="userForm.dialog.value"
    :form="userForm.form.value"
    :form-errors="userForm.errors.value"
    :is-editing="userForm.isEditing.value"
    :is-submitting="userForm.isSubmitting.value"
    @update:page="handlePageChange"
    @update:items-per-page="handleItemsPerPageChange"
    @update:search="handleSearch"
    @update:role-filter="handleRoleFilter"
    @update:dialog-open="userForm.dialog.value = $event"
    @update:form="userForm.form.value = $event"
    @sort="handleSort"
    @edit="handleEdit"
    @delete="handleDelete"
    @add="handleAdd"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

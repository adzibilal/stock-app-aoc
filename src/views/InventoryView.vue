<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const inventory = ref([])
const searchQuery = ref('')

async function getInventory() {
  const { data } = await supabase.from('inventory').select()
  inventory.value = data
}

onMounted(() => {
  getInventory()
})

function filteredInventory() {
  return inventory.value.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
}
</script>

<template>
  <div class="container">
    <br /><br />
    <h1>Inventory Stok Bahan Baku</h1>
    <br />
    <div class="mb-3">
      <label for="search" class="form-label">Search</label>
      <input type="text" class="form-control" id="search" v-model="searchQuery" />
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nama</th>
          <th scope="col">Stock</th>
          <th scope="col">Unit</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredInventory()" :key="item.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.unit }}</td>
          <td>
            <button
              type="button"
              class="btn btn-warning"
              data-bs-toggle="modal"
              :data-bs-target="'#modal' + item.id"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      v-for="item in inventory"
      :key="item.id"
      class="modal fade"
      :id="'modal' + item.id"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Stock {{ item.name }}</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

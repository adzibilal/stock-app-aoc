<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const inventory = ref([])
const searchQuery = ref('')

async function getInventory() {
  const { data } = await supabase.from('inventory').select()
  inventory.value = data
}
async function addItem() {
  // mengambil nilai dari input field
  const name = document.getElementById('name').value
  const stock = document.getElementById('stock').value
  const unit = document.getElementById('unit').value
  const price = document.getElementById('price').value
  console.error(name, stock, unit, price)
  // melakukan request ke server untuk mengubah data
  const { data, error } = await supabase
    .from('inventory')
    .insert({ name, stock, unit, price })
    .select()

  if (error) {
    // handle error jika gagal
    console.error(error.message)
  } else {
    // handle response jika sukses
    console.error(data)

    // menutup modal
    document.getElementById('closemodalAdd').click()

    // reset nilai form
    document.getElementById('name').value = ''
    document.getElementById('stock').value = ''
    document.getElementById('unit').value = ''
    document.getElementById('price').value = ''

    getInventory()
  }
}
async function editItem(itemID) {
  // mengambil nilai dari input field
  const name = document.getElementById('name' + itemID).value
  const stock = document.getElementById('stock' + itemID).value
  const unit = document.getElementById('unit' + itemID).value
  const price = document.getElementById('price' + itemID).value
  console.error(name, stock, unit, price)
  // melakukan request ke server untuk mengubah data
  const { data, error } = await supabase
    .from('inventory')
    .upsert({id: itemID, name, stock, unit, price })
    .select()

  if (error) {
    // handle error jika gagal
    console.error(error.message)
  } else {
    // handle response jika sukses
    console.error(data)

    // menutup modal
    document.getElementById('closemodal' + itemID).click()

    // reset nilai form
    document.getElementById('name' + itemID).value = ''
    document.getElementById('stock' + itemID).value = ''
    document.getElementById('unit' + itemID).value = ''
    document.getElementById('price' + itemID).value = ''

    getInventory()
  }
}
async function deleteInventory(id) {
  if (window.confirm('Yakin ingin hapus item ini?')) {
    const { error } = await supabase.from('inventory').delete().eq('id', id)

    if (error) {
      console.error(error)
    } else {
      getInventory()
    }
  } else {
    // User clicked Cancel
    // Do nothing or perform some other action
  }
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
    <button
      type="button"
      class="btn btn-sm btn-primary"
      data-bs-toggle="modal"
      :data-bs-target="'#modalAdd'"
    >
      Tambah Inventory
    </button>
    <br /><br />
    <div class="mb-3">
      <label for="search" class="form-label">Search</label>
      <input type="text" class="form-control" id="search" v-model="searchQuery" />
    </div>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nama</th>
          <th scope="col">Stock</th>
          <th scope="col">Unit</th>
          <th scope="col">Harga</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredInventory()" :key="item.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.unit }}</td>
          <td>{{ item.price }}</td>
          <td>
            <button
              type="button"
              class="btn btn-sm btn-warning"
              data-bs-toggle="modal"
              :data-bs-target="'#modal' + item.id"
            >
              Edit
            </button>
            <button type="button" class="btn btn-sm btn-danger" @click="deleteInventory(item.id)">
              Hapus
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
      id="modalAdd"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Tambah Inventory</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addItem()">
              <div class="mb-3">
                <label for="name" class="form-label">Nama Stock</label>
                <input type="text" class="form-control" id="name" />
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input type="text" class="form-control" id="stock" />
              </div>
              <div class="mb-3">
                <label for="unit" class="form-label">Unit</label>
                <input type="text" class="form-control" id="unit" />
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Harga</label>
                <input type="number" class="form-control" id="price" />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  id="closemodalAdd"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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
          <div class="modal-body">
            <form @submit.prevent="editItem(item.id)">
              <div class="mb-3">
                <label for="name" class="form-label">Nama Stock</label>
                <input type="text" class="form-control" :id="'name' + item.id" :value="item.name" />
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input
                  type="text"
                  class="form-control"
                  :id="'stock' + item.id"
                  :value="item.stock"
                />
              </div>
              <div class="mb-3">
                <label for="unit" class="form-label">Unit</label>
                <input type="text" class="form-control" :id="'unit' + item.id" :value="item.unit" />
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Harga</label>
                <input
                  type="number"
                  class="form-control"
                  :id="'price' + item.id"
                  :value="item.price"
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  :id="'closemodal' + item.id"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const menu = ref([])
const inventory = ref([])
const searchQuery = ref('')
const namaResep = ref('')

const recepies = ref([
  {
    id_inventory: '',
    jumlah: '',
    unit: ''
  }
])

async function getMenu() {
  const { data } = await supabase.from('menu').select()
  menu.value = data
}
async function getInventory() {
  const { data } = await supabase.from('inventory').select()
  inventory.value = data
}
onMounted(() => {
  getMenu()
  getInventory()
  console.error(menu.value)
})

function filteredMenu() {
  return menu.value.filter((item) => {
    return item.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
}

function addItemRow() {
  recepies.value.push({
    id_inventory: '',
    jumlah: '',
    unit: ''
  })
}

function removeItem(index) {
  recepies.value.splice(index, 1)
}

async function deleteMenu(id) {
  if (window.confirm('Yakin ingin hapus item ini?')) {
    const { error } = await supabase.from('menu').delete().eq('id', id)

    if (error) {
      console.error(error)
    } else {
      getMenu()
    }
  } else {
    // User clicked Cancel
    // Do nothing or perform some other action
  }
}

async function addItem() {
  console.error('Nama Menu', namaResep.value)
  console.error('resep', recepies.value)
  // melakukan request ke server untuk mengubah data
  const { data, error } = await supabase
    .from('menu')
    .insert({ nama: namaResep.value, resep: recepies.value })
    .select()

  if (error) {
    // handle error jika gagal
    console.error(error.message)
  } else {
    // handle response jika sukses
    console.error(data)

     // menutup modal
     document.getElementById('closemodalAdd').click()

    // reset value
    recepies.value = [
      {
        id_inventory: '',
        jumlah: '',
        unit: ''
      }
    ]
    getMenu()
  }
}
</script>

<template>
  <div class="container">
    <br /><br />
    <h1>Menu Resep AOC Cimahi</h1>
    <br />
    <button
      type="button"
      class="btn btn-sm btn-primary"
      data-bs-toggle="modal"
      :data-bs-target="'#modalAdd'"
    >
      Tambah Menu
    </button>
    <br /><br />
    <div class="mb-3">
      <label for="search" class="form-label">Search</label>
      <input type="text" class="form-control" id="search" v-model="searchQuery" />
    </div>

    <div class="row">
      <div v-for="(item, index) in filteredMenu()" :key="index" class="col-md-4">
        <div class="item-menu">
         
          <p class="sub-title">Nama Menu</p>
          {{ item.nama }}
          <br />
          <br />
          <p class="sub-title">Resep</p>
          <div v-for="(resep, index) in item.resep" :key="index" class="item-resep">
            <div
              v-for="(inv, index) in inventory"
              :key="index"
              :class="{ undis: inv.id !== resep.id_inventory }"
            >
              <div v-if="inv.id === resep.id_inventory">{{ inv.name }}</div>
            </div>
            <div class="desc">
              {{ resep.jumlah }}
              {{ resep.unit }}
            </div>
          </div>
          <br>

          <button type="button" class="btn btn-sm btn-danger" @click="deleteMenu(item.id)">
            Hapus
          </button>
        </div>
        <br />
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalAdd"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
                <label for="nama" class="form-label">Nama Menu</label>
                <input
                  type="text"
                  class="form-control"
                  id="nama_resep"
                  v-model="namaResep"
                  required
                />
              </div>

              <label for="stock" class="form-label">Resep</label>
              <div class="row" id="item-resep" v-for="(item, index) in recepies" :key="index">
                <div class="col-md-12">
                  <select name="" class="form-select" v-model="item.id_inventory" required>
                    <option :value="inv.id" v-for="(inv, index) in inventory" :key="index">
                      {{ inv.name }}({{ inv.unit }})
                    </option>
                  </select>
                  <br />
                </div>
                <div class="col-md-5">
                  <select name="" class="form-select" v-model="item.unit" required>
                    <option value="ml">ml</option>
                    <option value="gr">gr</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
                <div class="col-md-5">
                  <input
                    type="text"
                    class="form-control"
                    id="qty"
                    v-model="item.jumlah"
                    placeholder="Jumlah"
                    required
                  />
                </div>
                <div class="col-md-1">
                  <button type="button" class="btn btn-danger" @click="removeItem(index)">X</button>
                </div>
                <br /><br />
                <hr />
              </div>
              <div class="row">
                <div class="col-md-12">
                  <button type="button" class="btn btn-primary" @click="addItemRow()">
                    Tambah Bahan
                  </button>
                </div>
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
  </div>
</template>

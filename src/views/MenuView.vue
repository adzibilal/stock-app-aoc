<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const menu = ref([])
const inventory = ref([])
const searchQuery = ref('')

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
</script>

<template>
  <div class="container">
    <br /><br />
    <h1>Menu Resep AOC Cimahi</h1>
    <br />
    <div class="mb-3">
      <label for="search" class="form-label">Search</label>
      <input type="text" class="form-control" id="search" v-model="searchQuery" />
    </div>
    
    <div class="row">
      <div v-for="(item, index) in filteredMenu()" :key="index" class="col-md-4">
        <div class="item-menu">
          <p class="sub-title">Nama Menu</p>
          {{ item.nama }}
          <br> <br>
          <p class="sub-title">Resep</p>
          <div v-for="(resep, index) in item.resep" :key="index" class="item-resep">
            <div v-for="(inv, index) in inventory" :key="index" :class="{ undis : inv.id !== resep.id_inventory}">
              <div v-if="inv.id === resep.id_inventory">{{inv.name}}</div>
            </div>
            <div class="desc">
              {{ resep.jumlah }}
              {{ resep.unit }}
            </div>
          </div>
        </div>
        <br>
      </div>
    </div>

   
  </div>
</template>

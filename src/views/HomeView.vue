<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const inventory = ref([])

async function getInventory() {
  const { data } = await supabase.from('inventory').select()
  inventory.value = data
}

onMounted(() => {
  getInventory()
})
</script>

<template>
  <div class="container">
    <br><br>
    <h1>Selamat Datang</h1>
    <br>
    <div class="row">
      <div class="col-sm-4 mb-3 mb-sm-0">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Inventory</h5>
            <p class="card-text">Kelola Stok</p>
            <a href="/inventory" class="btn btn-primary">Kelola</a>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Transaksi</h5>
            <p class="card-text">Lihat rekap transaksi</p>
            <a href="#" class="btn btn-primary">Lihat</a>
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Menu</h5>
            <p class="card-text">Kelola Resep Menu</p>
            <a href="#" class="btn btn-primary">Kelola</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template>
  <div id="app">
    <div class="container">
      <AddItem />
      <Items />
    </div>
  </div>
</template>

<script>
import Items from './components/Items.vue'
import AddItem from './components/AddItem.vue'

export default {
  name: 'App',
  components: {
    Items,
    AddItem
  }
}
</script>

<style>

body {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  line-height: 1.6;
  background: #e8f7f0;
}

.container {
  max-width: 1100px;
  margin: auto;
  overflow: auto;
  padding: 0 2rem;
}

</style>

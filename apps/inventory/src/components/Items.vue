<template>
  <div class="items">
      <h3>Items</h3>
      <div v-for="item in allItems" v-bind:key="item._id" class="item">
        <h3>{{item.name}}</h3>
        <p>{{item.desc}}</p>
        <img :src="item.img" class="image-fit" />
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "Items",
    methods: {
        ...mapActions(['fetchItems'])
    },
    computed: mapGetters(['allItems']),
    created() {
        this.fetchItems();
    }
}
</script>

<style scoped>
    .items {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1rem;
    }

    .item {
        border: 1px solid #ccc;
        background: #41b883;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        position: relative;
        cursor: pointer;
    }

    .image-fit{
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
</style>
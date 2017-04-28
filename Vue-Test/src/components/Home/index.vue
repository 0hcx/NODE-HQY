<template>
  <div class="wrapper">
    <Topbar></Topbar>
    <div class="bd">
      <Sidebar></Sidebar>
      <div class="right-bd">
        <div v-if="tab === 'SEARCH'" class="main">
          <SearchJob></SearchJob>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Topbar from './topbar'
import Sidebar from './sidebar'
import SearchJob from './searchJob'

export default {
  components: { Topbar, Sidebar, SearchJob },
  data () {
    return {
      tab: 'SEARCH'
    }
  },
  methods: {
  }
}

</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.bd {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 100%;
}

.right-bd {
  flex-basis: 100px;
  flex-grow: 2;
}


</style>

<template>
  <div class="wrapper">
    <Topbar></Topbar>
    <div class="bd">
      <Sidebar v-on:toggleTab="toggleTab"></Sidebar>
      <div class="right-bd">
        <div class="main">
          <SearchJob v-if="tab === 'SEARCH'"></SearchJob>
          <StarJobs v-if="tab === 'STAR'"></StarJobs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Topbar from './topbar'
import Sidebar from './sidebar'
import SearchJob from './searchJob'
import StarJobs from './starJobs'

export default {
  components: { Topbar, Sidebar, SearchJob, StarJobs },
  data () {
    return {
      tab: this.$store.getters.getTab
    }
  },
  methods: {
    toggleTab () {
      this.tab = this.$store.getters.getTab
    }
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

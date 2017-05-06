<template>
    <div class="main" v-show="tab === 'STAR'">
      <!-- 展示结果 -->
      <SearchResult :descType="descType"></SearchResult>
      <!-- 底部页号栏 -->
      <Pagination :pageCount="pageCount" @pageChanged="pageChanged"></Pagination>
    </div>
</template>

<script>
import { searchJobs } from '../../vuex/actions'
import Pagination from '../common/pagination'
import SearchResult from '../common/searchResult'

export default {
  components: { Pagination, SearchResult },
  data () {
    return {
      searchResults: [],
      page: 1,
      descType: 'CANCLE_STAR'
    }
  },
  props: {
    tab: {
      type: String,
      default: ''
    }
  },
  watch: {
    tab: function (tab) {
      if (tab === 'STAR') {
        this.onSubmit()
        this.$store.dispatch('showStar', 'clear')
      }
    },
    updateStar: function (val) {
      this.onSubmit()
    }
  },
  computed: {
    updateStar () {
      return this.$store.getters.getUpdateStar
    },
    pageCount () {
      return this.$store.getters.getStarJobs.pageCount
    }
  },
  methods: {
    onSubmit () {
      var searchData = {
        uid: sessionStorage.getItem('uid'),
        page: this.page
      }
      searchJobs('STAR', searchData)
    },
    pageChanged (page) {
      this.page = page
      this.onSubmit()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>

.main {
  display: flex;
  flex-direction: column;
}

.searchForm {
  background-color: #ddd;
  
  form {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 80px;
    padding: 10px;

    .input-group {
      width: 240px;
    }
    >div:nth-child(n+1) {
      margin-left: 24px;
    }
    .salary-group {
      display: flex;
      flex-direction: row;
      align-items: center;

      .input-group {
        width: 90px;
      }

      input {
        width: 90px;
      }
    }
  }
}

</style>

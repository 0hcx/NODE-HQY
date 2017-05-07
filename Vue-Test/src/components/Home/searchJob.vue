<template>
    <div class="main" v-show="tab === 'SEARCH'">
      <div class="searchForm">
        <form @submit.prevent="onSubmit">
          <div class="input-group">
            <span class="input-group-addon">公司名称</span>
            <input type="text" class="form-control" placeholder="公司名称" v-model="company">
          </div>
          <div class="input-group">
          <span class="input-group-addon">职位类型</span>
            <input type="text" class="form-control" placeholder="职位类型" v-model="type">
          </div>
          <div class="salary-group">
            <div class="input-group">
              <span class="input-group-addon">月薪</span>
              <input type="number" class="form-control" placeholder="Min" v-model.number="salaryMin">
            </div>
            &nbsp;-&nbsp;
            <input type="number" class="form-control" placeholder="Max" v-model.number="salaryMax">
          </div>
          <div>
            <button type="button" class="btn btn-primary" @click='onSubmit(-1)'>查询</button>
          </div>
        </form>
      </div>
      <!-- 展示结果 -->
      <SearchResult :descType="descType"></SearchResult>
      <!-- 底部页号栏 -->
      <Pagination :pageCount="pageCount" @pageChanged="pageChanged"></Pagination>
    </div>
</template>

<script>
// import Axios from 'axios'
import { searchJobs } from '../../lib/vueHelper'
import Pagination from '../common/pagination'
import SearchResult from '../common/searchResult'

export default {
  components: { SearchResult, Pagination },
  data () {
    return {
      company: '',
      type: '',
      salaryMin: '',
      salaryMax: '',
      searchResults: [],
      page: 1,
      descType: 'DO_STAR'
    }
  },
  props: {
    tab: {
      type: String,
      default: ''
    }
  },
  computed: {
    pageCount () {
      return this.$store.getters.getSearchJobs.pageCount
    }
  },
  methods: {
    onSubmit () {
      let searchData = {
        company: this.company,
        type: this.type,
        salaryMin: this.salaryMin,
        salaryMax: this.salaryMax,
        page: this.page
      }
      searchData.salaryMin = (searchData.salaryMin === '') ? -1 : searchData.salaryMin
      searchData.salaryMax = (searchData.salaryMax === '') ? 99999999 : searchData.salaryMax
      searchJobs('ALL', searchData)
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

.searchResult {
  height: 650px;
  flex-grow: 1;
  overflow-y: auto;
}

table {

  tr {
    cursor: pointer;
  }

  th {
    text-align: center;
  }

  td {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .jobList {
    overflow-y: scroll;
  }
}

.pageButtons {

  a:hover {
    cursor: pointer;
  }
}

</style>

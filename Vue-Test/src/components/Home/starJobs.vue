<template>
    <div class="main" v-show="tab === 'STAR'">
      <DescMsg :jobDesc="jobDesc" :showMsg="showMsg" v-on:hideMsg="hideJobDesc"></DescMsg>
      <!-- 展示结果 -->
      <div class="searchResult">
        <table class="table table-hover">
          <tbody class="jobList">
            <tr>
              <th v-for="item in title">{{ item }}</th>
            </tr>
            <tr v-for="(item, index) in searchResults" @click="showDesc(index)">
              <td v-for="(value, key) in item" v-if="key !== '_id' && key !== '__v'">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 底部页号栏 -->
      <Pagination :pageCount="pageCount" @pageChanged="pageChanged"></Pagination>
    </div>
</template>

<script>
import Axios from 'axios'
import API from '../../api'
import DescMsg from './descMsg'
import Pagination from './pagination'

export default {
  components: { DescMsg, Pagination },
  data () {
    return {
      title: ['标题', '公司', '月薪', '地点', '发布时间', '最低学历', '工作经验', '详情', '福利', '职位类别', '招聘人数'],
      searchResults: [],
      pageCount: 0,
      page: 1,
      jobDesc: [],
      showMsg: false
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
    }
  },
  methods: {
    onSubmit () {
      var searchData = {
        uid: sessionStorage.getItem('uid'),
        page: this.page
      }
      Axios.post(API.getStarJob, searchData)
      .then(res => {
        this.searchResults = res.data.results // 单页查询结果
        this.pageCount = res.data.pageCount
        // console.log(searchData.page)
      })
      .catch(err => {
        console.log(err)
      })
    },
    showDesc (index) {
      let item = this.searchResults[index]
      this.jobDesc = [
        { title: '_id', value: item._id },
        { title: '标题', value: item.posname },
        { title: '公司', value: item.company },
        { title: '月薪', value: item.money },
        { title: '地点', value: item.area },
        { title: '发布时间', value: item.pubdate },
        { title: '最低学历', value: item.edu },
        { title: '工作经验', value: item.exp },
        { title: '详情', value: item.desc },
        { title: '福利', value: item.welfare },
        { title: '职位类别', value: item.type },
        { title: '招聘人数', value: item.count }
      ]
      this.showMsg = true
    },
    hideJobDesc () {
      this.showMsg = false
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

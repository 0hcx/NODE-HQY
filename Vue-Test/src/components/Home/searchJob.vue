<template>
    <div class="main">
      <DescMsg :jobDesc="jobDesc" :showMsg="showMsg" v-on:hideMsg="hideJobDesc"></DescMsg>
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
      <div class="searchResult">
        <table class="table table-hover">
          <tbody class="jobList">
            <tr>
              <th v-for="item in title">{{ item }}</th>
            </tr>
            <tr v-for="(item, index) in searchResults" @click="showDesc(index)">
              <td v-for="value in item">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 底部页号栏 -->
      <div class="pageButtons">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li :class="{disabled: minPage}">
              <a aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li v-for="(item, index) of pageList" :class="{active: item.active}">
              <a @click="onSubmit(index)">{{ item.value }}</a>
            </li>
            <li :class="{disabled: maxPage}">
              <a aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
</template>

<script>
import Axios from 'axios'
import DescMsg from './descMsg'

export default {
  components: { DescMsg },
  data () {
    return {
      company: '',
      type: '',
      salaryMin: '',
      salaryMax: '',
      title: ['标题', '公司', '月薪', '地点', '发布时间', '最低学历', '工作经验', '详情', '福利', '职位类别', '招聘人数'],
      searchResults: [],
      page: {
        selected: 0,  // 选中页数
        count: 0,     // 总页数
        size: 10      // 最大显示页数
      },
      pageList: [
        {active: false, value: 1}
      ],
      minPage: false,
      maxPage: false,
      jobDesc: [],
      showMsg: false
    }
  },
  methods: {
    onSubmit (index) {
      if (index === -1) {
        index = 0
        this.page.selected = 0
        this.pageList = [
          {active: false, value: 1}
        ]
      }
      let searchData = {
        company: this.company,
        type: this.type,
        salaryMin: this.salaryMin,
        salaryMax: this.salaryMax,
        page: this.pageList[index].value
      }
      searchData.salaryMin = (searchData.salaryMin === '') ? -1 : searchData.salaryMin
      searchData.salaryMax = (searchData.salaryMax === '') ? 99999999 : searchData.salaryMax
      Axios.post('http://localhost:3000/api/searchJobs', searchData)
      .then(res => {
        this.searchResults = res.data.results       // 单页查询结果
        this.page.count = res.data.pageCount   // 总页数
        console.log('总页数' + this.page.count)           // 总数据量
        // 页号栏变动
        // this.pageList = []
        let pageNumber = 1  // 实际页号like15页
        if (index >= 6 && (this.page.count - this.pageList[9].value) > 0) {
          pageNumber = this.pageList[1].value
          index--
        } else if (index < 6 && this.pageList[0].value !== 1) {
          pageNumber = this.pageList[0].value - 1
          index++
        }
        this.pageList = []
        this.page.size = (this.page.count > 10) ? 10 : this.page.count
        for (let i = 0; i < this.page.size; i++) {
          let item = {
            active: false,
            value: pageNumber
          }
          pageNumber++
          this.pageList.push(item)
        }
        // 改变当前选中页号下标样式
        this.pageList[this.page.selected].active = false
        this.pageList[index].active = true
        this.page.selected = index
        console.log(searchData.page)
      })
      .catch(err => {
        console.log(err)
      })
    },
    showDesc (index) {
      let item = this.searchResults[index]
      this.jobDesc = [
        {title: '标题', value: item.posname},
        {title: '公司', value: item.company},
        {title: '月薪', value: item.money},
        {title: '地点', value: item.area},
        {title: '发布时间', value: item.pubdate},
        {title: '最低学历', value: item.edu},
        {title: '工作经验', value: item.exp},
        {title: '详情', value: item.desc},
        {title: '福利', value: item.welfare},
        {title: '职位类别', value: item.type},
        {title: '招聘人数', value: item.count}
      ]
      this.showMsg = true
    },
    hideJobDesc () {
      this.showMsg = false
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

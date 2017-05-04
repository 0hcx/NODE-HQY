<template>
  <div class="searchResult">
    <DescMsg :jobDesc="jobDesc" :showMsg="showMsg" :descType="descType" @hideMsg="hideJobDesc"></DescMsg>
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
</template>

<script>
import DescMsg from './descMsg'

export default {
  components: { DescMsg },
  data () {
    return {
      title: ['标题', '公司', '月薪', '地点', '发布时间', '最低学历', '工作经验', '详情', '福利', '职位类别', '招聘人数'],
      jobDesc: [],
      showMsg: false
    }
  },
  props: {
    searchResults: {
      type: Array,
      defalut: []
    },
    descType: {
      type: String,
      defalut: ''
    }
  },
  methods: {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

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

</style>

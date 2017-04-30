<template>
  <div class="wrapper" @click="hideShade" v-if="showMsg">
    <div class="msgBox">
      <h4 class="msgTitle">详情介绍</h4>
      <table class="table table-hover">
        <tbody class="jobList">
          <tr v-for="item in jobDesc" :key="item.id">
            <td class="title">{{ item.title }}</td>
            <td class="ctn">{{ item.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  props: {
    jobDesc: {
      type: Array,
      default: []
    },
    showMsg: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hideShade () {
      this.$emit('hideMsg')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>

@white: #FFFFFF;
@blue: #20A0FF;

.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 0%, .7);
  z-index: 999;
}

.msgBox {
  width: 400px;
  height: auto;
  background-color: @blue;
  border-radius: 1em;

  h4 {
    color: @white;
  }

  table {
    background-color: #E5E9F2;
    margin-bottom: 0;
    border-bottom-right-radius: 1em;
    border-bottom-left-radius: 1em;
  }

  .title {
    width: 100px;
    border-right: 1px solid #333744;
  }

  .ctn {
    width: 300px;
    max-height: 150px;
    padding: 5px;
    display: -webkit-box;
    overflow: auto;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    line-height: 25px;
    word-wrap: break-word;
    word-break: normal;
  }


}



</style>

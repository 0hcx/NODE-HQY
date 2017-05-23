<template>
    <div class="main" v-show="tab === 'CHART'">
        <!--各职业所占比例-->
        <div id="chartCount" class="chart"></div>
        <!-- 各职业工资对比 -->
        <div id="chartSalary" style="width:1000px;height:420px;" class="chart"></div>
    </div>
</template>

<script>
import { getChartData } from '../../lib/vueHelper'
import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts)

export default {
  components: {},
  data () {
    return {
    }
  },
  props: {
    tab: {
      type: String,
      default: ''
    }
  },
  created () {
    this.onSubmit()
  },
  mounted () {
    // highcharts
    Highcharts.setOptions({
      lang: {
        printChart: '打印图表',
        downloadJPEG: '下载JPEG 图片',
        downloadPDF: '下载PDF文档',
        downloadPNG: '下载PNG 图片',
        downloadSVG: '下载SVG 矢量图',
        exportButtonTitle: '导出图片'
      },
      credits: {
        enabled: false
      }
    })
  },
  updated () {
    Highcharts.chart('chartCount', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
      },
      title: {
        text: '各职业的数量占比情况'
      },
      tooltip: {
        headerFormat: '{series.name}<br>',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: '职业数量占比',
        data: this.$store.getters.getChart.count
      }]
    })
    // salary
    Highcharts.chart('chartSalary', {
      chart: {
        type: 'column'
      },
      title: {
        text: '各职业的月薪对比情况'
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: '月薪 (元)'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '月薪: <b>{point.y:.1f} 元</b>'
      },
      series: [{
        name: '月薪',
        data: this.$store.getters.getChart.salary,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    })
  },
  computed: {
  },
  methods: {
    onSubmit () {
      // var searchData = {
      //   uid: sessionStorage.getItem('uid')
      // }
      getChartData({ chartType: 'COUNT' })
      getChartData({ chartType: 'SALARY' })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
/*  padding-bottom: 100%;*/
}

.chart {
  margin-bottom: 30px;
  flex-shrink: 0;
  border: 1px solid #ddd;
}

</style>

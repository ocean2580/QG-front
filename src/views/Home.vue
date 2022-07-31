<template>
  <div>
    <el-row>
      <el-col :span="10">
        <div id="main" style="width: 500px;height: 400px"></div>
      </el-col>

      <el-col :span="10">
        <div id="pie" style="width: 800px;height: 600px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "Home",
  data() {
    return {}
  },
  mounted() { // 页面元素渲染后再触发

    // line and bar
    var option = {
      title: {
        text: "各季度注册人数",
        subtext: "趋势图",
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'line',
        },
        {
          data: [],
          type: 'bar',
        }
      ]
    };
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    // pie
    var pieOption = {
      title: {
        text: "各季度注册人数",
        subtext: "比例图",
        left: 'center'
      },
      legend: {
        top: 'bottom'
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataView: { show: true, readOnly: true },
        }
      },
      series: [
        {
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8,
          },
          data: [],  // 填空
        }
      ]
    };
    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);

    // data
    this.request.get("/echarts/members").then(res => {
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data

      myChart.setOption(option);

      pieOption.series[0].data = [
        {name: "第一季度", value: res.data[0]},
        {name: "第二季度", value: res.data[1]},
        {name: "第三季度", value: res.data[2]},
        {name: "第四季度", value: res.data[3]},
      ]

      pieChart.setOption(pieOption);

    })
  }
}
</script>

<style scoped>

</style>
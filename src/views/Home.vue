<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px">

      <el-col :span="6">
        <el-card style="color: #409eff">
          <div><i class="el-icon-user-solid"/> user</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            100
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card style="color: #f56c6c">
          <div><i class="el-icon-money"/> sale</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            $ 100,000,000
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card style="color: #67c23a">
          <div><i class="el-icon-bank-card"/> profit</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">$ 90,000,000</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card style="color: #e6a23c">
          <div><i class="el-icon-s-shop"/> store</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">32</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px;height: 450px"></div>
      </el-col>

      <el-col :span="12">
        <div id="pie" style="width: 500px;height: 400px"></div>
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
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
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
          name: 'Android',
          data: [],
          type: 'bar',
        },
        {
          name: 'Android',
          data: [],
          type: 'line',
        },
        {
          name: 'IOS',
          data: [],
          type: 'bar',
        },
        {
          name: 'IOS',
          data: [],
          type: 'line',
        }
      ]
    };
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    // pie
    var pieOption = {
      title: {
        text: '各季度会员数量统计',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Android',
          type: 'pie',
          radius: '50%',
          center: ['25%', '50%'],
          label: {            //饼图图形上的文本标签
            normal: {
              show: true,
              position: 'inner', //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 14,    //文字的字体大小
                color: "#fff"
              },
              formatter: '{c} \n {d}%'
            }
          },
          data: [],  // 填空
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },

        {
          name: 'IOS',
          type: 'pie',
          radius: '55%',
          center: ['75%', '50%'],
          label: {            //饼图图形上的文本标签
            normal: {
              show: true,
              position: 'inner', //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 14,    //文字的字体大小
                color: "#fff"
              },
              formatter: '{c} \n {d}%'
            }
          },
          data: [
            {name: "第一季度", value: 5},
            {name: "第二季度", value: 6},
            {name: "第三季度", value: 7},
            {name: "第四季度", value: 8},
          ],
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

      option.series[2].data = [5, 6, 7, 8]
      option.series[3].data = [5, 6, 7, 8]

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
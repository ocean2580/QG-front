<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="name" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">search</el-button>
      <el-button type="warning" @click="reset">reset</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-upload action="http://116.205.186.165:9090/file/upload" :show-file-list="false" :on-success="handleFileUploadSuccess" style="display: inline-block">
        <el-button type="primary" class="ml-5">upload <i class="el-icon-top"></i></el-button>
      </el-upload>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='ok'
          cancel-button-text='next time'
          icon="el-icon-info"
          icon-color="red"
          title="Are you sure to delete these data in batch?"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference">Batch delete <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>

    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="name"></el-table-column>
      <el-table-column prop="type" label="type"></el-table-column>
      <el-table-column prop="size" label="size(kb)"></el-table-column>
      <el-table-column label="download">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)">download</el-button>
        </template>
      </el-table-column>
      <el-table-column label="enable">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc" @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="operation"  width="200" align="center">
        <template slot-scope="scope">
          <el-popconfirm
              class="ml-5"
              confirm-button-text='ok'
              cancel-button-text='next time'
              icon="el-icon-info"
              icon-color="red"
              title="Ready to delete?"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">delete <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: "Files",
  data() {
    return {
      tableData: [],
      name: '',
      multipleSelection: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.request.get("/file/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
        }
      }).then(res => {

        this.tableData = res.data.records
        this.total = res.data.total

      })
    },
    //TODO 禁用下载
    changeEnable(row) {
      this.request.post("/file/update", row).then(res => {
        if (res.code === '200') {
          this.$message.success("Succeed to operate!")
        }
      })
    },
    del(id) {
      this.request.delete("/file/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("Succeed to delete!")
          this.load()
        } else {
          this.$message.error("Fail to delete!")
        }
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)  // [{}, {}, {}] => [1,2,3]
      this.request.post("/file/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("Succeed to delete in batch!")
          this.load()
        } else {
          this.$message.error("Fail to delete in batch!")
        }
      })
    },
    reset() {
      this.name = ""
      this.load()
    },
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    },
    handleFileUploadSuccess(res) {
      console.log(res)
      this.load()
    },
    download(url) {
      url.replace("9090","8080")
      window.open(url)
    }
  }
}
</script>

<style scoped>

</style>
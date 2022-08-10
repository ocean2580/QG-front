<template>
  <div>

    <div style="margin: 10px 0">
      <!--    绑定输入框实现模糊搜索      -->
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="name" v-model="studentName"></el-input>
      <el-input style="width: 200px" suffix-icon="el-icon-message" placeholder="institute" class="ml-5"
                v-model="institute"></el-input>
      <el-button class="ml-5" type="primary" @click="load">search</el-button>
      <el-button type="warning" @click="reset">reset</el-button>
    </div>

    <div>
      <el-button type="primary" @click="handleAdd">add<i class="el-icon-circle-plus-outline"
                                                        style="margin-left: 1px"></i></el-button>
      <!--  批量删除 -->
      <el-popconfirm
          class="ml-5"
          confirm-button-text='ok'
          cancel-button-text='next time'
          icon="el-icon-info"
          icon-color="red"
          title="Are you sure to delete these data in batch?"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference">Batch delete<i class="el-icon-remove-outline"
                                                         style="margin-left: 1px"></i></el-button>
      </el-popconfirm>


    </div>

    <!-- table  -->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="40"></el-table-column>
      <el-table-column prop="studentName" label="name" width="140"></el-table-column>
      <el-table-column prop="institute" label="institute"></el-table-column>
      <el-table-column prop="grade" label="graade" width="120"></el-table-column>
      <el-table-column prop="studentClass" label="class"></el-table-column>
      <el-table-column label="operation">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">edit <i class="el-icon-edit"></i></el-button>

          <el-popconfirm
              class="ml-5"
              confirm-button-text='好的'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-delete"></i></el-button>
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

    <!--        dialog -->
    <el-dialog title="message" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="name">
          <el-input v-model="form.studentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="institute">
          <el-input v-model="form.institute" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="grade">
          <el-input v-model="form.grade" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="class">
          <el-input v-model="form.studentClass" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="save">yes</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,

      studentName: "",
      institute: "",


      dialogFormVisible: false,
      form: {},
      multipleSelection: [],
      roles: []

    }
  },
  created() {
    this.load();
  },
  methods: {
    reset() {
      this.studentName = "";
      this.institute = "";
      this.load();
    },

    // 增删查改
    save() {
      this.request.post("/student", this.form).then(res => {
        if (res.data) {
          this.$message.success("succeed to save");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("fail to save");
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {}
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    del(id) {
      this.request.delete("/student/" + id).then(res => {
        if (res.data) {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id);
      this.request.post("/student/del/batch", ids).then(res => {
        if (res.data) {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    },

    load() {    // 请求封装成方法
      this.request.get("/student/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          studentName: this.studentName,
          institute: this.institute,
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.records
        this.total = res.data.total;
      })

    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },


  }
}
</script>

<style>
.headerBg {
  background: #eee !important;
}
</style>
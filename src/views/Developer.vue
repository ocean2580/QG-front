<template>
  <div>

    <div style="margin: 10px 0">
      <!--    绑定输入框实现模糊搜索      -->
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="name" v-model="username"></el-input>
      <el-input style="width: 200px" suffix-icon="el-icon-message" placeholder="email" class="ml-5"
                v-model="email"></el-input>
      <el-input style="width: 200px" suffix-icon="el-icon-position" placeholder="address" class="ml-5"
                v-model="address"></el-input>
      <el-button class="ml-5" type="primary" @click="load">Search</el-button>
      <el-button type="warning" @click="reset">Reset</el-button>
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

      <el-upload action="http://116.205.186.165:8080/user/import" :show-file-list="false"
                 accept="xlsx" style="display: inline-block"
                 :on-success="handleExcelImportSuccess"
      >
        <el-button type="primary" class="ml-5">import<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button type="primary" @click="exp" class="ml-5">export<i class="el-icon-top"></i></el-button>
    </div>

    <!-- table  -->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
                   @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="40"></el-table-column>
      <el-table-column prop="username" label="developer" width="140"></el-table-column>
      <el-table-column prop="role" label="role"></el-table-column>
      <el-table-column prop="nickname" label="nickname" width="120"></el-table-column>
      <el-table-column prop="email" label="email"></el-table-column>
      <el-table-column prop="phone" label="phone"></el-table-column>
      <el-table-column prop="address" label="address"></el-table-column>
      <el-table-column label="operation">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">edit <i class="el-icon-edit"></i></el-button>

          <el-popconfirm
              style="margin-left: 2px;"
              confirm-button-text='ok'
              cancel-button-text='next time'
              icon="el-icon-info"
              icon-color="red"
              title="Ready to delete?"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">delete <i class="el-icon-delete"></i></el-button>
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
        <el-form-item label="developer">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="role">
          <!--    下拉框      -->
          <el-select clearable v-model="form.role" placeholder="role" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="nickname">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="address">
          <el-input v-model="form.address" autocomplete="off"></el-input>
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
  name: "Developer",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,

      username: "",
      address: "",
      email: "",

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
      this.username = "";
      this.email = "";
      this.address = "";
      this.load();
    },

    // 增删查改
    save() {
      this.request.post("/user", this.form).then(res => {
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
      this.request.delete("/user/" + id).then(res => {
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
      this.request.post("/user/del/batch", ids).then(res => {
        if (res.data) {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    },

    load() {    // 请求封装成方法
      this.request.get("/user/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          email: this.email,
          address: this.address,
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.records
        this.total = res.data.total;
      })

      this.request.get("/role").then(res => {
        this.roles = res.data
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

    // 导出
    exp() {
      window.open("http://116.205.186.165:8080/user/export");
    },
    handleExcelImportSuccess() {
      this.$message.success("succeed to import");
      this.load();
    }
  }
}
</script>

<style>
.headerBg {
  background: #eee !important;
}
</style>
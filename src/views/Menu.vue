<template>
  <div>

    <div style="margin: 10px 0">
      <!--    绑定输入框实现模糊搜索      -->
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="name" v-model="name"></el-input>
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

    <!--  table  -->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
              @selection-change="handleSelectionChange" row-key="id" default-expand-all>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="name" width="120"></el-table-column>
      <el-table-column prop="path" label="path"></el-table-column>
      <el-table-column prop="pagePath" label="page path"></el-table-column>
      <el-table-column label="icon" class-name="fontSize18" align="center" label-class-name="fontSize12">
        <template slot-scope="scope">
          <i :class="scope.row.icon"/>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="description"></el-table-column>
      <el-table-column label="operation" width="300" align="center">

        <template slot-scope="scope">
          <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">add sub menu <i
              class="el-icon-plus"></i></el-button>
          <el-button type="success" @click="handleEdit(scope.row)">edit <i class="el-icon-edit"></i></el-button>

          <el-popconfirm
              class="ml-5"
              confirm-button-text='ok'
              cancel-button-text='next time'
              icon="el-icon-info"
              icon-color="red"
              title="Ready to delete?"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference" style="margin-top: 2px;">delete <i class="el-icon-delete"></i></el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>


    <!--        dialog -->
    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="path">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="page path">
          <el-input v-model="form.pagePath" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="icon">
          <!--    下拉框      -->
            <el-select clearable v-model="form.icon" placeholder="choose" style="width: 100%">
              <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                <i :class="item.value"/> {{item.name}}
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
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
  name: "Menu",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,

      name: "",

      dialogFormVisible: false,
      form: {},
      multipleSelection: [],
      options: []

    }
  },
  created() {
    this.load();
  },
  methods: {
    reset() {
      this.name = "";
      this.load();
    },

    // 增删查改
    save() {
      this.request.post("/menu", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("succeed to save");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("fail to save");
        }
      })
    },
    handleAdd(pid) {
      this.dialogFormVisible = true;
      this.form = {}
      if (pid) {
        this.form.pid = pid
      }
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;

      // icon
      this.request.get("/menu/icons", {
        params: {
          name: this.name
        }
      }).then(res => {
        this.options = res.data;
      })
    },
    del(id) {
      this.request.delete("/menu/" + id).then(res => {
        if (res.code === '200') {
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
      this.request.post("/menu/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    },

    load() {    // 请求封装成方法
      this.request.get("/menu", {
        params: {
          name: this.name
        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data;
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
.fontSize18 {
  font-size: 18px;
}
.fontSize12 {
  font-size: 12px;
}
</style>
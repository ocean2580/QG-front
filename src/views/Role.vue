<template>
  <div>

    <div style="margin: 10px 0">
      <!--    绑定输入框实现模糊搜索      -->
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="请输入名称" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div>
      <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"
                                                        style="margin-left: 1px"></i></el-button>
      <!--  pop -->
      <el-popconfirm
          class="ml-5"
          confirm-button-text='好的'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="确定批量删除这些数据吗？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"
                                                         style="margin-left: 1px"></i></el-button>
      </el-popconfirm>
    </div>

    <!--  table  -->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange"
              row-key="id" default-expand-all>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button type="info" @click="selectMenu(scope.row.id)">分配菜单<i class="el-icon-menu"></i></el-button>
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>

          <!--pop-->
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
    <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%">
      <el-form label-width="80px" size="small">

        <!--    tree    -->
        <el-tree
            :props="props"
            :data="menuData"
            node-key="id"
            :default-expanded-keys="[2]"
            :default-checked-keys="[]"
            show-checkbox
            @check-change="handleCheckChange">
        </el-tree>

        <div slot="footer" class="dialog-footer">
          <el-button @click="menuDialogVis = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      menuDialogVis: false,

      name: "",

      dialogFormVisible: false,
      form: {},
      multipleSelection: [],
      menuData: [],

      props: {
        label: 'name',
      },
    }
  }
  ,
  created() {
    this.load();
  }
  ,
  methods: {
    reset() {
      this.name = "";
      this.load();
    }
    ,

    // 增删查改
    save() {
      this.request.post("/role", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("succeed to save");
          this.dialogFormVisible = false;
          this.load();
        } else {
          this.$message.error("fail to save");
        }
      })
    }
    ,
    handleAdd() {
      this.dialogFormVisible = true;
      this.form = {}
    }
    ,
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    }
    ,
    del(id) {
      this.request.delete("/role/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    }
    ,
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id);
      this.request.post("/role/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    }
    ,

    load() {    // 请求封装成方法
      this.request.get("/role/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,

        }
      }).then(res => {
        console.log(res);
        this.tableData = res.data.records
        this.total = res.data.total;
      })
    }
    ,
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    }
    ,
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    }
    ,
    selectMenu() {
      this.menuDialogVis = true;

      // 请求菜单数据
      this.request.get("/menu",{
        params: {
          name: ""
        }
      }).then(res => {
        this.menuData = res.data;
      })

    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    }
    ,

  }
}
</script>

<style>
.headerBg {
  background: #eee !important;
}
</style>
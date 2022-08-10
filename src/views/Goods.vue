<template>
  <div>

    <div style="margin: 10px 0">
      <!--    绑定输入框实现模糊搜索      -->
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="name" v-model="goodsName" class="ml-5"></el-input>
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="lost position" v-model="lostPosition" class="ml-5"></el-input>
      <el-input style="width: 200px" suffix-icon="el-icon-search" placeholder="claim position" v-model="claimPosition" class="ml-5"></el-input>

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

      <!--  与 entity类 字段名一致    -->
      <el-table-column prop="id" label="ID" width="40"></el-table-column>
      <el-table-column prop="goodsName" label="name" width="140"></el-table-column>
      <el-table-column prop="lostPosition" label="lost position"></el-table-column>
      <el-table-column prop="claimPosition" label="claim position"></el-table-column>
      <el-table-column prop="description" label="description"></el-table-column>
      <el-table-column prop="lostDate" label="lost date"></el-table-column>

      <el-table-column label="operation">
        <template slot-scope="scope">
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

    <!--        dialog ~ form       -->
    <el-dialog title="message" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="name">
          <el-input v-model="form.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="lost pos">
          <el-input v-model="form.lostPosition" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="claim pos">
          <el-input v-model="form.claimPosition" autocomplete="off"></el-input>
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
  name: "Goods",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,

      goodsName: "",
      lostPosition: "",
      claimPosition: "",


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
      this.goodsName = "";
      this.lostPosition = "";
      this.claimPosition = "";
      this.load();
    },

    // 增删查改
    save() {
      this.request.post("/goods", this.form).then(res => {
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
      this.request.delete("/goods/" + id).then(res => {
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
      this.request.post("/goods/del/batch", ids).then(res => {
        if (res.data) {
          this.$message.success("succeed to delete");
          this.load();
        } else {
          this.$message.error("fail to delete");
        }
      })
    },

    load() {    // 请求封装成方法
      this.request.get("/goods/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          goodsName: this.goodsName,
          lostPosition: this.lostPosition,
          claimPosition: this.claimPosition
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
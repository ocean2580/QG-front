<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1;font-size: 18px">
      <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>

      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown style="width: 100px; cursor: pointer">
      <div style="display: inline-block;width: 300px" >
        <el-avatar :src="user.avatarUrl" style="margin-right: 5px; margin-top: 10px" :fit="'fill'"></el-avatar>
        <span>{{ user.nickname }}</span>
        <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <router-link to="/person" style="text-decoration: none">个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <span style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>


  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    pathName: String,
    user: Object
  },
  data() {
    return {
    }
  },
  methods: {
    collapse() {
      this.$emit("asideCollapse");
    },
    logout() {
      this.$store.commit("logout")
      this.$message.success("succeed to exit")
    }
  },
  computed: {
    currentPathName() {
      return this.$store.state.currentPathName;
    }
  },
  watch: {
    currentPathName(newVal) {
      console.log(newVal)
    }
  },

}
</script>

<style scoped>

</style>
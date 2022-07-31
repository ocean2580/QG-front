<template>

  <el-container style="min-height: 100vh;">
    <!--aside-->
    <el-aside :width="sideWidth + 'px'"
              style="background-color: rgb(238, 241, 246); height: 100%; box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow"/>
    </el-aside>

    <el-container>

      <!--header-->
      <el-header style=" border-bottom: 1px solid #ccc;">
        <!--   3.传user     -->
        <Header :collapseBtnClass="collapseBtnClass" @asideCollapse="collapse" :user="user"/>
      </el-header>

      <!--main-->
      <el-main>
        <!--   当前页面的子路由会在 router-view中展示     -->
        <router-view @refreshUser="getUser"/>
      </el-main>

    </el-container>

  </el-container>

</template>

<script>


// import request from "@/utils/request";
import Aside from "@/components/Aside"
import Header from "@/components/Header"


export default {
  name: 'Manage',
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      user: {},

    }
  },

  components: {
    Header,
    Aside
  },
  created() {

    this.getUser()
  },
  methods: {
    collapse() {  // 点击触发收缩
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {  // fold
        this.sideWidth = 64;
        this.collapseBtnClass = 'el-icon-s-unfold';
        this.logoTextShow = false;
      } else {  // unfold
        this.sideWidth = 200;
        this.collapseBtnClass = 'el-icon-s-fold';
        this.logoTextShow = true;
      }
    },
    getUser() {
      // 2.后台获取User数据
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      this.request.get("/user/username/" + username).then(res => {
        this.user = res.data
      })
    }

  }

}
</script>


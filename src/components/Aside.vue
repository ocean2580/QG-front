<template>
  <el-menu :default-openeds="opens" style="min-height: 100vh; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff" active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/fm.png" alt="" style="width: 18px; position: relative; top: 1.5px">
      <b style="color: white; margin-left: 5px;" v-show="logoTextShow">Backstage</b>
    </div>

    <!--  index跳转  -->
    <div v-for="item in menus" :key="item.id">
      <!--   单级   -->
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>

      <!--   多级   -->
      <div v-else>
        <el-submenu :index="item.id + '' ">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </template>

          <!--    子级   -->
          <div v-for="subItem in item.children" :key="subItem.id">
              <el-menu-item :index="subItem.path">
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.name }}</span>
              </el-menu-item>
          </div>

        </el-submenu>
      </div>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data() {
    return {
      menus: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
      opens: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")).map(v => v.id + '') : []
    }
  },

}
</script>

<style scoped>
.el-menu--collapse span {
  visibility: hidden;
}

</style>
<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="title_wrap">
        <img
          src="../assets/qy.png"
          alt
        />
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      >退出</el-button>
    </el-header>
    <!-- 主题 -->
    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div
          class="toggle_button"
          @click="handleToggle"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eef"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index相同会导致点开一个，所有index相同的都会展开 -->
          <el-submenu
            :index="item.id+''"
            v-for="(item,index) in menuList"
            :key="`menu_list_${index}`"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i
                class="iconfont"
                :class="iconArr[index]"
              ></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+item2.path"
              v-for="(item2,index2) in item.children"
              :key="`menu_children_${index2}`"
              @click="handleSaveState('/'+item2.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem("activePath");
  },
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconArr: [
        "icon-user",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ],
      isCollapse: false,
    //   被激活的链接地址
      activePath:'',
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.message);
      }
      this.menuList = res.data;
    },
    // 点击切换折叠展开
    handleToggle() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存激活状态
    handleSaveState(activePath){
        window.sessionStorage.setItem("activePath",activePath);
        this.activePath=activePath;
    },
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  .title_wrap {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      height: 60%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle_button {
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.4em;
    user-select: none;
  }
  .el-menu {
    border-right: none;
    user-select: none;
  }
}
.el-main {
  background-color: #eaeaea;
}
.iconfont {
  margin-right: 10px;
}
</style>
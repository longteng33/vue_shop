<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <!-- 权限列表区域 -->
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <!-- 展开列开始 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index1===0?'bdtop':'',]"
              class="vcenter"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <!-- 一级权限 -->
                <el-tag
                  closable
                  @close="handleRemoveRightById(scope.row, item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级和三级权限 -->
                <el-row
                  :class="[index2===0?'':'bdtop',]"
                  class="vcenter"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="handleRemoveRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="handleRemoveRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre></pre>
          </template>
        </el-table-column>
        <!-- 展开列结束 -->

        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="handleSetRight(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="deafKeys"
        ref="tree_ref"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allowSetRight"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 分配权限对话框显示隐藏
      setRightDialogVisible: false,
      // 权限列表数据
      rightList: [],
      // 树形控件的绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中的节点id值
      deafKeys: [],
      // 即将分配权限的结束id
      roleId: "",
      
    };
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表数据失败");
      }
      this.rolesList = res.data;
    },
    // 删除三级权限按钮
    async handleRemoveRightById(role, id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          // type是前面的小图标
          type: "warning"
          // 如果点击确认，则result是字符串"confirm"
          // 如果点取消，则报错,捕捉这个错误并返回给result，它是字符串"cancel"
        }
      ).catch(err => err);

      if (result !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("删除失败");
      }
      role.children = res.data;
      this.$message.success("删除成功");
    },
    // 点击分配权限
    async handleSetRight(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightList = res.data;
      this.getDeafKeys(role, this.deafKeys);
      console.log(this.rightList);
      this.setRightDialogVisible = true;
    },
    // 获取所有已经被选的三级权限的id
    getDeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        return this.getDeafKeys(item, arr);
      });
    },
    // 分配权限对话框关闭时的回调
    setRightDialogClosed() {
      this.deafKeys = [];
    },
    // 点击分配权限对话框确认按钮
    async allowSetRight() {
      const keys = [
        ...this.$refs.tree_ref.getCheckedKeys(),
        ...this.$refs.tree_ref.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
   
  }
};
</script>

<style lang="less" scoped>
.vcenter {
  display: flex;
  align-items: center;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ddd;
}
.bdbottom {
  border-bottom: 1px solid #ddd;
}
</style>
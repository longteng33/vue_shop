<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索/添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="dialogVisible=true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="userList"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- scope.row是这一行的所有数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="handleChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-tooltip
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-edit"
                size="mini"
                @click="handleEdit(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 删除 -->
            <el-tooltip
              content="删除"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
                @click="handleRemoveId(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色 -->
            <el-tooltip
              content="分配角色"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <!-- 添加用户的表单 -->
      <el-form
        :model="addForm"
        :rules="addForm_rules"
        ref="addForm_ref"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <!-- 修改用户的表单 -->
      <el-form
        :model="editForm"
        :rules="editForm_rules"
        ref="editForm_ref"
        label-width="70px"
      >
        <!-- label-width是前面的文本宽度 -->
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item
          label="手机"
          prop="email"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditUserInfo"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select
            v-model="selectedRoleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allowSetRole"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {$confirm} from "../../utils/tools"
export default {
  created() {
    this.getUserList();
  },
  data() {
    // 验证邮箱的校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的邮箱"));
      }
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|)[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法的手机号"));
      }
    };

    return {
      userList: [],
      total: 0,
      // 获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //   控制添加用户对话框的显示隐藏
      dialogVisible: false,
      // 控制修改对话框的显示
      editDialogVisible: false,
      //   添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 点击编辑按钮的表单信息
      editForm: {},
      // 添加用户表单的验证规则
      addForm_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 编辑用户信息的表单验证规则
      editForm_rules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 控制分配角色对话框显示隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 下拉列表选中的值
      selectedRoleId: ""
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return;
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
        // console.log(res)
      }
    },
    // pagesize改变触发的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 页码发生变化时触发的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // switch开关改变时触发的函数
    async handleChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("更新用户状态失败");
        userInfo.mg_state = !userInfo.mg_state;
        return;
      } else {
        this.$message.success("更新状态成功");
      }
    },
    // 对话框关闭时触发的函数
    handleClose() {
      this.$refs.addForm_ref.resetFields();
    },
    // 点击对话框确定按钮添加新用户
    handleAddUser() {
      // 验证表单
      this.$refs.addForm_ref.validate(async valid => {
        if (!valid) {
          return;
        }
        // 验证通过，发起请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          this.$message.success("添加用户成功");
          this.dialogVisible = false;
          this.getUserList();
        }
      });
    },
    // 点击编辑按钮的回调
    async handleEdit(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("查询失败");
        return;
      }
      this.editForm = res.data;
    },
    // 编辑用户对话框关闭时触发
    handleEditDialogClose() {
      this.$refs.editForm_ref.resetFields();
    },
    // 点击编辑用户对话框确定按钮
    handleEditUserInfo() {
      // 验证表单
      this.$refs.editForm_ref.validate(async valid => {
        if (!valid) {
          return;
        }
        // 验证通过，发起请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改用户信息失败");
        } else {
          this.$message.success("修改用户信息成功");
          this.editDialogVisible = false;
          this.getUserList();
        }
      });
    },
    // 点击删除按钮，根据id删除对应的用户
    async handleRemoveId(id) {
      // const result = await this.$confirm(
      //   "此操作将永久删除该用户, 是否继续?",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     // type是前面的小图标
      //     type: "warning"
      //     // 如果点击确认，则result是字符串"confirm"
      //     // 如果点取消，则报错,捕捉这个错误并返回给result，它是字符串"cancel"
      //   }
      // ).catch(err => err);
  const result=await $confirm(this);
      if (result !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("删除失败");
      } else {
        this.$message.warning("删除成功");
        this.getUserList();
      }
    },
    // 点击分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 点击分配角色对话框确定按钮
   async allowSetRole() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});
      if(res.meta.status!==200){
        return this.$message.error("更新角色失败")
      }
      this.$message.success("更新角色成功");
      this.getUserList();
      this.setRoleDialogVisible=false;
    },
    // 点击分配角色对话框关闭
    setRoleDialogClosed(){
      this.selectedRoleId='';
      this.userInfo={};
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
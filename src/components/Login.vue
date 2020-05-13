<template>
  <div class="login">
    <div class="login_wrap">
      <!-- 头像 -->
      <div class="avatar_wrap">
        <img
          src="../assets/logo.png"
          alt
        />
      </div>
      <!-- 登录表单 -->
      <el-form
        class="login_form_wrap"
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm_ref"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn_wrap">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetFields"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  props: {},
  data() {
    return {
      // 表单数据
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 点击登录按钮
    login() {
      this.$refs.loginForm_ref.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) {
          this.$message.error("登录失败");
          return;
        } else {
          this.$message.success("登录成功");
          //  1、将登录成功之后，服务端返回的token保存到客户端的sessionStoragezhong
          // 1.1、项目中除了登录页面之外，其它的api接口必须在登录之后才能访问
          // 1.2、token只应当在当前网站打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem("token", res.data.token);
          // 2、跳转到路由/home
          this.$router.push("/home");
        }
      });
    },
    // 点击重置按钮
    resetFields() {
      this.$refs.loginForm_ref.resetFields();
    }
  }
};
</script>


<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  .login_wrap {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_wrap {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form_wrap {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btn_wrap {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

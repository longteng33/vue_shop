<template>
  <div>
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
      @open="dialogOpen"
    >
      <!-- 对话框中的表单 -->
      <el-form
        :model="dialogForm"
        :rules="dialogForm_rules"
        ref="dialogForm_ref"
        label-width="100px"
      >
        <!-- label-width是前面的文本宽度 -->
        <el-form-item
          label="省市区/县"
          prop="address1"
        >
          <el-cascader
            :options="cityData"
            v-model="dialogForm.address1"
            :props="{ expandTrigger: 'hover' }"
            style="width:100%"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address2"
        >
          <el-input v-model="dialogForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="clickConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // clickBtn响应按钮的点击
  // dialogForm对话框中的表单数据对象
  // callback点击确定按钮后的回调函数
  props: ["callback", "clickBtn", "dialogForm","cityData"],
  created() {},
  mounted() {},
  data() {
    return {
      initValue: "",
      dialogVisible: false,
      // 表单绑定的数据对象
      // dialogForm:{},
      // 对话框中的表单验证规则
      dialogForm_rules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    clickBtn(val) {
      this.dialogVisible = true;
    }
  },
  methods: {
    // 对话框打开时触发
    dialogOpen() {
      this.initValue = this.dialogForm.address1;
    },
    // 对话框关闭时触发
    dialogClosed() {
      // 重置表单
      this.$refs.dialogForm_ref.resetFields();
    },
    // 点击对话框确定按钮触发
    clickConfirm() {
      this.$refs.dialogForm_ref.validate(valid => {
        if (!valid) {
          return;
        }
        // 如果内容没有发生改变，则不发送请求
        if (this.initValue === this.dialogForm.address1) {
          this.$message.error("请修改参数值");
          return;
        }
        this.dialogVisible = false;
        this.$emit("confirm");
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>




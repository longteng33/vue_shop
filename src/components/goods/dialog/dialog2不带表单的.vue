<template>
<!-- 使用步骤：
1、替换edit
2、替换dialog_attr_name,也可拷贝后再替换
3、拷贝组件
4、拷贝两个数据
5、拷贝一个函数
6、在触发中执行this.dialog_edit_click = !this.dialog_edit_click; -->
  <div>
    <!-- 点击edit按钮弹出的对话框 -->
    <!-- clickBtn是点击某按钮展示此对话框 -->
    <!-- confirm是点击对话框中的确定按钮后的回调 -->
    <!-- dialogForm是父组件传给子组件的数据对象 -->
    <edit-dialog
      :clickBtn="dialog_edit_click"
      @confirm="dialog_edit_confirm"
      :dialogForm="editForm"
    ></edit-dialog>
    <!--  -->
    <!--  -->
    <!--  -->
    <el-dialog
      title="edit"
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
          label="参数名称"
          prop="dialog_attr_name"
        >
          <el-input v-model="dialogForm.dialog_attr_name"></el-input>
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
  props: ["callback","clickBtn","dialogForm"],
  created() {},
  mounted() {},
  data() {
    return {
      initValue:'',
      dialogVisible:false,
      // 对话框中的表单验证规则
      dialogForm_rules: {
        dialog_attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }]
      },
      // 
      // 拷贝
      //  控制edit-dialog对话框显示隐藏
      dialog_edit_click: false,
      editForm: {
          dialog_attr_name:'',
      },
      // 
      // 
    };
  },
  watch:{
    clickBtn(val){
        this.dialogVisible=true;
    }
  },
  methods: {
    // 对话框打开时触发
    dialogOpen(){
      this.initValue=this.dialogForm.dialog_attr_name;
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
         if(this.initValue===this.dialogForm.dialog_attr_name){
          this.$message.error("请修改参数值")
          return;
        }
        this.dialogVisible=false;
        this.$emit("confirm");
        
      });
    },

    // 拷贝
    // 点击edit对话框的确定按钮
    dialog_edit_confirm() {},
  }
};
</script>

<style scoped lang="less">
</style>


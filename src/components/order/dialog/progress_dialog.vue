<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
      @open="dialogOpen"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
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
  // callback点击确定按钮后的回调函数
  props: ["callback", "clickBtn", "progressInfo"],
  created() {},
  mounted() {},
  data() {
    return {
      initValue: "",
      dialogVisible: false

      //
      // 拷贝

      //
      //
    };
  },
  watch: {
    clickBtn(val) {
      this.dialogVisible = true;
    }
  },
  methods: {
    // 对话框打开时触发
    dialogOpen() {},
    // 对话框关闭时触发
    dialogClosed() {
      // 重置表单
    },
    // 点击对话框确定按钮触发
    clickConfirm() {
      this.dialogVisible = false;
      this.$emit("confirm");
    }

    // 拷贝
  }
};
</script>

<style scoped lang="less">
@import '../../../plugins/timeline/timeline.css';
@import '../../../plugins/timeline-item/timeline-item.css';
</style>


<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据表格 -->
      <el-table
        :data="orderList"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="80px"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              v-if="scope.row.pay_status==='1'"
            >已付款</el-tag>
            <el-tag
              type="danger"
              size="mini"
              v-else
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="180px"
        >
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 点击编辑按钮弹出的对话框 -->
    <!-- clickBtn是点击某按钮展示此对话框 -->
    <!-- confirm是点击对话框中的确定按钮后的回调 -->
    <!-- dialogForm是父组件传给子组件的数据对象 -->
    <edit-dialog
      :clickBtn="dialog_edit_click"
      @confirm="dialog_edit_confirm"
      :dialogForm="editForm"
      :cityData="cityData"
    ></edit-dialog>

    
    <progress-dialog
      :clickBtn="dialog_progress_click"
      @confirm="dialog_progress_confirm"
      :progressInfo="progressInfo"
    ></progress-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
import editDialog from "./dialog/edit_dialog";
import progressDialog from "./dialog/progress_dialog";

export default {
  components: {
    editDialog,
    progressDialog
  },
  created() {
    this.getOrderList();
  },
  mounted() {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      //  控制edit-dialog 编辑对话框显示隐藏
      dialog_edit_click: false,
      editForm: {
        address1: [],
        address2: ""
      },
      cityData,
      //  控制progress-dialog 对话框显示隐藏
      dialog_progress_click: false,
      
    //   物流数据信息
      progressInfo:[],
    };
  },
  methods: {
    //
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表数据失败");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // pagesize改变触发的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 页码发生变化时触发的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 点击编辑按钮
    showBox() {
      this.dialog_edit_click = !this.dialog_edit_click;
    },
    // 点击编辑对话框的确定按钮
    dialog_edit_confirm() {},
    // 点击展示物流数据按钮
   async showProgress() {
      this.dialog_progress_click = !this.dialog_progress_click;
       const {data:res}=await this.$http.get(`/kuaidi/1106975712661`);
       if (res.meta.status !== 200) {
           return this.$message.error("获取物流信息失败")
         }
         this.progressInfo=res.data;
         
    },
    // 点击progress对话框的确定按钮
    dialog_progress_confirm() {}
  }
};
</script>

<style scoped lang="less">
</style>

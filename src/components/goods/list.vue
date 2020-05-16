<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索/添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table
        :data="goodsList"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="180px"
        >
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140px"
          
        >
        <template slot-scope="scope">
            <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.goods_id)"
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
  </div>
</template>

<script>
import { $confirm } from "../../utils/tools";
export default {
  created() {
    this.getGoodsList();
  },
  mounted() {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 总条数
      total: 0
    };
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // pagesize改变触发的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 页码发生变化时触发的函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 点击商品删除
    async removeById(id) {
      const result = await $confirm(this);
      if (result !== "confirm") {
        return this.$message.info("取消删除");
      }
       const {data:res}=await this.$http.delete(`goods/${id}`);
       if (res.meta.status !== 200) {
           return this.$message.error("删除失败")
         }
         this.$message.success("删除成功");
         this.getGoodsList();
    },
    // 点击添加商品，跳转到添加商品页面
    toAddPage(){
        this.$router.push("./goods/add")
    }
  }
};
</script>

<style scoped lang="less">
.el-table {
  margin-top: 15px;
}
</style>

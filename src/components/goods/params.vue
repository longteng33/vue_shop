<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 头部警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs页签开始 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedKeys.length!==3"
            @click="isAddDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  :closable="true"
                  @close="handleClosed(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 动态编辑标签,输入文本框 开始 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
                <!-- 动态编辑标签,输入文本框 结束 -->
              </template>>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedKeys.length!==3"
            @click="isAddDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
             <!-- 展开行 -->
            <el-table-column type="expand">
              <template scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  :closable="true"
                  @close="handleClosed(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 动态编辑标签,输入文本框 开始 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
                <!-- 动态编辑标签,输入文本框 结束 -->
              </template>>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- tabs页签结束 -->
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="`添加${activeName==='many'?'动态参数':'静态属性'}`"
      :visible.sync="isAddDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form
        :model="addForm"
        :rules="addForm_rules"
        ref="addForm_ref"
        label-width="100px"
      >
        <!-- label-width是前面的文本宽度 -->
        <el-form-item
          :label="`${activeName==='many'?'动态参数':'静态属性'}:`"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isAddDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAddParams"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击编辑按钮弹出的对话框 -->
    <!-- clickBtn是点击某按钮展示此对话框 -->
    <!-- confirm是点击对话框中的确定按钮后的回调 -->
    <!-- dialogForm是父组件传给子组件的数据对象 -->
    <edit-dialog
      :clickBtn="dialog_edit_click"
      @confirm="dialog_edit_confirm"
      :dialogForm="editForm"
    ></edit-dialog>
  </div>
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
  <!--  -->
</template>

<script>
import { $confirm } from "../../utils/tools";
import editDialog from "./dialog/edit_dialog";
export default {
  components: {
    editDialog
  },
  created() {
    this.getCateList();
  },
  mounted() {},
  data() {
    return {
      // 商品分类列表数据
      cateList: [],
      //   级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      },
      //   级联选择框双向绑定的数组
      selectedKeys: [],
      //   被激活的页签名称
      activeName: "many",
      //   动态参数数据
      manyTableData: [],
      //   静态属性数据
      onlyTableData: [],
      //   添加参数对话框显示隐藏
      isAddDialogVisible: false,
      //   添加参数 的表单数据对象
      addForm: {},
      // 添加参数 的表单验证规则
      addForm_rules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }]
      },
      //  控制edit-dialog 编辑对话框显示隐藏
      dialog_edit_click: false,
      editForm: {
        attr_name: "",
        attr_id: ""
      },
      // 控制按钮与文本框的切换显示
      inputVisible: false,
      // 文本框中输入的内容
      inputValue: ""
    };
  },
  computed: {
    //   在级联选择框中选中的三级分类id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      } else {
        return null;
      }
    }
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.cateList = res.data;
    },
    // 级联选择框选中项变化触发
    handleChange() {
      this.getParamsData();
    },
    // tab页签点击回调
    handleTabClick() {
      this.getParamsData();
    },
    // 获取分类参数
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData=[];
        this.onlyTableData=[];
        return;
      }
      //   发起请求,获取对应参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品参数列表失败");
      }
      res.data.forEach(item => {
        if (item.attr_vals == "") {
          item.attr_vals = [];
        } else {
          item.attr_vals = item.attr_vals.split(" ");
        }
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 添加参数对话框关闭触发
    addDialogClosed() {
      this.$refs.addForm_ref.resetFields();
    },
    // 添加参数对话框点击确定按钮
    confirmAddParams() {
      this.$refs.addForm_ref.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.isAddDialogVisible = false;
        this.getParamsData();
      });
    },
    // 点击编辑按钮
    async showEditDialog(row) {
      this.dialog_edit_click = !this.dialog_edit_click;
      //   查询当前参数的信息
      //    const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
      //        params:{attr_sel:this.activeName}
      //    });
      //    if (res.meta.status !== 200) {
      //        return this.$message.error("获取参数信息失败")
      //      }
      //     this.editForm=res.data;
      this.editForm.attr_name = row.attr_name;
      this.editForm.attr_id = row.attr_id;
      //   或者深克隆一下
    },
    // 点击编辑对话框的确定按钮
    async dialog_edit_confirm() {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数成功");
      this.getParamsData();
    },

    // 点击删除按钮
    async removeParams(attr_id) {
      // 弹窗确认
      //   const confirmResult = await this.$confirm(
      //     "此操作将永久删除该参数, 是否继续?",
      //     "提示",
      //     {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     }
      //   ).catch(err => err);
      const result = await $confirm(this);
      // console.log(result)
      if (result !== "confirm") {
        return this.$message.info("取消删除");
      }
      //   如果点击确认
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除");
      }
      this.$message.success("删除成功");
      this.getParamsData();
    },
    // 按钮与文本框切换，文本框失去焦点或按下enter
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 发起请求，存到后端
      this.saveAttrVals(row)
    },
   async saveAttrVals(row){
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败");
      }
      this.$message.success("修改参数项成功");
    },
    // 按钮与文本框切换，点击按钮
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除参数标签
    handleClosed(i, row) {
      row.attr_vals.splice(i, 1);
       this.saveAttrVals(row);
    },
    fa() {
      console.log(23);
    }
  }
};
</script>

<style scoped lang="less">
.cat_opt {
  margin: 15px 0;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 150px;
}
</style>

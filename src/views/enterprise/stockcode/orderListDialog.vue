<template>
  <el-dialog :title="title" :visible="visible" width="1000px" append-to-body  :close-on-click-modal="false" @close="cancel">
    <el-table v-loading="loading" border stripe :data="orderList">
      <el-table-column label="序号" align="center" type="index" min-width="5%" />
      <el-table-column label="货源单号" align="center" prop="mainOrderNumber" />
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="手机号码" align="center" prop="phonenumber" />
    </el-table>
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
  </el-dialog>
</template>

<script>
import { getOrderList } from '@/api/enterprise/stockcode';
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      orderList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.getList();
      }
    }
  },
  methods: {
    // 获取货集码下的货源列表
    getList() {
      this.loading = true;
      getOrderList(this.code).then(response => {
        this.orderList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

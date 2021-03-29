<template>
  <!-- 驳回理由对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <RefactorTable :loading="loading" :data="childList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #lastLoadingTime="{row}">
        <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #orderTime="{row}">
        <span>{{ parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #receiveTime="{row}">
        <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #wayBillUpdateTime="{row}">
        <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleWaybill(row)"
        >详情</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="detailtitle" :open.sync="opendetail" :disable="formDisable" @refresh="getList" />
  </el-dialog>
</template>

<script>
import { childListApi, childList } from '@/api/settlement/adjust';
// import UploadImage from '@/components/UploadImage/index';


export default {
  name: 'ChildDialog',
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 弹框 内容
      detailvisible: false,
      opendetail: false,
      detailtitle: '',
      currentId: '',
      formDisable: false,
      tableColumnsConfig: [],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 子单列表
      childList: {
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wayBillCode: null
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
  created() {
  },
  methods: {
    /** 查询运输异常列表 */
    getList() {
      this.loading = true;
      childList(this.queryParams).then(response => {
        this.childList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log(this.childList);
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 获取列表
    setForm(data) {
      console.log(data);
      // this.queryParams.wayBillCode = data.code;
      this.tableHeaderConfig(this.tableColumnsConfig, childListApi, {
        prop: 'edit',
        isShow: true,
        label: '操作',
        width: 100,
        fixed: 'right'
      });
      this.getList();
    },
    // 查看运单详情
    handleWaybill(row) {
      this.$refs.DetailDialog.reset();
      this.currentId = row.wayBillCode;
      this.opendetail = true;
      this.detailtitle = '运输单信息';
      this.formDisable = true;
    }
  }
};
</script>

<style>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
</style>

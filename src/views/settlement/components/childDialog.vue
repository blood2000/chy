<template>
  <!-- 子单对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body :close-on-click-modal="false" @close="cancel">
    <RefactorTable :loading="loading" :data="childlist" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #loadWeight="{row}">
        <span v-if="row.stowageStatus === '1'">{{ row.loadWeight || '0.00' }} 方</span>
        <span v-if="row.stowageStatus === '2'">{{ row.loadWeight || '0.00' }} 车</span>
        <span v-else>{{ row.loadWeight || '0.00' }} 吨</span>
      </template>
      <template #unloadWeight="{row}">
        <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight || '0.00' }} 方</span>
        <span v-if="row.stowageStatus === '2'">{{ row.unloadWeight || '0.00' }} 车</span>
        <span v-else>{{ row.unloadWeight || '0.00' }} 吨</span>
      </template>
      <!-- <template #lastLoadingTime="{row}">
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
      </template> -->

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
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';

export default {
  name: 'ChildDialog',
  components: {
    DetailDialog
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
      loading: false,
      // 总条数
      total: 0,
      // 子单列表
      childlist: [],
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
    this.tableHeaderConfig(this.tableColumnsConfig, childListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 100,
      fixed: 'right'
    });
  },
  methods: {
    /** 查询子单列表 */
    getList() {
      this.loading = true;
      childList(this.queryParams).then(response => {
        console.log(response);
        this.childlist = response.rows;
        this.total = response.total;
        this.loading = false;
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
      this.queryParams.wayBillCode = data.wayBillCode;
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

<template>
  <div class="app-container">

    <div class="mb20 mt20">
      <span class="mr20">承运码信息</span>

      <el-switch
        v-model="chenyunma"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />

    </div>

    <el-image
      v-show="chenyunma"
      v-viewer
      :src="url"
      fit="contain"
      style="width: 100px; height: 100px"
    >
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>

    <div class="header mb20 mt20">货源信息</div>

    <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, (row.status -0)) }}</span>
      </template>
      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-printer"
          @click="handleInfo(row)"
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
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" />


  </div>
</template>

<script>
import { getByOrderCode, getCym } from '@/api/order/release';

// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
export default {
  name: 'WaybillInfo',
  components: { DetailDialog },
  props: {
    waybillData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      // 表
      loading: false,
      list: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      tableColumnsConfig: [
        {
          prop: 'waybillNo',
          isShow: true,
          width: 200,
          tooltip: true,
          label: '运单号'
        },
        {
          prop: 'licenseNumber',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '车牌号'
        },
        {
          prop: 'driverName',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '司机'
        },
        {
          prop: 'driverPhone',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '司机手机号'
        },
        {
          prop: 'fillTime',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '装货时间'
        },
        {
          prop: 'signTime',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '卸货时间'
        },
        {
          prop: 'status',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '运单状态'
        },
        {
          prop: 'edit',
          isShow: true,
          label: '操作',
          width: 120,
          fixed: 'left'
        }

      ],

      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': 0 },
        { 'dictLabel': '已接单', 'dictValue': 1 },
        { 'dictLabel': '已装货', 'dictValue': 2 },
        { 'dictLabel': '已签收', 'dictValue': 3 },
        { 'dictLabel': '已回单', 'dictValue': 4 },
        { 'dictLabel': '已核算', 'dictValue': 5 },
        { 'dictLabel': '已申请打款', 'dictValue': 6 },
        { 'dictLabel': '已打款', 'dictValue': 7 }
        // { 'dictLabel': '已申请开票', 'dictValue': 8 },
        // { 'dictLabel': '已开票', 'dictValue': 9 },
        // { 'dictLabel': '已作废', 'dictValue': 10 }
      ],

      // 请求用
      orderCode: '',
      // 展示用
      chenyunma: true,
      url: '',
      // 弹框
      currentId: null,
      title: '',
      open: false,
      // 表单是否禁用
      formDisable: false
    };
  },

  created() {
    if (this.waybillData) {
      // this.url = this.waybillData.classList.length ? this.waybillData.classList[0].cargoCodeQr : '';
      this.orderCode = this.waybillData.code;
      this.getList();
      this.getCymByCode();
    }
  },

  methods: {
    // 获取列表
    async getList() {
      this.loading = true;
      try {
        const res = await getByOrderCode({ orderCode: this.orderCode, ...this.queryParams });
        this.total = res.total - 0;
        this.list = res.rows;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    // 获取承运码
    async getCymByCode() {
      const res = await getCym(this.orderCode);
      this.url = res.data;
    },

    // 分页
    handleInfo(row) {
      this.$refs.DetailDialog.reset();
      this.currentId = row.waybillCode;
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-image ::v-deep .image-slot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border: 1px solid #dfe6ec;
}
.header {
  padding-bottom: 10px;
  position: relative;
  font-weight: 700;
  &::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 20px;
    left: -15px;
    top: 1px;
    background-color: #1890ff;
  }
}
</style>

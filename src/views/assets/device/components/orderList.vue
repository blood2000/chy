<template>
  <div>
    <!-- 搜索 -->
    <div class="device-search-box">
      <el-select
        v-model="queryParams.shipmentCode"
        v-el-select-loadmore="shipmentLoadmore"
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="企业名称/货主姓名/手机号"
        size="small"
        :remote-method="shipmentRemoteMethod"
        :loading="shipmentLoading"
        class="device-search-select"
      >
        <el-option
          v-for="item in shipmentOptions"
          :key="item.code"
          :label="item.adminName"
          :value="item.code"
        />
      </el-select>
      <el-input
        v-model="queryParams.mainOrderNumber"
        placeholder="货源单号"
        clearable
        size="small"
        class="device-search-input"
        @keyup.enter.native="handleQuery"
      />
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
    </div>
    <!-- 货源列表 -->
    <div class="device-info-list-box">
      <el-button class="clear-fence-button" type="text" icon="" size="mini" @click="handleCleatSelection">清除围栏</el-button>
      <el-table
        ref="OrderTableRef"
        v-loading="loading"
        height="calc(100% - 94px)"
        class="own-device-electronic-table"
        :data="simpleOrderList"
        row-key="code"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" :reserve-selection="true" />
        <el-table-column label="货源单号" align="center" prop="mainOrderNumber" />
      </el-table>
      <pagination
        class="own-device-electronic-pagination"
        :small="true"
        :background="false"
        :pager-count="5"
        layout="sizes, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { listShipment } from '@/api/assets/shipment';
import { getSimpleOrderList, getFencePlatList } from '@/api/assets/device';
export default {
  data() {
    return {
      // 选择货主
      shipmentLoading: false,
      shipmentOptions: [],
      shipmentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: null
      },
      // 货源列表
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shipmentCode: undefined,
        mainOrderNumber: undefined
      },
      simpleOrderList: [],
      total: 0,
      // 勾选货源code集合
      orderCodeList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询货主列表
    getShipmentList() {
      this.shipmentQueryParams.searchValue = this.shipmentQueryParams.searchValue.toUpperCase();
      listShipment(this.shipmentQueryParams).then((response) => {
        this.shipmentLoading = false;
        this.shipmentOptions = [...this.shipmentOptions, ...response.rows];
      });
    },
    // 货主远程搜索
    shipmentRemoteMethod(query) {
      if (query !== '') {
        this.shipmentLoading = true;
        this.shipmentQueryParams.searchValue = query;
        this.shipmentQueryParams.pageNum = 1;
        this.shipmentOptions = [];
        this.getShipmentList();
      } else {
        this.shipmentOptions = [];
      }
    },
    // 货主远程搜索列表触底事件
    shipmentLoadmore() {
      this.shipmentQueryParams.pageNum++;
      this.getShipmentList();
    },
    /** 搜索 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.orderCodeList = selection.map(item => item.code);
      if (this.orderCodeList.length > 0) {
        // 有勾选
        this.getFencePlatList();
      } else {
        // 无勾选
        this.$emit('clearMap');
      }
    },
    /** 多选框取消勾选 */
    handleCleatSelection() {
      this.$refs.OrderTableRef.clearSelection();
    },
    /** 获取货源列表 */
    getList() {
      this.loading = true;
      getSimpleOrderList(this.queryParams).then(response => {
        this.loading = false;
        this.simpleOrderList = response.data.list;
        this.total = response.data.total;
      });
    },
    /** 获取平台围栏 */
    getFencePlatList() {
      getFencePlatList({ orderCodeList: this.orderCodeList }).then(response => {
        const { data = [] } = response;
        if (data.length === 0) {
          this.msgInfo('暂无电子围栏信息');
        }
        // 绘制电子围栏
        this.$emit('drawFencePlat', data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 设备搜索
.device-search-box{
  .device-search-select{
    width: calc(100% - 24px);
    margin: 16px 12px 0;
  }
  .device-search-input{
    width: calc(100% - 110px);
    margin: 10px 12px 12px;
  }
}

// 设备列表
.device-info-list-box{
  height: calc(100% - 64px);
  padding: 0 4px;
  overflow: hidden;
  position: relative;
  .clear-fence-button{
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 1;
  }
}
</style>

<style lang="scss">
// 滚动条样式
.own-device-scroll-box::-webkit-scrollbar {
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
}
.own-device-scroll-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.1);
}
.own-device-scroll-box::-webkit-scrollbar-thumb:hover {
  background:rgba(0, 0, 0, 0.2);
}
// 表格样式
.own-device-electronic-table .el-table__header-wrapper th, .own-device-electronic-table .el-table__fixed-header-wrapper th{
  background-color: #ededed !important;
}
// 分页样式
.own-device-electronic-pagination{
  height: 52px;
  margin: 0;
  padding: 10px 0 !important;
  .btn-prev, .btn-next, .el-pager>li{
    height: 26px;
    line-height: 26px !important;
  }
  .btn-prev{
    padding-right: 4px;
  }
  .btn-next{
    padding-left: 8px;
  }
}
</style>

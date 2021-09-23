<template>
  <div>
    <div class="waybill-title"><div class="waybill-icon" />{{ selectDictLabel(transOptions, listQuery.MTransMode) }}<div class="waybill-divider" /></div>
    <div class="marginlr">
      <el-table v-loading="loading" max-height="290" highlight-current-row border :data="childList">
        <el-table-column label="序号" align="center" fixed="left" type="index" width="50" />
        <el-table-column label="状态" align="center" prop="isAbnormal" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.isAbnormal === 0" class="g-color-success">● 正常</span>
            <span v-if="scope.row.isAbnormal === 1" class="g-color-error">● 异常</span>
          </template>
        </el-table-column>
        <el-table-column label="分运单号" align="center" prop="waybillNo" show-overflow-tooltip min-width="120" />
        <el-table-column label="物流状态" align="center" prop="wlstatus" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            {{ selectDictLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="装货重量" align="center" prop="loadWeight" show-overflow-tooltip min-width="120" />
        <el-table-column label="卸货重量" align="center" prop="unloadWeight" show-overflow-tooltip min-width="120" />
        <el-table-column label="装货地" align="center" prop="loadAddress" show-overflow-tooltip min-width="120" />
        <el-table-column label="卸货地" align="center" prop="unloadAddress" show-overflow-tooltip min-width="120" />
        <el-table-column label="装货时间" align="center" prop="fillTime" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            {{ parseTime(scope.row.fillTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column label="卸货时间" align="center" prop="signTime" show-overflow-tooltip min-width="120">
          <template slot-scope="scope">
            {{ parseTime(scope.row.signTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column label="运输工具" align="center" prop="mcarrierNo" show-overflow-tooltip min-width="120" />
        <el-table-column label="承运负责人" align="center" prop="mprincipal" show-overflow-tooltip min-width="120" />
        <el-table-column label="操作" align="center" fixed="left" class-name="small-padding fixed-width" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getMultiSonList } from '@/api/waybill/manages';
export default {
  components: { }, // DataNull
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      listQuery: {
        MParentCode: '',
        MTransMode: '',
        pageNum: 1,
        pageSize: 10
      },
      childList: [],
      // 运输方式字典
      transOptions: [
        { 'dictLabel': '多式联运', 'dictValue': 100 },
        { 'dictLabel': '公路运单', 'dictValue': 200 },
        { 'dictLabel': '水路运单', 'dictValue': 300 },
        { 'dictLabel': '空运运单', 'dictValue': 400 },
        { 'dictLabel': '铁路运单', 'dictValue': 500 }
      ],
      // 运单状态字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
        { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
        { 'dictLabel': '已核算', 'dictValue': '5' },
        { 'dictLabel': '已申请(打款)', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        // { 'dictLabel': '已申请开票', 'dictValue': '8' },
        // { 'dictLabel': '已开票', 'dictValue': '9' },
        // { 'dictLabel': '已作废', 'dictValue': '10' },
        { 'dictLabel': '已核验', 'dictValue': '11' },
        { 'dictLabel': '已完成', 'dictValue': '12' }
      ],
      total: 0
    };
  },
  watch: {
    info: {
      handler(value) {
        if (!value.waybillCode) {
          this.childList = [];
          return;
        }
        this.loading = true;
        this.listQuery.MTransMode = value.mtransMode;
        this.listQuery.MParentCode = value.waybillCode;
        this.getList();
      },
      immediate: true
    }
  },
  methods: {
    // 获取货运子单
    getList() {
      getMultiSonList(this.listQuery).then(res => {
        this.loading = false;
        this.childList = res.rows;
        this.total = res.total;
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$emit('refresh', { ...row, mode: this.listQuery.MTransMode });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style lang="scss">
.comment{
  position: relative;
}
.waybill-detail-dialog{
  .el-dialog__body{
    padding: 10px 20px 30px !important;
    min-height: 70vh;
  }
}
</style>
<style lang="scss" scoped>
.mr3{
  margin-right: 3%;
}
.marginlr{
  margin: 0 35px 30px;
}
.input-width{
  width: 60%;
}
.mb{
  margin-bottom: 22px;
}
.m40{
  margin: 30px 0 40px;
}
.text-row{
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #20273A;
  margin-bottom: 12px;
}
.text-label{
  text-align: end;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 22px;
  color: #909398;
}
.img-box{
  margin: 5px 5px 0 0;
  width: 150px;
  height: 150px;
  vertical-align: top;
  object-fit: contain;
  border-radius: 6px;
  border: 1px dashed #dddddd;
}
// 轨迹-运单详情卡片
.waybill-detail-frame{
  position: relative;
  top: -590px;
  left: 10px;
  height: 0;
}
.waybill-detail-card{
  width: 250px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  .waybill-licenseNumber{
    background: url('~@/assets/images/location/bg_lic.png') no-repeat;
    background-size: 100% 100%;
    height: 24px;
    width: 90px;
    font-weight: bold;
    line-height: 24px;
    text-align: center;
    color: #050407;
  }
  >h5{
    line-height: 30px;
    border-bottom: 1px solid #d2d4da;
    margin-bottom: 8px;
    font-size: 14px;
    color: #262626;
    font-weight: bold;
    >span{
      font-size: 14px;
      &.license{
        background: #ffba00;
        padding: 3px 4px 1px;
        margin-left: 6px;
        border-radius: 4px;
        border: 1px solid gray;
      }
    }
  }
  .text-label{
    margin-bottom: 6px;
  }
  .text-row{
    margin-bottom: 6px;
  }
}
// 轨迹-时间线
.time-line-content{
  >li{
    position: relative;
    padding: 0 0 20px 20px;
    border-left: 1px solid #d2d4da;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: -6px;
      width: 11px;
      height: 11px;
      border-radius: 100%;
      background: #d2d4da;
    }
    &.light{
      &::before{
        content: '';
        background: #00bd93;
      }
    }
  }
}
.waybill-title{
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 24px;
  color: #262626;
  margin: 15px 20px;
  .waybill-icon{
    margin-right: 6px;
    width: 2px;
    height: 16px;
    background: #1990FF;
    border-radius: 2px;
  }
  .waybill-divider{
    margin-left: 8px;
    height: 1px;
    width: 94%;
    border-bottom: 1px dashed #DAD3D3;
  }
}
.waybill-mark{
  color: #ff4949;
  // font-size: 12px;
  margin: 0 0 10px 30px;
}
::v-deep .el-drawer__body{
  // padding: 0 20px;
  overflow-y: auto;
}
::v-deep .el-tabs__nav-wrap{
  padding: 0 20px;
}
.process-ondate{
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #262626;
}
.process-date{
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #7A8DA0;
}
.process-ontitle{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #262626;
}
.process-title{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 22px;
  color: #7A8DA0;
}
.process-onicon{
  width: 48px;
  height: 50px;
}
.process-icon{
  margin: 10px 0 17px;
  width: 20px;
  height: 20px;
}
.process-arrow{
  margin-top: 15px;
  width: 107px;
  height: 8px;
}
</style>>

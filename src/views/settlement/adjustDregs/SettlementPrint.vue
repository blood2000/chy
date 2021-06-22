<template>
  <div>

    <div class="box-print">
      <el-button
        v-print="printObj"
        size="mini"
        type="primary"
        icon="el-icon-printer"
        plain
      >打印</el-button>
    </div>

    <div id="wholecont" class="pr">

      <div>
        <h1 class="p_title">结算单</h1>
      </div>


      <div class="feiyong">
        <el-row>
          <el-col :span="3" class="text-label">
            项目名称：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ printData.projectName || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            渣土场：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ printData.ztcName || '-' }}
          </el-col>

          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>



          <el-col :span="3" class="text-label">
            调度者：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ printData.teamName || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            装车数量：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ printData.loadNum || '-' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>



          <el-col :span="3" class="text-label">
            实发趟数：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ printData.actualTripsNum || '-' }}
          </el-col>
          <el-col :span="3" class="text-label">
            结算趟数：
          </el-col>
          <el-col :span="8" class="text-row">
            {{ printData.settlementTripsNum || '-' }}
          </el-col>
          <el-col :span="2" class="text-row"><div style="height:22px" /></el-col>



          <el-col :span="3" class="text-label">
            运费结算：
          </el-col>
          <el-col :span="21" class="text-row">
            {{ floorFn(printData.freightAmount) }} 元
          </el-col>
        </el-row>
      </div>



      <div class="info_tab">
        <table width="100%" border="1" bordercolor="#404040" cellspacing="0" cellpadding="0" style="padding: 25px">
          <thead>
            <tr>
              <th width="50px">运输单号</th>
              <th width="50px">司机名称</th>
              <th width="50px">车牌号</th>
              <th width="50px">货物</th>

              <th width="50px">项目名称</th>
              <th width="50px">装货重量</th>
              <th width="50px">装货时间</th>

              <th width="50px">渣土场</th>
              <th width="50px">卸货重量</th>
              <th width="50px">卸货时间</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in adjustlist" :key="index" class="tbody_tr">
              <td>{{ item.waybillNo }}</td>
              <td>{{ item.fwefw }}</td>
              <td>{{ item.nwueinfi }}</td>
              <td>{{ item.goodsName }}</td>

              <td>{{ item.loadFormattedAddress }}</td>
              <td>{{ item.loadWeight }} {{ item.stowageStatus === '0'?'吨':(item.stowageStatus === '1'?'立方' : '车') }}</td>
              <td>{{ parseTime(item.fillTime, '{y}-{m}-{d}') }}</td>

              <td>{{ item.unloadFormattedAddress }}</td>
              <td>{{ item.unloadWeight }} {{ item.stowageStatus === '0'?'吨':(item.stowageStatus === '1'?'立方' : '车') }}</td>
              <td>{{ parseTime(item.signTime, '{y}-{m}-{d}') }}</td>
            </tr>
          </tbody>
        </table>

      </div>

      <div class="saiyin pa">
        <div class="grid-content">
          <p class="mb10">
            签名：
          </p>
          <p>
            时间：
          </p>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
import { floor } from '@/utils/ddc';
import { batchRelatedWaybill } from '@/api/settlement/adjustDregs';
export default {
  props: {
    printData: {
      type: Object,
      default: () => { return {}; }
    },
    wayBillCodes: {
      type: Array,
      default: () => []

    }

  },
  data() {
    return {
      loading: false,

      floorFn: floor,

      printObj: {
        id: 'wholecont',
        popTitle: '福建大道成物流科技有限公司',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
      },

      adjustlist: []
    };
  },

  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      batchRelatedWaybill({ wayBillCodes: this.wayBillCodes }).then(res => {
        this.loading = false;
        this.adjustlist = res.data.list;
        console.log(this.adjustlist);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
table th, table td {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    font-weight: normal;
    padding: 5px;
    text-align: center;
}
#wholecont{
    font-size: 14px;
    padding-bottom: 150px;
}
.box-print{
    text-align: right;
    margin: 0 auto;
}



.p_title{
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    margin: 0 0 40px;
}

.feiyong{
    width: 100%;
    margin-bottom: 30px;
    .text-label{
        font-weight: 700;
    }
    // .text-row{
    //     width: 100%;
    // }
}
.info_tab{
    width: 100%;
}
.saiyin{
    right: 0;
    bottom: 0;
    width: 300px;
}
</style>

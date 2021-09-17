<template>
  <div>

    <div v-if="btnShow" id="tin_print-btn" class="box-print">
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
        <el-row class="feiyong-row" type="flex" justify="space-around">
          <el-col :span="12">
            <el-row type="flex">
              <el-col :span="5"><span class="text-label">项目名称：</span></el-col>
              <el-col :span="18"><span class="text-row">{{ printData.projectNames || '-' }}</span></el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex">
              <el-col :span="5"><span class="text-label">渣土场：</span></el-col>
              <el-col :span="18"><span class="text-row"> {{ printData.ztcLandNames || '-' }}</span></el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="feiyong-row">
          <el-col :span="12">
            <el-row>
              <el-col :span="5"><span class="text-label">调度组：</span></el-col>
              <el-col :span="18"><span class="text-row">{{ printData.teamNames || '-' }}</span></el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="5"><span class="text-label">装车数量：</span></el-col>
              <el-col :span="18"><span class="text-row">{{ printData.loadNum || '-' }}</span></el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="feiyong-row">
          <el-col :span="12">
            <el-row>
              <el-col :span="5"><span class="text-label">实发趟数：</span></el-col>
              <el-col :span="18"><span class="text-row">{{ printData.actualTripsNum || '-' }}</span></el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="5"><span class="text-label">结算趟数：</span></el-col>
              <el-col :span="18"><span class="text-row">{{ printData.settlementTripsNum || '-' }}</span></el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="feiyong-row">
          <el-col :span="12">
            <el-row>
              <el-col :span="5"><span class="text-label">运费结算：</span></el-col>
              <el-col :span="18"><span class="text-row"> {{ floorFn(printData.deliveryCashFee) }} 元</span></el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="5"><span class="text-label">操作人：</span></el-col>
              <el-col :span="18"><span class="text-row">{{ shipmentName || '-' }}</span></el-col>
            </el-row>
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
              <!-- <th width="50px">货物</th> -->

              <th width="50px">项目</th>
              <th width="50px">装货数量</th>
              <th width="50px">装货时间</th>

              <th width="50px">渣土场</th>
              <th width="50px">卸货数量</th>
              <th width="50px">卸货时间</th>
              <th width="50px">运费单价</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in adjustlist" :key="index" class="tbody_tr">
              <td>{{ item.waybillNo }}</td>
              <td>{{ item.driverName }}</td>
              <td>{{ item.licenseNumber }}</td>
              <!-- <td>{{ item.goodsName }}</td> -->

              <td>{{ item.projectName }}</td>
              <td>{{ floorFn(item.loadWeight, item.stowageStatus === '2'? 0: 3) }} {{ item.stowageStatus === '0'?'吨':(item.stowageStatus === '1'?'立方' : '车') }}</td>
              <!-- <td>{{ item.loadWeight }} {{ item.stowageStatus === '0'?'吨':(item.stowageStatus === '1'?'立方' : '车') }}</td> -->
              <td>{{ parseTime(item.fillTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</td>

              <td>{{ item.ztcName }}</td>
              <td>{{ floorFn(item.unloadWeight, item.stowageStatus === '2'? 0: 3) }} {{ item.stowageStatus === '0'?'吨':(item.stowageStatus === '1'?'立方' : '车') }}</td>
              <!-- <td>{{ item.unloadWeight }} {{ item.stowageStatus === '0'?'吨':(item.stowageStatus === '1'?'立方' : '车') }}</td> -->
              <td>{{ parseTime(item.signTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</td>
              <td>{{ floorFn(item.deliveryCashFee) }} 元</td>
            </tr>
          </tbody>
        </table>

      </div>

      <div class="saiyin">
        <div class="grid-content">
          <p class="mb10">
            甲方签名：{{ printData.companyName||'' }}
          </p>
          <p>
            时间：
          </p>
        </div>

        <div class="grid-content grid-right">
          <p class="mb10">
            乙方签名：
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
import { getUserInfo } from '@/utils/auth';
export default {
  props: {
    printData: {
      type: Object,
      default: () => { return {}; }
    },
    btnShow: {
      type: Boolean,
      default: true
    }
    // wayBillCodes: {
    //   type: Array,
    //   default: () => []

    // }

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

      adjustlist: [],

      // 渣土场 1001 场内1002 自倒 1003
      loadUnloadType_op: [
        // { 'dictLabel': '渣土场', 'dictValue': '1001' },
        { 'dictLabel': '场内', 'dictValue': '1002' },
        { 'dictLabel': '自倒', 'dictValue': '1003' }
      ]
    };
  },

  computed: {
    shipmentName() {
      const { user = {}} = getUserInfo() || {};
      return user.nickName;
    }
  },

  created() {
    this.getList();
  },

  methods: {
    getList() {
      const queryParams = {
        'pageNum': 1,
        'pageSize': 1000
      };
      this.loading = true;
      batchRelatedWaybill({ ...queryParams, batchNo: this.printData.batchNo }).then(res => {
        this.loading = false;
        this.$emit('onsuccess');
        this.adjustlist = res.data.list.map(e => {
          if (e.loadUnloadType !== '1001') {
            e.ztcName = this.selectDictLabel(this.loadUnloadType_op, e.loadUnloadType) || '-';
          }
          return e;
        });
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
      font-size: 14px;
      font-weight: 700;
      line-height: 14px;
    }
    .text-row{
      line-height: 14px;
    }
    .feiyong-row{
      padding: 0 20px;
      margin-bottom: 10px;
    }
}
.info_tab{
    width: 100%;
}
.saiyin{
    display: flex;
    justify-content: space-between;
}
.grid-content{
  width: 50%;
  padding: 50px 30px;
}


@page{
  size:auto; /* auto is the initial value */
  margin: 3mm;/* this affects the margin in the printer settings */
}

html{
  background-color: #FFFFFF;
  margin: 0;/* this affects the margin on the html before sending to printer */
}

body{
  border: solid 1px blue ;
  margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
}
</style>

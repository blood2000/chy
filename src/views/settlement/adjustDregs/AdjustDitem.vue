<template>
  <div>
    <el-row :gutter="10" class="mb8 ly-flex-align-center">
      <el-col :span="8">
        <span class="mr3">司机实收金额</span>
        <el-input-number
          v-model="deliveryCashFee"
          placeholder="请输入司机实收金额"
          :controls="false"
          :precision="2"
          :step="1"
          :min="0"
          size="mini"
          style="width: 180px"
          class="mr3"
          @keyup.enter.native="handleChange"
        />

        <el-button type="primary" size="mini" @click="handleChange">批量修改</el-button>

      </el-col>
      <el-col :span="16">
        <TotalBar :total-list="totalList" />
      </el-col>


    </el-row>
    <el-table v-loading="loading" highlight-current-row :data="adjustlist" border height="500px">
      <el-table-column width="120" label="调度组名称" show-overflow-tooltip align="center" prop="teamName" />
      <el-table-column width="120" label="接单日期" show-overflow-tooltip align="center" prop="receiveTime">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="班次" show-overflow-tooltip align="center" prop="waybillClasses">
        <template slot-scope="{row}">
          <span>{{ waybillClasses(row.waybillClasses) }}</span>
        </template>
      </el-table-column>




      <el-table-column label="渣土场" show-overflow-tooltip align="center" prop="ztcLandName" />
      <el-table-column label="项目" show-overflow-tooltip align="center" prop="projectName" />

      <el-table-column label="运输单号" show-overflow-tooltip align="center" prop="waybillNo" />

      <el-table-column label="司机姓名" show-overflow-tooltip align="center" prop="driverName" />
      <el-table-column label="司机电话" show-overflow-tooltip align="center" prop="driverPhone" />
      <el-table-column label="车牌号" show-overflow-tooltip align="center" prop="licenseNumber" />

      <el-table-column label="货主备注" show-overflow-tooltip align="center" prop="shipperRemark" />

      <el-table-column width="80" label="装货数量" align="left" prop="loadWeight">
        <template slot-scope="{row}">
          <span>{{ floor(row.loadWeight, row.stowageStatus === '2'? 0: 3) +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" label="卸货数量" align="left" prop="unloadWeight">
        <template slot-scope="{row}">
          <span>{{ floor(row.unloadWeight, row.stowageStatus === '2'? 0: 3) +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80" label="留存运费(元)" align="center" prop="taxPayment" fixed="right">
        <template slot-scope="scope">
          <span> {{ floor(scope.row.taxPayment) }} </span>
        </template>
      </el-table-column>

      <el-table-column width="80" label="服务费(元)" align="center" prop="serviceFee" fixed="right">
        <template slot-scope="scope">
          <span> {{ floor(scope.row.serviceFee) }} </span>
        </template>
      </el-table-column>

      <el-table-column width="140" label="司机实收金额(元)" align="center" prop="deliveryCashFee" fixed="right">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.deliveryCashFee"
            class="teshu"
            :controls="false"
            :precision="2"
            placeholder="请输入司机实收金额"
            style="width:100%;"
            size="mini"
            @change="handlerChangev([scope.row], 1)"
            @keyup.enter.native="handlerChangev([scope.row], 1)"
            @focus="$emit('isLoading', true)"
            @blur="$emit('isLoading', false)"
          />
        </template>
      </el-table-column>

      <el-table-column width="140" label="增减值" align="center" prop="increaseDes" fixed="right">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.increaseDes"
            :controls="true"
            controls-position="right"
            :precision="2"
            placeholder="请输入增减金额"
            style="width:100%;"
            size="mini"
            @change="handlerInOrDe(scope.row)"
            @keyup.enter.native="handlerInOrDe(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column width="120" label="备注" align="center" prop="deductionDes" fixed="right">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deductionDes" placeholder="请输入备注" />
        </template>
      </el-table-column>

      <el-table-column width="80" label="运单备注" align="center" prop="shipperRemark" fixed="right" />

      <el-table-column width="140" label="货主实付金额(元)" align="center" prop="shipperRealPay" fixed="right">
        <template slot-scope="scope">
          <span> {{ floor(scope.row.shipperRealPay) }} </span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
function sum(arr) {
  return arr.reduce(function(prev, curr, idx, arr) {
    return prev + curr;
  });
}
import { floor } from '@/utils/ddc';
import { calculateFee } from '@/api/settlement/adjustDregs';
import TotalBar from '@/components/Ddc/Tin/TotalBar';
export default {
  components: { TotalBar },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    isAgain: {
      type: Number,
      default: 0
    },
    open: [Boolean]
  },

  data() {
    return {
      loading: false,
      deliveryCashFee: undefined,

      oldList: [], // 拷贝一份

      floor,
      changeFee: null,

      stowageStatusOP: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ]

    };
  },

  computed: {
    adjustlist() {
      return this.list;
    },

    isPiliang() {
      return this.adjustlist.length > 1;
    },

    totalList() {
      const arr = [
        {
          label: '结算车数',
          value: 0,
          key: 'loadWeight'
        },
        {
          label: '留存运费',
          value: 0,
          key: 'taxPayment'
        },
        {
          label: '服务费',
          value: 0,
          key: 'serviceFee'
        },
        {
          label: '司机实收',
          value: 0,
          key: 'deliveryCashFee'
        },
        {
          label: '货主实付',
          value: 0,
          key: 'shipperRealPay'
        }
      ];

      arr.forEach(item => {
        const value = sum(this.adjustlist.map(e => e[item.key] - 0 || 0));
        if (item.key === 'loadWeight') {
          item.value = value;
        } else {
          item.value = floor(value);
        }
      });
      return arr;
    }
  },

  watch: {
    open(b) {
      if (!b) {
        this.deliveryCashFee = undefined;
        this.oldList = [];
      }
    }
  },

  created() {
    this.changeFee = this.newDebounceFun(this.setDeliveryCashFee, 1000);
  },

  updated() {
    // 对驳回的单独处理
    this.oldList.length <= 0 && (this.oldList = JSON.parse(JSON.stringify(this.list)));
  },

  methods: {
    // 批量修改
    handleChange() {
      this.adjustlist.forEach(e => {
        e.deliveryCashFee = this.deliveryCashFee;
        e.increaseDes = 0;
      });

      // 驳回, 同步旧的金额
      this.oldList.forEach(e => {
        e.deliveryCashFee = this.deliveryCashFee;
      });
      this.handlerChangev(this.adjustlist);
    },

    // 单条修改
    handlerChangev(arr, mark) {
      // mark === 1 单独修改触发
      if (mark && mark === 1) {
        // 驳回, 同步旧的金额
        this.oldList.forEach(e => {
          if (e.waybillNo === arr[0].waybillNo) {
            e.deliveryCashFee = arr[0].deliveryCashFee;
          }
        });
        arr[0].increaseDes = 0;
      }

      this.que = {
        deliveryCashFee: arr[0].deliveryCashFee, //	金额		false
        waybillCodeList: arr.map(e => e.waybillCode)//	运单ids
      };

      if (this.isRealNum(this.que.deliveryCashFee)) {
        this.changeFee(arr);
      }
    },

    // 防抖=需要带参数,避免和原方法冲突
    newDebounceFun(callback, time) {
      var timer;
      return function(argument) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          callback(argument);
        }, time);
      };
    },
    // 防抖
    async setDeliveryCashFee(arr) {
      this.loading = true;
      this.$emit('isLoading', true);
      try {
        const res = await calculateFee(this.que);

        const { data, code, msg } = res;
        this.loading = false;

        if (code === 501) {
          this.msgError(msg);
          return;
        }
        this.$emit('isLoading', false);
        arr && arr.forEach(row => {
          data.forEach(da => {
            if (row.waybillCode === da.waybillCode) {
              const {
                deliveryFeeDeserved, // 司机应收运费
                deliveryCashFee, //	司机实收现金	number
                serviceFee, //	服务费	number
                serviceTaxFee, //	服务费税费	number
                shipperRealPay, //	货主实付金额	number
                taxPayment //	留存运费	number
                // waybillCode //	运单CODE
              } = da;

              row.deliveryFeeDeserved = deliveryFeeDeserved;
              row.deliveryCashFee = deliveryCashFee;
              row.serviceFee = serviceFee;
              row.shipperRealPay = shipperRealPay;
              row.serviceTaxFee = floor(serviceTaxFee);
              row.taxPayment = floor(taxPayment);
            }
          });
        });
      } catch (error) {
        this.loading = false;
        this.$emit('isLoading', false);
      }
    },
    // 工具-判断
    isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
      if (val === '' || val == null) {
        return false;
      }
      if (!isNaN(val)) {
        // 对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        // 所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
        return true;
      } else {
        return false;
      }
    },
    // 增减
    handlerInOrDe(row) {
      //   const deliveryCashFee = this.deliveryCashFee ? (this.deliveryCashFee - 0) : 0;
      //   row.deliveryCashFee = deliveryCashFee + row.increaseDes;
      //   this.handlerChangev([row]);
      // 8/11 更改chj
      const oldRow = this.oldList.filter(e => e.waybillNo === row.waybillNo)[0] || {};
      row.deliveryCashFee = (oldRow.deliveryCashFee || 0) + row.increaseDes;
      this.handlerChangev([row]);
    },
    // 其他
    waybillClasses(type) {
      if (type === '0') {
        return '白班';
      } else if (type === '1') {
        return '晚班';
      } else {
        return '';
      }
    }
  }
};
</script>


<style scoped>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-form-item{
  margin-bottom: 0;
}
.el-table .teshu.el-input-number ::v-deep.el-input__inner {
  /* text-align: left; */
  /* border-radius: 0; */
  border: 0;
  background-color: #cceeff;
}

.ly-flex{
  flex-wrap: wrap;
}

</style>

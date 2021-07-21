<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      @select="tabSelecedOne"
      @select-all="tabSelecedAll"
      @header-click="headerClick"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <RefactorTable
            :ref="'RefactorTable_'+props.$index"
            :data="props.row.childs"
            :table-columns-config="columns"
            :cb-data="props.row.selectChilds"
          >

            <template #ztcName="{row}">
              <span>{{ row.ztcName || '-' }}</span>
            </template>
            <template #projectName="{row}">
              <span>{{ row.projectName || '-' }}</span>
            </template>
            <template #loadWeight="{row}">
              <span>{{ row.loadWeight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
            </template>
            <template #unloadWeight="{row}">
              <span>{{ row.unloadWeight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
            </template>

            <template #icStatus="{row}">
              <span :class=" row.icStatus==='0'?'g-color-require':'g-color-success' ">{{ selectDictLabel([
                { 'dictLabel': '未核对', 'dictValue': '0' },
                { 'dictLabel': '已核对', 'dictValue': '1' },
              ], row.icStatus) }}</span>
            </template>
            <template #goodsBigType="{row}">
              <span>{{ selectDictLabel(goodsTypeOption, row.goodsBigType) }}</span>
            </template>

            <!-- 默认不显示的 -->
            <template #stowageStatus="{row}">
              <span>{{ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
            </template>
          </RefactorTable>

        </template>
      </el-table-column>

      <el-table-column
        type="selection"
        width="55"
      />

      <template v-for="(item,index) in com">
        <el-table-column
          v-if="item.isShow"
          :key="index"
          :fixed="item.fixed"
          :label="item.label"
          :width="item.width"
          :prop="item.prop"
        >
          <template slot-scope="scope">

            <div v-if="item.prop === 'edit'">
              <!-- <el-button
                size="mini"
                type="text"
                @click="handleTableBtn([scope.row])"
              >核算</el-button> -->
            </div>

            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>


    </el-table>
  </div>
</template>



<script>

// 核算弹窗
const com = [
  {
    'prop': 'cardBatchNo',
    'isShow': true,
    'label': '卡批号',
    'sortNum': 2,
    'width': 150
  },
  {
    'prop': 'card16no',
    'label': '卡ID',
    'isShow': true,
    'sortNum': 2,
    'tooltip': true
  },
  {
    'label': '调度组名称',
    'prop': 'teamName',
    'isShow': true,
    'sortNum': 3,
    'tooltip': true
  },
  {
    'label': '项目',
    'prop': 'projectName',
    'isShow': true,
    'sortNum': 5,
    'tooltip': true
  },
  {
    'label': '渣土场',
    'prop': 'ztcName',
    'isShow': true,
    'sortNum': 6,
    'tooltip': true
  },
  {
    'label': '运单数',
    'prop': 'waybillConts',
    'isShow': true,
    'sortNum': 7,
    'tooltip': true
  }
  // {
  //   'label': '运费结算金额',
  //   'prop': 'freightAmount',
  //   'isShow': false,
  //   'sortNum': 8,
  //   'tooltip': true
  // },
  // {
  //   'label': '装车数量',
  //   'prop': 'loadNum',
  //   'isShow': true,
  //   'sortNum': 11,
  //   'tooltip': true
  // },
  // {
  //   'label': '实发趟数',
  //   'prop': 'actualTripsNum',
  //   'isShow': true,
  //   'sortNum': 11,
  //   'tooltip': true
  // },
  // {
  //   'label': '结算趟数',
  //   'prop': 'settlementTripsNum',
  //   'isShow': true,
  //   'sortNum': 11,
  //   'tooltip': true
  // }
  //   {
  //     'label': '运单号',
  //     'prop': 'waybillCods',
  //     'isShow': true,
  //     'sortNum': 11,
  //     'width': '120',
  //     'tooltip': true
  //   },
  //   {
  //     'label': '操作人',
  //     'prop': 'opName',
  //     'isShow': true,
  //     'sortNum': 12,
  //     'width': '120',
  //     'tooltip': true
  //   },
  // {
  //   'prop': 'edit',
  //   'isShow': false,
  //   'label': '操作',
  //   'width': 50,
  //   'fixed': 'left'
  // }
];



export default {
  components: { },

  props: {
    myData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: [Boolean]
  },

  data() {
    return {
      com,

      // 弹框数据
      // adjustdialog: false,

      selected: [], // 选中外层

      nowSort: 'cardBatchNo',

      goodsTypeOption: [],

      stowageStatusOP: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ],

      // 渣土场 1001 场内1002 自倒 1003
      loadUnloadType_op: [
        // { 'dictLabel': '渣土场', 'dictValue': '1001' },
        { 'dictLabel': '场内', 'dictValue': '1002' },
        { 'dictLabel': '自倒', 'dictValue': '1003' }
      ]

    };
  },

  computed: {
    // 父过来的数据, 进一步处理
    list() {
      const arr = [];
      const object = {};
      this.myData.forEach(e => {
        const str = e[this.nowSort];
        const array = object[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          object[str] = suibian;
        }
      });


      for (const item in object) {
        const obj = {
          freightAmount: 0
        };
        object[item].forEach(ite => {
          // obj['freightAmount'] += ite['taxFee'] - 0; // 运费结算金额(取含税价字段)
          if (ite.loadUnloadType !== '1001') {
            ite.ztcName = this.selectDictLabel(this.loadUnloadType_op, ite.loadUnloadType);
          }
        });


        obj['card16no'] = [...new Set(object[item].map(e => (e.card16no || '-')))].join(',');
        obj['teamName'] = [...new Set(object[item].map(e => (e.teamName || '-')))].join(','); // object[item].map(e=> e.teamName)
        obj['ztcName'] = [...new Set(object[item].map(e => (e.ztcName || '-')))].join(','); // ite['ztcName']; // 渣土场（卸货地）
        obj['projectName'] = [...new Set(object[item].map(e => (e.projectName || '-')))].join(','); // ite['projectName']; // 	项目（装货地）
        obj['cardBatchNo'] = [...new Set(object[item].map(e => e.cardBatchNo))].join(','); // ite['cardBatchNo'] || null; // 	卡批次(初次读卡的时候存在)



        obj['waybillConts'] = object[item].length; // 运单数量
        // obj['actualTripsNum'] = object[item].length; // 实发趟数（次）
        // obj['settlementTripsNum'] = object[item].length; // 结算趟数
        obj['waybillCods'] = object[item].map(e => e.wayBillCode); // 	运单CodeIds
        obj['childs'] = object[item]; // 肯定
        obj['selectChilds'] = [];
        obj['$_id'] = this.genID();

        arr.push(obj);
      }

      // console.log(arr);

      return arr;
    }



  },

  // watch: {
  //   sort() {
  //     // console.log(this.sort);
  //     this.nowSort = this.sort;
  //     this.isDuo();
  //   }
  // },

  created() {
    // this.get_goodsType();
  },

  methods: {

    // 选中运单 data = 当前选中的   row = 当前行  this.list
    // handleSelectionChange(data, row) {
    //   const selectChilds = [];
    //   row.childs.forEach((e, index) => {
    //     data.forEach(ee => {
    //       if (e.wayBillCode === ee.wayBillCode) {
    //         // 选中
    //         selectChilds.push(index);
    //       }
    //     });
    //   });

    //   row.selectChilds = selectChilds;

    //   this.isDuo();
    //   // this.handleTableBtn();
    // },
    // 点击单个
    tabSelecedOne(selection, row) {
      let isok = false;
      selection.forEach(e => {
        if (e.$_id === row.$_id) {
          // 找到说明是 选中
          isok = true;
        }
      });
      if (isok) {
        row.selectChilds = row.childs.map((e, index) => index);
      } else {
        row.selectChilds = [];
      }

      this.isDuo();
      this.$emit('onAllSeleced', selection);
    },
    // 点击全选
    tabSelecedAll(selection) {
      if (selection.length) {
        selection.forEach(e => {
          e.selectChilds = e.childs.map((_, index) => index);
        });
      } else {
        this.list.forEach(e => {
          e.selectChilds = [];
        });
      }
      this.isDuo();
    },

    // 判断多选
    isDuo() {
      const arr = [];
      this.list.forEach(e => {
        arr.push(e.selectChilds.length > 0);
      });

      this.$emit('ismultiple', arr.some(e => e));
    },

    /** 核算事件 批量核算也是触发这个函数 */
    handleTableBtn(rowArr) {
      const lists = rowArr || this.list;


      const arr = [];
      lists.forEach(e => {
        // 找出选中的下标
        if (!rowArr) {
          e.selectChilds.forEach(se => {
            arr.push(e.childs[se]);
          });
        } else {
          e.childs.forEach((ee) => {
            arr.push(ee);
          });
        }
      });

      // 判断是不是同一个调度者
      const object = {};
      arr.forEach(e => {
        const str = e['cardBatchNo'];
        const array = object[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          object[str] = suibian;
        }
      });
      if (Object.keys(object).length > 1) {
        this.msgWarning('只能选择同批次的');
        this.$emit('ismultiple', false);
      } else {
        // this.$emit('ismultiple', false);
        // this.adjustdialog = true;
        // this.$refs.AdjustDialog.setForm(arr);
        // console.log(arr, '选中的数据');
        this.$emit('onAllSeleced', arr);
      }
    },

    /** headerClick **/
    headerClick(column, event) {
      // console.log(column.property);
      this.nowSort = column.property;
    },

    /** 生成随机id */
    genID(length = 5) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    }

    /** 获取字典大类 */
    // get_goodsType() {
    //   const goodsBigType_option = this.$store.getters.goodsBigType_option;

    //   if (!goodsBigType_option) {
    //     this.listByDict({
    //       dictPid: '0',
    //       dictType: 'goodsType'
    //     }).then(res => {
    //       this.goodsTypeOption = res.data;
    //       this.$store.dispatch('orders/store_goodsBigType_option', res.data);
    //     });
    //   } else {
    //     this.goodsTypeOption = goodsBigType_option;
    //   }
    // }


  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

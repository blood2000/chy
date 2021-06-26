<template>
  <el-popover
    placement="right"
    width="400"
    trigger="click"
  >
    <div>
      <el-checkbox-group v-model="checkboxGroup" @change="handlerChange">

        <el-row>
          <el-col v-for="item in showList" :key="item.enName" :span="8" class="mt10">
            <el-checkbox style="width:100px;" :label="item.cnName" border :disabled="item.$_disabled" />
          </el-col>
        </el-row>
      </el-checkbox-group>
    </div>
    <el-button slot="reference" type="text" @click="handlergetLists"><i class="el-icon-plus" /></el-button>
  </el-popover>
</template>

<script>
// import { getRuleItemList } from '@/api/enterprise/rules';
export default {
  name: 'PopoverCom',
  props: {
    // value: {
    //   type: Array,
    //   default: () => []
    // },
    // type: {
    //   type: [String, Number],
    //   default: 1
    // },
    // fixed: {
    //   type: Array,
    //   default: () => []
    // },
    list: {
      type: Array,
      default: () => [] ||
        [
          {
            'id': null,
            'cnName': '其他',
            'enName': 'OTHER',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-04-07T06:36:07.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '6',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': '抹零规则',
            'enName': 'M0',
            'showType': 3,
            'dictCode': 'M0',
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-25T11:25:23.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '18',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': '油费',
            'enName': 'FUEL',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-19T06:33:57.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '13',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': 'ETC费',
            'enName': 'ETC',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-19T06:33:57.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '14',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': '扣回单费',
            'enName': 'RECEIPT_FEE',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-19T06:33:57.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '16',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': '超时费',
            'enName': 'OVERTIME_FEE',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-19T06:33:57.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '15',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': '卸车费',
            'enName': 'DISCHARGE_FARE',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-19T06:33:57.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '12',
            'ruleType': 0
          },
          {
            'id': null,
            'cnName': '装车费',
            'enName': 'LOADING_FEE',
            'showType': 1,
            'dictCode': null,
            'isDel': 0,
            'createCode': '2',
            'createTime': '2021-03-19T06:32:59.000+00:00',
            'updateCode': null,
            'updateTime': null,
            'code': '11',
            'ruleType': 0
          }
        ]
    }
  },

  data() {
    return {
      showList: [],
      checkboxGroup: []
    };
  },


  // watch: {
  //   value: {
  //     handler(data) {
  //       console.log(data);
  //       if (data) {
  //         this.checkboxGroup.map(e => e.cnName);
  //       }
  //     },
  //     immediate: true
  //   },

  //   fixed: {
  //     handler(fixed) {
  //       if (fixed.length) {
  //         const arr = this.list.filter(e => {
  //           let bool = true;
  //           fixed.forEach(ee => {
  //             if (ee.cnName === e.cnName) {
  //               bool = false;
  //             }
  //           });

  //           return bool;
  //         });
  //         console.log(arr, '选项1231');
  //       }
  //     },
  //     immediate: true
  //   }


  // },

  created() {},
  methods: {
    handlergetLists() {
      this.showList = this.list;
    },
    handlerChange() {
      const arr = [];
      this.showList.forEach(e => {
        this.checkboxGroup.forEach(ee => {
          if (ee === e.cnName) {
            arr.push({
              ...e,
              ruleValue: e.ruleValue || 0,
              // type: this.type,
              waybillCode: undefined
            });
          }
        });
      });

      console.log(arr);

      this.$emit('input', arr);
    }

    // getList() {
    //   const que = {
    //     ruleType: 0
    //   };
    //   getRuleItemList(que).then(response => {
    //     this.list = response.data.list.filter(e => {
    //       return e.showType === 1;
    //     });
    //   });
    // }
  }
};
</script>

<style>

</style>

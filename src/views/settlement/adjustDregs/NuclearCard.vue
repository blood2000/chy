<template>
  <el-dialog :title="`数据IC卡: ${ titleData.ttttt1111 || 'IC20511547'} (承运司机: ${titleData.ttttt222 ||'张张张'})`" :visible="visible" width="80%" append-to-body @close="$emit('update:open', false)">
    <div class="mb20">
      <!-- <el-button type="primary" @click="handler('connect')">连接服务</el-button> -->
      <el-button type="primary" @click="handler('cancellation')">注销卡片(清空使用者信息)</el-button>
      <el-button type="primary" @click="handler('issuingCard')">发卡(绑定卡用户)</el-button>
      <el-button type="primary" @click="handler('readUserinfo')">读取用户信息</el-button>
      <el-button type="primary" @click="handler('readData')">读取数据</el-button>
      <el-button type="primary" @click="handler('writeData')">写数据</el-button>
      <!-- <el-button type="primary" @click="handler('writeDataBatch')">写批量数据</el-button>
      <el-button type="primary" @click="handler('folderBatch')">批量创建目录</el-button>
      <el-button type="primary" @click="handler('stop')">停止定时器</el-button> -->

    </div>
    <!-- 表格 -->
    <RefactorTable
      :loading="loading"
      :data="list"
      :table-columns-config="[
        {
          prop: 'id',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '承运车辆'
        },
        {
          prop: 'id1',
          isShow: true,
          label: '项目(装货地)'
        },
        {
          prop: 'id2',
          isShow: true,
          label: '卸货地'
        },
        {
          prop: 'id3',
          isShow: true,
          label: '装货时间'
        },
        {
          prop: 'id4',
          isShow: true,
          label: '操作员'
        },
        {
          prop: 'id5',
          isShow: true,
          label: '运单编号'
        },
        {
          prop: 'id6',
          isShow: true,
          label: '核对状态'
        },
        {
          prop: 'id7',
          width: 100,
          isShow: true,
          label: '核对时间'
        }
      ]"
    >
      <template #id6="{row}">
        <span v-if="row.id6 === 0">√</span>
        <el-button v-else type="danger" plain @click="absenceOpen(row)">不存在</el-button>
      </template>
    </RefactorTable>


    <div slot="footer" class="dialog-footer ly-flex-pack-center">
      <el-button type="primary" @click="submitForm">保存并清空</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CardReader from '@/libs/ICCard/CardReader';
const { fn: { resultData }, action } = CardReader;
export default {
  name: 'NuclearCard',
  components: {
    // UploadImage
  },
  props: {
    open: Boolean
  },
  data() {
    return {
      titleData: {},
      loading: false,

      list: [{
        id: 1,
        id6: 1,
        id7: '2021.06.21 15:30:45'
      }]
    };
  },
  computed: {
    visible: {
      get() {
        if (this.open) {
          this._minit();
        } else {
          this._close();
        }
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {},

  beforeDestroy() {

  },

  methods: {
    init() {
      console.log('123');
    },

    _minit() {
      CardReader.fn.connect(() => {

      });
      console.log(789);
      // this.loading = true;
      // const _this = this;
      // CardReader.fn.connect(() => {
      //   _this.$alert('请把确认卡片放在读卡器上了吗?', '读卡提示', {
      //     confirmButtonText: '确定',
      //     callback: () => {
      //       console.log('提示OK');
      //       // // 读取用户信息
      //       // const { data, code } = await action.readUserInfo();
      //       // if (code !== 200) return;
      //       // console.log(
      //       //   resultData(data, [
      //       //     'user_code',
      //       //     'user_name',
      //       //     'user_telno',
      //       //     'issuing_code',
      //       //     'issuing_name']), '用户数据'
      //       // );


      //       // // 读取数据
      //       // const { data: data2, code: code2 } = await action.readData();

      //       // if (code2 !== 200) {
      //       //   console.log(code2);
      //       // } else {
      //       //   const resData = data2.map(e => {
      //       //     return resultData(e, [
      //       //       'user_code',
      //       //       'user_name',
      //       //       'user_telno',
      //       //       'issuing_code',
      //       //       'issuing_name'
      //       //     ]).data;
      //       //   });
      //       //   console.log(resData);
      //       // }
      //       // //   .then(res => {
      //       // //   const resData = res.data.map(e => {
      //       // //     return resultData(e, [
      //       // //       'user_code',
      //       // //       'user_name',
      //       // //       'user_telno',
      //       // //       'issuing_code',
      //       // //       'issuing_name'
      //       // //     ]).data;
      //       // //   });
      //       // //   console.log(resData);
      //       // // });
      //     }
      //   });


      //   _this.loading = false;
      // }, () => {
      //   _this.$alert('服务链接已断开, 请检查服务是否开启', '服务连接提示', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       _this.visible = false;
      //       _this.loading = false;
      //     }
      //   });
      // });
    },

    absenceOpen(row) {
      this.$confirm('运单不存在', `运单: ${'YGH123456789'}`, {
        confirmButtonText: '转为正常单',
        cancelButtonText: '删除该条记录',
        type: 'warning',
        center: true
      }).then(() => {
        console.log('转为正常单');
      }).catch(() => {
        console.log('删除该条记录');
      });
    },

    submitForm() {
      console.log('保存并清空');
    },

    _reqerror() {
      this.$confirm('请将【数据IC卡】放至有效位置!', '为能读取到数据', {
        confirmButtonText: '知道了',
        type: 'warning',
        showCancelButton: false,
        center: true
      }).then(() => {
        this.$emit('update:open', false);
      }).catch(() => {
        this.$emit('update:open', false);
      });
    },

    handler(key) {
      const _this = this;
      switch (key) {
        // case 'connect':
        //   // 连接服务
        //   CardReader.fn.connect();
        //   break;
        case 'cancellation':
          // 注销卡片
          action.cancellation().then(res => { console.log(res); });
          break;
        case 'getCard':
          // 获得卡片
          action.getCard().then(res => {});
          break;
        case 'issuingCard':
          // 发卡
          action.issuingCard({
            user_code: 'adf34d2d22b64c43b31476a746dd757f',
            user_telno: '18415451845',
            user_name: '黄婷',
            issuing_code: '94671e0bff6647e88db777427d700e32',
            issuing_name: '陈大帅'
          }).then(res => { console.log(res); });
          break;
        case 'readUserinfo':
          // 读取用户信息
          action.readUserInfo().then(res => {
            console.log(res, '用户信息----');
            console.log(
              resultData(res.data, [
                'user_code',
                'user_name',
                'user_telno',
                'issuing_code',
                'issuing_name'])
            );
          });
          break;
        case 'readData':
          // 读取数据e
          action.readData().then(res => {
            const resData = res.data.map(e => {
              return resultData(e, [
                'user_code',
                'user_name',
                'user_telno',
                'issuing_code',
                'issuing_name'
              ]).data;
            });
            console.log(resData);
          });
          break;
        case 'writeData':
          // 写数据
          action.writeData().then(res => { console.log(res); });
          break;
          // case 'writeDataBatch':
          //   // 写批量数据
          //   // CardReader.action.readData();
          //   // _this.start = true;
          //   // let index1 = 1;
          //   // const interval1 = set1(function() {
          //   //   console.log(index1);
          //   //   CardReader.action.writeData();
          //   //   index1 += 1;
          //   //   if (!_this.start) {
          //   //     window.clearInterval(interval1);
          //   //   }
          //   // }, 1500);
          //   break;
          // case 'folderBatch':
          //   // 批量创建目录
          //   // CardReader.action.readData();
          //   // _this.start = true;
          //   // let index = 1;
          //   // const interval2 = setInterval(function() {
          //   //   console.log(index);
          //   //   CardReader.action.createFolder(index);
          //   //   index += 1;
          //   //   if (!_this.start) {
          //   //     window.clearInterval(interval2);
          //   //   }
          //   // }, 1500);
          //   break;
          // case 'stop':
          //   // 停止定时器
          //   _this.start = false;
          //   break;

        default:
          break;
      }
    },

    // 关闭
    _close() {
      if (CardReader.socket) {
        CardReader.socket.onclose = function() {}; // disable onclose handler first
        CardReader.socket.close();
        CardReader.socket = null;
        console.log('关闭');
      }
    }
  }
};
</script>

<style>

</style>

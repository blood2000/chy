<template>
  <el-dialog :title="`发卡人: ${ userInfo.issuing_name || ''} (承运司机: ${userInfo.user_name ||''})`" :visible="visible" width="80%" append-to-body @close="$emit('update:open', false)">
    <div class="mb20" style="padding: 20px;">
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
          prop: '驾驶员姓名',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '驾驶员姓名'
        },
        {
          prop: '联系手机号',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '联系手机号'
        },
        {
          prop: '车牌号',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '车牌号'
        },
        {
          prop: '项目名称',
          isShow: true,
          width: 120,
          label: '项目(装货地)'
        },
        {
          prop: '泥尾名称',
          isShow: true,
          label: '卸货地'
        },
        {
          prop: '入场时间',
          isShow: true,
          label: '入场时间'
        },
        {
          prop: '出场时间',
          isShow: true,
          label: '出场时间'
        },
        {
          prop: '货源数值编号',
          isShow: true,
          label: '货源编号'
        },
        {
          prop: '运单数值编号',
          isShow: true,
          label: '运单编号'
        },
        {
          prop: 'id6',
          isShow: true,
          width: 90,
          label: '核对状态'
        },
        {
          prop: 'id4',
          isShow: true,
          label: '操作员'
        }
      ]"
    >
      <template #id6="{row}">
        <span v-if="row.id6 === 0">√</span>
        <el-button v-else size="mini" type="danger" plain @click="absenceOpen(row)">不存在</el-button>
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

const USERINFO = [
  'user_code',
  'user_name',
  'user_telno',
  'issuing_code',
  'issuing_name'];

const DATAINFO = [
  '货源数值编号',
  '运单数值编号',
  '项目名称',
  '车牌号',
  '驾驶员姓名',
  '联系手机号',
  '入场时间',
  '出场时间',
  '泥尾名称'
];

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
      loading: false,

      userInfo: {},
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
      // console.log('没其他的意思');
    },

    _minit() {
      CardReader.fn.connect(async() => {
        this.loading = true;
        // 读取用户 和 卡数据
        const resUserInfo = (await action.readUserInfo()).data;

        console.log('失败!!');


        const readDataInfo = (await action.readData()).data;
        // 用户数据处理
        this.userInfo = resultData(resUserInfo, USERINFO).data;
        this.list = readDataInfo.map(e => resultData(e, DATAINFO).data);
        // 存储一份 key 当前的 user_code valu {用户信息: 值}
        this.setLocalStorage(this.userInfo.user_code, { [resUserInfo]: readDataInfo });

        this.loading = false;
      }, () => {
        this.loading = false;
        this.$emit('update:open', false);
      });
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
          // action.getCard().then(res => {});
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
            this.userInfo = resultData(res.data, [
              'user_code',
              'user_name',
              'user_telno',
              'issuing_code',
              'issuing_name']).data;
          });

          break;
        case 'readData':
          // 读取数据e
          action.readData().then(res => {
            const resData = res.data.map(e => {
              // 29804;2614710;广东深圳福龙学校项目;鄂ALF106;张三丰;13812345678;1621648441990;1621648441990;广东深圳妈湾石头';

              return resultData(e, [
                '货源数值编号',
                '运单数值编号',
                '项目名称',
                '车牌号',
                '驾驶员姓名',
                '联系手机号',
                '入场时间（时间戳）',
                '出场时间（时间戳）',
                '泥尾名称'
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

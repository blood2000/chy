<template>
  <el-dialog :title="`数据IC卡: ${ titleData.ttttt1111 || 'IC20511547'} (承运司机: ${titleData.ttttt222 ||'张张张'})`" :visible="visible" width="80%" append-to-body @close="$emit('update:open', false)">
    <div>
      <el-button type="primary" @click="handler('connect')">连接服务</el-button>
      <el-button type="primary" @click="handler('cancellation')">注销卡片</el-button>
      <el-button type="primary" @click="handler('getCard')">获得卡片</el-button>
      <el-button type="primary" @click="handler('issuingCard')">发卡</el-button>
      <el-button type="primary" @click="handler('readUserinfo')">读取用户信息</el-button>
      <el-button type="primary" @click="handler('readData')">读取数据</el-button>
      <el-button type="primary" @click="handler('writeData')">写数据</el-button>
      <el-button type="primary" @click="handler('writeDataBatch')">写批量数据</el-button>
      <el-button type="primary" @click="handler('folderBatch')">批量创建目录</el-button>
      <el-button type="primary" @click="handler('stop')">停止定时器</el-button>

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
          this.open && CardReader.fn.connect();
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
  created() {

  },

  beforeDestroy() {

  },

  methods: {
    init(data) {
      console.log(data);



      // 请求失败提示
    //   this._reqerror();
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
        case 'connect':
          // 连接服务
          CardReader.fn.connect();
          break;
        case 'cancellation':
          // 注销卡片
          CardReader.action.cancellation();
          break;
        case 'getCard':
          // 获得卡片
          CardReader.action.getCard();
          break;
        case 'issuingCard':
          // 发卡
          CardReader.action.issuingCard({
            user_code: 'adf34d2d22b64c43b31476a746dd757f',
            user_telno: '18415451845',
            user_name: '黄婷',
            issuing_code: '94671e0bff6647e88db777427d700e32',
            issuing_name: '陈大帅'
          });
          break;
        case 'readUserinfo':
          // 读取用户信息
          CardReader.action.readUserInfo();
          console.log('readUserInfo');
          break;
        case 'readData':
          // 读取数据
          CardReader.action.readData();
          break;
        case 'writeData':
          // 写数据
          CardReader.action.writeData();
          break;
        case 'writeDataBatch':
          // 写批量数据
          // CardReader.action.readData();
          // _this.start = true;
          // let index1 = 1;
          // const interval1 = set1(function() {
          //   console.log(index1);
          //   CardReader.action.writeData();
          //   index1 += 1;
          //   if (!_this.start) {
          //     window.clearInterval(interval1);
          //   }
          // }, 1500);
          break;
        case 'folderBatch':
          // 批量创建目录
          // CardReader.action.readData();
          // _this.start = true;
          // let index = 1;
          // const interval2 = setInterval(function() {
          //   console.log(index);
          //   CardReader.action.createFolder(index);
          //   index += 1;
          //   if (!_this.start) {
          //     window.clearInterval(interval2);
          //   }
          // }, 1500);
          break;
        case 'stop':
          // 停止定时器
          _this.start = false;
          break;

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

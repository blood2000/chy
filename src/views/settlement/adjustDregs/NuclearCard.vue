<template>
  <el-dialog :title="`发卡人: ${ userInfo.issuing_name || ''} (承运司机: ${userInfo.user_name ||''})`" :visible="visible" width="80%" append-to-body @close="$emit('update:open', false)">
    <div class="mb20" style="padding: 20px;">
      <!-- <el-button type="primary" @click="handler('connect')">连接服务</el-button> -->
      <el-button type="primary" @click="handler('cancellation')">注销卡片(清空使用者信息)</el-button>
      <el-button type="primary" @click="handler('issuingCard')">发卡(绑定卡用户)</el-button>
      <el-button type="primary" @click="handler('readUserinfo')">读取用户信息</el-button>
      <el-button type="primary" @click="handler('readData')">读取数据</el-button>
      <el-button type="primary" @click="handler('writeData')">写数据</el-button>
      <el-button type="primary" @click="handler('writeOtherData')">写数据222</el-button>
      <!-- <el-button type="primary" @click="handler('writeDataBatch')">写批量数据</el-button>
      <el-button type="primary" @click="handler('folderBatch')">批量创建目录</el-button>
      <el-button type="primary" @click="handler('stop')">停止定时器</el-button> -->

    </div>
    <!-- 表格 -->

    <!--
        icList	核销数据列表		false
        array
            driverName	司机名称		false
            driverPhone	司机电话		false
            fillTime	装货时间戳		false
            fillTimeDate	装货时间		false
            licenseNumber	车牌号		false
            mudtail	泥尾		false

            orderId	货源ID		false

            projectName	项目名称		false

            serialNumber	序号		false

            signTime	卸货时间戳		false
            signTimeDate	卸货时间		false
            status	0正常 1.数据库有数据IC卡没有 2.IC卡有数据数据库没有		false

            waybillId	运单ID		false

        userCode	用户CODE
     -->

    <RefactorTable
      :loading="loading"
      :data="list"
      :table-columns-config="[
        {
          prop: 'driverName',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '驾驶员姓名'
        },
        {
          prop: 'driverPhone',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '联系手机号'
        },
        {
          prop: 'licenseNumber',
          isShow: true,
          width: 120,
          tooltip: true,
          label: '车牌号'
        },
        {
          prop: 'projectName',
          isShow: true,
          width: 120,
          label: '项目(装货地)'
        },
        {
          prop: 'mudtail',
          isShow: true,
          label: '泥尾'
        },
        {
          prop: 'fillTimeDate',
          isShow: true,
          label: '入场时间'
        },
        {
          prop: 'signTimeDate',
          isShow: true,
          label: '出场时间'
        },
        {
          prop: 'orderId',
          isShow: true,
          label: '货源编号'
        },
        {
          prop: 'waybillId',
          isShow: true,
          label: '运单编号'
        },
        {
          prop: 'serialNumber',
          isShow: true,
          label: '渣土场编号'
        },
        {
          prop: 'status',
          isShow: true,
          width: 90,
          label: '核对状态'
        }
      ]"
    >
      <template #status="{row}">
        <span v-if="row.status === 0"><i class="el-icon-check" /></span>
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

import { checkList, delWaybill, check } from '@/api/settlement/adjustDregs';

// /transportation/icCheck/delWaybill


const { fn: { resultData }, action } = CardReader;

const USERINFO = [
  'user_code',
  'user_name',
  'user_telno',
  'issuing_code',
  'issuing_name'];
// 29804;2614710;广东深圳福龙学校项目;鄂ALF106;张三丰;13812345678;1621648441990;1621648441990;49384299482;广东深圳妈湾石头';
const DATAINFO = [
  'orderId',
  'waybillId',
  'projectName',
  'licenseNumber',
  'driverName',
  'driverPhone',
  'fillTime',
  'signTime',
  'serialNumber',
  'mudtail'
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
      list: [],
      IClist: []
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
        const { data: resUserInfo } = (await action.readUserInfo());


        const res = (await action.readData(null, () => {
          this.msgError('无任何消息');
          this.loading = false;
        }));

        if (res) {
          const readDataInfo = res.data;

          // 用户数据处理
          this.userInfo = resultData(resUserInfo, USERINFO).data;
          this.IClist = readDataInfo.map(e => resultData(e, DATAINFO).data);
          // 存储一份 key 当前的 user_code valu {用户信息: 值}
          this.setLocalStorage(this.userInfo.user_code, { [resUserInfo]: readDataInfo });

          this.initData();
        }
      }, () => {
        this.loading = false;
        this.$emit('update:open', false);
      });
    },

    // /transportation/icCheck/checkList
    async initData() {
      console.log(this.IClist);
      console.log(this.userInfo);

      const que = {
        icList: this.IClist.map(e => {
          // this.parseTime(date[0], '{y}-{m}-{d}')
          return {
            ...e,
            other: undefined
            // fillTimeDate: this.parseTime(1623036606252),
            // signTimeDate: this.parseTime(e.signTime - 0) + ''
          };
        }),
        // [
        //   {
        //     driverName: '', //	司机名称		false
        //     driverPhone: '', //	司机电话		false
        //     fillTime: '', //	装货时间戳		false
        //     fillTimeDate: '', //	装货时间		false
        //     licenseNumber: '', //	车牌号		false
        //     mudtail: '', //	泥尾		false
        //     orderId: '', //	货源ID		false
        //     projectName: '', //	项目名称		false
        //     serialNumber: '', //	序号		false
        //     signTime: '', //	卸货时间戳		false
        //     signTimeDate: '', //	卸货时间		false
        //     status: '', //	0正常 1.数据库有数据IC卡没有 2.IC卡有数据数据库没有 3.数据不一致		false
        //     waybillId: '' //	运单ID
        //   }
        // ],
        userCode: this.userInfo.user_code //	用户CODE

      };

      try {
        const res = await checkList(que);
        this.list = res.data.map(e => {
          return {
            ...e,
            fillTimeDate: this.parseTime(e.fillTime - 0),
            signTimeDate: this.parseTime(e.signTime - 0)
          };
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },

    absenceOpen(row) {
      this.$confirm('运单不存在', `运单: ${row.waybillId}`, {
        confirmButtonText: '转为正常单',
        cancelButtonText: '删除该条记录',
        distinguishCancelAndClose: true,
        type: 'warning',
        center: true
      }).then(() => {
        console.log('转为正常单');
        row.status = 0;
      }).catch((action) => {
        if (action === 'cancel') {
          delWaybill({ waybillId: row.waybillId - 0 }).then(res => {
            this.msgSuccess('删除该条记录成功');
            this.list = this.list.filter(e => e.waybillId !== row.waybillId);
          });
        }
      });
    },

    submitForm() {
      const filterArr = this.list.filter(e => {
        return e.status !== 0;
      });

      if (filterArr.length > 0) {
        this.$alert(`运单${filterArr[0].waybillId} 平台未能核对成功`, '数据存在异常', {
          confirmButtonText: '好的',
          type: 'warning',
          center: true,
          callback: action => {}
        });
      } else {
        this.$confirm('确认保存并清空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log('保存并清空');
          this.loading = true;
          check(this.list.map(e => e.waybillId)).then(res => {
            action.issuingCard({
              user_code: this.userInfo.user_code,
              user_telno: this.userInfo.user_telno,
              user_name: this.userInfo.user_name,
              issuing_code: this.userInfo.issuing_code,
              issuing_name: this.userInfo.issuing_name
            }).then(res => {
              if (res.code === 200) {
                this.msgSuccess('保存并核销成功');
                this.userInfo = {};
                this.list = [];
                this.IClist = [];
                this.loading = false;

                this.$emit('update:open', false);
              }
            });
          });
        }).catch(() => {

        });
      }
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
            user_code: '2356e0709128412eb3af3bf3397a0518',
            user_telno: '18415451845',
            user_name: '黄婷',
            issuing_code: '94671e0bff6647e88db777427d700e32',
            issuing_name: '陈大帅'
          }).then(res => { console.log(res); });
          break;
        case 'readUserinfo':
          // 读取用户信息
          action.readUserInfo().then(res => {
            this.userInfo = resultData(res.data, USERINFO).data;
          });

          break;
        case 'readData':
          // 读取数据e
          action.readData().then(res => {
            const resData = res.data.map(e => {
              return resultData(e, DATAINFO).data;
            });
            console.log(resData);
          });
          break;
        case 'writeOtherData':
          // 读取数据e
          action.writeOtherData();
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

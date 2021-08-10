<template>

  <div>
    <div v-show="showSearch">
      <QueryForm v-model="queryParams" :shift-op="shift_op" :attendance-status-op="attendanceStatus_op" @handleQuery="queryParams.pageNum = 1;getList()" />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <span style="lineHeight: 30px;">
            白班：白；晚班：晚；连班：连；晚班收车时间：收；请假：请；旷工或离职：旷；未开工或合理休假：休；加班：加；未登记：缺。
          </span>
        </el-col>

        <el-col v-if="false" :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <MoreRefactorTable :loading="loading" :summary="false" :data="list" :table-columns-config="tableColumnsConfig" :morelist="morelist" indexfixed>

        <template v-for="(item, index) in morelist[0].children" #[item.prop]="{row}">
          <!-- <template v-for="(item, index) in morelist[0].children" :slot="item.prop" slot-scope="{row}"> -->
          <div :key="index">
            <el-popover
              v-if="true"
              placement="top"
              title="考勤备注"
              width="300"
              trigger="click"
              :content="row.sighowiheio"
            >
              <div slot="reference" class="triangleL shou">{{ selectDictLabel(lebshift_op, row[item.prop] + '') }}</div>
            </el-popover>

            <span v-else>{{ selectDictLabel(lebshift_op, row[item.prop] + '') }}</span>
          </div>
        </template>
      </MoreRefactorTable>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth';
import QueryForm from './components/QueryForm';
import { floor } from '@/utils/ddc';
import { getLocalStorage } from '@/utils/auth';

import { getMachineWorkingList, getMachineWorkingapi } from '@/api/construction/manhour';


export default {
  name: 'Manhour', // 机械工时登记

  components: { QueryForm },

  // attendanceStatus	0未出勤，1出勤，2请假，3矿工或者离职，4未开工或合理休假，5加班
  // attendanceTime	考勤日期		false	 string
  // createTime	创建时间		false	 string
  // isAsc	desc or asc		false	 string
  // keyWord	关键字检索		false	 string
  // orderByColumn	按什么排序		false	 string
  // orgCode	机构code		false	 string
  // pageNum	页数		false	integer(int32)
  // pageSize	每页大小		false	integer(int32)
  // schedule	班次 0白班1夜班
  // projectCode	项目code		false	string
  data() {
    return {
      // 搜索显隐
      'showSearch': true,
      // 导出
      'exportLoading': false,
      // 加载
      'loading': false,
      // 总条数
      'total': 0,
      // 表头
      'tableColumnsConfig': [],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,

        projectCode: undefined,
        keyWord: undefined,
        attendanceTime: new Date().getFullYear() + '-01', // 默认当前年一月

        attendanceStatus: undefined, // 考勤类型
        schedule: undefined // 班次

      },

      'list': [],
      // 多选
      'selections': [],
      // 登录信息
      getUserInfo,

      // 表格字典
      auditStatus_op: [
        { dictValue: 0, dictLabel: '待审核' },
        { dictValue: 1, dictLabel: '已审核' }
      ],
      status_op: [
        { dictValue: 0, dictLabel: '未完工' },
        { dictValue: 1, dictLabel: '已完成' }
      ],

      // schedule	班次 0白班1夜班
      shift_op: [
        { dictLabel: '白班', dictValue: '0' },
        { dictLabel: '晚班', dictValue: '1' },
        { dictLabel: '连班', dictValue: '2' }
      ],
      lebshift_op: [
        { dictLabel: '白', dictValue: '1' },
        { dictLabel: '晚', dictValue: '2' },
        { dictLabel: '连', dictValue: '3' },
        { dictLabel: '收', dictValue: '4' },
        { dictLabel: '请', dictValue: '5' },
        { dictLabel: '旷', dictValue: '6' },
        { dictLabel: '休', dictValue: '7' },
        { dictLabel: '加', dictValue: '8' },
        { dictLabel: '缺', dictValue: '9' }
      ],
      // attendanceStatus	0 未出勤 ，1 出勤 ，2 请假 ，3 矿工或者离职 ，4 未开工或合理休假 ，5 加班
      attendanceStatus_op: [
        { dictLabel: '未出勤', dictValue: '0' },
        { dictLabel: '出勤', dictValue: '1' },
        { dictLabel: '请假', dictValue: '2' },
        { dictLabel: '矿工或者离职', dictValue: '3' },
        { dictLabel: '未开工或合理休假', dictValue: '4' },
        { dictLabel: '加班', dictValue: '5' }
      ],

      floor // 工具
    };
  },

  computed: {
    api() {
      return getMachineWorkingapi + '4545';
    },
    morelist() {
      // // const tab1 = [];
      // const tab2 = [];
      // const tab3 = [];

      // this.tableColumns.forEach(e => {
      //   if (e.pid === 2) {
      //     tab2.push(e);
      //   } else if (e.pid === 3) {
      //     tab3.push(e);
      //   }
      // });

      return [
        {
          label: '日期',
          children: [
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '1',
              prop: 'rijiqi1',
              sortNum: 0,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '2',
              prop: 'rijiqi2',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '3',
              prop: 'rijiqi3',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '4',
              prop: 'rijiqi4',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '5',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '6',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '7',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '8',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '9',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '10',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '11',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '12',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '13',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '14',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '15',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '16',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '17',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '18',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '19',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '20',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '21',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '22',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '23',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '24',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '25',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '26',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '27',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '28',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '29',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '30',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '31',
              prop: 'rijiqi1',
              sortNum: 7,
              tooltip: true,
              width: '50'
            }
          ]
        },
        {
          label: '合计',
          fixed: 'right',
          width: '150',
          children: [
            {
              pid: 3,
              isChild: true,
              isShow: true,
              label: '出勤',
              prop: 'attendance',
              fixed: 'right',
              sortNum: 300,
              tooltip: true,
              width: '50'
            },
            {
              pid: 3,
              isChild: true,
              isShow: true,
              label: '连班',
              prop: 'lqingiqbiiop',
              sortNum: 310,
              fixed: 'right',
              tooltip: true,
              width: '50'
            },
            {
              pid: 3,
              isChild: true,
              isShow: true,
              label: '请假',
              prop: 'leave',
              sortNum: 320,
              fixed: 'right',
              tooltip: true,
              width: '50'
            }
          ]
        }
      ];
    },
    tableColumns() {
    //   const isAdmin = !this.getUserInfo.isShipment;
      return [
        {
          pid: 1,
          isChild: false,
          isShow: true,
          label: '岗位',
          prop: 'sighowiheio',
          sortNum: 0,
          fixed: 'left',
          tooltip: true,
          width: '120'
        },
        {
          pid: 1,
          isChild: false,
          isShow: true,
          label: '姓名',
          fixed: 'left',
          prop: 'xiangijij',
          sortNum: 0,
          tooltip: true,
          width: '120'
        }
      ];
    },

    queParams() {
      return {
        ...this.queryParams
        // bigCreateTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[0] : undefined, //	签收时间		false
        // endCreateTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[1] : undefined, //	签收时间		false
        // receiveTime: undefined
      };
    }
  },

  created() {
    this.tabColInit();
    this.getList();
  },

  methods: {

    // 初始表头
    tabColInit() {
      const tabCol = getLocalStorage(this.api);
      this.tableColumnsConfig = tabCol || this.tableColumns;
      // this.tableHeaderConfig(this.tableColumnsConfig, '', null, this.tableColumns);
    },
    // 初始数据
    async getList() {
      this.loading = true;
      getMachineWorkingList(this.queParams).then(res => {
        this.list = [{ sighowiheio: '主管', rijiqi1: '1', rijiqi2: '2', rijiqi3: '2', rijiqi4: '3' }] || res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    async handleExport() {
      this.exportLoading = true;
      await this.download('/kydsz/machineWork/web—getMachineWorkingListExport', this.queParams, `机械工时登记`);
      this.exportLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.el-table--enable-row-transition .el-table__body td{
  position: relative;
}
.triangleL::before{
  content: '★';
  position: absolute;
  color: #fff;
  font-size: 12px;
  top: -5px;
  right: 0;
  width: 10px;
  height: 10px;
  z-index: 1;

}

// .triangleT,.triangleL,.triangleB,.triangleR{position:relative;}
.triangleL::after
{content:"";position:absolute;width:0;height:0;top:-15px;left:35px;border-color:transparent;border-style:solid;}

.triangleL::after{border-left-color: red;border-width:15px; transform: rotate(-45deg); }

</style>

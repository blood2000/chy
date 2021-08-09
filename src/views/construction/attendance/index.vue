<template>

  <div>
    <div v-show="showSearch">
      <QueryForm v-model="queryParams" :shift-op="shift_op" @handleQuery="queryParams.pageNum = 1;getList()" />
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

        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <MoreRefactorTable :loading="loading" :summary="false" :data="list" :table-columns-config="tableColumnsConfig" :morelist="morelist">
        <template #rijiqi1="{row}">
          <el-tooltip effect="light" placement="top">
            <div slot="content" style="width: 300px">
              多行信息第二行信息第二行信息第二行信息第二行信息第二行信息第二行信息第二行信息
            </div>
            <div class="triangleL">{{ selectDictLabel(lebshift_op, row.rijiqi1 + '') }}</div>
          </el-tooltip>
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
        phone: undefined,
        yuehushie: undefined, // 时间
        kaogqihnihijij: undefined, // 考勤类型
        bangieisoopjp: undefined // 班次

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

      shift_op: [
        { dictLabel: '不限', dictValue: '0' },
        { dictLabel: '白班', dictValue: '1' },
        { dictLabel: '晚班', dictValue: '2' },
        { dictLabel: '连班', dictValue: '3' }
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

      floor // 工具
    };
  },

  computed: {
    api() {
      return getMachineWorkingapi + '4545';
    },
    morelist() {
      // const tab1 = [];
      const tab2 = [];
      const tab3 = [];

      this.tableColumns.forEach(e => {
        if (e.pid === 2) {
          tab2.push(e);
        } else if (e.pid === 3) {
          tab3.push(e);
        }
      });

      return [
        {
          label: '日期',
          children: tab2
        },
        {
          label: '合计',
          children: tab3
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
          tooltip: true,
          width: '120'
        },
        {
          pid: 1,
          isChild: false,
          isShow: true,
          label: '姓名',
          prop: 'xiangijij',
          sortNum: 0,
          tooltip: true,
          width: '120'
        },
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
          prop: 'rijiqi1',
          sortNum: 7,
          tooltip: true,
          width: '50'
        },
        {
          pid: 2,
          isChild: true,
          isShow: true,
          label: '3',
          prop: 'rijiqi1',
          sortNum: 7,
          tooltip: true,
          width: '50'
        },
        {
          pid: 2,
          isChild: true,
          isShow: true,
          label: '4',
          prop: 'rijiqi1',
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
        },
        {
          pid: 3,
          isChild: true,
          isShow: true,
          label: '出勤',
          prop: 'chusqiohoq',
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
          tooltip: true,
          width: '50'
        },
        {
          pid: 3,
          isChild: true,
          isShow: true,
          label: '请假',
          prop: 'qingqijijai',
          sortNum: 320,
          tooltip: true,
          width: '50'
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
        this.list = [{ sighowiheio: '主管', rijiqi1: '1' }] || res.data.list;
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
  cursor: pointer;
}

// .triangleT,.triangleL,.triangleB,.triangleR{position:relative;}
.triangleL::after
{content:"";position:absolute;width:0;height:0;top:-15px;left:35px;border-color:transparent;border-style:solid;}

.triangleL::after{border-left-color: red;border-width:15px; transform: rotate(-45deg);cursor: pointer; }

</style>

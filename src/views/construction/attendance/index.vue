<template>

  <div>
    <div v-show="showSearch">
      <QueryForm v-model="queryParams" :shift-op="shift_op" :attendance-status-op="attendanceStatus_op" :project-list-o-p="projectList" @handleQuery="queryParams.pageNum = 1;getList()" @initPickerOptions="queryParams.projectCode=projectList[0].code" />
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

      <MoreRefactorTable :loading="loading" :summary="false" :data="list" :table-columns-config="tableColumnsConfig" :morelist="morelist" indexfixed>

        <!-- <template #nickName="{row}">
          <span>{{ row.nickName || '--' }} [{{ row.phonenumber }}]</span>
        </template> -->

        <template v-for="(item, index) in morelist[0].children" #[item.prop]="{row}">
          <!-- <template v-for="(item, index) in morelist[0].children" :slot="item.prop" slot-scope="{row}"> -->
          <div :key="index">
            <el-popover
              v-if="row[item.prop] && (row[item.prop].split(';'))[1]"
              placement="right"
              title="考勤备注"
              width="300"
              trigger="click"
              :content="(row[item.prop].split(';'))[1]"
            >
              <div slot="reference" class="triangleL shou">{{ (row[item.prop].split(';'))[0] }}</div>
            </el-popover>
            <span v-else>{{ row[item.prop]? row[item.prop] : undefined }}</span>
            <!-- <span v-else>{{ isTedate? (((new Date().getMonth()) >= index || row[item.prop] !== '缺')? row[item.prop]:undefined) : row[item.prop] }}</span> -->
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

import { getEmployeeAttendanceList, getEmployeeAttendanceApi } from '@/api/construction/attendance';
import { webGetMachineProjectList } from '@/api/construction/comon';

export default {
  name: 'Attendance', // 机械工时登记

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
        keyWord: undefined,

        attendanceMonth: this.parseTime(new Date(), '{y}-{m}'), // new Date().getFullYear() + '-01', // 默认当前年一月

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


      projectList: [],
      // schedule	班次 0白班1夜班
      shift_op: [
        // { dictLabel: '白班', dictValue: '0' },
        // { dictLabel: '晚班', dictValue: '1' },
        // { dictLabel: '连班', dictValue: '2' }
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
        // { dictLabel: '未出勤', dictValue: '0' },
        // { dictLabel: '出勤', dictValue: '1' },
        // { dictLabel: '请假', dictValue: '2' },
        // { dictLabel: '矿工或者离职', dictValue: '3' },
        // { dictLabel: '未开工或合理休假', dictValue: '4' },
        // { dictLabel: '加班', dictValue: '5' }
      ],

      floor // 工具
    };
  },

  computed: {
    isTedate() {
      return this.parseTime(new Date(), '{y}-{m}') === this.queryParams.attendanceMonth;
    },

    api() {
      return getEmployeeAttendanceApi + '4545';
    },
    morelist() {
      return [
        {
          label: '日期',
          children: [
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '1',
              prop: 'one',
              sortNum: 0,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '2',
              prop: 'two',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '3',
              prop: 'three',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '4',
              prop: 'four',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '5',
              prop: 'five',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '6',
              prop: 'six',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '7',
              prop: 'seven',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '8',
              prop: 'eight',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '9',
              prop: 'nine',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '10',
              prop: 'ten',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '11',
              prop: 'eleven',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '12',
              prop: 'twelve',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '13',
              prop: 'thirteen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '14',
              prop: 'fourteen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '15',
              prop: 'fifteen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '16',
              prop: 'sixteen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '17',
              prop: 'seventeen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '18',
              prop: 'eighteen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '19',
              prop: 'nineteen',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '20',
              prop: 'twenty',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '21',
              prop: 'twentyOne',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '22',
              prop: 'twentyTwo',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '23',
              prop: 'twentyThree',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '24',
              prop: 'twentyFour',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '25',
              prop: 'twentyFive',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '26',
              prop: 'twentySix',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '27',
              prop: 'twentySeven',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '28',
              prop: 'twentyEight',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '29',
              prop: 'twentyNine',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '30',
              prop: 'thirty',
              sortNum: 7,
              tooltip: true,
              width: '50'
            },
            {
              pid: 2,
              isChild: true,
              isShow: true,
              label: '31',
              prop: 'thirtyOne',
              sortNum: 7,
              tooltip: true,
              width: '50'
            }
          ]
        },
        {
          label: '合计',
          fixed: 'right',
          width: '300',
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
              label: '加班',
              prop: 'workOvertime',
              fixed: 'right',
              sortNum: 300,
              tooltip: true,
              width: '50'
            },
            {
              pid: 3,
              isChild: true,
              isShow: true,
              label: '旷工',
              prop: 'absenteeism',
              fixed: 'right',
              sortNum: 300,
              tooltip: true,
              width: '50'
            },
            {
              pid: 3,
              isChild: true,
              isShow: true,
              label: '缺勤',
              prop: 'absent',
              fixed: 'right',
              sortNum: 300,
              tooltip: true,
              width: '50'
            },
            {
              pid: 3,
              isChild: true,
              isShow: true,
              label: '休假',
              prop: 'vacation',
              fixed: 'right',
              sortNum: 300,
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
          prop: 'postName',
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
          prop: 'nickName',
          sortNum: 0,
          tooltip: true,
          width: '120'
        }
      ];
    },

    queParams() {
      return {
        ...this.queryParams,
        attendanceStatus: this.queryParams.attendanceStatus ? this.queryParams.attendanceStatus : undefined,
        schedule: this.queryParams.attendanceStatus ? this.queryParams.schedule : undefined,
        projectName: this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code').projectName
      };
    }
  },

  created() {
    this.initData();
    this.tabColInit();
  },

  methods: {
    // 初始化搜索数据
    async initData() {
      const res = await webGetMachineProjectList();
      this.projectList = res.data;
      this.queryParams.projectCode = this.projectList[0].code;

      this.getDicts('work-shift').then((response) => {
        this.shift_op = response.data;
      });

      this.getDicts('attendance-type').then((response) => {
        this.attendanceStatus_op = response.data;
      });

      this.getList();
    },

    // 初始表头
    tabColInit() {
      const tabCol = getLocalStorage(this.api);
      this.tableColumnsConfig = tabCol || this.tableColumns;
      // this.tableHeaderConfig(this.tableColumnsConfig, '', null, this.tableColumns);
    },
    // 初始数据
    async getList() {
      this.loading = true;
      getEmployeeAttendanceList(this.queParams).then(res => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    async handleExport() {
      this.exportLoading = true;
      await this.download('/kydsz/employeeAttendance/web—getEmployeeAttendanceListExport', this.queParams, this.queParams, this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code').projectName + `工地考勤`);
      this.exportLoading = false;
    },

    // 根据value匹配数组中的一项
    _zhaovalue(arr, value, key = 'dictValue') {
      return (arr.filter(e => {
        return e[key] === value;
      }))[0];
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

<template>

  <div>
    <div v-show="showSearch">
      <QueryForm v-model="queryParams" :project-list-o-p="projectList" @handleQuery="queryParams.pageNum = 1;getList()" />
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

        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>
      <!-- @selection-change="(selection)=> selections = selection" -->
      <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig">
        <template #price="{row}">
          <span>{{ floor(row.price - 0) }}</span>
        </template>
        <template #total="{row}">
          <span>{{ row.total? floor(row.total - 0): '--' }}</span>
        </template>
      </RefactorTable>

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
import { getUserInfo, getLocalStorage } from '@/utils/auth';
import QueryForm from './components/QueryForm';
import { floor } from '@/utils/ddc';

import { getProjectTicketList, getProjectTicketApi } from '@/api/construction/tupiao';
import { webGetMachineProjectList } from '@/api/construction/comon';
export default {
  name: 'Tupiao', // 工地土票列表

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
        ticketName: undefined,
        receiveSite: undefined,
        receiveTime: [] // 时间



      },
      'list': [],
      // 多选
      'selections': [],

      //
      projectList: [],
      // 登录信息
      getUserInfo,
      floor // 工具
    };
  },

  computed: {
    api() {
      return getProjectTicketApi;
    },

    // code	编码	string
    // earlyStageRemainingTickets	前期余票	integer
    // id	主键	integer
    // number	数量	integer
    // price	价格	number
    // projectName	项目名称	string
    // receiveSite	接收工地	string
    // remark	备注	string
    // signName	签收人	string
    // signTime	签收时间	string
    // thisWeekCollectTickets	本日领票	integer
    // thisWeekRefundTickets	本日退票	integer
    // thisWeekRemainingTickets	本日余票	integer
    // thisWeekUsedTickets	本日用票	integer
    // ticketName	土票名称	string
    // total	总价	number
    // vehicleSize	车型	string
    // vehicleSizeName	车型	string

    tableColumns() {
    //   const isAdmin = !this.getUserInfo.isShipment;
      return [
        {
          'label': '项目名称',
          'prop': 'projectName',
          'isShow': false,
          'sortNum': 10,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '土票名称',
          'prop': 'ticketName',
          'isShow': true,
          'sortNum': 20,
          'tooltip': true
        },
        {
          'label': '车型',
          'prop': 'vehicleSizeName',
          'isShow': true,
          'sortNum': 30,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '接收工地',
          'prop': 'receiveSite',
          'isShow': true,
          'sortNum': 40,
          'tooltip': true
        },
        {
          'label': '接收人',
          'prop': 'signName',
          'isShow': true,
          'sortNum': 50,
          'tooltip': true
        },
        {
          'label': '签收时间',
          'prop': 'signTime',
          'isShow': true,
          'sortNum': 51,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '前余',
          'prop': 'earlyStageRemainingTickets',
          'isShow': true,
          'sortNum': 52,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '日领',
          'prop': 'thisWeekCollectTickets',
          'isShow': true,
          'sortNum': 60,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '日用',
          'prop': 'thisWeekUsedTickets',
          'isShow': true,
          'sortNum': 60,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '日余',
          'prop': 'thisWeekRemainingTickets',
          'isShow': true,
          'sortNum': 60,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '日退',
          'prop': 'thisWeekRefundTickets',
          'isShow': true,
          'sortNum': 60,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '数量',
          'prop': 'number',
          'isShow': true,
          'sortNum': 60,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '单价',
          'prop': 'price',
          'isShow': true,
          'sortNum': 100,
          'width': '50',
          'tooltip': true
        },
        {
          'label': '总价',
          'prop': 'total',
          'isShow': true,
          'sortNum': 110,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '备注',
          'prop': 'remark',
          'isShow': true,
          'sortNum': 120,
          'tooltip': true
        }
      ];
    },

    queParams() {
      return {
        ...this.queryParams,
        bigSignTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[0] : undefined, //	签收时间		false
        endSignTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[1] : undefined, //	签收时间		false
        receiveTime: undefined,
        projectName: this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code').projectName
      };
    }
  },

  created() {
    this.tabColInit();
    this.initData();
  },

  methods: {
    // 初始化搜索数据
    async initData() {
      const res = await webGetMachineProjectList();
      this.projectList = res.data;
      this.queryParams.projectCode = this.projectList[0].code;
      this.getList();
    },
    // 初始表头
    tabColInit() {
      const tabCol = getLocalStorage(this.api);
      this.tableColumnsConfig = tabCol || this.tableColumns;

    //   this.tableHeaderConfig(this.tableColumnsConfig, this.api, {
    //     prop: 'edit',
    //     isShow: true,
    //     label: '操作',
    //     width: 170,
    //     fixed: 'left'
    //   }, this.tableColumns);
    },
    // 初始数据
    async getList() {
      this.loading = true;
      getProjectTicketList(this.queParams).then(res => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    async handleExport() {
      this.exportLoading = true;
      await this.download('/kydsz/projectTicket/web—getProjectTicketListExport', this.queParams, this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code').projectName + `_工地土票列表`);
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

<style>

</style>

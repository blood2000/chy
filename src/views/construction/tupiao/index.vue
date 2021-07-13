<template>

  <div>
    <div v-show="showSearch">
      <QueryForm v-model="queryParams" @handleQuery="queryParams.pageNum = 1;getList()" />
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
        <!-- <template #batchNo="{row}">
          <DismissedTrack :batch-no="row.batchNo" />
        </template> -->
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
import { getUserInfo } from '@/utils/auth';
import QueryForm from './components/QueryForm';

import { getProjectTicketList } from '@/api/construction/tupiao';
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

        projectName: undefined,
        ticketName: undefined,
        receiveSite: undefined,
        receiveTime: [] // 时间



      },
      'list': [{
        ticketName: 'wuf',
        machineType: '3232'
      }],
      // 多选
      'selections': [],
      // 登录信息
      getUserInfo
    };
  },

  computed: {
    api() {
      return '';
    },

    // code	编码	string
    // earlyStageRemainingTickets	前期余票	integer(int32)
    // id	主键	integer(int64)
    // machineType	车型	integer(int32)
    // price	价格	number(double)
    // receiveSite	接收工地	string
    // remark	备注	string
    // signName	签收人	string
    // signTime	签收时间	string
    // thisWeekCollectTickets	本周领票	integer(int32)
    // thisWeekRefundTickets	本周退票	integer(int32)
    // thisWeekRemainingTickets	本周余票	integer(int32)
    // thisWeekUsedTickets	本周用票	integer(int32)
    // ticketName	土票名称	string

    tableColumns() {
    //   const isAdmin = !this.getUserInfo.isShipment;
      return [
        {
          'label': '土票名称',
          'prop': 'ticketName',
          'isShow': true,
          'sortNum': 2,
          'tooltip': true
        },
        {
          'label': '车型',
          'prop': 'machineType',
          'isShow': true,
          'sortNum': 3,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '接收工地',
          'prop': 'receiveSite',
          'isShow': true,
          'sortNum': 4,
          'tooltip': true
        },
        {
          'label': '接收人',
          'prop': 'signName',
          'isShow': true,
          'sortNum': 5,
          'tooltip': true
        },
        {
          'label': '前期余票',
          'prop': 'earlyStageRemainingTickets',
          'isShow': true,
          'sortNum': 6,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '本周领票',
          'prop': 'thisWeekCollectTickets',
          'isShow': true,
          'sortNum': 7,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '本周余票',
          'prop': 'thisWeekRemainingTickets',
          'isShow': true,
          'sortNum': 8,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '本周退票',
          'prop': 'thisWeekRefundTickets',
          'isShow': true,
          'sortNum': 9,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '单价',
          'prop': 'price',
          'isShow': true,
          'sortNum': 10,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '总价',
          'prop': 'total',
          'isShow': true,
          'sortNum': 11,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '备注',
          'prop': 'remark',
          'isShow': true,
          'sortNum': 12,
          'tooltip': true
        }
      ];
    },

    queParams() {
      return {
        ...this.queryParams,
        bigSignTime: this.queryParams.receiveTime[0], //	签收时间		false
        endSignTime: this.queryParams.receiveTime[1], //	签收时间		false
        receiveTime: undefined
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
      this.tableColumnsConfig = this.tableColumns;

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
      await this.download('/tools/projectTicket/web—getProjectTicketListExport', this.queParams, `工地土票列表`);
      this.exportLoading = false;
    }
  }
};
</script>

<style>

</style>

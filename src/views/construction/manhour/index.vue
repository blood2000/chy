<template>

  <div>
    <div v-show="showSearch">
      <QueryForm ref="QueryForm" v-model="queryParams" :shift-op="shift_op" :zt-jx-tasks-op="ztJxTasks_op" :project-list-o-p="projectList" @handleQuery="queryParams.pageNum = 1;getList()" />
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
        <template #nickName="{row}">
          <span>{{ row.nickName || '--' }} [{{ row.phonenumber }}]</span>
        </template>
        <template #startTimeAndCompleteTime="{row}">
          <!-- <div>
            <div v-for="(item,index) in (_timeHandler(row.startTimeAndCompleteTime))" :key="index">{{ item }}</div>
          </div> -->
          <div>{{ row.actualStartTime }} - {{ row.actualCompleteTime }}</div>
        </template>
        <template #price="{row}">
          <span>{{ row.price || row.price == 0? floor(row.price - 0): '-' }}</span>
        </template>
        <template #total="{row}">
          <span>{{ row.total || row.total == 0? floor(row.total - 0): '-' }}</span>
        </template>
        <template #hoursPrice="{row}">
          <span>{{ row.hoursPrice || row.hoursPrice == 0? floor(row.hoursPrice - 0): '-' }}</span>
        </template>
        <template #hoursTotal="{row}">
          <span>{{ row.hoursTotal || row.hoursTotal == 0? floor(row.hoursTotal - 0): '-' }}</span>
        </template>
        <!-- 9/26 挖机提交时段 -->
        <template #StartToEnd="{row}">
          <span>{{ row.startTime + '-' + row.completeTime }}</span>
        </template>
        <template #submitAuditTime="{row}">
          <span>{{ parseTime(row.submitAuditTime) || '-' }}</span>
        </template>
        <template #actualNumber="{row}">
          <span>{{ row.actualNumber || '-' }}</span>
        </template>
        <template #soilQualityName="{row}">
          <span>{{ row.soilQualityName || '-' }}</span>
        </template>
        <template #hours="{row}">
          <span>{{ row.hours || '-' }}</span>
        </template>
        <template #confirmAuditTime="{row}">
          <span>{{ parseTime(row.confirmAuditTime) || '-' }}</span>
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
import { getUserInfo } from '@/utils/auth';
import QueryForm from './components/QueryForm';
import { floor } from '@/utils/ddc';
import { getLocalStorage } from '@/utils/auth';

import { getMachineWorkingList, getMachineWorkingapi } from '@/api/construction/manhour';
import { webGetMachineProjectList } from '@/api/construction/comon';


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
        receiveTime: [], // 时间
        confirmAuditTime: [],
        submitAuditTime: [], // 时间
        morningEveningDate: [], // 时间
        schedule: undefined,
        jobContent: undefined

      },

      'list': [],
      // 多选
      'selections': [],
      // 登录信息
      getUserInfo,
      //
      projectList: [],
      shift_op: [],
      ztJxTasks_op: [],

      // 表格字典
      auditStatus_op: [
        { dictValue: 0, dictLabel: '待审核' },
        { dictValue: 1, dictLabel: '已审核' }
      ],
      status_op: [
        { dictValue: 0, dictLabel: '未完工' },
        { dictValue: 1, dictLabel: '已完成' }
      ],

      floor // 工具
    };
  },

  computed: {
    api() {
      return getMachineWorkingapi;
    },
    tableColumns() {
    //   const isAdmin = !this.getUserInfo.isShipment;
      return [
        {
          'label': '项目名称',
          'prop': 'projectName',
          'isShow': true,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '机主姓名',
          'prop': 'ownerName',
          'isShow': true,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '司机姓名',
          'prop': 'nickName',
          'isShow': true,
          'width': '205',
          'tooltip': true
        },
        {
          'label': '机械类型',
          'prop': 'machineTypeName',
          'isShow': true,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '型号',
          'prop': 'machineModel',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },

        {
          'label': '班次',
          'prop': 'scheduleName',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '工作内容',
          // 'prop': 'jobContent',
          'prop': 'jobContentName',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '挖机提交时段',
          'prop': 'StartToEnd',
          'isShow': true,
          'width': '110',
          'tooltip': true
        },
        {
          'label': '挖机提交时间',
          'prop': 'submitAuditTime',
          'isShow': true,
          'width': '160',
          'tooltip': true
        },


        {
          'label': '车数',
          'prop': 'actualNumber',
          'isShow': true,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '土质',
          'prop': 'soilQualityName',
          'isShow': true,
          'width': '60',
          'tooltip': true
        },

        {
          'label': '单价',
          'prop': 'price',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '总价',
          'prop': 'total',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },


        {
          'label': '作业时段',
          'prop': 'startTimeAndCompleteTime',
          'isShow': true,
          'width': '135',
          'tooltip': true
        },
        {
          'label': '审核日期',
          'prop': 'morningEveningDate',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },

        // {
        //   'label': '作业结束时间',
        //   'prop': 'completeTime',
        //   'isShow': false,
        //   'width': '90',
        //   'tooltip': true
        // },
        {
          'label': '作业工时',
          'prop': 'hours',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },


        {
          'label': '台班单价',
          'prop': 'hoursPrice',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '台班总价',
          'prop': 'hoursTotal',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '结算方式',
          'prop': 'billingMethodName',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '操作时间',
          'prop': 'confirmAuditTime',
          'isShow': true,
          'width': '90',
          'tooltip': true
        },

        {
          'label': '备注',
          'prop': 'remark',
          'isShow': true,
          'tooltip': true
        }
        // {
        //   'label': '完工备注',
        //   'prop': 'completeRemark',
        //   'isShow': true,
        //   'tooltip': true
        // },
        // {
        //   'label': '复核备注',
        //   'prop': 'checkRemark',
        //   'isShow': true,
        //   'tooltip': true
        // }
      ];
    },

    queParams() {
      const shift = this.shift_op.find(e => e.dictValue === this.queryParams.schedule) || {};

      const { submitAuditTime } = this.queryParams;
      return {
        ...this.queryParams,
        bigCreateTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[0] : undefined, //	签收时间		false
        endCreateTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[1] : undefined, //	签收时间		false
        bigConfirmAuditTime: this.queryParams.confirmAuditTime ? this.queryParams.confirmAuditTime[0] : undefined,
        endConfirmAuditTime: this.queryParams.confirmAuditTime ? this.queryParams.confirmAuditTime[1] : undefined,

        bigMorningEveningDate: this.queryParams.morningEveningDate ? this.queryParams.morningEveningDate[0] : undefined,
        endMorningEveningDate: this.queryParams.morningEveningDate ? this.queryParams.morningEveningDate[1] : undefined,
        receiveTime: undefined,
        confirmAuditTime: undefined,
        morningEveningDate: undefined,

        bigSubmitAuditTime: submitAuditTime ? submitAuditTime[0] : undefined,
        endSubmitAuditTime: submitAuditTime ? submitAuditTime[1] : undefined,
        submitAuditTime: undefined,

        projectName: this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code')?.projectName || undefined,
        scheduleName: shift.dictLabel

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
      this.getDicts('work-shift').then((response) => {
        this.shift_op = response.data;
      });
      this.getDicts('zt-jx-tasks').then((response) => {
        console.log(response);
        this.ztJxTasks_op = response.data;
      });

      const res = await webGetMachineProjectList();
      this.projectList = res.data;
      // this.queryParams.projectCode = this.projectList[0].code;
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
      getMachineWorkingList(this.queParams).then(res => {
        this.list = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    async handleExport() {
      const projectName = this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code')?.projectName;
      const exportName = projectName || Date.now();

      const qp = {
        ...this.queParams,
        pageNum: undefined,
        pageSize: undefined

      };

      this.exportLoading = true;
      await this.download('/kydsz/machineWorkHours/web—getMachineWorkingListExport', qp, exportName + `_机械工时登记`);
      this.exportLoading = false;
    },

    // 处理时间成段
    _timeHandler(time) {
      let arr = [];
      if (time) {
        arr = time.split(';');
      }

      return arr;
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

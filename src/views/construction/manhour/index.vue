<template>

  <div>
    <div v-show="showSearch">
      <QueryForm ref="QueryForm" v-model="queryParams" :shift-op="shift_op" :project-list-o-p="projectList" @handleQuery="queryParams.pageNum = 1;getList()" />
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
          <div>
            <div v-for="(item,index) in (_timeHandler(row.startTimeAndCompleteTime))" :key="index">{{ item }}</div>
          </div>
        </template>
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
        schedule: undefined

      },

      'list': [],
      // 多选
      'selections': [],
      // 登录信息
      getUserInfo,
      //
      projectList: [],
      shift_op: [],

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
          'isShow': false,
          'sortNum': 10,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '机主姓名',
          'prop': 'nickName',
          'isShow': true,
          'sortNum': 20,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '机械类型',
          'prop': 'machineTypeName',
          'isShow': true,
          'sortNum': 30,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '机械型号',
          'prop': 'machineModel',
          'isShow': true,
          'sortNum': 40,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '车数',
          'prop': 'actualNumber',
          'isShow': true,
          'sortNum': 50,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '单价',
          'prop': 'price',
          'isShow': true,
          'sortNum': 51,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '总价',
          'prop': 'total',
          'isShow': true,
          'sortNum': 52,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '班次',
          'prop': 'scheduleName',
          'isShow': false,
          'sortNum': 53,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '作业时段',
          'prop': 'startTimeAndCompleteTime',
          'isShow': true,
          'sortNum': 60,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '作业开始时间',
          'prop': 'startTime',
          'isShow': false,
          'sortNum': 60,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '作业结束时间',
          'prop': 'completeTime',
          'isShow': false,
          'sortNum': 70,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '作业工时',
          'prop': 'totalHours',
          'isShow': true,
          'sortNum': 80,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '班次',
          'prop': 'scheduleName',
          'isShow': true,
          'sortNum': 80,
          'width': '90',
          'tooltip': true
        },

        {
          'label': '台班单价',
          'prop': 'hoursPrice',
          'isShow': true,
          'sortNum': 100,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '台班总价',
          'prop': 'hoursTotal',
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
        bigCreateTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[0] : undefined, //	签收时间		false
        endCreateTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[1] : undefined, //	签收时间		false
        receiveTime: undefined,
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
      this.getDicts('work-shift').then((response) => {
        this.shift_op = response.data;
      });

      const res = await webGetMachineProjectList();
      this.projectList = res.data;
      this.queryParams.projectCode = this.projectList[0].code;
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
      this.exportLoading = true;
      await this.download('/kydsz/machineWork/web—getMachineWorkingListExport', this.queParams, this._zhaovalue(this.projectList, this.queryParams.projectCode, 'code').projectName + `_机械工时登记`);
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

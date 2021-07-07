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
        <template #tupiaoming="{row}">
          <div>
            {{ row.tupiaoming }}({{ row.dianh }})
          </div>
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
      'total': 1,
      // 表头
      'tableColumnsConfig': [],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,

        xiangamu: undefined,
        tupoapming: undefined,
        jiesgosng: undefined,
        receiveTime: [] // 时间

      },
      'list': [{
        tupiaoming: 'wuf',
        cexing: '3232',
        dianh: '17858587458'
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
    tableColumns() {
    //   const isAdmin = !this.getUserInfo.isShipment;
      return [
        {
          'label': '机主姓名',
          'prop': 'tupiaoming',
          'isShow': true,
          'sortNum': 2,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '机械类型',
          'prop': 'cexing',
          'isShow': true,
          'sortNum': 3,
          //   'width': '60',
          'tooltip': true
        },
        {
          'label': '机械型号',
          'prop': 'jixiexip',
          'isShow': true,
          'sortNum': 4,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '车数',
          'prop': 'jiesren',
          'isShow': true,
          'sortNum': 5,
          'width': '60',
          'tooltip': true
        },
        {
          'label': '作业开始时间',
          'prop': 'qianqohui',
          'isShow': true,
          'sortNum': 6,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '作业结束时间',
          'prop': 'qhiohaog',
          'isShow': true,
          'sortNum': 7,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '作业工时',
          'prop': 'yiubpp',
          'isShow': true,
          'sortNum': 8,
          'width': '90',
          'tooltip': true
        },

        {
          'label': '单价',
          'prop': 'danjai',
          'isShow': true,
          'sortNum': 10,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '总价',
          'prop': 'zongjia',
          'isShow': true,
          'sortNum': 11,
          'width': '90',
          'tooltip': true
        },
        {
          'label': '备注',
          'prop': 'beijsij',
          'isShow': true,
          'sortNum': 12,
          'tooltip': true
        }
      ];
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
      console.log(this.queryParams);
    },
    async handleExport() {
      this.exportLoading = true;
      await this.download('/transportation/batch/export', this.queryParams, `机械工时登记`);
      this.exportLoading = false;
    }
  }
};
</script>

<style>

</style>

<template>
  <div>
    <!-- <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px" class="clearfix">
      <el-form-item label="转货地址" prop="testName">
        <el-input
          v-model="queryParams.testName"
          placeholder="请输入公司名称/客户姓名/手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="转货电话" prop="testName1">
        <el-input
          v-model="queryParams.testName1"
          placeholder="装货地/装货电话/装货人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="发货人" prop="testName2">
        <el-input
          v-model="queryParams.testName2"
          placeholder="目的地/收货电话/收货人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item class="fr">
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

      </el-form-item>
    </el-form> -->

    <!-- <div class="mb8">
      <tablec-cascader v-model="tableColumnsConfig" :options="options" />
    </div> -->
    <el-tabs v-model="activeName" type="card" @tab-click="getList()">
      <el-tab-pane label="司机" name="listDriver" />
      <el-tab-pane label="调度" name="listInfo" />
    </el-tabs>

    <refactor-table :loading="loading" :data="list" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange" />

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div>
      <el-button type="cyan" :disabled="!(ids.length>0)" icon="el-icon-search" size="mini" @click="_ok(true)">确定</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="_ok(false)">取消</el-button>
    </div>
  </div>
</template>

<script>

import { listDriver } from '@/api/assets/driver';
import { listInfo } from '@/api/assets/team';
import { dispatchOrder } from '@/api/order/manage';
import tableColumnsConfig_listDriver from '../data/config-driver';
import tableColumnsConfig_listInfo from '../data/config-team';

// import { listShipment, getShipment, delShipment } from '@/api/assets/shipment';

const apiFn = {
  listDriver, listInfo
};


export default {
  name: 'OpenDialog',

  props: {
    dispatch: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      // tab
      activeName: 'listDriver',
      // 遮罩层
      loading: false,
      // 多选
      ids: [],
      // 发布货源的时候调用
      selections: [],
      // 总条数
      total_listDriver: 0,
      total_listInfo: 0,
      // 查询参数
      // 表格数据
      list_listDriver: [],
      queryParams_listDriver: {
        pageNum: 1,
        pageSize: 10
      },
      list_listInfo: [],
      queryParams_listInfo: {
        pageNum: 1,
        pageSize: 10
      },
      // 表头动态值
      tableColumnsConfig_listDriver,
      tableColumnsConfig_listInfo
    };
  },
  computed: {
    list() {
      return this['list_' + this.activeName];
    },
    queryParams() {
      return this['queryParams_' + this.activeName];
    },
    tableColumnsConfig() {
      return this['tableColumnsConfig_' + this.activeName];
    },
    total() {
      return this['total_' + this.activeName];
    }
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;

      apiFn[this.activeName](this.queryParams).then(response => {
        this['list_' + this.activeName] = response.rows;
        this['total_' + this.activeName] = response.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm('queryForm');
      // this.handleQuery();
    },

    handleUpdate() {

    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.selections = selection;
    },

    _ok(bool) {
      // 判断是那个地方调用这个组件了
      if (!this.dispatch) {
        this.$emit('handleSelectionChange', { [this.activeName]: this.selections }, bool);
      } else {
        if (bool) {
          const orderSpecifiedList = this.ids.map(e => {
            if (this.activeName === 'listDriver') {
              return {
                'driverInfoCode': e,
                'teamInfoCode': '',
                'userType': 2
              };
            } else {
              return {
                'driverInfoCode': '',
                'teamInfoCode': e,
                'userType': 1
              };
            }
          });

          const data = {
            'oderCode': this.dispatch.code,
            orderSpecifiedList
          };


          dispatchOrder(data).then(res => {
            this.msgSuccess('派发成功!');
            this.$emit('_ok', false);
          });
        } else {
          this.$emit('_ok', false);
        }
      }
    }


  }
};
</script>

<style>

</style>

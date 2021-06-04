<template>
  <div>
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px" class="clearfix" @submit.native.prevent>
      <el-form-item label="关键字" prop="keywords">
        <el-input
          v-model="queryParams.keywords"
          placeholder="请输入电话号码或姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item class="fr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="司机" name="listDriver" />
      <el-tab-pane label="调度" name="listInfo" />
    </el-tabs>

    <!-- 司机 -->
    <div v-show="activeName === 'listDriver'">
      <refactor-table
        :loading="loading"
        :data="list_listDriver"
        :table-columns-config="tableColumnsConfig"
        :cb-data="myTo"
        :row-key="(row)=> row.id"
        reserve-selection
        @selection-change="handleSelectionChange"
      >

        <template #tin12="{row}">
          <span v-if="row">司机</span>
        </template>
        <template #driverType="{row}">
          <span>{{ row.driverType === 1? '独立司机': '聘用司机' }}</span>
        </template>
      </refactor-table>
    </div>

    <!-- 调度者 -->
    <div v-show="activeName === 'listInfo'">
      <el-radio-group v-model="radio" style="width:100%" @change="handlerChange">

        <el-table v-loading="loading" highlight-current-row :data="list_listInfo" border>
          <el-table-column label="" align="center" width="50">
            <template slot-scope="scope">
              <div @click.capture="handlerclick1($event, scope.row.id)">
                <el-radio :label="scope.row.id">
                  <div v-show="false" />
                </el-radio>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="调度组名称" align="center" prop="name" show-overflow-tooltip />
          <!-- <el-table-column label="身份证" align="center" prop="identificationNumber" show-overflow-tooltip /> -->
          <el-table-column label="管理者" align="center" prop="teamLeaderName" show-overflow-tooltip />

          <el-table-column label="电话" align="center" prop="telphone" show-overflow-tooltip />

        </el-table>
      </el-radio-group>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <div class="ly-t-right mt20 mb20">
      <el-button v-show="activeName === 'listDriver'" type="primary" :disabled="!(ids.length>0)" size="mini" @click="_ok('listDriver')">确定</el-button>
      <el-button v-show="activeName === 'listInfo'" type="primary" :disabled="!radio" size="mini" @click="_ok('listInfo')">确定</el-button>
      <el-button size="mini" @click="_ok(false)">取消</el-button>
    </div>
  </div>
</template>

<script>

import { listDriver } from '@/api/assets/driver';
import { listInfo } from '@/api/assets/team';
import { dispatchOrder } from '@/api/order/manage';
import tableColumnsConfig_listDriver from '../data/config-driver';
import tableColumnsConfig_listInfo from '../data/config-team';

const apiFn = {
  listDriver, listInfo
};


export default {
  name: 'OpenDialog',

  props: {
    dispatch: {
      type: Object,
      default: null
    },
    cbData: {
      type: Array,
      default: () => []
    },
    actionIndex: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      /* 额外数据 */
      t_cbData_listDriver: null,
      t_cbData_listInfo: null,
      t_data1: {},

      midBox: {}, // 临时存储
      radio: '', // 选择的id
      myTo_listDriver: null,
      myTo_listInfo: null,
      // tab
      activeName: 'listDriver',
      // 遮罩层
      loading: false,
      // 多选
      ids: [],
      // 发布货源的时候调用
      selections_listDriver: [],
      selections_listInfo: [],
      // 总条数
      total_listDriver: 0,
      total_listInfo: 0,
      // 查询参数
      // 表格数据
      list_listDriver: [],
      queryParams_listDriver: {
        keywords: undefined,
        pageNum: 1,
        pageSize: 10
      },
      list_listInfo: [],
      queryParams_listInfo: {
        keywords: undefined,
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
    },
    myTo() {
      return this['myTo_' + this.activeName];
    },
    selections() {
      return this['selections_' + this.activeName];
    }
  },

  watch: {
    actionIndex: {
      handler(value) {
        if (!value) return;

        this.activeName = value === '2' ? 'listDriver' : 'listInfo';
      },
      immediate: true
    }

  },
  created() {
    const arr = JSON.parse(JSON.stringify(this.cbData)) || [];

    this['t_cbData_' + this.activeName] = arr.map(e => {
      return {
        ...e,
        tin_isOk: true
      };
    });
    this.getList();
  },

  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;

      let quer = this.queryParams;
      if (this.activeName === 'listDriver') {
        quer = {
          ...this.queryParams,
          // authStatus: 3,
          isOK: 0

        };
      } else {
        quer = {
          ...this.queryParams,
          // status: 0,
          // authStatus: 3,
          isOK: 0
        };
      }

      apiFn[this.activeName](quer).then(response => {
        this['list_' + this.activeName] = response.rows;
        this['total_' + this.activeName] = response.total;
        this.loading = false;

        if (this['t_cbData_' + this.activeName]) {
          if (this.activeName === 'listDriver') {
            const arr = [];

            const data1 = this.t_data1['page_' + this.queryParams_listDriver.pageNum];

            // data1 当前页选中的值(初始值为空)
            (data1 || this['t_cbData_' + this.activeName]).forEach(ee => {
              this.list.forEach((e, index) => {
                if (e.code === ee.code) {
                  arr.push(index);
                }
              });
            });

            this['myTo_' + this.activeName] = arr;
          } else {
            this['t_cbData_' + this.activeName].forEach(ee => {
              this.list.forEach((e, index) => {
                if (e.code === ee.code) {
                  this.radio = e.id;
                }
              });
            });
          }
        }
      }).catch(() => {
        this.loading = false;
      });
    },

    /** 切换操作 */
    handleClick(value) {
      if (!this.list_listDriver.length || !this.list_listInfo.length) {
        this.getList();
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },

    handleUpdate() {

    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      const list1 = this['list_' + this.activeName] || [];
      const list2 = this['t_cbData_' + this.activeName] || [];

      const concatArr = this._deduplication([...list1, ...list2], 'code'); // 当前页和其他页选中的数据

      // 过滤出其他页的数据
      const weArr = concatArr.filter(e => {
        return e.tin_isOk;
      });

      // 选中的拼接上其他页的数据
      const newArr = this._deduplication([...selection, ...weArr], 'code');
      this.ids = newArr.map(item => item.code);
      this['selections_' + this.activeName] = newArr;
      this['t_cbData_' + this.activeName] = newArr;
    },
    // 单选
    handlerChange(value) {},
    handlerclick1(e, value) {
      if (value === this.radio) {
        if (e && e.preventDefault) {
          e.preventDefault();// 非IE浏览器
        } else { window.event.returnValue = false; } // IE浏览器
        this.radio = '';
      }
    },

    _ok(bool) {
      // 判断是那个地方调用这个组件了
      if (!this.dispatch) {
        if (bool === 'listDriver') {
          if (this.activeName === 'listDriver') {
            this['selections_listInfo'] = [];
          } else {
            this['selections_listDriver'] = [];
          }
          this.$emit('handleSelectionChange', { [this.activeName]: this.selections }, bool);
        } else {
          this['selections_listDriver'] = [];
          this['selections_listInfo'] = this.list_listInfo.filter(e => e.id === this.radio);


          this.$emit('handleSelectionChange', { [this.activeName]: this.selections }, bool);
        }
      } else {
        // dispatch 有值是manage组件调用的
        if (bool) {
          let arr = [];
          if (this.activeName === 'listDriver') {
            arr = this.ids;
          } else {
            arr = (this.list_listInfo.filter(e => e.id === this.radio)).map(e => e.code);
          }

          const orderSpecifiedList = arr.map(e => {
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
            'orderCode': this.dispatch.code,
            orderSpecifiedList
          };


          dispatchOrder(data).then(res => {
            this.msgSuccess('派发成功!');
            this.$emit('_ok', 'success');
          });
        } else {
          this.radio = '';
          this.$emit('_ok', false);
        }
      }
    },
    /* 数组对象去重 */
    _deduplication(arr = [], key) {
      var result = [];
      var obj = {};

      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
          result.push(arr[i]);
          obj[arr[i][key]] = true;
        }
      }

      return result;
    }
  }
};
</script>

<style>

</style>

<template>
  <div>
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px" class="clearfix" @submit.native.prevent>
      <el-form-item label="关键字" prop="keywords">
        <el-input
          v-model="queryParams.keywords"
          placeholder="请输入关键字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="转货电话" prop="testName1">
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
      </el-form-item> -->


      <el-form-item class="fr">
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

      </el-form-item>
    </el-form>

    <!-- <div class="mb8">
      <tablec-cascader v-model="tableColumnsConfig" :options="options" />
    </div> -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="司机" name="listDriver" />
      <el-tab-pane label="调度" name="listInfo" />
    </el-tabs>

    <!-- 司机 -->
    <div v-show="activeName === 'listDriver'">
      <refactor-table :loading="loading" :data="list_listDriver" :table-columns-config="tableColumnsConfig" :cb-data="myTo" :row-key="(row)=> row.id" reserve-selection @selection-change="handleSelectionChange">

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
        <el-table v-loading="loading" :data="list_listInfo" border stripe>
          <el-table-column label="" align="center" width="50">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id">
                <div v-show="false" />
              </el-radio>
            </template>
          </el-table-column>

          <el-table-column label="调度者名称" align="left" prop="name" show-overflow-tooltip />
          <el-table-column label="身份证" align="left" prop="identificationNumber" show-overflow-tooltip />
          <el-table-column label="管理者" align="left" prop="teamLeaderName" show-overflow-tooltip />
          <el-table-column label="承运人类型" align="left" prop="contactPhone" show-overflow-tooltip>
            <template v-if="scope" slot-scope="scope">
              调度者
            </template>
          </el-table-column>
          <el-table-column label="电话" align="left" prop="telphone" show-overflow-tooltip />

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

    <div class="ly-t-right mt20">
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
    },
    cbData: {
      type: Array,
      default: null
    },
    actionIndex: {
      type: String,
      default: null
    }
  },

  data() {
    return {
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
          authStatus: 3

        };
      } else {
        quer = {
          ...this.queryParams,
          status: 0,
          authStatus: 3
        };
      }

      apiFn[this.activeName](quer).then(response => {
        this['list_' + this.activeName] = response.rows;
        this['total_' + this.activeName] = response.total;
        this.loading = false;

        if (this.cbData) {
          // console.log(this.cbData);

          if (this.activeName === 'listDriver') {
            const arr = [];
            this.cbData.forEach(ee => {
              this.list.forEach((e, index) => {
                if (e.code === ee.code) {
                  arr.push(index);
                }
              });
            });

            this['myTo_' + this.activeName] = arr;
          } else {
            this.cbData.forEach(ee => {
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
      // console.log(this.activeName);

      !this.list_listDriver.length && this.getList();
      !this.list_listInfo.length && this.getList();
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
      // console.log(selection);

      // this.midBox['dri_' + this.queryParams_listDriver.pageNum] = selection;

      // console.log(this.midBox);


      this.ids = selection.map(item => item.code);
      this['selections_' + this.activeName] = selection;
    },
    // 单选
    handlerChange(value) {
      // console.log(value);
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
    }

    // 回填 rows 为数组
    // toggleSelection(rows) {
    //   console.log(this.$refs.multipleTable.toggleRowSelection());

    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.multipleTable.toggleRowSelection(row, true);
    //     });
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // }


  }
};
</script>

<style>

</style>


<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="130px"
    >
      <el-form-item
        label="下单客户"
        prop="form1"
      >
        <el-input
          v-model="queryParams.form1"
          placeholder="请输入下单客户"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="发货企业"
        prop="form2"
      >
        <el-input
          v-model="queryParams.form2"
          placeholder="请输入发货企业"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="装货信息"
        prop="form3"
      >
        <el-input
          v-model="queryParams.form3"
          placeholder="请输入装货信息"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="收货信息"
        prop="form4"
      >
        <el-input
          v-model="queryParams.form4"
          placeholder="请输入收货信息"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="货源单号"
        prop="form5"
      >
        <el-input
          v-model="queryParams.form5"
          placeholder="请输入货源单号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="接单日期"
        prop="form6"
      >
        <el-date-picker
          v-model="queryParams.form6"
          size="small"
          style="width: 215px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item
        label="车牌号"
        prop="form7"
      >
        <el-input
          v-model="queryParams.form7"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机姓名"
        prop="form8"
      >
        <el-input
          v-model="queryParams.form8"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机电话"
        prop="form9"
      >
        <el-input
          v-model="queryParams.form9"
          placeholder="请输入司机电话"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="运输单号"
        prop="form10"
      >
        <el-input
          v-model="queryParams.form10"
          placeholder="请输入运输单号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >批量删除</el-button>
      </el-col> -->
      <el-col :span="1.5" style="marginTop:-5px">
        <tablec-cascader v-if="activeName === '1'" v-model="tableColumnsConfig1" :lcokey="lcokey" />
        <tablec-cascader v-if="activeName === '2'" v-model="tableColumnsConfig2" :lcokey="lcokey" />
        <tablec-cascader v-if="activeName === '3'" v-model="tableColumnsConfig3" :lcokey="lcokey" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待运输" name="1" />
      <el-tab-pane label="运输中" name="2" />
      <el-tab-pane label="已卸货" name="3" />
    </el-tabs>

    <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <!-- <template #isPay="{row}">
                    <span>{{ selectDictLabel(isPayOptions, row.isPay) }}</span>
                </template> -->

      <template #edit="{row}">
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleTableBtn(row, 1)"
        >补装货凭证</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleTableBtn(row, 2)"
        >补卸货凭证</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleTableBtn(row, 3)"
        >车辆跟踪</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleTableBtn(row, 4)"
        >定位</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleTableBtn(row, 5)"
        >投诉</el-button>
        <el-button
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleTableBtn(row, 6)"
        >评价</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />




    <!-- 补装货凭证 / 补卸货凭证 -->
    <dialog-a :open.sync="dialoga" :title="titlea" :initdata="dialogadata" />

    <!-- 投诉 -->
    <dialog-b :open.sync="dialogb" :title="titleb" :initdata="dialogbdata" />


    <!-- <el-dialog :title="title" :visible.sync="visible" :width="dialogWidth" append-to-body>
      <div>{{ activeName }}</div>
    </el-dialog> -->

  </div>
</template>

<script>
import {
  arr1 as tableColumnsConfig1,
  arr2 as tableColumnsConfig2,
  arr3 as tableColumnsConfig3
} from './data/tracklist-index';

import { listTest, getTest, delTest, addTest, updateTest } from '@/api/test/test';

import DialogA from './component/DialogA';
import DialogB from './component/DialogB';

export default {
  'name': 'Tracklist',
  components: { DialogA, DialogB },
  data() {
    return {
      tableColumnsConfig1,
      tableColumnsConfig2,
      tableColumnsConfig3,
      activeName: '1',


      // 遮罩层
      'loading': false,
      // 选中数组
      //   'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'list1': [{ id: 1 }],
      'list2': [{ id: 2 }],
      'list3': [{ id: 3 }],

      // 查询参数
      'queryParams': {
        'page': 1,
        'pageSize': 10
      },
      // 弹框 内容
      visible: false,

      dialoga: false,
      dialogadata: {},
      dialogb: false,
      dialogbdata: {},
      titlea: '',
      titleb: '',
      title: '',

      dialogWidth: '800px'
      // ne 0 司机 1 货主
    //   driverOrShipmentOptions: [
    //     { 'dictLabel': '司机', 'dictValue': '0' },
    //     { 'dictLabel': '货主', 'dictValue': '1' }
    //   ],
    //   // <!-- isPay	支付给司机运费状态 0-未支付 1-已支付 -->
    //   isPayOptions: [
    //     { 'dictLabel': '未支付', 'dictValue': '0' },
    //     { 'dictLabel': '已支付', 'dictValue': '1' }
    //   ]
    };
  },
  computed: {
    lcokey() {
      return this.$route.name + this.activeName;
    },
    // 表头
    tableColumnsConfig() {
      return this['tableColumnsConfig' + this.activeName];
    },
    // 列表
    list() {
      return this['list' + this.activeName];
    }
  },
  created() {
    this['tableColumnsConfig' + this.activeName] = this.getLocalStorage(this.lcokey) || this.tableColumnsConfig;
    this.getList();
  },
  'methods': {
    /** handleClick */
    handleClick(tab) {
      this['tableColumnsConfig' + this.activeName] = this.getLocalStorage(this.lcokey) || this.tableColumnsConfig;
      this.queryParams.page = 1;
      this.getList();
    },

    /** 查询【请填写功能名称】列表 */
    getList() {
    //   this.loading = true;
    //   listTest(this.queryParams).then(response => {
    //     this.list = response.rows;
    //     this.total = response.total;
    //     this.loading = false;
    //   });
    },
    // // 取消按钮
    // cancel() {
    //   this.open = false;
    //   this.reset();
    // },
    // // 表单重置
    // reset() {
    //   this.form = {
    //     testId: null,
    //     testName: null
    //   };
    //   this.resetForm('form');
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.testId);
    //   this.single = selection.length !== 1;
    //   this.multiple = !selection.length;
    // },
    // /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.title = '添加【请填写功能名称】';
    // },
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const testId = row.testId || this.ids;
    //   getTest(testId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = '修改【请填写功能名称】';
    //   });
    // },
    // /** 提交按钮 */
    // submitForm() {
    //   this.$refs['form'].validate(valid => {
    //     if (valid) {
    //       if (this.form.testId != null) {
    //         updateTest(this.form).then(response => {
    //           this.msgSuccess('修改成功');
    //           this.open = false;
    //           this.getList();
    //         });
    //       } else {
    //         addTest(this.form).then(response => {
    //           this.msgSuccess('新增成功');
    //           this.open = false;
    //           this.getList();
    //         });
    //       }
    //     }
    //   });
    // },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const testIds = row.testId || this.ids;
    //   this.$confirm('是否确认删除【请填写功能名称】编号为"' + testIds + '"的数据项?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(function() {
    //     return delTest(testIds);
    //   }).then(() => {
    //     this.getList();
    //     this.msgSuccess('删除成功');
    //   });
    // },
    // /** 导出按钮操作 */
    // handleExport() {
    //   this.download('system/test/export', {
    //     ...this.queryParams
    //   }, `system_test.xlsx`);
    // }

    handleTableBtn(row, index) {
      console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.dialoga = true;
          this.titlea = '补装货凭证';
          this.dialogadata = { ...row, myType: 1 };
          break;
        case 2:
          this.dialoga = true;
          this.titlea = '补卸货凭证';
          this.dialogadata = { ...row, myType: 2 };
          break;
        case 3:
          this.title = '车辆跟踪';

          break;
        case 4:
          this.title = '定位';
          break;
        case 5:
          this.dialogb = true;
          this.titleb = '投诉';
          this.dialogbdata = { ...row, myType: 5 };
          break;
        case 6:
          this.dialogb = true;
          this.dialogbdata = { ...row, myType: 6 };
          console.log(this.dialogbdata);

          this.titleb = '评价';
          break;

        default:
          break;
      }
    }
  }
};
</script>

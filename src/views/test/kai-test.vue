<template>
  <div class="app-card-box">

    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="90px" class="clearfix app-container" @submit.native.prevent>

      <!-- 普通input搜索 -->
      <el-form-item label="${comment}" prop="testName1">
        <el-input
          v-model="queryParams.testName1"
          placeholder="请输入${comment}"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- 下拉框 -->
      <el-form-item label="${comment}" prop="testName2">
        <el-select v-model="queryParams.testName2" placeholder="----请选择----" clearable filterable style="width: 228px">
          <el-option
            v-for="(dict,index) in dicts['testName2_option'] || [
              { dictLabel: '否', dictValue: 0 },
              { dictLabel: '是', dictValue: 1 }
            ]"
            :key="index"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <!-- 时间筛选框 -->
      <el-form-item label="发布时间" prop="testName3">
        <el-date-picker
          v-model="queryParams.testName3"
          size="small"
          style="width: 228px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <!-- 做远程使用的 -->
      <el-form-item label="货主" prop="testName4" size="small">
        <el-select
          v-model="queryParams.testName4"
          v-el-select-loadmore="loadmore"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="(item, index) in shipmentList"
            :key="index"
            :value="item.code"
            :label="item.adminName"
          >
            <div class="ly-flex-pack-justify"><span>{{ item.adminName }}</span><span>{{ item.telphone }}</span></div>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 单选框 -->
      <el-form-item label="状态" prop="testName5">
        <el-radio-group v-model="queryParams.testName5">
          <el-radio
            v-for="(dict,index) in dicts['testName5_option'] || []"
            :key="index"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>


      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" class="fr">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" type="primary" plain size="mini" @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">

        <!-- 做切换使用 -->
        <el-col :span="1.5">
          <el-radio-group v-model="active" size="small" @change="handleClick">
            <el-radio-button label="0">已发布</el-radio-button>
            <el-radio-button label="1">已关闭</el-radio-button>
          </el-radio-group>
        </el-col>

        <!-- 做批量按钮使用 -->
        <el-col :span="1.5">
          <el-button
            v-if="false"
            v-hasPermi="['system:test:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>

        <!-- 右边统一位置 -->
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="listApi" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <!-- 表格 -->
      <RefactorTable
        is-show-index
        :loading="loading"
        :data="list"
        :table-columns-config="tableColumnsConfig"
      >
        <!-- stripe -->
        <!-- row-key="id" -->
        <!-- :tree-props="{children: 'children', hasChildren: 'hasChildren'}" -->
        <!-- @selection-change="handleSelectionChange" -->
        <!-- :height="theight" -->
        <!-- :row-class-name="tableRowClassName" -->
        <!-- 装货地 -->
        <template #addressName1="{row}">
          <span>{{ row.addressAlias1 || row.addressName1 }}</span>
        </template>

        <template #edit="{row}">
          <template v-if="true">

            <!-- 前3个的放这里 -->
            <el-button
              v-hasPermi="['consigner-order-edit']"
              size="mini"
              type="text"
              @click="handleInfo(row)"
            >详情</el-button>

            <el-button
              v-hasPermi="['consigner-order-edit']"
              size="mini"
              type="text"
              @click="handleUpdate(row)"
            >编辑</el-button>

            <el-button
              v-hasPermi="['consigner-order-open']"
              size="mini"
              type="text"
              :class="row.status+''==='0'?'g-color-error': null"
              @click="handleClose(row)"
            >{{ row.status+''==='0'?'禁用':'启用' }}</el-button>

            <!-- 大于3个按钮的使用这个... -->
            <TableDropdown>
              <el-dropdown-item>
                <el-button
                  v-hasPermi="['consigner-order-delete']"
                  size="mini"
                  type="text"
                  @click="handleDelete(row)"
                >删除</el-button>
              </el-dropdown-item>

            </TableDropdown>
          </template>
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


    <!-- 弹框使用  class类 i-price 是使用图片了 -->
    <el-dialog :title="'费用调价'" class="i-price" :visible.sync="open" width="900px" append-to-body>
      <!-- 弹框内的组件 -->
      <div>123</div>
      <!-- <price-adjustment v-if="openPriceAdjustment" :mytabs="tabs" :order-code="orderCode" :pubilsh-code="pubilshCode" @submitRes="submitRes" /> -->
    </el-dialog>
  </div>
</template>

<script>
import tableColumnsConfig from ''; // 追加表头字段
var listApi = ''; // 存储key
export default {
  name: 'Manage', // 页面缓存需要name
  components: {},
  data() {
    return {
      /* 模板参数必须 */
      loading: false, // 加载

      showSearch: true, // 显示搜索条件

      open: false, // 打开弹框

      active: '0', // 做tab切换

      treeData: [], // 树形数据(无)

      /* 表格参数 */
      // theight: undefined, // 列表高度(无)
      total: 10, // 总条数
      list: [{ projectName: 1231313 }], // 表格数据
      listApi, // 表头存的key
      tableColumnsConfig: [], // 表头动态值

      /* 筛选参数 */
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        status: '0'
      },

      /* 字典集合 取名规则 ***_option */
      dicts: {
        isManual_option: [{ dictLabel: '自动', dictValue: 2 }, { dictLabel: '手动', dictValue: 1 }]
      },

      /* 其他额外参数 */
      shipmentList: [], // 远程搜索的时候使用
      shipmentreq: {
        pageNum: 1,
        keywords: '',
        pageSize: 10
      }
    };
  },

  watch: {
    // 页面刷新使用
    '$route.query.p': {
      handler(value, odvalue) {
        if (!value) return;
        this.queryParams.pageNum = 1;
        this.getList();
        this.$route.query.p = '';
      },
      immediate: true
    }
  },


  created() {
    // 配置表头 listApi-> 请求的接口, null-> 编辑, tableColumnsConfig-> 外部的表头
    this.tableHeaderConfig(this.tableColumnsConfig, listApi, null, tableColumnsConfig);
    // 需要字典的这里请求
    this.getDict();

    this.getList();
  },
  methods: {

    /** 获取首页字典值 */
    getDict() {
      // 要做vuex存储
      // const goodsBigType_option = this.$store.getters.goodsBigType_option;

      // if (!goodsBigType_option) {
      //   this.listByDict({
      //     dictPid: '0',
      //     dictType: 'goodsType'
      //   }).then(res => {
      //     this.goodsTypeOption = res.data;
      //     this.$store.dispatch('orders/store_goodsBigType_option', res.data);
      //   });
      // } else {
      //   this.goodsTypeOption = goodsBigType_option;
      // }

      // ['businessTypes'].forEach(e => {
      //   this.getDicts(e).then(response => {
      //     this.dicts[e] = response.data;
      //   });
      // });
    },

    /** 列表 */
    getList() {
      // this.loading = true;
      // getOrderInfoList(this.newQueryParams).then(response => {
      //   this.total = response.data.total - 0;
      //   this.handlerList(response.data.list);
      // }).catch(() => {
      //   this.theight = null;
      //   this.loading = false;
      // });
    },


    /** 模板相关事件 */
    handleClick() {
      this.queryParams.status = this.active;
      this.handleQuery();
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

    /** 导出按钮操作 */
    handleExport() {
      this.download('/transportation/order/export', {
        ...this.queryParams
      }, `order_export.xlsx`);
    },

    /** 触发远程搜索 */
    remoteMethod(query) {
      if (query !== '') {
        this.shipmentreq.pageNum = 1;
        this.shipmentreq.keywords = query;
        this.shipmentList = [];
        this.getTeamList();
      } else {
        this.shipmentList = [];
      }
    },
    /** 远程搜索列表触底事件 */
    loadmore() {
      if (this.dataOver) return;
      this.shipmentreq.pageNum++;
      this.getTeamList();
    },
    /** 请求数据 */
    getTeamList() {
      // 请求数据
      // listShipment(this.shipmentreq).then(
      //   (res) => {
      //     this.dataOver = !res.rows.length;
      //     this.shipmentList = this.shipmentList.concat(res.rows);
      //     this.loading = false;
      //   }
      // ).catch(() => {
      //   this.loading = false;
      // });
    }

    /** 子类的高亮 */
    // tableRowClassName({ row, rowIndex }) {
    //   if (row.children) {
    //     return 'warning-row';
    //   }
    //   if (!row.isShowEdit) {
    //     return 'red-row';
    //   }
    //   return '';
    // },

    /** 生成随机id */
    // genID(length) {
    //   return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    // }
    /* 获取 */
    // _zhaovalue(arr, value) {
    //   return arr.filter((e) => {
    //     return e.dictValue === value;
    //   })[0];
    // },
    /* 包装成 */
    // _baozhuan(arr, dictValue, dictLabel) {
    //   return arr.map((e) => {
    //     return {
    //       ...e,
    //       dictValue: e[dictValue],
    //       dictLabel: e[dictLabel]
    //     };
    //   });
    // }
  }
};
</script>

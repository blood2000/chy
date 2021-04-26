
<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="80px"
      >
        <el-form-item
          label="装货信息"
          prop="loadInfo"
        >
          <el-input
            v-model="queryParams.loadInfo"
            placeholder="装货地/装货电话/发货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="卸货信息"
          prop="receivedInfo"
        >
          <el-input
            v-model="queryParams.receivedInfo"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物类型" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物类型"
            filterable
            clearable
            style="width: 228px"
            size="small"
          >
            <el-option
              v-for="dict in commodityCategoryCodeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货源单号"
          prop="mainOrderNumber"
        >
          <el-input
            v-model="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="接单日期"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item
          label="车牌号"
          prop="licenseNumber"
        >
          <el-input
            v-model="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="司机姓名"
          prop="driverName"
        >
          <el-input
            v-model="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="运输单号"
          prop="waybillNo"
        >
          <el-input
            v-model="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="下单客户"
          prop="orderClient"
        >
          <el-input
            v-model="queryParams.orderClient"
            placeholder="请输入下单客户"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="发货企业"
          prop="deliveryCompany"
        >
          <el-input
            v-model="queryParams.deliveryCompany"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="纸质回单" prop="isReturn">
          <el-select
            v-model="queryParams.isReturn"
            placeholder="请选择纸质回单"
            filterable
            clearable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in isReturnOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分单" prop="isChild">
          <el-select
            v-model="queryParams.isChild"
            placeholder="请选择分单"
            filterable
            clearable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in isChildOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="g-radio-group">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="4">已复核</el-radio-button>
        <el-radio-button label="5">已结算</el-radio-button>
        <el-radio-button label="7">已打款</el-radio-button>
      </el-radio-group>
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col v-if="activeName == '4'" :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillBalanceInfo:batchDetail']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="multiple"
            @click="handleAdjust"
          >批量核算</el-button>
        </el-col>
        <el-col v-if="activeName == '5'" :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-wallet"
            size="mini"
            :disabled="multiple"
            @click="handleApply"
          >批量申请</el-button>
        </el-col>
        <el-col v-if="activeName == '7'" :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-chat-dot-square"
            size="mini"
            :disabled="multiple"
            @click="handleAssess"
          >批量评价</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="adjustlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <template #goodsBigType="{row}">
          <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
        </template>
        <template #isReturn="{row}">
          <span>
            <i v-if="row.isReturn == 0" class="el-icon-error g-color-gray" />
            <i v-if="row.isReturn == 1" class="el-icon-success g-color-success" />
            {{ selectDictLabel(isReturnOptions, row.isReturn) }}
          </span>
        </template>
        <template #lastLoadingTime="{row}">
          <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>

        <template #edit="{row}">
          <el-button
            v-if="activeName == '5' && row.isApplyMoneyBack == 1"
            v-has-permi="['transportation:waybillBalanceInfo:warning']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 1)"
          >驳回提示</el-button>
          <el-button
            v-if="activeName == '4'"
            v-hasPermi="['transportation:waybillBalanceInfo:shipperRebutUnloading']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 2)"
          >驳回</el-button>
          <el-button
            v-if="activeName == '4'"
            v-hasPermi="['transportation:waybillBalanceInfo:batchDetail']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 3)"
          >核算</el-button>
          <el-button
            v-if="activeName == '5'"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 4)"
          >申请打款</el-button>
          <el-button
            v-if="activeName == '7'"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 5)"
          >评价</el-button>
          <el-button
            v-if="row.isChild == '2'"
            v-has-permi="['transportation:waybill:childList']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 6)"
          >分单列表</el-button>
          <el-button
            v-has-permi="['transportation:waybill:getWayBillByCode']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 7)"
          >详情</el-button>
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
    <!-- 驳回弹窗 -->
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 核算弹窗 -->
    <adjust-dialog ref="AdjustDialog" :open.sync="adjustdialog" :title="title" @refresh="getList" />
    <!-- 子单弹窗 -->
    <child-dialog ref="ChildDialog" :open.sync="childdialog" :title="title" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 评价弹窗 -->
    <comment-dialog ref="CommentDialog" :open.sync="commentdialog" :title="title" @refresh="getList" />
  </div>
</template>

<script>
import { adjustList, adjustListApi, batchApply } from '@/api/settlement/adjust';
// 驳回弹窗
import RejectDialog from '../components/rejectDialog';
// 核算弹窗
import AdjustDialog from './adjustDialog';
// 子单弹窗
import ChildDialog from '../components/childDialog';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
// 评价弹窗
import CommentDialog from './commentDialog';


export default {
  'name': 'AdjustList',
  components: { RejectDialog, AdjustDialog, DetailDialog, ChildDialog, CommentDialog },
  data() {
    return {
      tableColumnsConfig: [],
      api: adjustListApi,
      activeName: '4',
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 非多个禁用
      multiple: true,
      waybillCodeList: [],
      'bodyParams': {
        waybillCodeList: []
      },
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'adjustlist': [],
      // 弹窗表格
      commentlist: [],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'loadInfo': undefined,
        'receivedInfo': undefined,
        'goodsBigType': undefined,
        'mainOrderNumber': undefined,
        'orderEndTime': undefined,
        'orderStartTime': undefined,
        'licenseNumber': undefined,
        'driverName': undefined,
        'waybillNo': undefined,
        'orderClient': undefined,
        'deliveryCompany': undefined,
        'isReturn': undefined,
        'isChild': undefined,
        'status': '4'
      },
      receiveTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      rejectdialog: false,
      adjustdialog: false,
      childdialog: false,
      commentdialog: false,
      title: '',
      dialogWidth: '800px',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 纸质回单字典
      isReturnOptions: [
        { 'dictLabel': '未回单', 'dictValue': '0' },
        { 'dictLabel': '已回单', 'dictValue': '1' }
      ],
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        // { 'dictLabel': '子单', 'dictValue': '1' },
        { 'dictLabel': '是', 'dictValue': '2' }
      ]
    };
  },
  computed: {
    lcokey() {
      return this.$route.name + this.activeName;
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, adjustListApi, {
      prop: 'edit',
      isShow: true,
      tooltip: false,
      label: '操作',
      width: 240,
      fixed: 'right'
    });
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.orderStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.orderEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.orderStartTime = null;
        this.queryParams.orderEndTime = null;
      }
    },
    /** handleClick */
    handleClick(tab) {
      this.queryParams.status = tab;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.commentlist = selection;
      this.ids = selection.map((item) => item.wayBillCode);
      this.bodyParams.waybillCodeList = this.ids;
      this.multiple = !selection.length;
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      adjustList(this.queryParams).then(response => {
        this.adjustlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.receiveTime = [];
      this.queryParams.orderStartTime = null;
      this.queryParams.orderEndTime = null;
      this.handleQuery();
    },
    // 批量核算
    handleAdjust() {
      this.adjustdialog = true;
      this.title = '结算审核';
      this.$refs.AdjustDialog.setForm(this.ids);
    },
    // 批量申请打款
    handleApply() {
      this.$confirm('是否确认批量申请打款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchApply(this.bodyParams).then(response => {
          this.$message({ type: 'success', message: '申请打款成功！' });
          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 批量评价
    handleAssess() {
      this.commentdialog = true;
      this.title = '用户评价';
      this.$refs.CommentDialog.setForm(this.commentlist);
    },

    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$alert(row.applyMoneyBackRemark, '驳回提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
          });
          break;
        case 2:
          this.$refs.RejectDialog.reset();
          this.rejectdialog = true;
          this.title = '驳回运输核算单';
          this.$refs.RejectDialog.setForm(row);
          break;
        case 3:
          this.adjustdialog = true;
          this.title = '结算审核';
          this.waybillCodeList = [];
          this.waybillCodeList.push(row.wayBillCode);
          this.$refs.AdjustDialog.setForm(this.waybillCodeList);
          break;
        case 4:
          this.$confirm('是否确认申请打款?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.bodyParams.waybillCodeList = [];
            this.bodyParams.waybillCodeList.push(row.wayBillCode);
            batchApply(this.bodyParams).then(response => {
              this.$message({ type: 'success', message: '申请打款成功！' });
              this.getList();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
          break;
        case 5:
          this.commentdialog = true;
          this.title = '用户评价';
          this.commentlist = [];
          this.commentlist.push(row);
          this.$refs.CommentDialog.setForm(this.commentlist);
          break;
        case 6:
          this.title = '子单列表';
          this.childdialog = true;
          this.$refs.ChildDialog.setForm(row);
          break;
        case 7:
          this.$refs.DetailDialog.reset();
          this.currentId = row.wayBillCode;
          this.open = true;
          this.title = '运输单信息';
          this.formDisable = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :inline="true" label-width="auto" @submit.native.prevent>
        <el-form-item v-for="(item, index) in dataModelDto.queryFields" :key="index" :label="item.dataItemInfo.itemCn">
          <!-- string|整数类型|浮点类型 -->
          <el-input
            v-if="item.dataItemInfo.itemType === 'string' || item.dataItemInfo.itemType === 'number' || item.dataItemInfo.itemType === 'float'"
            v-model="item.value"
            :placeholder="`请输入${item.dataItemInfo.itemCn}`"
            clearable
            style="width: 200px"
            size="small"
          />
          <!-- 时间类型 -->
          <template v-else-if="item.dataItemInfo.itemType === 'date'">
            <el-date-picker
              v-model="item.startTime"
              clearable
              size="small"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              style="width: 200px"
            />
            至
            <el-date-picker
              v-model="item.endTime"
              clearable
              size="small"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              style="width: 200px"
            />
          </template>
          <!-- 时间戳类型 -->
          <template v-else-if="item.dataItemInfo.itemType === 'timestamp'">
            <el-date-picker
              v-model="item.startTime"
              clearable
              size="small"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"
              style="width: 200px"
              default-time="00:00:00"
            />
            至
            <el-date-picker
              v-model="item.endTime"
              clearable
              size="small"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              style="width: 200px"
              default-time="23:59:59"
            />
          </template>
          <!-- 枚举类型 -->
          <el-select
            v-else-if="item.dataItemInfo.itemType === 'enum'"
            v-model="item.value"
            :placeholder="`请选择${item.dataItemInfo.itemCn}`"
            filterable
            clearable
            style="width: 200px"
            size="small"
          >
            <el-option
              v-for="dict in item.itemOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <!-- 输入框 -->
          <el-input
            v-else
            v-model="item.value"
            :placeholder="`请输入${item.dataItemInfo.itemCn}`"
            clearable
            style="width: 200px"
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-download"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" highlight-current-row border :data="dataList">
        <el-table-column type="index" label="序号" fixed="left" align="center" width="50" />
        <el-table-column
          v-for="(item, index) in dataModelDto.tableFields"
          :key="item.dataItemInfo.itemEn + index"
          :prop="item.functionType ? item.functionFieldAlias : `${item.nodeId}_${item.dataItemInfo.itemEn}`"
          align="center"
          :label="item.fieldLabel"
        />
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="dataModelDto.page.pageNum"
        :limit.sync="dataModelDto.page.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getDataModel, searchDataModel } from '@/api/dataCenter/dataCenter.js';
import { deepClone } from '@/utils/index';
export default {
  name: '',
  data() {
    return {
      modelId: null,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      page: {
        pageNum: 1,
        pageSize: 10
      },
      queryFields: [],
      tableFields: [],
      // 总条数
      total: 0,
      loading: false,
      // 导出按钮
      exportLoading: false,
      // 列表数据
      dataList: [],
      // 函数字典值
      functionList: [],
      dataModelDto: {
        queryFields: [],
        tableFields: [],
        page: {
          pageNum: 1,
          pageSize: 10
        }
      }
    };
  },
  mounted() {
    const path = this.$route.path;
    const pathArr = path.split('/');
    this.modelId = pathArr[pathArr.length - 1];
    this.getDataModelData();
    this.getFunctionList();
  },
  methods: {
    /** 获取函数字典值 */
    getFunctionList() {
      this.getDicts('agg_function').then(response => {
        this.functionList = response.data;
      });
    },
    /** 获取模型数据 */
    getDataModelData() {
      getDataModel(this.modelId).then(res => {
        if (res.data && res.data.dataModelDto) {
          const dataModelDto = res.data.dataModelDto;
          // 如果是枚举类型，要请求字典
          if (dataModelDto.queryFields) {
            dataModelDto.queryFields.forEach((el, i) => {
              if (el.dataItemInfo.itemKey && el.dataItemInfo.itemKey !== '') {
                this.getDicts(el.dataItemInfo.itemKey).then(value => {
                  dataModelDto.queryFields[i].itemOptions = value.data;
                });
              }
            });
          }
          // 缓存数据
          this.$nextTick(() => {
            const { queryFields, tableFields, page } = dataModelDto;
            this.queryFields = queryFields || [];
            this.tableFields = tableFields || [];
            this.page = page || {};
            this.dataModelDto = deepClone(dataModelDto);
          });
          setTimeout(() => {
            this.resetQuery();
          }, 300);
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.page.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dataModelDto.queryFields = deepClone(this.queryFields);
      this.dataModelDto.tableFields = deepClone(this.tableFields);
      this.dataModelDto.page = deepClone(this.page);
      this.resetForm('queryForm');
      this.handleQuery();
    },
    getList() {
      this.loading = true;
      searchDataModel(Object.assign({}, this.dataModelDto, { dataModelId: this.modelId })).then(res => {
        this.loading = false;
        if (res.data) {
          const { list, total } = res.data;
          this.total = total || 0;
          this.dataList = list || [];
        } else {
          this.total = 0;
          this.dataList = [];
        }
      });
    },
    /** 导出 */
    async handleExport() {
      this.exportLoading = true;
      await this.download('/analysis/dataModelInfos/export', Object.assign({}, this.dataModelDto, { dataModelId: this.modelId }), '导出文件', 'application/json');
      this.exportLoading = false;
    }
  }
};
</script>

<template>
  <!-- 执行修改 -->
  <div>
    <div class="app-container">
      <el-form ref="form" :model="params" inline label-width="auto">
        <el-form-item
          v-for="(item, index) in form.dataParamsInfoList"
          :key="index"
          :label="item.itemCn"
          :prop="item.itemEn"
          :rules="[{ required: type === 'operate' ? true : (item.sqlType === 'backup' ? true : false), message: `${item.itemCn}不能为空`, trigger: ['blur', 'change'] }]"
        >
          <!-- string -->
          <el-input
            v-if="item.itemType === 'string'"
            v-model="params[item.itemEn]"
            :placeholder="`请输入${item.itemCn}`"
            clearable
            style="width: 200px"
            size="small"
          />
          <!-- 整数类型 -->
          <el-input-number
            v-else-if="item.itemType === 'number'"
            v-model="params[item.itemEn]"
            :placeholder="`请输入${item.itemCn}`"
            style="width: 200px"
            size="small"
            controls-position="right"
            :precision="0"
          />
          <!-- 浮点类型 -->
          <el-input-number
            v-else-if="item.itemType === 'float' || item.itemType === 'float4'"
            v-model="params[item.itemEn]"
            :placeholder="`请输入${item.itemCn}`"
            style="width: 200px"
            size="small"
            controls-position="right"
          />
          <!-- 时间类型 -->
          <template v-else-if="item.itemType === 'date'">
            <el-date-picker
              v-model="params[item.itemEn]"
              clearable
              size="small"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              style="width: 200px"
            />
          </template>
          <!-- 时间戳类型 -->
          <template v-else-if="item.itemType === 'timestamp'">
            <el-date-picker
              v-model="params[item.itemEn]"
              clearable
              size="small"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"
              style="width: 200px"
              default-time="00:00:00"
            />
          </template>
          <!-- 枚举类型 -->
          <el-select
            v-else-if="item.itemType === 'enum'"
            v-model="params[item.itemEn]"
            :placeholder="`请选择${item.itemCn}`"
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
            v-model="params[item.itemEn]"
            :placeholder="`请输入${item.itemCn}`"
            clearable
            style="width: 200px"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="type === 'backup'">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 查询结果 -->
      <template v-if="type === 'backup'">
        <el-table
          v-for="(item, index) in tableList"
          :key="index"
          v-loading="loading"
          highlight-current-row
          border
          :data="item"
          class="mb20 mt5"
        >
          <el-table-column type="index" label="序号" fixed="left" align="center" width="50" />
          <el-table-column
            v-for="(value, key, i) in item[0]"
            :key="key + i"
            :prop="key"
            align="center"
            :label="key"
          />
        </el-table>
      </template>

      <!-- 执行结果 -->
      <template v-if="type === 'operate'">
        <el-button class="mt10 mr20" type="primary" icon="el-icon-s-promotion" size="mini" @click="handleOperate">提交修改</el-button>
        <span class="mt10" style="color: #1890ff">{{ `修改成功 ${operateResult} 条` }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { getDataOperate, runBackupSql, runOperateSql } from '@/api/dataCenter/dataCenter.js';
export default {
  data() {
    return {
      operateId: null,
      type: null, // 查询备份backup  执行修改operate
      // 表单参数
      form: {
        dataParamsInfoList: [],
        params: {}
      },
      params: {},
      // 查询结果
      loading: false,
      tableList: [],
      // 执行结果
      operateResult: 0
    };
  },
  mounted() {
    this.type = 'operate';
    const path = this.$route.path;
    const pathArr = path.split('/');
    this.operateId = pathArr[pathArr.length - 1];
    this.getData();
  },
  methods: {
    getData() {
      getDataOperate(this.operateId).then(res => {
        if (res.data) {
          this.form = {
            dataParamsInfoList: res.data.dataParamsInfoList,
            databaseId: res.data.databaseId,
            operateJson: res.data.operateJson
          };
          this.setForm();
        }
      });
    },
    /** 表单赋值 */
    setForm() {
      if (this.type === 'backup') {
        this.form.pageNum = 0;
        this.form.pageSize = 10;
      } else if (this.type === 'operate') {
        this.form.sourceCode = '测试'; // 来源参数固定写死
      }
      // 构造params表单
      if (this.type === 'backup') {
        this.form.dataParamsInfoList = this.form.dataParamsInfoList.filter(el => {
          return el.sqlType === 'backup';
        });
      }
      this.form.dataParamsInfoList.forEach((el, i) => {
        this.$set(this.params, el.itemEn, undefined);
        // 如果是枚举类型，要请求字典
        if (el.itemType === 'enum') {
          this.getDicts(el.itemKey).then(value => {
            this.$set(this.form.dataParamsInfoList[i], 'itemOptions', value.data);
          });
        }
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.form.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('form');
      this.handleQuery();
    },
    /** 数据备份查询 */
    getList() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          runBackupSql(Object.assign({}, this.form, { params: this.params })).then(res => {
            this.loading = false;
            this.tableList = res.data;
          });
        }
      });
    },
    /** 执行修改 */
    handleOperate() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          runOperateSql(Object.assign({}, this.form, { params: this.params })).then(res => {
            this.operateResult = res.data || 0;
          });
        }
      });
    }
  }
};
</script>

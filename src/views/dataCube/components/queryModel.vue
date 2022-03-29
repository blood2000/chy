<template>
  <div v-show="showSearch">
    <el-form ref="queryForm" :inline="true" label-width="auto" @submit.native.prevent>
      <template v-for="(item, index) in dataModelDto.queryFields">
        <el-form-item v-if="!item.dynamic" :key="index" :label="item.dataItemInfo.itemCn">
          <!-- string -->
          <el-input
            v-if="item.dataItemInfo.itemType === 'string'"
            v-model="item.value"
            :placeholder="`请输入${item.dataItemInfo.itemCn}`"
            clearable
            style="width: 200px"
            size="small"
          />
          <!-- 整数类型|浮点类型|money -->
          <template v-else-if="item.dataItemInfo.itemType === 'number' || item.dataItemInfo.itemType === 'float' || item.dataItemInfo.itemType === 'float4' || item.dataItemInfo.itemType === 'money'">
            <el-input
              v-model="item.start"
              :placeholder="`请输入${item.dataItemInfo.itemCn}开始值`"
              clearable
              style="width: 200px"
              size="small"
            />
            至
            <el-input
              v-model="item.end"
              :placeholder="`请输入${item.dataItemInfo.itemCn}结束值`"
              clearable
              style="width: 200px"
              size="small"
            />
          </template>
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
            v-model="item.multiple"
            :placeholder="`请选择${item.dataItemInfo.itemCn}`"
            clearable
            multiple
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
          <!-- 自定义枚举类型 -->
          <el-select
            v-else-if="item.dataItemInfo.itemType === 'custom'"
            v-model="item.multiple"
            :placeholder="`请选择${item.dataItemInfo.itemCn}`"
            clearable
            multiple
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
      </template>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="$emit('handleQuery')">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="$emit('resetQuery')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    dataModelDto: {
      type: Object,
      default: () => {
        return {
          queryFields: [],
          tableFields: [],
          page: {
            pageNum: 1,
            pageSize: 10
          }
        };
      }
    }
  }
};
</script>

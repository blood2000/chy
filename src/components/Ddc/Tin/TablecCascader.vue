<template>
  <div>
    <el-tooltip class="item" effect="dark" content="字段排序" placement="top">
      <el-button size="mini" circle icon="el-icon-sort" @click="handleUpdate" />
    </el-tooltip>

    <el-dialog title="拖拽排序" :visible.sync="open" append-to-body destroy-on-close width="80%">

      <div class="mb10">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <ul class="t-thead">
        <draggable
          v-model="banner_list"
          v-bind="{
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'chosenClass',
            scroll: true,
            scrollSensitivity: 200}"
        >
          <li
            v-for="(th, key) in banner_list"
            :key="th.prop +''+ key"
            style="padding: 10px 20px"
          >
            <el-row :gutter="10" type="flex" align="middle">
              <el-col :span="4"><el-checkbox v-model="th.isShow"><span>{{ th.prop }}</span></el-checkbox></el-col>
              <el-col :span="4"><el-input v-model="th.label" placeholder="请输入列名" clearable /></el-col>
              <el-col :span="3" class="g-text-center"><span class="mr5">是否排序</span><el-switch v-model="th.sortable" /></el-col>
              <el-col :span="3" class="g-text-center"><span class="mr5">超出隐藏</span><el-switch v-model="th.tooltip" /></el-col>
              <el-col :span="3"><el-input v-model="th.width" placeholder="最小列宽" /></el-col>
              <el-col :span="3">
                <el-select v-model="th.fixed" placeholder="固定方向" filterable clearable style="width:100%">
                  <el-option label="固定左边" value="left" />
                  <el-option label="固定右边" value="right" />
                </el-select></el-col>
              <el-col :span="4">
                <el-input v-model="th.remark" placeholder="备注" clearable />
              </el-col>
            </el-row>
          </li>
        </draggable>
      </ul>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { setLocalStorage } from '@/utils/auth';

/**
 * 调用示例:
 *
 * <tablec-cascader v-model="tableColumnsConfig" />
 * tableColumnsConfig: 返回选中的值
 **/
export default {
  name: 'TablecCascader',
  components: {
    draggable
  },
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },

    lcokey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      open: false,
      banner_list: []
    };
  },

  methods: {

    submitForm() {
      this.$emit('input', this.banner_list);
      setLocalStorage(this.lcokey || this.$route.name, this.banner_list);
      this.open = false;
    },
    cancel() {
      this.open = false;
      this.banner_list = [];
    },
    handleUpdate() {
      this.open = true;
      this.banner_list = JSON.parse(JSON.stringify(this.value));
    }
  }
};
</script>

<style scoped>
.t-thead li {
  border-bottom: 1px solid #ccc;
}
</style>

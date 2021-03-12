<template>
  <div>
    <el-cascader
      :value="cInitData"
      :options="cOptions"
      :props="{ multiple: true }"
      collapse-tags
      @change="handleChange"
    />
    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate">表头排序</el-button>

    <el-dialog title="拖拽排序" :visible.sync="open" append-to-body destroy-on-close>
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
          >{{ th.label }}</li>
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
 * <TablecCascader :options='options' v-model="tableColumnsConfig"></TablecCascader>
 * options: 展示所有
 * tableColumnsConfig: 返回选中的值
 **/
export default {
  name: 'TablecCascader',
  components: {
    draggable
  },
  props: {
    /** 下拉框格式:
     *  [{prop: 'infoId',label: '访问编号',},{prop: 'userName',label: '用户名称',}]
     */
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },

    data() {
      return {
        open: false,
        banner_list: []
      };
    },

    computed: {
      cOptions() {
        return this.options.map(item => {
          return {
            value: item,
            label: item.label
          };
        });
      },
      cInitData() {
        return this.value.map(item => {
          return [item];
        });
      }
    },

    methods: {
      handleChange(value) {
        let arr = [];
        arr = arr.concat(...value);
        this.$emit('input', arr);

        setLocalStorage(this.$route.name, arr);
      },

      submitForm() {
        this.open = false;
        this.$emit('input', this.banner_list);
        setLocalStorage(this.$route.name, this.banner_list);
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
  }
};
</script>

<style scoped>
.t-thead li {
  border-bottom: 1px solid #ccc;
}
</style>

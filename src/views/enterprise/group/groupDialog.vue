<template>
  <!-- 添加调度组对话框 -->
  <el-dialog :title="title" :class="[{'i-add':title==='添加调度组'}]" :visible="visible" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="调度者姓名" prop="disUserCode">
        <FilterableSelect
          v-if="open"
          v-model="form.disUserCode"
          clearable
          style="width:255px"
          placeholder="请输入调度者姓名/手机号"
          :axios="{
            queryFn:listInfo,
            queryData:{}
          }"
          :show-key="{
            value: 'code',
            label: 'teamLeaderName',
            telphone: 'telphone'
          }"
          @selected="(data)=>{form.disUserPhone = data.telphone;form.disUserName = data.teamLeaderName; form.disName = data.name }"
        >
          <template #default="{row}">
            <span>{{ row.teamLeaderName }}</span><span>{{ row.telphone }}</span>
          </template>
        </FilterableSelect>

        <!-- <el-input v-model="form.disUserName" placeholder="请输入调度者姓名" /> -->
      </el-form-item>
      <el-form-item label="调度者手机" prop="disUserPhone">
        <el-input v-model="form.disUserPhone" :disabled="!!form.disUserCode" maxlength="11" placeholder="请输入调度者手机" />
      </el-form-item>
      <el-form-item label="调度组名称" prop="disName">
        <el-input v-model="form.disName" :disabled="!!form.disUserCode" placeholder="请输入调度组名称" />
      </el-form-item>
      <el-form-item v-if="false" label="常用调度组" prop="isOften">
        <el-switch
          v-model="form.isOften"
          active-color="#409EFF"
          inactive-color="#9FA2B5"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="不开票不打款" prop="isNotInvoice">
        <el-switch
          v-model="form.isNotInvoice"
          active-color="#409EFF"
          inactive-color="#9FA2B5"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo } from '@/api/enterprise/group';

import { listInfo } from '@/api/assets/team';
import FilterableSelect from '@/components/FilterableSelect';


export default {
  components: {
    FilterableSelect
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // 选中数组
      ids: [],
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        disUserCode: [
          { required: true, message: '调度者姓名不能为空', trigger: 'blur' }
        ],
        disUserPhone: [
          { required: true, message: '调度者电话不能为空', trigger: 'blur' }
        ]
      },
      listInfo
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        if (!v) {
          this.form = {};
        }
        this.$emit('update:open', v);
      }
    }
  },
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addInfo(this.form).then(response => {
            this.msgSuccess('新增成功');
            this.close();
            this.$emit('refresh');
          });
        }
      });
    },
    /** 取消按钮 */
    cancel() {
	    this.close();
	    this.reset();
    },
    // 关闭弹窗
    close() {
	  this.$emit('update:open', false);
    },
    // 表单重置
    reset(shipmentCode) {
      this.form = {
        disName: null,
        disUserCode: null,
        disUserName: null,
        disUserPhone: null,
        isNotInvoice: 0,
        isOften: 0,
        shipperCode: shipmentCode
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      console.log(data);
	    this.form = data;
    }
  }
};
</script>

<style scoped>
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 90% !important;
	}
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
  .el-radio{
    line-height: 36px;
  }
</style>

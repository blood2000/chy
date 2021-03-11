<template>
  <el-form ref="basicInfoForm" :model="form" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input v-model="form.tableName" placeholder="请输入仓库名称" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input v-model="form.tableComment" placeholder="请输入" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="实体类名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="functionAuthor">
          <el-input v-model="form.functionAuthor" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: 'BasicInfoForm',
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: this.info,
      rules: {
        tableName: [
          { required: true, message: '请输入表名称', trigger: 'blur' }
        ],
        tableComment: [
          { required: true, message: '请输入表描述', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请输入实体类名称', trigger: 'blur' }
        ],
        functionAuthor: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ]
      }
    };
  }
};
</script>

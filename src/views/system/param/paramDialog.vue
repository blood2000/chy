<template>
  <el-dialog :visible="visible" :title="`${typeName} - ${title}`" :class="[{'i-add':title==='新增'}]" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="参数中文名" prop="paramCnName">
        <el-input v-model="form.paramCnName" placeholder="请输入参数中文名" class="width90" clearable />
      </el-form-item>
      <el-form-item label="参数英文名" prop="paramEnName">
        <el-input v-model="form.paramEnName" placeholder="请输入参数英文名" class="width90" clearable />
      </el-form-item>
      <el-form-item label="表单类型" prop="paramFormType">
        <el-select v-model="form.paramFormType" placeholder="请选择表单类型" filterable clearable class="width90">
          <el-option
            v-for="dict in formTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.paramFormType && (form.paramFormType === '4' || form.paramFormType === '5')" label="字典值" prop="paramDictCode">
        <el-select
          v-model="form.paramDictCode"
          v-el-select-loadmore="loadmore"
          filterable
          remote
          reserve-keyword
          placeholder="请输入字典名称搜索"
          :remote-method="remoteMethod"
          :loading="loading"
          clearable
          class="width90"
          @change="changeDict"
        >
          <el-option
            v-for="item in paramDictOptions"
            :key="item.dictType"
            :label="`${item.dictType}（${item.dictName}）`"
            :value="item.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <!-- input -->
        <template v-if="!form.paramFormType || form.paramFormType === '1' || form.paramFormType === '3'">
          <el-input v-model="form.paramValue" class="width90" placeholder="请输入参数值" />
        </template>
        <!-- checkbox -->
        <template v-else-if="form.paramFormType === '6'">
          <el-checkbox v-model="form.paramValue" label="是否勾选" />
        </template>
        <!-- switch -->
        <template v-else-if="form.paramFormType === '7'">
          <el-switch v-model="form.paramValue" />
        </template>
        <!-- select -->
        <template v-else>
          <el-select v-model="form.paramValue" class="width90" placeholder="请选择参数值">
            <el-option
              v-for="dict in paramDicts"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="自定义sql" prop="paramSql">
        <el-input v-model="form.paramSql" placeholder="请输入自定义sql" class="width90" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="paramStatus">
        <el-radio-group v-model="form.paramStatus">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="paramRemark">
        <el-input v-model="form.paramRemark" placeholder="请输入备注" type="textarea" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addParam, editParam } from '@/api/system/param';
import { listType } from '@/api/system/dict/type';

export default {
  name: 'ParamDialog',
  props: {
    open: Boolean,
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      typeName: null,
      buttonLoading: false,
      // 表单类型字典
      formTypeOptions: [],
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: 0 },
        { dictLabel: '禁用', dictValue: 1 }
      ],
      form: {},
      rules: {
        paramCnName: [
          { required: true, message: '参数中文名不能为空', trigger: 'blur' }
        ],
        paramEnName: [
          { required: true, message: '参数英文名不能为空', trigger: 'blur' }
        ],
        paramFormType: [
          { required: true, message: '表单类型不能为空', trigger: 'change' }
        ]
      },
      // 字典远程搜索
      loading: false,
      paramDictOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: null
      },
      paramDicts: []
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
    this.getDictsOptions();
  },
  methods: {
    // 查询字典
    getDictsOptions() {
      // 表单类型
      this.getDicts('formType').then(response => {
        this.formTypeOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 重置弹窗
    reset() {
      this.paramDicts = [];
      this.paramDictOptions = [];
      this.form = {
        paramCnName: null,
        paramEnName: null,
        paramFormType: null,
        paramValue: null,
        paramDictCode: null,
        typeCode: null,
        paramSql: null,
        paramStatus: 0,
        paramRemark: null
      };
      this.resetForm('form');
    },
    // 弹窗赋值
    setAddForm(data) {
      this.typeName = data.label;
      this.form.typeCode = data.code;
    },
    setEditForm(data, param) {
      this.form = { ...param };
      this.typeName = data.label;
      this.form.typeCode = data.code;
      if (this.form.paramDictCode) {
        this.setDictOption(this.form.paramDictCode);
        this.changeDict(this.form.paramDictCode);
      }
    },
    // 提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.paramFormType !== '4' && this.form.paramFormType !== '5') {
            this.form.paramDictCode = undefined;
          }
          if (this.form.code) {
            editParam(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh', this.form.typeCode);
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addParam(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh', this.form.typeCode);
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    // 字典远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.queryParams.dictName = query;
        this.queryParams.pageNum = 1;
        this.paramDictOptions = [];
        this.getDictList();
      } else {
        this.paramDictOptions = [];
      }
    },
    // 查询字典列表
    getDictList() {
      listType(this.queryParams).then(response => {
        this.loading = false;
        this.paramDictOptions = [...this.paramDictOptions, ...response.rows];
      });
    },
    // 远程搜索列表触底事件
    loadmore() {
      this.queryParams.pageNum++;
      this.getDictList();
    },
    // 远程搜索回显
    setDictOption(dictCode) {
      listType({ dictType: dictCode }).then(response => {
        this.paramDictOptions = response.rows;
      });
    },
    // 选中字典
    changeDict(data) {
      this.getDicts(data).then(response => {
        this.paramDicts = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.width90{
  width: 90%;
}
</style>

<template>
  <!-- 添加或修改项目对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <!-- <el-form-item label="主键" prop="id">
        <el-input v-model="form.id" placeholder="请输入主键" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码" />
      </el-form-item> -->
      <!-- <el-form-item label="货主编码" prop="shipmentCode">
        <el-input v-model="form.shipmentCode" placeholder="请输入货主编码" />
      </el-form-item> -->
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="form.projectName" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="商品大类" prop="commodityCategoryCode">
        <el-radio-group v-model="form.commodityCategoryCode" @change="handlecommodityCategoryChange">
          <el-radio
            v-for="dict in commodityCategoryCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
        <!-- <el-input v-model="form.commodityCategoryCode" placeholder="请输入商品类别编码" /> -->
      </el-form-item>
      <el-form-item v-if="isMore == 0" label="商品小类" prop="commoditySubclassCodes">
        <el-radio-group v-model="form.commoditySubclassCodes">
          <el-radio
            v-for="dict in commoditySubclassCodesOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isMore == 1" label="商品小类" prop="commoditySubclassCodes">
        <el-checkbox-group v-model="commoditySubclassCodes" @change="handleCheckedChange">
          <el-checkbox
            v-for="dict in commoditySubclassCodesOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="备注" prop="projectRemark">
        <el-input v-model="form.projectRemark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
      <!-- <el-form-item label="(0:正常 1:删除)" prop="delFlag">
        <el-input v-model="form.delFlag" placeholder="请输入(0:正常 1:删除)" />
      </el-form-item>
      <el-form-item label="创建人" prop="createCode">
        <el-input v-model="form.createCode" placeholder="请输入创建人" />
      </el-form-item>
      <el-form-item label="更新人" prop="updateCode">
        <el-input v-model="form.updateCode" placeholder="请输入更新人" />
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, updateInfo } from '@/api/enterprise/project';
// import UploadImage from '@/components/UploadImage/index';

export default {
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 选中数组
      ids: [],
  	  // 货主编码字典
      shipmentCodeOptions: [],
      // 项目名称字典
      projectNameOptions: [],
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 商品小类字典
      commoditySubclassCodesOptions: [],
      commoditySubclassCodes: [],
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ]
      },
      // 是否多选
      isMore: '2',
      // 小类字典类型
      commoditySubclass: ''
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
    this.getDicts('productType').then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
	  this.$refs['form'].validate(valid => {
	    if (valid) {
          if (this.isMore === '1') {
            this.form.commoditySubclassCodes = this.commoditySubclassCodes.join(',');
          }
	      if (this.form.id != null) {
	        updateInfo(this.form).then(response => {
	          this.msgSuccess('修改成功');
	          this.close();
	          this.$emit('refresh');
	        });
	      } else {
	        addInfo(this.form).then(response => {
	          this.msgSuccess('新增成功');
	          this.close();
	          this.$emit('refresh');
	        });
	      }
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
    reset() {
      this.form = {
        id: null,
        code: null,
        shipmentCode: null,
        projectName: null,
        commodityCategoryCode: null,
        commoditySubclassCodes: null,
        projectRemark: null,
        delFlag: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null
      };
      this.resetForm('form');
      this.isMore = '2';
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
      this.commoditySubclassCodes = data.commoditySubclassCodes.split(',');
      this.handleChange(data.commodityCategoryCode);
    },
    // 单选商品大类
    handlecommodityCategoryChange(selection) {
      this.handleChange(selection);
      this.commoditySubclassCodes = [];
    },
    // 单选商品大类后联动数据事件
    handleChange(value) {
      const commodity = this.commodityCategoryCodeOptions.filter(item => {
        return item.dictValue === value;
      });
      this.commoditySubclass = commodity[0].dictValue;
      console.log(this.commoditySubclass);
      this.getDicts(this.commoditySubclass).then(response => {
        this.commoditySubclassCodesOptions = response.data;
      });
      this.isMore = commodity[0].isCheckbox;
    },
    // 多选小类
    handleCheckedChange(selection) {
      console.log(selection);
      // this.commoditySubclassCodes = selection.map((item) => item.commoditySubclassCodesOptions);
    }
  }
};
</script>

<style>
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
    line-height: 36px !important;
  }
</style>

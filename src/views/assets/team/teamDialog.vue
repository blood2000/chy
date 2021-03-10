<template>
	<!-- 添加或修改调度者对话框 -->
	<el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
	  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
	    <!-- <el-form-item label="主键" prop="id">
	      <el-input v-model="form.id" placeholder="请输入主键" />
	    </el-form-item> -->
	    <el-form-item label="编码" prop="code">
	      <el-input v-model="form.code" placeholder="请输入编码" />
	    </el-form-item>
	    <el-form-item label="网点编码" prop="branchCode">
	      <el-input v-model="form.branchCode" placeholder="请输入网点编码" />
	    </el-form-item>
	    <el-form-item label="车队名称" prop="name">
	      <el-input v-model="form.name" placeholder="请输入车队名称" />
	    </el-form-item>
	    <el-form-item label="管理者" prop="teamLeader">
	      <el-input v-model="form.teamLeader" placeholder="请输入车队管理者" />
	    </el-form-item>
	    <!-- <el-form-item label="是否删除" prop="isDel">
	      <el-input v-model="form.isDel" placeholder="请输入是否删除" />
	    </el-form-item> -->
	    <el-form-item label="状态">
	      <el-radio-group v-model="form.status">
	        <el-radio
	          v-for="dict in statusOptions"
	          :key="dict.dictValue"
	          :label="parseInt(dict.dictValue)"
	        >{{dict.dictLabel}}</el-radio>
	      </el-radio-group>
	    </el-form-item>
		<el-form-item label="营业执照" prop="businessLicenseImg">
		  <el-input v-model="form.businessLicenseImg" placeholder="请输入营业执照" />
		</el-form-item>
		<el-form-item label="道路运输经营许可证照">
		  <uploadImage v-model="form.transportPermitImage"/>
		</el-form-item>
		<el-form-item label="身份证正面照片">
		  <uploadImage v-model="form.identificationImage"/>
		</el-form-item>
		<el-form-item label="身份证国徽面">
		  <uploadImage v-model="form.identificationBackImage"/>
		</el-form-item>
	    <!-- <el-form-item label="创建人" prop="createCode">
	      <el-input v-model="form.createCode" placeholder="请输入创建人" />
	    </el-form-item>
	    <el-form-item label="修改人" prop="updateCode">
	      <el-input v-model="form.updateCode" placeholder="请输入修改人" />
	    </el-form-item> -->
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="submitForm">确 定</el-button>
	    <el-button @click="cancel">取 消</el-button>
	  </div>
	</el-dialog>
</template>

<script>
	import { addInfo, updateInfo } from "@/api/assets/team";
	import UploadImage from '@/components/UploadImage/index';
	
	export default {
	  props: {
	    title: String,
	    open: Boolean
	  },
	  components: {
	    UploadImage
	  },
	  data() {
	    return {
		  // 状态字典
		  statusOptions: [
		  		{dictLabel: '启用', dictValue: '0'},
		    {dictLabel: '禁用', dictValue:'1'},
		  ],
	      // 表单参数
	      form: {},
	      // 表单校验
	      rules: {
			code: [
			  { required: true, message: "编码不能为空", trigger: "blur" }
			],
	        branchCode: [
	          { required: true, message: "网点编码不能为空", trigger: "blur" }
	        ],
	        name: [
	          { required: true, message: "车队名称不能为空", trigger: "blur" }
	        ],
	        teamLeader: [
	          { required: true, message: "车队管理者不能为空", trigger: "blur" }
	        ],
	      }
	    }
	  },
	  computed: {
	    visible: {
	      get() {
	        return this.open;
	      },
	      set(v) {
	        this.$emit("update:open", v);
	      },
	    },
	  },
	  created() {
		  
	  },
	  methods: {
		  /** 提交按钮 */
		  submitForm() {
		    this.$refs["form"].validate(valid => {
		      if (valid) {
		        if (this.form.id != null) {
		          updateInfo(this.form).then(response => {
		            this.msgSuccess("修改成功");
		            this.close();
		            this.$emit('refresh');
		          });
		        } else {
		          addInfo(this.form).then(response => {
		            this.msgSuccess("新增成功");
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
	      this.$emit("update:open", false);
	    },
		// 表单重置
		reset() {
		  this.form = {
		    id: null,
			code: null,
			branchCode: null,
			name: null,
			teamLeader: null,
			isDel: null,
			status: 0,
			createCode: null,
			createTime: null,
			updateCode: null,
			updateTime: null,
			businessLicenseImg: null,
			transportPermitImage: null,
			identificationImage: null,
			identificationBackImage: null
		  };
		  this.resetForm("form");
		},
	  }
	}
</script>

<style>
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 90%;
	}
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
</style>

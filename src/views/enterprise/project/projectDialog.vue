<template>
  <!-- 添加或修改项目对话框 -->
  <el-dialog :title="title" :class="[{'i-add':title==='添加项目'}]" :visible="visible" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="项目名称" prop="projectName" class="width90">
        <el-input v-model="form.projectName" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="合作单位" prop="earthworkUnit" class="width90">
        <el-input v-model="form.earthworkUnit" placeholder="请输入合作单位" />
      </el-form-item>
      <el-form-item label="装货地址" prop="detail" class="width90">
        <amap-search ref="AmapSearchRef" v-model="form.detail" :search-option="searchOption" class="width100" @change="addressChange" />
      </el-form-item>
      <el-form-item label="卸货地址" prop="unloadDetail" class="width90">
        <amap-search ref="UnloadAmapSearchRef" v-model="form.unloadDetail" :search-option="searchOption" class="width100" :clearable="true" @change="unloadAddressChange" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="选择负责的组织/成员" class="width90">
            <el-select
              v-model="changeOrgValue"
              clearable
              filterable
              style="width: 100%"
              @change="changeOption"
            >
              <el-option
                v-for="dict in changeOrgOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="changeOrgValue === 0" label="负责的成员组织" prop="orgCodes" class="width90">
            <el-select
              v-model="form.orgCodes"
              clearable
              filterable
              style="width: 100%"
              multiple
            >
              <el-option
                v-for="dict in memberOrgList"
                :key="dict.orgCode"
                :label="dict.orgName"
                :value="dict.orgCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="changeOrgValue === 1" label="负责的成员" prop="userCodes" class="width90">
            <el-select
              v-model="form.userCodes"
              clearable
              filterable
              style="width: 100%"
              multiple
            >
              <el-option
                v-for="dict in memberList"
                :key="dict.userCode"
                :label="dict.nickName + ' ('+dict.phonenumber+')'"
                :value="dict.userCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-form-item label="货物大类" prop="commodityCategoryCode">
        <el-radio-group v-model="form.commodityCategoryCode" @change="handlecommodityCategoryChange">
          <el-radio
            v-for="dict in commodityCategoryCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isMore == 0 || !isMore" label="货物小类" prop="commoditySubclassCodes">
        <el-radio-group v-model="form.commoditySubclassCodes">
          <el-radio
            v-for="dict in commoditySubclassCodesOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isMore == 1" label="货物小类" prop="commoditySubclassCodes">
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
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addInfo, updateInfo } from '@/api/enterprise/project';
import { listDept } from '@/api/system/dept';
import { listUser } from '@/api/system/user';
import AmapSearch from '@/components/Ddc/Tin/AmapSearch';
import { getUserInfo } from '@/utils/auth';

const geocoder = new AMap.Geocoder({
  radius: 1000,
  extensions: 'all'
});

export default {
  components: {
    AmapSearch
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    shipment: {
      type: String,
      default: null
    },
    company: {
      type: String,
      default: null
    },
    companyCode: {
      type: String,
      default: null
    },
    userCode: {
      type: String,
      default: null
    },
    showShipment: {
      type: Boolean
    },
    orgType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      memberOrgList: [],
      memberList: [],
      searchOption: {
        city: '全国',
        citylimit: true
      },
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
      // 项目类型字典
      projectTypeOptions: [],
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '装货地址不能为空', trigger: ['blur', 'change'] }
        ]
        /* unloadDetail: [
          { required: true, message: '卸货地址不能为空', trigger: ['blur', 'change'] }
        ]
        commodityCategoryCode: [
          { required: true, message: '请选择货物大类', trigger: 'blur' }
        ],
        commoditySubclassCodes: [
          { required: true, message: '请选择货物小类', trigger: 'blur' }
        ]*/
      },
      // 是否多选
      isMore: '2',
      // 大类字典类型
      commodityCategory: {
        'status': '0',
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 小类字典类型
      commoditySubclass: {
        'status': '0',
        'dictPid': '',
        'dictType': 'goodsType'
      },
      changeOrgValue: 0,
      changeOrgOptions: [
        { label: '选择组织', value: 0 },
        { label: '选择成员', value: 1 }
      ]
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
    this.getMemberOrgList();
    this.getMemberList();
    /* this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
    this.listByDict({ dictPid: '0', dictType: 'transportation_scenario' }).then(response => {
      this.projectTypeOptions = response.data;
      console.log(this.projectTypeOptions);
    });*/
  },
  methods: {
    changeOption(value) {
      if (value === 1) {
        this.getMemberList();
      } else {
        this.getMemberOrgList();
      }
    },
    /** 查询成员列表 */
    getMemberList() {
      const data = {};
      data.pageNum = 1;
      data.pageSize = 100;
      var flag = true;
      if (this.companyCode) {
        data.orgCode = this.companyCode;
        flag = false;
      }
      if (this.company) {
        data.orgCode = this.company;
      }
      if (this.showShipment) {
        data.showShipment = this.showShipment;
      }
      if (this.orgType) {
        data.orgType = this.orgType;
      }
      if (flag) {
        const { user = {}, shipment = {}} = getUserInfo() || {};
        data.orgCode = shipment.info.companyCode;
        data.orgType = 1;
        data.showShipment = true;
      }
      listUser(data).then(response => {
        this.memberList = response.rows;
      }
      );
    },
    /** 查询部门列表 */
    getMemberOrgList() {
      const data = {};
      data.pageNum = 1;
      data.pageSize = 100;
      var flag = true;
      if (this.companyCode) {
        data.orgCode = this.companyCode;
        flag = false;
      }
      if (this.company) {
        data.orgCode = this.company;
      }
      if (this.userCode) {
        data.userCode = this.userCode;
      }
      if (this.showShipment) {
        data.showShipment = this.showShipment;
      }
      if (this.orgType) {
        data.orgType = this.orgType;
      }
      if (flag) {
        const { user = {}, shipment = {}} = getUserInfo() || {};
        data.orgCode = shipment.info.companyCode;
        data.userCode = user.userCode;
        data.orgType = 1;
        data.showShipment = true;
      }
      listDept(data).then(response => {
        this.memberOrgList = response.data;
      });
    },
    // 搜索地址
    addressChange(row) {
      const { lng, lat, dictLabel } = row;
      this.form.longitude = lng;
      this.form.latitude = lat;
      this.form.detail = dictLabel;
      // 根据地址获取省市区
      this.getAddressBylnglat(lng, lat);
    },
    // 通过经纬度获取详细点位信息
    getAddressBylnglat(lng, lat) {
      const _this = this;
      // 通过高德地图的sdk将坐标转为地址
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            const { adcode, province, city, district } = result.regeocode.addressComponent;
            _this.form.provinceCode = adcode.slice(0, 2);
            _this.form.cityCode = adcode.slice(0, 4);
            _this.form.districtCode = adcode.slice(0, 6);
            _this.form.province = province;
            _this.form.city = city;
            _this.form.district = district;
          }
        }
      });
    },
    // 搜索卸货地址
    unloadAddressChange(row) {
      if (row) {
        const { lng, lat, dictLabel } = row;
        this.form.unloadLongitude = lng;
        this.form.unloadLatitude = lat;
        this.form.unloadDetail = dictLabel;
        // 根据地址获取省市区
        this.getUnloadAddressBylnglat(lng, lat);
      } else {
        this.form.unloadLongitude = '';
        this.form.unloadLatitude = '';
        this.form.unloadDetail = '';
        this.form.unloadProvinceCode = '';
        this.form.unloadCityCode = '';
        this.form.unloadDistrictCode = '';
        this.form.unloadProvince = '';
        this.form.unloadCity = '';
        this.form.unloadDistrict = '';
      }
    },
    // 通过经纬度获取详细点位信息
    getUnloadAddressBylnglat(lng, lat) {
      const _this = this;
      // 通过高德地图的sdk将坐标转为地址
      geocoder.getAddress([lng, lat], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            const { adcode, province, city, district } = result.regeocode.addressComponent;
            _this.form.unloadProvinceCode = adcode.slice(0, 2);
            _this.form.unloadCityCode = adcode.slice(0, 4);
            _this.form.unloadDistrictCode = adcode.slice(0, 6);
            _this.form.unloadProvince = province;
            _this.form.unloadCity = city;
            _this.form.unloadDistrict = district;
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.shipment) {
            this.form.shipmentCode = this.shipment;
          }
          if (this.changeOrgValue === 0) {
            this.form.userCodes = null;
          } else if (this.changeOrgValue === 1) {
            this.form.orgCodes = null;
          } else {
            this.form.userCodes = null;
            this.form.orgCodes = null;
          }
          if (this.form.id) {
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
      this.changeOrgValue = 0;
      this.form = {
        id: null,
        shipmentCode: null,
        projectName: null,
        earthworkUnit: null,
        // 装货
        detail: null,
        provinceCode: null,
        cityCode: null,
        districtCode: null,
        province: '',
        city: '',
        district: '',
        latitude: null,
        longitude: null,
        // 卸货
        unloadDetail: null,
        unloadProvinceCode: null,
        unloadCityCode: null,
        unloadDistrictCode: null,
        unloadProvince: null,
        unloadCity: null,
        unloadDistrict: null,
        unloadLatitude: null,
        unloadLongitude: null,
        // 组织成员
        orgCodes: null,
        userCodes: null,
        // commodityCategoryCode: null,
        // commoditySubclassCodes: null,
        // projectRemark: null,
        projectType: '1100' // 新增项目类型 1100 大宗商品 1200 渣土
      };
      this.resetForm('form');
      this.isMore = '2';
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
      if (data.orgCodes && data.orgCodes.length > 0) {
        this.changeOrgValue = 0;
      } else if (data.userCodes && data.userCodes.length > 0) {
        this.changeOrgValue = 1;
      }
      /* if (data.commoditySubclassCodes) {
        this.commoditySubclassCodes = data.commoditySubclassCodes.split(',');
      }
      if (data.commodityCategoryCode) {
        this.handleChange(data.commodityCategoryCode);
      } */
    },
    // 单选商品大类
    handlecommodityCategoryChange(selection) {
      this.handleChange(selection);
      this.form.commoditySubclassCodes = null;
      this.commoditySubclassCodes = [];
    },
    // 单选商品大类后联动数据事件
    handleChange(value) {
      const commodity = this.commodityCategoryCodeOptions.filter(item => {
        return item.dictValue === value;
      });
      this.commoditySubclass.dictPid = commodity[0].dictCode;
      this.listByDict(this.commoditySubclass).then(response => {
        this.commoditySubclassCodesOptions = response.data;
      });
      this.isMore = commodity[0].isCheckbox;
    },
    // 多选小类
    handleCheckedChange(selection) {
      this.form.commoditySubclassCodes = selection.join(',');
      // this.commoditySubclassCodes = selection.map((item) => item.commoditySubclassCodesOptions);
    }
  }
};
</script>

<style lang="scss" scoped>
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 94.4%;
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

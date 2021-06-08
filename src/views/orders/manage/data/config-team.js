
const arr = [
  {
    prop: 'branchCode',
    isShow: true,
    label: '网点编码'
  },
  {
    prop: 'name',
    isShow: true,
    label: '调度组名称'
  },
  {
    prop: 'teamLeader',
    isShow: true,
    label: '管理者名称'
  },
  {
    prop: 'isDel',
    isShow: true,
    label: '是否删除'
  },
  {
    prop: 'status',
    isShow: true,
    label: '状态'

  },
  {
    prop: 'createCode',
    isShow: false,
    label: '创建人'

  },
  {
    prop: 'updateCode',
    isShow: false,
    label: '修改人'

  },
  {
    prop: 'businessLicenseImg',
    isShow: false,
    label: '营业执照'

  },
  {
    prop: 'transportPermitImage',
    isShow: false,
    label: '道路运输经营许可证照'
  },
  {
    prop: 'identificationImage',
    isShow: false,
    label: '身份证正面照片'
  },
  {
    prop: 'identificationBackImage',
    isShow: false,
    label: '身份证国徽面'

  }
];



export default arr.concat({
  prop: 'edit',
  isShow: false,
  label: '操作',
  width: 180,
  fixed: 'left'
});
































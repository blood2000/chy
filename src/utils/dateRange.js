export const pickerOptions = {
  shortcuts: [{
    text: '本日',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '本月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      var tYear = end.getFullYear();
      var tMonth = end.getMonth() + 1;
      start.setTime(new Date(tYear + '-' + tMonth + '-01'));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '今年至今',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      var tYear = end.getFullYear();
      start.setTime(new Date(tYear + '-01-01'));
      picker.$emit('pick', [start, end]);
    }
  }]
};

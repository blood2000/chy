import { parseTime } from '@/utils/ddc';

export const pickerOptions = {
  shortcuts: [{
    text: '本日',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '昨日',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '本周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - (start.getDay() - 1) * 3600 * 1000 * 24);
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
    text: '本年',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      var tYear = end.getFullYear();
      start.setTime(new Date(tYear + '-01-01'));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '近三天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '近七天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '近三月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
};

export const pickerTimeOptions = {
  shortcuts: [{
    text: '本日',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(new Date(parseTime(new Date(), '{y}-{m}-{d} 00:00:00')));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '昨日',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(new Date(parseTime(end.getTime() - 3600 * 1000 * 24 * 1, '{y}-{m}-{d} 23:59:59')));
      start.setTime(new Date(parseTime(start.getTime() - 3600 * 1000 * 24 * 1, '{y}-{m}-{d} 00:00:00')));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '本周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(new Date(parseTime(start.getTime() - (start.getDay() - 1) * 3600 * 1000 * 24, '{y}-{m}-{d} 00:00:00')));
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
    text: '本年',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      var tYear = end.getFullYear();
      start.setTime(new Date(tYear + '-01-01 00:00:00'));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '近三天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(new Date(parseTime(start.getTime() - 3600 * 1000 * 24 * 2, '{y}-{m}-{d} 00:00:00')));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '近七天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(new Date(parseTime(start.getTime() - 3600 * 1000 * 24 * 6, '{y}-{m}-{d} 00:00:00')));
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '近三月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(new Date(parseTime(start.getTime() - 3600 * 1000 * 24 * 90, '{y}-{m}-{d} 00:00:00')));
      picker.$emit('pick', [start, end]);
    }
  }]
};

import request from '@/utils/request';

// 查询发票列表
export const billListApi = '/transportation/invoiceApply/listInvoiceApply';
export function billList(data) {
  return request({
    url: '/transportation/invoiceApply/listInvoiceApply',
    method: 'post',
    data: data
  });
}

// 审核发票申请
export function passCheck(data) {
  return request({
    url: '/transportation/invoiceApply/passCheck',
    method: 'post',
    data: data
  });
}

// 发票结算单详情
export function getDetail(invoiceApplyCode) {
  return request({
    url: '/transportation/invoiceApply/detail/' + invoiceApplyCode,
    method: 'post'
  });
}


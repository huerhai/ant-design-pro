/**
 * Created by liwenjie on 2017/11/29.
 */
// import { stringify } from 'qs';
import request from '../utils/request';

// 获取预审案件列表
export async function queryList(query) {
  return request('/gw/cs/claim/list', {
    method: 'POST',
    body: {
      size: 10,
      ...query,
      page: query.page,
      claimId: query.claimId ? query.claimId : undefined,
      insuredPersonId: query.insuredPersonId ? query.insuredPersonId : undefined,
      insuredPersonName: query.insuredPersonName ? query.insuredPersonName : undefined,
      isEmergency: query.isEmergency ? true : undefined,
      isOverLimit: query.isOverLimit ? true : undefined,
      isInvalid: query.isInvalid ? true : undefined,
    },
  });
}

// 获取预审案件列表
export async function updateStatusCodes({ items, to }) {
  return request('/gw/cs/claim/updateStatusCodes', {
    method: 'POST',
    body: {
      claimDataIdList: items,
      statusCode: to,
    },
  });
}

// 获取 案件信息
export async function getClaimById(claimDataId) {
  return request(`/gw/cs/claim/getClaimById?claimDataId=${claimDataId}`);
}

// 获取 预审信息
export async function getDutyByClaimId(claimId) {
  return request(`/gw/cs/duty/getDutyByClaimId?claimId=${claimId}`);
}
// 获取 保单信息
export async function getPolicyById(body) {
  return request('/gw/cs/policy/getPolicyById', {
    method: 'POST',
    body,
  });
}

// 案件 修改责任
export async function updateDutyByClaimId(body) {
  return request('/gw/cs/duty/updateDutyByClaimId', {
    method: 'POST',
    body,
  });
}

// 案件 新增责任
export async function createDutyByClaimId(body) {
  return request('/gw/cs/duty/createDutyByClaimId', {
    method: 'POST',
    body,
  });
}

// 案件 新增责任
export async function exportCasesDetail(body) {
  return request('/gw/cs/excelexport/excelmutidetail', {
    method: 'POST',
    body,
  });
}

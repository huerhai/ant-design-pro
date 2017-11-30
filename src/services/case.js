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

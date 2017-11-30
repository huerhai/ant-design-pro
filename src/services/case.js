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
      isEmergency: query.isEmergency ? true : undefined,
      isOverLimit: query.isOverLimit ? true : undefined,
      isInvalid: query.isInvalid ? true : undefined,
    },
  });
}

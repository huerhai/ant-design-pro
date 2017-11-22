/**
 * Created by liwenjie on 2017/11/10.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCompany(params) {
  return request(`/api/company?${stringify(params)}`);
}

export async function removeCompany(params) {
  return request('/api/company', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addCompany(params) {
  return request('/api/company', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateCompany(params) {
  return request('/api/company', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryGroup(params) {
  return request(`/api/group?${stringify(params)}`);
}

export async function removeGroup(params) {
  return request('/api/group', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addGroup(params) {
  return request('/api/group', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateGroup(params) {
  return request('/api/group', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

// 获取预审案件列表
export async function queryRreList(params) {
  return request('/gw/cs/pretreatment/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

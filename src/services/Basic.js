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

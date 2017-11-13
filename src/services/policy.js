/**
 * Created by liwenjie on 2017/11/10.
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/policy?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/policy', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function add(params) {
  return request('/api/policy', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(params) {
  return request('/api/policy', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

/* eslint-disable no-param-reassign */
import { queryBasicProfile, queryAdvancedProfile } from '../services/api';
import { getClaimById, getDutyByClaimId, getPolicyById, createDutyByClaimId } from '../services/case';

export default {
  namespace: 'claim',

  state: {
    currentItem: {},
    basicGoods: [],
    basicLoading: true,
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: [],
    advancedLoading: true,
  },

  effects: {
    *fetchDetail({ payload, callback }, { call, put }) {
      const response1 = yield call(getClaimById, payload.claimDataId);
      const response2 = yield call(getDutyByClaimId, payload.claimId);
      const response3 = yield call(getPolicyById, {
        companyId: {
          ...response1.companyId,
        },
        id: response1.insuredPerson.id,
        idType: {
          ...response1.insuredPerson.idType,
        },
      });
      const newItem = {
        ...payload,
        detail: response1,
        dutyList: response2,
        policyList: response3,
        insurancePlanList: response3.reduce((a, b) => a.concat(b.insurancePlanResponseList), []),
      };
      yield put({
        type: 'updatePorps',
        payload: {
          currentItem: newItem,
        },
      });
      if (callback) callback(newItem);
    },
    *createDuty({ payload, callback }, { call }) {
      const { detail, policyList, claimId } = payload;
      const arry = [];
      detail.eventResponseList.forEach((event) => {
        const policy = policyList.find((item) => {
          return item.policyId === event.policyId;
        });
        if (policy) {
          event.policyHolder = policy.policyHolder;
          const duty = policy.insurancePlanResponseList.find((plan) => {
            return event.dutyCode === plan.dutyCode;
          });
          event.insurancePlan = duty;
        }
        let flag = true;
        arry.forEach((events) => {
          if (events.length > 0) {
            if (events[0].dutyCode === event.dutyCode) {
              events.push(event);
              flag = false;
            }
          }
        });
        if (flag) {
          arry.push([event]);
        }
      });
      const res = arry.filter(item => item[0].dutyCode).map((events) => {
        const temp = {
          保单号: '',
          审核结论: '',
          结论原因: '',
          审核意见: '',
          结案金额: '',
          dutyCode: '',
        };
        events.filter(item => item.insurancePlan).forEach((event) => {
          if (temp.保单号.split(',').indexOf(event.policyId) === -1) {
            temp.保单号 = temp.保单号 + (temp.保单号 && ',') + event.policyId;
          }
          if (temp.审核结论.split('; ').indexOf(event.resCode.value) === -1) {
            temp.审核结论 = temp.审核结论 + (temp.审核结论 && '; ') + event.resCode.value;
          }
          if (temp.结论原因.split('; ').indexOf(event.resOpinion) === -1) {
            temp.结论原因 = temp.结论原因 + (temp.结论原因 && '; ') + event.resReason;
          }
          if (temp.审核意见.split('; ').indexOf(event.resReason) === -1) {
            temp.审核意见 = temp.审核意见 + (temp.审核意见 && '; ') + event.resOpinion;
          }
          temp.结案金额 += +event.claimPay;
          temp.dutyCode += +event.claimPay;
          if (temp.dutyCode !== event.insurancePlan.dutyCode) {
            temp.dutyCode = event.insurancePlan.dutyCode;
          }
        });

        return {
          policyId: temp.保单号,
          resCode: temp.审核结论,
          resOpinion: temp.结论原因,
          resReason: temp.审核意见,
          dutyPay: temp.结案金额,
          dutyCode: temp.dutyCode,
        };
      });
      yield call(createDutyByClaimId, {
        claimId,
        list: res,
      });
      const duty = yield call(getDutyByClaimId, claimId);
      if (callback) callback(duty);
    },
    *fetchBasic(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: true },
      });
      const response = yield call(queryBasicProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: false },
      });
    },
    *fetchAdvanced(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: true },
      });
      const response = yield call(queryAdvancedProfile);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { advancedLoading: false },
      });
    },
  },

  reducers: {
    updatePorps(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

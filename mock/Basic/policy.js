import mockjs from 'mockjs';

// mock tableListDataSource
let tableListDataSource = mockjs.mock({
  'list|1-30': [{
    key: '@id',
    被保人姓名: '@cname',
    团体名称: /团体[1-999]/,
    团体保单号: /\d{5}/,
    保险公司: /公司[1-3]/,
    个人保单号: /\d{10}/,
    产品名称: /产品[1-3]/,
    层级: /第[1-5]层级/,
    被保人属性: /本人|子女|父母|配偶/,
    出生年月: /[1980-2014]年[1-12]月/,
    性别: /男|女/,
    证件类型: '身份证',
    被保人身份证: '@id',
    医保类型: /城镇|农村|城乡/,
    医保卡号: /\d{10}/,
    剩余保费: '@float(0, 20000, 2, 2)',
    初期保费: '20000',
    银行账号: /\d{19}/,
    开户行: /建设|工商|农业/,
    保单生效日: '@date',
    保单终止日: '@date',
  }],
}).list;


export function get(req, res) {
  let dataSource = [...tableListDataSource];

  const { query } = req;
  const { pageSize = 10, page = 1, ...other } = query;

  for (const key in other) {
    if ({}.hasOwnProperty.call(other, key)) {
      dataSource = dataSource.filter((item) => {
        if ({}.hasOwnProperty.call(item, key)) {
          return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1;
        }
        return true;
      });
    }
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(page, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function post(req, res, _, b) {
  const body = (b && b.body) || req.body;
  const { method, ...obj } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => item.key !== obj.key);
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map((item) => {
        return item.key === obj.key ? obj : item;
      });
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift(Object.assign(obj, { key: i }));
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  get,
  post,
};

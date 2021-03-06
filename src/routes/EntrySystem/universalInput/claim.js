import moment from 'moment';

const ICD10 = [
  {
    label: '慢性呼吸道感染 J98.951',
    value: '慢性呼吸道感染 J98.951',
  },
  {
    label: '胸腔肿物 J98.902',
    value: '胸腔肿物 J98.902',
  },
  {
    label: '胸腔占位性病变 J98.901',
    value: '胸腔占位性病变 J98.901',
  },
  {
    label: '其他特指的呼吸性疾患 J98.851',
    value: '其他特指的呼吸性疾患 J98.851',
  },
  {
    label: '胸部肿物 J98.804',
    value: '胸部肿物 J98.804',
  },
  {
    label: '呼吸道梗阻 J98.803',
    value: '呼吸道梗阻 J98.803',
  },
  {
    label: '呼吸道感染 J98.802',
    value: '呼吸道感染 J98.802',
  },
  {
    label: '鼻咽肿物 J98.801',
    value: '鼻咽肿物 J98.801',
  },
  {
    label: '膈松弛 J98.653',
    value: '膈松弛 J98.653',
  },
  {
    label: '膈麻痹 J98.652',
    value: '膈麻痹 J98.652',
  },
  {
    label: '膈肌囊肿 J98.651',
    value: '膈肌囊肿 J98.651',
  },
  {
    label: '横膈麻痹 J98.603',
    value: '横膈麻痹 J98.603',
  },
  {
    label: '膈肌麻痹 J98.602',
    value: '膈肌麻痹 J98.602',
  },
  {
    label: '膈(横膈)膨升 J98.601',
    value: '膈(横膈)膨升 J98.601',
  },
  {
    label: '纵隔退缩 J98.553',
    value: '纵隔退缩 J98.553',
  },
];
const claim = {
  title: '一个案件对象',
  type: 'object',
  properties: {
    accidentAddress: {
      type: 'string',
      title: '出险地址',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    city: {
      type: 'city',
      title: '出险城市',
      defaultValue: undefined,
      description: '描述',
      order: 4,
      rules: [],
      style: {},
    },
    accidentSubtype: {
      type: 'radioBtn',
      title: '出险类型',
      defaultValue: 1,
      description: '描述',
      order: 1,
      rules: [],
      style: {},
      enum: [{
        label: '疾病',
        value: 1,
      }, {
        label: '意外',
        value: 2,
      }, {
        label: '其他',
        value: 3,
      }],
    },
    auditConclusion: {
      type: 'select',
      title: '审核结论',
      defaultValue: 1,
      description: '描述',
      order: 2,
      rules: [],
      style: {},
      enum: [{
        label: '赔付',
        value: 1,
      }, {
        label: '协议',
        value: 2,
      }, {
        label: '部分',
        value: 3,
      }, {
        label: '拒赔',
        value: 4,
      }, {
        label: '通融赔付',
        value: 5,
      }, {
        label: '撤案',
        value: 6,
      }, {
        label: '其他',
        value: 0,
      }],
    },
    auditOption: {
      type: 'string',
      title: '复核意见',
      defaultValue: '通过',
      description: '描述',
      order: 3,
      rules: [],
      style: {},
    },
    claimId: {
      type: 'string',
      title: '赔案ID',
      defaultValue: (Math.random() * 1000).toFixed(0),
      description: '描述',
      order: 0,
      rules: [],
      style: {},
    },
    customCode: {
      type: 'string',
      title: '收单单位',
      defaultValue: '',
      description: '描述',
      order: 999,
      rules: [],
      style: {},
    },
    materialCode: {
      type: 'multipleSelect',
      title: '资料代码',
      defaultValue: [1, 2, 3, 4],
      description: '描述',
      order: 999,
      rules: [],
      style: {},
      enum: [{
        label: '理赔申请书',
        value: 1,
      }, {
        label: '保单原件或复印件',
        value: 2,
      }, {
        label: '申请人、被保险人、领款人身份证明材料',
        value: 3,
      }, {
        label: '受益人银行卡账号或者复印件',
        value: 4,
      }, {
        label: '门诊发票',
        value: 5,
      }, {
        label: '住院发票',
        value: 6,
      }, {
        label: '门诊处方/费用明细/诊断证明',
        value: 7,
      }, {
        label: '检查报告单',
        value: 8,
      }, {
        label: '出院证明/出院小结/诊断证明',
        value: 9,
      }, {
        label: '住院费用清单',
        value: 10,
      }, {
        label: '住院病历',
        value: 11,
      }, {
        label: '医保报销单',
        value: 12,
      }, {
        label: '其他补充保险报销单',
        value: 13,
      }, {
        label: '意外事故证明（单位出具、村委会出具、交警证明、工伤证明等）',
        value: 14,
      }, {
        label: '药店发票',
        value: 15,
      }, {
        label: '行驾两证、交通事故调解书',
        value: 16,
      }, {
        label: '其他',
        value: 17,
      },
      ],
    },
    firstDate: {
      type: 'date',
      title: '初次就诊日期',
      defaultValue: moment(),
      description: '描述',
      order: 8,
      rules: [],
      style: {},
    },
    accidentDate: {
      type: 'date',
      title: '出险日期',
      defaultValue: moment(),
      description: '描述',
      order: 6,
      rules: [],
      style: {},
    },
    emailAccept: {
      type: 'bool',
      title: '是否接接受邮件',
      defaultValue: true,
      description: '描述',
      order: 999,
      rules: [],
      style: {},
    },
    isOriginal: {
      type: 'bool',
      title: '是否原件',
      defaultValue: false,
      description: '描述',
      order: 999,
      rules: [],
      style: {},
    },
    accidentInfo: {
      type: 'string',
      title: '出险经过',
      defaultValue: '',
      description: '描述',
      order: 7,
      rules: [],
      style: {},
    },
  },
};
const person = {
  title: '一个人员对象',
  type: 'object',
  properties: {
    address: {
      type: 'string',
      title: '联系地址',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    bankAccount: {
      type: 'string',
      title: '银行账号',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    bankBranch: {
      type: 'string',
      title: '银行所在省',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    bankSubbranch: {
      type: 'string',
      title: '银行所在市',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    bankType: {
      type: 'number',
      title: '银行名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    birthday: {
      type: 'number',
      title: '生日',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    email: {
      type: 'string',
      title: '邮箱账号',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    gender: {
      type: 'number',
      title: '性别',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    id: {
      type: 'string',
      title: '身份证号码',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    idType: {
      type: 'number',
      title: '证件类型',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    idValidateFrom: {
      type: 'number',
      title: '证件有效期起止时间',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    job: {
      type: 'string',
      title: '职业',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    mobilePhone: {
      type: 'string',
      title: '手机号',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    name: {
      type: 'string',
      title: '姓名',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    organization: {
      type: 'string',
      title: '单位名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    payType: {
      type: 'number',
      title: '领款方式',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    relationship: {
      type: 'number',
      title: '和被保人关系',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    telephone: {
      type: 'string',
      title: '座机号码',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    type: {
      type: 'number',
      title: '领款人类型',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    zip: {
      type: 'string',
      title: '邮政编码',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
  },
};
const event = {
  title: '事件数组',
  type: 'array',
  properties: {
    billCnt: {
      type: 'number',
      unit: '件',
      title: '收据总数',
      defaultValue: 1,
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    careDate: {
      type: 'date',
      title: '就诊日期',
      defaultValue: undefined,
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    deductiblePay: {
      type: 'money',
      title: '扣除金额',
      defaultValue: 0,
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    claimPay: {
      type: 'money',
      title: '赔付金额',
      defaultValue: 0,
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    classCode: {
      type: 'string',
      title: '险种代码',
      defaultValue: '',
      description: '描述',
      order: 0,
      rules: [],
      style: {},
    },
    clinical: {
      type: 'string',
      title: '科室名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    copiedMaterialCount: {
      type: 'number',
      title: '复印件或扫描件件数',
      unit: '件',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    coverageCode: {
      type: 'multipleSelect',
      title: '索赔事故性质',
      defaultValue: [],
      description: '描述',
      order: 2,
      rules: [],
      style: {},
      enum: [
        {
          label: '身故',
          value: 1,
        },
        {
          label: '伤残',
          value: 2,
        },
        {
          label: '重大疾病',
          value: 3,
        },
        {
          label: '门急诊医疗',
          value: 4,
        },
        {
          label: '住院医疗',
          value: 5,
        },
        {
          label: '住院补贴',
          value: 6,
        },
        {
          label: '女性生育',
          value: 7,
        },
        {
          label: '其他',
          value: 8,
        },
      ],
    },
    critical: {
      type: 'string',
      title: '重疾名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    deadDate: {
      type: 'date',
      title: '身故日期',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    disableDate: {
      type: 'date',
      title: '伤残鉴定日期',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    disableLevel: {
      type: 'string',
      title: '伤残等级',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    disableStandard: {
      type: 'string',
      title: '伤残鉴定标准',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    doctor: {
      type: 'string',
      title: '医生姓名',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    dutyCode: {
      type: 'string',
      title: '责任代码',
      defaultValue: '',
      description: '描述',
      order: 1,
      rules: [],
      style: {},
    },
    eventNo: {
      type: 'string',
      title: '事件号',
      defaultValu: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    historyIllness: {
      type: 'bool',
      title: '是否有既往症',
      defaultValue: true,
      description: '描述',
      order: 999,
      rules: [],
      style: {},
    },
    hospitalName: {
      type: 'string',
      title: '就诊医院名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    illCode: {
      type: 'string',
      title: '疾病主要诊断 ',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    inDate: {
      type: 'date',
      title: '入院日期',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
      filter: '住院',
    },
    inDays: {
      type: 'number',
      unit: '天',
      title: '住院天数',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
      filter: '住院',
    },
    mainDoctor: {
      type: 'string',
      title: '主治医生姓名',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    medicalType: {
      type: 'select',
      title: '医保类别 ',
      defaultValue: 6,
      description: '描述',
      order: 5,
      rules: [],
      style: {},
      enum: [
        { label: '城镇居民', value: 1 },
        { label: '城镇职工', value: 2 },
        { label: '新农合', value: 3 },
        { label: '非医保', value: 4 },
        { label: '其他', value: 5 },
        { label: '城乡居民', value: 6 },
      ],
    },
    originalMaterialCount: {
      type: 'number',
      unit: '件',
      title: '原件件数',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    outDate: {
      type: 'date',
      title: '出院日期',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    payType: {
      type: 'multipleSelect',
      title: '费用类别',
      defaultValue: [],
      description: '描述',
      order: 5,
      rules: [],
      style: {},
      enum: [
        { label: '死亡赔偿金丧葬费', value: 1 },
        { label: '伤残赔偿金', value: 2 },
        { label: '医疗费', value: 3 },
        { label: '误工费', value: 4 },
        { label: '护理费', value: 5 },
        { label: '住院补贴费', value: 6 },
        { label: '交通费', value: 7 },
        { label: '住宿费', value: 8 },
        { label: '被扶养人生活费', value: 9 },
        { label: '住院伙食补助费', value: 10 },
        { label: '营养费', value: 11 },
        { label: '残疾辅助器具费', value: 12 },
        { label: '精神损害赔偿金', value: 13 },
        { label: '后续治疗费', value: 14 },
        { label: '伤残鉴定费', value: 15 },
        { label: '其他', value: 16 },
      ],
    },
    policyId: {
      type: 'string',
      title: '保单号',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    reAuditDate: {
      type: 'date',
      title: '复核完成时间',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    reAuditOption: {
      type: 'string',
      title: '复核意见',
      defaultValu: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    referral: {
      type: 'bool',
      title: '是否转诊',
      defaultValue: true,
      description: '描述',
      order: 999,
      rules: [],
      style: {},
    },
    referralClinical: {
      type: 'string',
      title: '转科室名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    referralDoctor: {
      type: 'string',
      title: '转医生姓名',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    referralHospitalName: {
      type: 'string',
      title: '转医院名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    resCode: {
      type: 'select',
      title: '赔付结论',
      defaultValue: 1,
      description: '描述',
      order: 5,
      rules: [],
      style: {},
      enum: [{
        label: '赔付',
        value: 1,
      }, {
        label: '协议',
        value: 2,
      }, {
        label: '部分',
        value: 3,
      }, {
        label: '拒赔',
        value: 4,
      }, {
        label: '通融赔付',
        value: 5,
      }, {
        label: '撤案',
        value: 6,
      }, {
        label: '其他',
        value: 0,
      }],
    },
    resOpinion: {
      type: 'string',
      title: '审核意见',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    resReason: {
      type: 'string',
      title: '结论原因',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    subIllCode: {
      type: 'string',
      title: '疾病次要诊断',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    surgery: {
      type: 'string',
      title: '手术名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
  },
};

const basicInfo = {
  title: '基本信息',
  type: 'object',
  properties: {
    policyId: {
      type: 'string',
      title: '保单号',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    policyHolderName: {
      type: 'string',
      title: '投保单位',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    idType: {
      type: 'select',
      title: '证件类型',
      defaultValue: '111',
      description: '描述',
      rules: [],
      style: {},
      enum: [{
        label: '身份证',
        value: '111',
      }, {
        label: '驾驶证',
        value: '112',
      }, {
        label: '港澳台胞证',
        value: '113',
      }],
    },
    id: {
      type: 'string',
      title: '证件号码',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    name: {
      type: 'string',
      title: '被保人姓名',
      description: '',
      rules: [],
      style: {},
    },
    gender: {
      type: 'radioBtn',
      title: '性别',
      defaultValue: '2',
      description: '描述',
      rules: [],
      style: {},
      enum: [{
        label: '男',
        value: '2',
      }, {
        label: '女',
        value: '3',
      }, {
        label: '未知',
        value: '4',
      }],
    },
    mobilePhone: {
      type: 'string',
      title: '联系电话',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    bankType: {
      type: 'select',
      title: '银行名称',
      defaultValue: '002',
      description: '描述',
      rules: [],
      style: {},
      enum: [{
        label: '中国工商银行',
        value: '001',
      }, {
        label: '中国建设银行',
        value: '002',
      }],
    },
    bankAccount: {
      type: 'string',
      title: '银行账号',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    bankAccountCity: {
      type: 'city',
      title: '银行省市区',
      description: '描述',
      order: 4,
      rules: [],
      style: {
        span: 12,
      },
    },
    relationship: {
      type: 'select',
      title: '领款关系',
      defaultValue: '1',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
      enum: [{
        label: '本人',
        value: '1',
      }, {
        label: '配偶',
        value: '2',
      }, {
        label: '父母',
        value: '3',
      }, {
        label: '子女',
        value: '4',
      }, {
        label: '其他',
        value: '5',
      }],
    },
    领款人姓名: {
      type: 'string',
      title: '领款人姓名',
      description: '描述',
      hide: [{
        key: 'relationship',
        value: '1',
      }],
      rules: [],
      style: {},
    },
    领款人证件类型: {
      type: 'select',
      title: '证件类型',
      defaultValue: '111',
      description: '描述',
      rules: [],
      style: {},
      hide: [{
        key: 'relationship',
        value: '1',
      }],
      enum: [{
        label: '身份证',
        value: '111',
      }, {
        label: '驾驶证',
        value: '112',
      }, {
        label: '港澳台胞证',
        value: '113',
      }],
    },
    领款人证件号: {
      type: 'string',
      title: '证件号',
      defaultValue: '',
      description: '描述',
      hide: [{
        key: 'relationship',
        value: '1',
      }],
      rules: [],
      style: {},
    },
    bankType2: {
      type: 'select',
      title: '银行名称',
      description: '描述',
      hide: [{
        key: 'relationship',
        value: '1',
      }],
      rules: [],
      style: {},
      enum: [{
        label: '中国工商银行',
        value: '001',
      }, {
        label: '中国建设银行',
        value: '002',
      }],
    },
    bankAccount2: {
      type: 'string',
      title: '银行账号',
      defaultValue: '',
      description: '描述',
      hide: [{
        key: 'relationship',
        value: '1',
      }],
      rules: [],
      style: {},
    },
    bankAccountCity2: {
      type: 'city',
      title: '银行省市区',
      defaultValue: undefined,
      description: '描述',
      hide: [{
        key: 'relationship',
        value: '1',
      }],
      rules: [],
      style: {
        span: 12,
      },
    },
  },
};
const basicEventInfo = {
  title: '案件基本信息',
  type: 'object',
  properties: {
    accidentSubtype: {
      type: 'radioBtn',
      title: '出险类型',
      defaultValue: 1,
      description: '描述',
      order: 1,
      rules: [],
      style: {
        span: 8,
      },
      enum: [{
        label: '疾病',
        value: 1,
      }, {
        label: '意外',
        value: 2,
      }, {
        label: '其他',
        value: 3,
      }],
    },
    billType: {
      type: 'radioBtn',
      title: '收据类型',
      defaultValue: 1,
      description: '描述',
      order: 1,
      rules: [],
      style: {
        span: 8,
      },
      enum: [{
        label: '门诊',
        value: 1,
      }, {
        label: '住院',
        value: 2,
      }, {
        label: '其他',
        value: 3,
      }],
    },
    referral: {
      type: 'bool',
      title: '是否转诊',
      defaultValue: false,
      description: '描述',
      rules: [],
      style: {
        span: 8,
      },
    },
    firstDate: {
      type: 'dateString',
      title: '就诊日期',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    hospitalName: {
      type: 'string',
      title: '就诊医院',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    clinical: {
      type: 'string',
      title: '科室名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    illCode: {
      type: 'selectTag',
      title: '疾病诊断',
      defaultValue: undefined,
      description: '描述',
      rules: [],
      style: {
        span: 24,
        formItem: {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        },
      },
      enum: ICD10,

    },
    referralHospitalName: {
      type: 'string',
      title: '转医院',
      defaultValue: '',
      description: '描述',
      hide: [{
        key: 'referral',
        value: false,
      }],
      rules: [],
      style: {},
    },
    referralClinical: {
      type: 'string',
      title: '转科室',
      defaultValue: '',
      description: '描述',
      hide: [{
        key: 'referral',
        value: false,
      }],
      rules: [],
      style: {},
    },
    referralDoctor: {
      type: 'string',
      title: '转医生',
      defaultValue: '',
      description: '描述',
      hide: [{
        key: 'referral',
        value: false,
      }],
      rules: [],
      style: {},
    },
    illCode2: {
      type: 'selectNET',
      title: '转诊 疾病诊断',
      defaultValue: undefined,
      description: '描述',
      hide: [{
        key: 'referral',
        value: false,
      }],
      rules: [],
      style: {
        span: 24,
        formItem: {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        },
      },
      enum: ICD10,
    },
  },
};

const invoiceInfo = {
  title: '收据信息',
  type: 'object',
  properties: {
    hospitalName: {
      type: 'string',
      title: '收据号',
      defaultValue: '',
      description: '描述',
      rules: [],
      style: {},
    },
    总金额: {
      type: 'money',
      title: '总金额',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
    自费: {
      type: 'money',
      title: '自费',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
    自负: {
      type: 'money',
      title: '自负',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
    统筹: {
      type: 'money',
      title: '统筹',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
    附加: {
      type: 'money',
      title: '附加',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
    大病: {
      type: 'money',
      title: '大病',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
    第三方: {
      type: 'money',
      title: '第三方',
      defaultValue: 0,
      description: '描述',
      rules: [],
      style: {
        span: 4,
      },
    },
  },
};
export { basicInfo, basicEventInfo, invoiceInfo, claim, person, event };

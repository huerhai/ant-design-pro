import moment from 'moment';

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
      title: '转来科室名称',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    referralDoctor: {
      type: 'string',
      title: '转来医生姓名',
      defaultValue: '',
      description: '描述',
      order: 5,
      rules: [],
      style: {},
    },
    referralHospitalName: {
      type: 'string',
      title: '转来医院名称',
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
export { claim, event };

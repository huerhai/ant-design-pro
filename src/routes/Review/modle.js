/**
 * Created by liwenjie on 2017/11/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Radio, Alert, Button, Icon, Cascader } from 'antd';
import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

const modal = ({
  item = {},
  onOk,
  onCancel,
  onAdd,
  riskNumber,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields,
  },
  ...modalProps
}) => {
  const handleOk = (bool, onlyPublish) => {
    const values = getFieldsValue();
    if (onlyPublish) {
      onOk({
        ...item,
        para1: values.para1,
        pretreatmentStatus: '2',
      });
      return;
    }
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const riskDimension = [];
      const suggestion = [];
      const des = [];
      const riskLevel = [];
      // const riskScore = [];
      const description = [];
      const riskAmout = [];
      for (let i = 0; i < riskNumber; i += 1) {
        riskDimension.push(values[`riskDimension-${i}`][0]);
        suggestion.push(values[`riskDimension-${i}`][1]);
        des.push(values[`riskDimension-${i}`][2]);
        riskLevel.push(values[`riskLevel-${i}`] || '低');
        // riskScore.push(values[`riskLevel-${i}`] === '高' ? 0.8 : 0.4);
        description.push(values[`description-${i}`]);
        riskAmout.push(values[`riskAmout-${i}`] || 0);
      }
      const data = {
        ...item,
        para1: values.para1,
        riskDimension: riskDimension.join('||'),
        suggestion: suggestion.join('||'),
        des: des.join('||'),
        riskLevel: riskLevel.join('||'),
        riskAmout: riskAmout.join('||'),
        // riskScore: riskScore.join('||'),
        description: description.join('||'),
        pretreatmentStatus: bool ? '1' : item.pretreatmentStatus,
      };
      onOk(data);
      setTimeout(() => {
        resetFields();
      }, 900);
    });
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel,
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  const options = [{
    value: '药品行为',
    label: '药品行为',
    children: [
      {
        value: '无适应症用药',
        label: '无适应症用药',
        children: [{
          value: '实际用药与疾病诊断不匹配',
          label: '实际用药与疾病诊断不匹配',
        }],
      },
      {
        value: '药品配位禁忌',
        label: '药品配位禁忌',
        children: [{
          value: 'XXX药品与XXX药品属于配伍禁忌',
          label: 'XXX药品与XXX药品属于配伍禁忌',
        }],
      },
      {
        value: '超剂量配药',
        label: '超剂量配药',
        children: [{
          value: '药品用量超过说明书限定、同级别医院同病种最大用量',
          label: '药品用量超过说明书限定、同级别医院同病种最大用量',
        }],
      },
      {
        value: '重复用药',
        label: '重复用药',
        children: [{
          value: '同类药品、同一给药途径重复用药',
          label: '同类药品、同一给药途径重复用药',
        }],
      },
      {
        value: '超疗程用药',
        label: '超疗程用药',
        children: [{
          value: 'XXX药品超过临床最大疗程',
          label: 'XXX药品超过临床最大疗程',
        }],
      },
      {
        value: '抗生素超过3种',
        label: '抗生素超过3种',
        children: [{
          value: '单处方抗生素超过3种',
          label: '单处方抗生素超过3种',
        }],
      },
      {
        value: '超限制用药',
        label: '超限制用药',
        children: [{
          value: 'XX药品使用与三目录用药限制不符',
          label: 'XX药品使用与三目录用药限制不符',
        }],
      },
      {
        value: '其他',
        label: '其他',
      },
    ],
  }, {
    value: '疾病诊断',
    label: '疾病诊断',
    children: [{
      value: '慢性病就诊',
      label: '慢性病就诊',
      children: [{
        value: '短期内病情发展至危重，初期症状不明显',
        label: '短期内病情发展至危重，初期症状不明显',
      }],
    }, {
      value: '疾病风险',
      label: '疾病风险',
      children: [{
        value: '治疗周期长、费用高、有并发症、治疗毒副作用大、预后不佳',
        label: '治疗周期长、费用高、有并发症、治疗毒副作用大、预后不佳',
      }],
    }, {
      value: '其他',
      label: '其他',
    }],
  }, {
    value: '诊疗行为',
    label: '诊疗行为',
    children: [{
      value: '过度检查',
      label: '过度检查',
      children: [{
        value: 'XXX检查与此次就诊无相关性',
        label: 'XXX检查与此次就诊无相关性',
      }],
    }, {
      value: '套高标准收费',
      label: '套高标准收费',
      children: [{
        value: '用金额较高的收费项目代替实际项目',
        label: '用金额较高的收费项目代替实际项目',
      }],
    }, {
      value: '超频次收费',
      label: '超频次收费',
      children: [{
        value: 'XX诊疗项目频次超过限定、或同级别医院同病种最大频次',
        label: 'XX诊疗项目频次超过限定、或同级别医院同病种最大频次',
      }],
    }, {
      value: '其他',
      label: '其他',
    }],
  }, {
    value: '医疗行为',
    label: '医疗行为',
    children: [{
      value: '冒名就医',
      label: '冒名就医',
      children: [{
        value: '便民门诊，处方只有诊断或没有诊断，诊断疾病种类多且明显与年龄不符',
        label: '便民门诊，处方只有诊断或没有诊断，诊断疾病种类多且明显与年龄不符',
      }, {
        value: '同一天、相近时间多个医院就诊，同或不同诊断',
        label: '同一天、相近时间多个医院就诊，同或不同诊断',
      }, {
        value: '其他',
        label: '其他',
      }],
    }, {
      value: '其他',
      label: '其他',
    }],
  }, {
    value: '索赔行为',
    label: '索赔行为',
    children: [{
      value: '投保前出险',
      label: '投保前出险',
      children: [{
        value: '多次就诊，只对保单有效期内的就诊费用申请 理赔 ',
        label: '多次就诊，只对保单有效期内的就诊费用申请 理赔 ',
      }, {
        value: '无正常理由的异地就医，比如选择异地的低一级医院',
        label: '无正常理由的异地就医，比如选择异地的低一级医院',
      }],
    },
    {
      value: '极短期出险',
      label: '极短期出险',
      children: [{
        value: '保单生效后极短期出险（<3天）',
        label: '保单生效后极短期出险（<3天）',
      },
      {
        value: '疾病观察期后极短期出险（<3天）',
        label: '疾病观察期后极短期出险（<3天）',
      },
      {
        value: '保单生效后极短期出险（<10天）',
        label: '保单生效后极短期出险（<10天）',
      },
      {
        value: '保单生效后极短期出险（<30天）',
        label: '保单生效后极短期出险（<30天）',
      },
      {
        value: '疾病观察期后极短期出险（<10天）',
        label: '疾病观察期后极短期出险（<10天）',
      }],
    },
    {
      value: '短期出险',
      label: '短期出险',
      children: [{
        value: '疾病观察期后极短期出险（<30天）',
        label: '疾病观察期后极短期出险（<30天）',
      }],
    },
    {
      value: '未如实告知',
      label: '未如实告知',
      children: [{
        value: '投保前XXX疾病未如实告知，此次因相关疾病就诊',
        label: '投保前XXX疾病未如实告知，此次因相关疾病就诊',
      }, {
        value: '投保前XXX疾病未如实告知，此次因不相关疾病就诊',
        label: '投保前XXX疾病未如实告知，此次因不相关疾病就诊',
      }],
    },
    {
      value: '投保前疾病',
      label: '投保前疾病',
      children: [{
        value: '投保前即患有XXX疾病，此次因相关疾病就诊',
        label: '投保前即患有XXX疾病，此次因相关疾病就诊',
      }, {
        value: '投保前即患有XXX疾病，此次因不相关疾病就诊',
        label: '投保前即患有XXX疾病，此次因不相关疾病就诊',
      }, {
        value: '投保前即有XXX疾病症状，此次因相关疾病就诊',
        label: '投保前即有XXX疾病症状，此次因相关疾病就诊',
      }, {
        value: '投保前即有XXX疾病症状，此次因不相关疾病就诊',
        label: '投保前即有XXX疾病症状，此次因不相关疾病就诊',
      }],
    },
    {
      value: '修改病史',
      label: '修改病史',
      children: [{
        value: '修改入院病史中“现病史”，修改时间在出院后',
        label: '修改入院病史中“现病史”，修改时间在出院后',
      }, {
        value: '修改入院病史“现病史”，修改时间在住院途中',
        label: '修改入院病史“现病史”，修改时间在住院途中',
      }, {
        value: '修改入院病史中“既往史”，修改时间在出院后',
        label: '修改入院病史中“既往史”，修改时间在出院后',
      }, {
        value: '修改入院病史“既往史”，修改时间在住院途中',
        label: '修改入院病史“既往史”，修改时间在住院途中',
      }],
    },
    {
      value: '其他',
      label: '其他',
    },
    ],
  }, {
    value: '其他',
    label: '其他',
    children: [{
      value: '其他',
      label: '其他',
    }],
  }];

  const muban = (value, i) => {
    setFieldsValue({ [`description-${i}`]: value[2] });
  };

  const RiskFormItem = () => {
    const tem = [];
    for (let i = 0; i < riskNumber; i += 1) {
      tem.push(
        <div key={i}>
          <FormItem {...formItemLayout} label="风险模板">
            {getFieldDecorator(`riskDimension-${i}`, {
              initialValue: item.riskDimension ?
                [item.riskDimension ? item.riskDimension.split('||')[i] : '', item.suggestion ? item.suggestion.split('||')[i] : '', item.des ? item.des.split('||')[i] : '']
                : [],
              rules: [{ required: true, message: '必须选择风险场景' }],
            })(
              <Cascader options={options} onChange={value => muban(value, i)} placeholder="请选择 风险维度 风险场景" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="风险等级">
            {getFieldDecorator(`riskLevel-${i}`, {
              initialValue: item.riskLevel ? item.riskLevel.split('||')[i] : '低',
            })(
              <RadioGroup>
                <RadioButton value="高">高</RadioButton>
                <RadioButton value="中">中</RadioButton>
                <RadioButton value="低">低</RadioButton>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="风险说明">
            {getFieldDecorator(`description-${i}`, {
              initialValue: item.description ? item.description.split('||')[i] : '',
            })(
              <Input.TextArea rows={4} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="风险金额">
            {getFieldDecorator(`riskAmout-${i}`, {
              initialValue: item.riskAmout ? item.riskAmout.split('||')[i] : 0,
              rules: [{ pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?|0$/, message: '请填写有效的金额(最多两位小数)' }],
            })(
              <Input addonAfter="元" />
            )}
          </FormItem>
          <div className={styles.divider} />
        </div>
      );
    }
    return tem;
  };
  return (
    <Modal
      {...modalOpts}
      width={800}
      footer={[
        <Button key="back" size="large" onClick={onCancel}>取消</Button>,
        <Button key="delete" size="large" onClick={() => handleOk(true, true)}>
          无风险
        </Button>,
        <Button key="submit" type="primary" size="large" onClick={() => handleOk(false)}>
          保存
        </Button>,
        <Button key="submit2" type="primary" size="large" onClick={() => handleOk(true)}>
          保存并发布
        </Button>,
      ]}
    >
      <Alert
        message={`赔案号:${item.claimId}`}
        type="info"
        style={{ marginBottom: 15 }}
      />
      <Form key={item.claimId}>
        <FormItem {...formItemLayout} label="被保人">
          {getFieldDecorator('para1', {
            initialValue: item.para1,
          })(
            <Input />
          )}
        </FormItem>
        {RiskFormItem()}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={onAdd} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加一个风险提示
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(modal);

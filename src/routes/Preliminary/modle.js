/**
 * Created by liwenjie on 2017/11/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Radio, Alert, Slider, Checkbox } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const values = getFieldsValue();
      const data = {
        ...item,
        ...values,
        riskDimension: values.riskDimension.join(','),
      };
      onOk(data);
    });
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  const options = [
    { label: '索赔行为', value: '索赔行为' },
    { label: '医疗行为', value: '医疗行为' },
    { label: '疾病诊断', value: '疾病诊断' },
    { label: '药品项目', value: '药品项目' },
    { label: '诊疗项目', value: '诊疗项目' },
  ];
  return (
    <Modal {...modalOpts} width={800}>
      <Alert message={`赔案号:${item.claimId}`} type="info" style={{ marginBottom: 15 }} />
      <Form>
        <FormItem {...formItemLayout} label="被保人">
          {getFieldDecorator('para1', {
            initialValue: item.para1,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="风险维度">
          {getFieldDecorator('riskDimension', {
            initialValue: item.riskDimension ? item.riskDimension.split(',') : [],
          })(
            <Checkbox.Group options={options} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="风险等级">
          {getFieldDecorator('riskLevel', {
            initialValue: item.riskLevel,
          })(
            <RadioGroup onChange={(e) => {
              let tmp = 0;
              switch (e.target.value) {
                case '高':
                  tmp = 0.8;
                  break;
                case '中':
                  tmp = 0.5;
                  break;
                case '低':
                  tmp = 0.2;
                  break;
                default:
                  break;
              }
                setFieldsValue({ riskScore: tmp });
              }}
            >
              <RadioButton value="高">高</RadioButton>
              <RadioButton value="中">中</RadioButton>
              <RadioButton value="低">低</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="风险评分">
          {getFieldDecorator('riskScore', {
            initialValue: +item.riskScore || 0,
          })(
            <Slider min={0} max={1} step={0.01} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="风险场景">
          {getFieldDecorator('suggestion', {
            initialValue: item.suggestion,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="风险说明">
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(
            <Input.TextArea rows={4} />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(modal);

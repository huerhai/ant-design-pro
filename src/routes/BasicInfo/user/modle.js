/**
 * Created by liwenjie on 2017/11/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Radio } from 'antd';

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
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
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
    wrapperCol: { span: 15 },
  };
  return (
    <Modal {...modalOpts} width={800}>
      <Form>
        <FormItem {...formItemLayout} label="帐号">
          {getFieldDecorator('帐号', {
            initialValue: item.帐号,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('姓名', {
            initialValue: item.姓名,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="公司属性">
          {getFieldDecorator('公司属性', {
            initialValue: item.公司属性,
          })(
            <RadioGroup>
              <RadioButton value="属性1">属性1</RadioButton>
              <RadioButton value="属性2">属性2</RadioButton>
              <RadioButton value="属性3">属性3</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属公司">
          {getFieldDecorator('所属公司', {
            initialValue: item.所属公司,
          })(
            <RadioGroup>
              <RadioButton value="公司1">公司1</RadioButton>
              <RadioButton value="公司2">公司2</RadioButton>
              <RadioButton value="公司3">公司3</RadioButton>
            </RadioGroup>
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

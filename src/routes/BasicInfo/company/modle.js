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
        <FormItem {...formItemLayout} label="编号">
          {getFieldDecorator('编号', {
            initialValue: item.编号,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="公司名">
          {getFieldDecorator('公司名', {
            initialValue: item.公司名,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="标示">
          {getFieldDecorator('标示', {
            initialValue: item.标示,
          })(
            <RadioGroup>
              <RadioButton value="分公司">分公司</RadioButton>
              <RadioButton value="中支公司">中支公司</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('联系人', {
            initialValue: item.联系人,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系电话">
          {getFieldDecorator('联系电话', {
            initialValue: item.联系电话,
          })(
            <Input />
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

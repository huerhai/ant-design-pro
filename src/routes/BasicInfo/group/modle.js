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
        <FormItem {...formItemLayout} label="团体编号">
          {getFieldDecorator('团体编号', {
            initialValue: item.团体编号,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="团体名称">
          {getFieldDecorator('团体名称', {
            initialValue: item.团体名称,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="产品名称">
          {getFieldDecorator('产品名称', {
            initialValue: item.产品名称,
          })(
            <Input />
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
        <FormItem {...formItemLayout} label="理赔时效">
          {getFieldDecorator('理赔时效', {
            initialValue: item.理赔时效,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所属保险公司">
          {getFieldDecorator('所属保险公司', {
            initialValue: item.所属保险公司,
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

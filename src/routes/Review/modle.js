/* eslint-disable no-unused-vars */
/**
 * Created by liwenjie on 2017/11/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Radio, Alert, Button, Icon, Cascader } from 'antd';
import EditTable from './zeren';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

const modal = ({
  item = {},
  onOk,
  onCancel,
  onChange,
  ...modalProps
}) => {
  const modalOpts = {
    ...modalProps,
    onCancel,
  };

  return (
    <Modal
      {...modalOpts}
      width="80%"
      footer={[
        <Button key="back" size="large" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={onOk}>
          保存
        </Button>,
      ]}
    >
      <Alert
        message={`赔案号:${item.claimId}`}
        type="info"
        style={{ marginBottom: 15 }}
      />
      <EditTable
        item={item}
        onChange={(dutyList) => {
          onChange(Object.assign(item, { dutyList }));
        }}
      />
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(modal);

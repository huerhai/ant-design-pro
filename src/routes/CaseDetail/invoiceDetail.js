/**
 * Created by liwenjie on 2017/12/7.
 */

/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Alert, Button, Table, Divider, Icon } from 'antd';


const FormItem = Form.Item;

const modal = ({
  item = {},
  onOk,
  list,
  onCancel,
  ...modalProps
}) => {
  const modalOpts = {
    ...modalProps,
    onCancel,
  };

  const columns = [
    {
      title: '账单名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '费用名称',
      dataIndex: 'itemSubName',
      key: 'itemSubName',
    },
    {
      title: '单价(元)',
      dataIndex: 'itemUnitPay',
      key: 'itemUnitPay',
      sorter: (a, b) => (+a) - (+b),
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? (+text).toFixed(2) : '-'}</div>;
      },
    },
    {
      title: '数量',
      dataIndex: 'itemCnt',
      key: 'itemCnt',
      sorter: (a, b) => +a - +b,
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? +text : '-'}</div>;
      },
    },
    {
      title: '金额(元)',
      dataIndex: 'itemPay',
      key: 'itemPay',
      sorter: (a, b) => +a - +b,
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? (+text).toFixed(2) : '-'}</div>;
      },
    },
    {
      title: '自付比例(%)',
      dataIndex: 'selfPayRate',
      key: 'selfPayRate',
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? +text * 100 : '-'}</div>;
      },
    },
    {
      title: '分类自负',
      dataIndex: 'classificationPayAmt',
      key: 'classificationPayAmt',
      align: 'right',
      sorter: (a, b) => +a - +b,
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? (+text).toFixed(2) : '-'}</div>;
      },
    },
    {
      title: '自费金额(元)',
      dataIndex: 'selfPayAmt',
      key: 'selfPayAmt',
      align: 'right',
      sorter: (a, b) => +a - +b,
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? (+text).toFixed(2) : '-'}</div>;
      },
    },
    {
      title: '医保给付(元)',
      dataIndex: 'medicalPayAmt',
      key: 'medicalPayAmt',
      align: 'right',
      sorter: (a, b) => +a - +b,
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? (+text).toFixed(2) : '-'}</div>;
      },
    },
    {
      title: '第三方支付(元)',
      dataIndex: 'thirdPayAmt',
      key: 'thirdPayAmt',
      align: 'right',
      sorter: (a, b) => +a - +b,
      render: (text) => {
        return <div style={{ textAlign: 'right' }}>{text ? (+text).toFixed(2) : '-'}</div>;
      },
    },
    {
      title: '是否剔除',
      dataIndex: 'rejectFlag',
      key: 'rejectFlag',
      render: (rejectFlag) => {
        return rejectFlag ? '是' : '否';
      },
    },
    {
      title: '剔除原因',
      dataIndex: 'rejectReason',
      key: 'rejectReason',
    },
  ];

  const pagination = {
    defaultPageSize: 15,
    pageSizeOptions: ['15', '50', '1000'],
    showSizeChanger: true,
    showTotal: (total) => {
      return `共计${total}条数据`;
    },
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
        message={`赔案号:${item.claimId} | 收据号:${list.billSno} | 总金额:${list.billAmt}元 | 分类自负:${list.classificationPayAmt}元  | 自费支付:${list.selfPayAmt}元  | 统筹支付:${list.overallPayAmt}元  | 附加支付:${list.accountPayAmt}元 | 第三方支付:${list.thirdPayAmt} | 现金支付:${list.cashPayAmt} | 医保账户支付:${list.attachPayAmt}`}
        type="info"
        style={{ marginBottom: 15 }}
      />
      <Table
        columns={columns}
        dataSource={list.list}
        rowKey="itemDataId"
        pagination={pagination}
        size="small"
      />
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(modal);

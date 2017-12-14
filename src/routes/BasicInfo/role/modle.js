/**
 * Created by liwenjie on 2017/11/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Radio, Checkbox } from 'antd';
import './Roleboard.less';

const CheckboxGroup = Checkbox.Group;
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
    labelCol: { span: 6 },
    wrapperCol: { offset: 0, span: 14 },

  };
  const formItemLayout2 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
  };

  const companyOptions = [
    { label: 'TPA', value: 'tpa' },
    { label: '栈略', value: 'zhanlve' },
  ];

  const systemOptions = [
    { label: '公司管理', value: 'comp' },
    { label: '角色管理', value: 'role' },
    { label: '用户管理', value: 'user' },
  ];

  const basicOptions = [
    { label: '保险公司管理', value: 'comp' },
    { label: '险种管理', value: 'type' },
    { label: '产品管理', value: 'prod' },
    { label: '团体管理', value: 'group' },
    { label: '保单管理', value: 'audit' },
  ];

  const auditOptions = [
    { label: '案件扫描', value: 'scan' },
    { label: '案件预审', value: 'pre' },
    { label: '案件录入', value: 'inse' },
    { label: '案件质审', value: 'qual' },
    { label: '案件审核', value: 'revi' },
    { label: '所有案件', value: 'all' },
  ];

  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <Modal {...modalOpts} width={800}>
      <Form>
        <div style={{ width: 400 }}>
          <FormItem {...formItemLayout2} label="角色名称">
            {getFieldDecorator('角色名称', {
              initialValue: item.角色名称,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="公司属性">
            {getFieldDecorator('公司属性', {
              initialValue: item.公司属性,
            })(
              <CheckboxGroup options={companyOptions} onChange={(e) => { this.props.handleChange(item, '公司属性', e.target.value); }} />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="备注">
            {getFieldDecorator('备注', {
              initialValue: item.备注,
            })(
              <Input />
            )}
          </FormItem>
        </div>
        <div style={{overflow: 'auto' }}>
          <span>菜单编辑</span>
          <div style={{ height: '1px', borderTop: '1px solid #ddd', textAlign: 'center', margin: '10px 0px' }} />
          <div className="left-part" style={{ width: '40%', float: 'left', marginTop: '10px' }}>
            <FormItem {...formItemLayout} label="系统设置: ">
              {getFieldDecorator('系统设置', {
                initialValue: item.系统设置,
              })(
                <CheckboxGroup options={systemOptions} onChange={onChange} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="基础信息:" >
              {getFieldDecorator('基础信息', {
                initialValue: item.基础信息,
              })(
                <CheckboxGroup options={basicOptions} onChange={onChange} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="赔案管理: ">
              {getFieldDecorator('赔案管理', {
                initialValue: item.赔案管理,
              })(
                <CheckboxGroup options={auditOptions} onChange={onChange} />
              )}
            </FormItem>
          </div>
          <div className="right-part" style={{ width: '60%', float: 'left', marginTop: '10px' }}>
            <table>
              <tbody>
                <tr>
                  <td>名称</td>
                  <td>权限</td>
                  <td><Checkbox onChange={onChange}>增</Checkbox></td>
                  <td><Checkbox onChange={onChange}>改</Checkbox></td>
                  <td><Checkbox onChange={onChange}>删</Checkbox></td>
                  <td><Checkbox onChange={onChange}>审</Checkbox></td>
                  <td>操作</td>
                </tr>
                <tr>
                  <td>公司管理</td>
                  <td><Checkbox onChange={onChange}>查</Checkbox></td>
                  <td><Checkbox onChange={onChange}>增</Checkbox></td>
                  <td><Checkbox onChange={onChange}>改</Checkbox></td>
                  <td><Checkbox onChange={onChange}>删</Checkbox></td>
                  <td><Checkbox onChange={onChange}>审</Checkbox></td>
                  <td><span>删除</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
};

export default Form.create()(modal);

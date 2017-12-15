import React, { Component } from 'react';
import { Form, Input, Modal, Checkbox, Select } from 'antd';
import './Userboard.less';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

const formItemLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
    };
  }

  render() {
    const { item } = this.state;
    return (
      <Modal
        title={this.props.title}
        width={800}
        handleChange={this.props.handleChange}
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
      >
        <Form>
          <div style={{ overflow: 'auto' }}>
            <div className="left-part" style={{ width: '45%', float: 'left', marginTop: '10px', marginRight: '5%' }}>
              <span>用户编辑</span>
              <div style={{ height: '1px', borderTop: '1px solid #ddd', textAlign: 'center', margin: '10px 0px' }} />
              <FormItem {...formItemLayout2} label="账号">
                <Input defaultValue={item.账号} onChange={(e) => { this.onChange('账号', e.target.value); }} />
              </FormItem>
              <FormItem {...formItemLayout2} label="密码">
                <Input defaultValue={item.密码} onChange={(e) => { this.onChange('密码', e.target.value); }} />
              </FormItem>
              <FormItem {...formItemLayout2} label="姓名">
                <Input defaultValue={item.姓名} onChange={(e) => { this.onChange('姓名', e.target.value); }} />
              </FormItem>
              <FormItem>
                <span style={{ color: 'rgba(0, 0, 0, 0.85)', margin: '0px 10px 0px 25px' }}>所属公司:</span>
                <Select defaultValue="tpa" style={{ width: 200 }} label="所属公司" onChange={(e) => { this.onChange('所属公司', e.target.value); }}>
                  <Option value="tpa">TPA</Option>
                  <Option value="leapstack">栈略数据</Option>
                </Select>
              </FormItem>
            </div>
            <div className="right-part" style={{ width: '45%', float: 'left', marginTop: '10px' }}>
              <span>角色编辑</span>
              <div style={{ height: '1px', borderTop: '1px solid #ddd', textAlign: 'center', margin: '10px 0px' }} />
              <FormItem {...formItemLayout}>
                <CheckboxGroup
                  defaultValue={item.角色编辑}
                  options={['录入员', '录入主管', '扫描员']}
                  onChange={(value) => { this.onChange('角色编辑', value); }}
                />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

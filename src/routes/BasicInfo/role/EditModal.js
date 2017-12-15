import React, { Component } from 'react';
import { Form, Input, Modal, Checkbox } from 'antd';
import './Roleboard.less';

const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;

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

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      opts: {},
      funcs: {},
    };
  }

  onChange(name, checkedValues) {
    // const target = checkedValues[checkedValues.length - 1];
    // let { item } = this.state;
    let { opts, item } = this.state;
    const ops = ['系统设置', '基础信息', '赔案管理'];
    const info = [systemOptions, basicOptions, auditOptions];
    const options = info[ops.indexOf(name)];
    opts[name] = [];
    for (let i = 0; i < options.length; i += 1) {
      if (checkedValues.indexOf(options[i].value) >= 0) {
        if (opts[name].indexOf(options[i]) >= 0) ;
        else {
          opts[name].push(options[i]);
        }
      }
    }
    this.setState({ opts });
  }

  removeOpts(name, value) {
    let { opts, funcs } = this.state;
    for (let i = 0; i < opts[name].length; i += 1) {
      if (opts[name][i].label === value) {
        opts[name].splice(i, 1);
        delete funcs[value];
      }
    }
    this.setState({ opts, funcs });
  }

  componentWillRescieveProps(nextProps) {
    this.setState({ item: nextProps.item });
  }

  generateSelects() {
    let children = [];
    const ops = ['系统设置', '基础信息', '赔案管理'];
    ops.map((name) => {
      if (this.state.opts[name] !== undefined) {
        return this.state.opts[name].map((data) => {
          return children.push(
            <tr>
              <td>{data.label}</td>
              <td>
                <Checkbox
                  onChange={(e) => { this.editing(data.label, e.target.checked, 0); }}
                >
                  查
                </Checkbox>
              </td>
              <td>
                <Checkbox
                  onChange={(e) => { this.editing(data.label, e.target.checked, 1); }}
                >
                  增
                </Checkbox>
              </td>
              <td>
                <Checkbox
                  onChange={(e) => { this.editing(data.label, e.target.checked, 2); }}
                >
                  改
                </Checkbox>
              </td>
              <td>
                <Checkbox
                  onChange={(e) => { this.editing(data.label, e.target.checked, 3); }}
                >
                  删
                </Checkbox>
              </td>
              <td>
                <Checkbox
                  onChange={(e) => { this.editing(data.label, e.target.checked, 4); }}
                >
                  审
                </Checkbox>
              </td>
              {/* <td className="del-btn"><span onClick={() => { this.removeOpts(name, data.label); }}>删除</span></td> */}
            </tr>
          );
        });
      }
    });
    return children;
  }

  editing(label, value, index) {
    let { funcs } = this.state;
    if (!funcs[label]) {
      funcs[label] = [];
    }
    funcs[label][index] = value;
    this.setState({ funcs });
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
          <div style={{ width: 400 }}>
            <FormItem {...formItemLayout2} label="角色名称">
              <Input defaultValue={item.角色名称} onChange={(e) => { this.onChange('角色名称', e.target.value); }} />
            </FormItem>
            <FormItem {...formItemLayout2} label="公司属性">
              <CheckboxGroup defaultValue={item.公司属性} options={companyOptions} onChange={(value) => { this.onChange('公司属性', value); }} />
            </FormItem>
            <FormItem {...formItemLayout2} label="备注">
              <Input defaultValue={item.备注} onChange={(e) => { this.onChange('备注', e.target.value); }} />
            </FormItem>
          </div>
          <div style={{ overflow: 'auto' }}>
            <span>菜单编辑</span>
            <div style={{ height: '1px', borderTop: '1px solid #ddd', textAlign: 'center', margin: '10px 0px' }} />
            <div className="left-part" style={{ width: '40%', float: 'left', marginTop: '10px' }}>
              <FormItem {...formItemLayout} label="系统设置: ">
                <CheckboxGroup
                  defaultValue={item.系统设置}
                  options={systemOptions}
                  onChange={(value) => { this.onChange('系统设置', value); }}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="基础信息:" >
                <CheckboxGroup
                  defaultValue={item.基础信息}
                  options={basicOptions}
                  onChange={(value) => { this.onChange('基础信息', value); }}
                />
              </FormItem>
              <FormItem {...formItemLayout} label="赔案管理: ">
                <CheckboxGroup
                  defaultValue={item.赔案管理}
                  options={auditOptions}
                  onChange={(value) => { this.onChange('赔案管理', value); }}
                />
              </FormItem>
            </div>
            <div className="right-part" style={{ width: '60%', float: 'left', marginTop: '10px' }}>
              <table>
                <tbody>
                  <tr>
                    <td>名称</td>
                    <td>权限</td>
                    <td><Checkbox>增</Checkbox></td>
                    <td><Checkbox>改</Checkbox></td>
                    <td><Checkbox>删</Checkbox></td>
                    <td><Checkbox>审</Checkbox></td>
                    {/* <td>操作</td> */}
                  </tr>
                  {this.generateSelects()}
                </tbody>
              </table>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

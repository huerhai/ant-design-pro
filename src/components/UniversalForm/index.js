/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Select, Radio, DatePicker, Cascader, InputNumber, Tabs, Icon, Button, Dropdown, Menu, message } from 'antd';
import UniversalInput from '../UniversalInput';

const FormItem = Form.Item;

@Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  // mapPropsToFields(props) {
  //   return {
  //     username: {
  //       ...props.username,
  //       value: props.username.value,
  //     },
  //   };
  // },
  onValuesChange(_, values) {
    console.log(values);
  },
})
export default class UniversalForm extends PureComponent {
  getInputForm(data) {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const children = [];
    let arr = Object.keys(data.properties);
    if (this.props.filter) {
      arr = arr.filter((key) => {
        if (data.properties[key].filter) {
          return this.props.filter.indexOf(data.properties[key].filter);
        }
        return true;
      });
    }
    arr.sort((a, b) => data.properties[a].order - data.properties[b].order)
      .forEach((key) => {
        const item = data.properties[key];
        children.push(
          <Col span={8} key={key}>
            <FormItem {...formItemLayout} label={item.title}>
              {getFieldDecorator(key, {
                initialValue: item.defaultValue,
                rules: item.rules,
              })(
                <UniversalInput schema={item} />
              )}
            </FormItem>
          </Col>
        );
      });
    return <Form><Row gutter={40}>{children}</Row></Form>;
  }
  render() {
    return (
      this.getInputForm(this.props.schema)
    );
  }
}

/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Input, Select, Radio, DatePicker, Cascader, InputNumber, Tabs, Icon, Button, Dropdown, Menu, message } from 'antd';

import city from './city';

const RadioGroup = Radio.Group;

export default class UniversalClaim extends PureComponent {
  render() {
    const { schema, ...otherProp } = this.props;
    switch (schema.type) {
      case 'string':
      case 'dateString':
        return <Input {...otherProp} />;
      case 'bool':
        return (
          <RadioGroup {...otherProp} >
            <Radio value>是</Radio>
            <Radio value={false}>不是</Radio>
          </RadioGroup>);
      case 'date':
        return (<DatePicker {...otherProp} />);
      case 'radioBtn':
        return (
          <Radio.Group {...otherProp}>
            {schema.enum.map((item) => {
              return <Radio.Button value={item.value} key={item.value}>{item.label}</Radio.Button>;
            })}
          </Radio.Group>);
      case 'select':
        return (
          <Select {...otherProp}>
            {schema.enum.map((item) => {
              return (
                <Select.Option
                  value={item.value}
                  key={item.value}
                >
                  {item.label}
                </Select.Option>
                );
            })}
          </Select>);
      case 'selectTag':
        return (
          <Select mode="tags" tokenSeparators={[',']} {...otherProp}>
            {schema.enum.map((item) => {
              return (
                <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              );
            })}
          </Select>);
      case 'multipleSelect':
        return (
          <Select mode="multiple" {...otherProp}>
            {schema.enum.map((item) => {
              return (
                <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              );
            })}
          </Select>);
      case 'city':
        return (
          <Cascader
            showSearch
            changeOnSelect
            {...otherProp}
            options={city}
            placeholder="支持搜索"
          />);
      case 'number':
        return (
          <div>
            <InputNumber min={0} max={999999} {...otherProp} />
            <span>{schema.unit}</span>
          </div>);
      case 'money':
        return (
          <InputNumber
            {...otherProp}
            style={{ width: '100%' }}
            min={0}
            max={9999999}
            formatter={value => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />);
      default:
        return <Input />;
    }
  }
}

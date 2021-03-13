import {
  CheckOutlined,
  ClockCircleTwoTone,
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  DatePicker,
  TimePicker,
  Switch,
  Space,
  Select,
} from 'antd';
import moment from 'moment';
import * as React from 'react';
import type { DeviceModelState, Dispatch } from 'umi';
import { connect } from 'umi';
import FilterDate from './FilterDate';

type DrawerUpdateMultipleDeviceProps = {
  dispatch: Dispatch;
  deviceStore: DeviceModelState;
};

class DrawerUpdateMultipleDevice extends React.Component<DrawerUpdateMultipleDeviceProps> {
  state = {
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
    inputVisible: false,
    inputValue: '',
    description: '',
    rangeDate: [],
  };
  forMap = (time: any, index: any) => {
    return (
      time === '1' && (
        <Input
          key={Math.random() + 100}
          prefix={<ClockCircleTwoTone className="site-form-item-icon" />}
          readOnly
          style={{
            fontWeight: 'bolder',
            width: 200,
          }}
          size={'small'}
          suffix={
            <Button
              onClick={() => {
                this.handleRemoveDateFilter(index.toString());
              }}
            >
              <CloseOutlined />
            </Button>
          }
          value={`${index} h - ${index + 1} h`}
        />
      )
    );
  };

  handleRemoveDateFilter = (index: any) => {
    const { isUpdateMultiple, updateDevicesState, selectedDevice } = this.props.deviceStore;
    const listTimeFilter = isUpdateMultiple
      ? updateDevicesState.timeFilter
      : selectedDevice.timeFilter;

    if (isUpdateMultiple) {
      this.props.dispatch({
        type: 'deviceStore/setUpdateDevicesState',
        payload: {
          ...updateDevicesState,
          timeFilter: listTimeFilter?.map((time, i) => {
            if (i.toString() === index) {
              return '0';
            }
            return time;
          }),
        },
      });
    } else {
      this.props.dispatch({
        type: 'deviceStore/setCurrentDevice',
        payload: {
          ...selectedDevice,
          timeFilter: listTimeFilter?.map((time, i) => {
            if (i.toString() === index) {
              return 0;
            }
            return time;
          }),
        },
      });
    }
  };

  onTimeFilterBlur = () => {
    this.setState({ inputVisible: false });
  };

  // Render function
  render() {
    const { inputVisible } = this.state;
    const {
      isUpdateMultiple,
      selectedDevice,
      updateDevicesState,
      listDeviceTypes,
    } = this.props.deviceStore;

    const timeFilter = isUpdateMultiple ? updateDevicesState.timeFilter : selectedDevice.timeFilter;
    const displayTimeFilter = timeFilter.map((time, index) => {
      return (
        time === '1' && (
          <Input
            key={Math.random() + 100}
            prefix={<UserOutlined className="site-form-item-icon" />}
            readOnly
            style={{
              fontWeight: 'bolder',
              width: 200,
            }}
            size={'small'}
            suffix={
              <Button
                onClick={() => {
                  this.handleRemoveDateFilter(index.toString());
                }}
              >
                <CloseOutlined />
              </Button>
            }
            value={`${index} h - ${index + 1} h`}
          />
        )
      );
    });

    const { RangePicker } = DatePicker;
    const { Option } = Select;

    return (
      <>
        <Row>
          <Col>
            <Space wrap={true}>{displayTimeFilter}</Space>
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col>
            {inputVisible && (
              <TimePicker.RangePicker
                onChange={(e) => {
                  if (e) {
                    if (e[0] && e[1]) {
                      const startDate = e[0].hour();
                      const endDate = e[1]?.hour();
                      if (startDate >= 0 && endDate >= 0) {
                        if (isUpdateMultiple) {
                          this.props.dispatch({
                            type: 'deviceStore/setUpdateDevicesState',
                            payload: {
                              ...updateDevicesState,
                              timeFilter: timeFilter.map((time, index) => {
                                if (index >= startDate && index < endDate) {
                                  return '1';
                                }
                                return time;
                              }),
                            },
                          });
                        } else {
                          this.props.dispatch({
                            type: 'deviceStore/setCurrentDevice',
                            payload: {
                              ...selectedDevice,
                              timeFilter: timeFilter?.map((time, index) => {
                                if (index >= startDate && index < endDate) {
                                  return '1';
                                }
                                return time;
                              }),
                            },
                          });
                        }
                      }
                    }
                  }

                  this.onTimeFilterBlur();
                }}
                format="HH"
                // onOk={(date) => {
                //   console.log(date?.[0]?.hour);
                // }}
                onBlur={this.onTimeFilterBlur}
              />
            )}
            {!inputVisible && (
              <Button
                onClick={() => {
                  this.setState({ inputVisible: true });
                }}
              >
                <PlusOutlined /> New Time
              </Button>
            )}
          </Col>
        </Row>
        <Divider></Divider>
        <FilterDate {...this.props}></FilterDate>
        <Divider></Divider>
        {!isUpdateMultiple && (
          <Row>
            <Col flex={3}>Discription</Col>
            <Col flex={5}>
              <Input
                value={selectedDevice.description}
                onChange={(e) => {
                  this.props.dispatch({
                    type: 'deviceStore/setCurrentDevice',
                    payload: {
                      ...selectedDevice,
                      description: e.target.value,
                    },
                  });
                }}
              ></Input>
            </Col>
          </Row>
        )}
        <Divider></Divider>
        <Row>
          <Col flex={3}>Start Date - End Date</Col>
          <Col flex={5}>
            <RangePicker
              format={'YYYY/MM/DD'}
              disabledDate={(current) => {
                return current < moment().endOf('day');
              }}
              onChange={(e) => {
                if (e) {
                  if (e[0] && e[1]) {
                    const startDate = e[0].format('YYYY-MM-DD');
                    const endDate = e[1].format('YYYY-MM-DD');
                    if (isUpdateMultiple) {
                      this.props.dispatch({
                        type: 'deviceStore/setUpdateDevicesState',
                        payload: {
                          ...updateDevicesState,
                          startDate,
                          endDate,
                        },
                      });
                    } else {
                      this.props.dispatch({
                        type: 'deviceStore/setCurrentDevice',
                        payload: {
                          ...selectedDevice,
                          startDate,
                          endDate,
                        },
                      });
                    }
                  }
                }
              }}
              value={
                isUpdateMultiple
                  ? [
                      moment(moment(updateDevicesState.startDate).format('YYYY/MM/DD')),
                      moment(moment(updateDevicesState.endDate).format('YYYY/MM/DD')),
                    ]
                  : [
                      moment(moment(selectedDevice.startDate).format('YYYY/MM/DD')),
                      moment(moment(selectedDevice.endDate).format('YYYY/MM/DD')),
                    ]
              }
            />
          </Col>
        </Row>
        <Divider></Divider>
        {!isUpdateMultiple && (
          <>
            <Row>
              <Col flex={2}>Publish</Col>
              <Col flex={5}>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={selectedDevice.isPublished}
                  onChange={(value) => {
                    this.props.dispatch({
                      type: 'deviceStore/setCurrentDevice',
                      payload: {
                        ...selectedDevice,
                        isPublished: value,
                      },
                    });
                  }}
                />
              </Col>
            </Row>
            <Divider></Divider>
          </>
        )}
        <Row>
          <Col flex={2}>Type</Col>
          <Col flex={5}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a type"
              defaultValue={listDeviceTypes[0].typeName}
              optionFilterProp="children"
              onChange={(value) => {
                const { typeName } = listDeviceTypes.filter((t) => t.id === value)[0];
                if (isUpdateMultiple) {
                  this.props.dispatch({
                    type: 'deviceStore/setUpdateDevicesState',
                    payload: {
                      ...updateDevicesState,
                      currentType: typeName,
                      typeId: value,
                    },
                  });
                } else {
                  this.props.dispatch({
                    type: 'deviceStore/setCurrentDevice',
                    payload: {
                      ...selectedDevice,
                      type: {
                        id: value,
                        typeName,
                      },
                    },
                  });
                }
              }}
              value={
                isUpdateMultiple ? updateDevicesState.currentType : selectedDevice.type.typeName
              }
            >
              {listDeviceTypes.map((type) => {
                return (
                  <Option key={`${type.id}`} value={type.id}>
                    {type.typeName}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Divider></Divider>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(DrawerUpdateMultipleDevice);

import { Button, Col, Row, Space } from 'antd';
import * as React from 'react';
import type { DeviceModelState, Dispatch } from 'umi';

type FilterTimeProps = {
  dispatch: Dispatch;
  deviceStore: DeviceModelState;
};

class FilterDate extends React.Component<FilterTimeProps> {
  state = {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  render() {
    const { isUpdateMultiple, selectedDevice, updateDevicesState } = this.props.deviceStore;
    const data = isUpdateMultiple ? updateDevicesState.dateFilter : selectedDevice.dateFilter;
    return (
      <>
        <Row>
          <Col>
            <Space>
              {data?.map((d, index) => {
                return (
                  <Button
                    onClick={() => {
                      if (isUpdateMultiple) {
                        this.props.dispatch({
                          type: 'deviceStore/setUpdateDevicesState',
                          payload: {
                            ...updateDevicesState,
                            dateFilter: data.map((value, i) => {
                              const state = value === '0' ? '1' : '0';
                              if (i === index) {
                                return state;
                              }
                              return value;
                            }),
                          },
                        });
                      } else {
                        this.props.dispatch({
                          type: 'deviceStore/setCurrentDevice',
                          payload: {
                            ...selectedDevice,
                            dateFilter: data.map((value, i) => {
                              const state = value === '0' ? '1' : '0';
                              if (i === index) {
                                return state;
                              }
                              return value;
                            }),
                          },
                        });
                      }
                    }}
                    type={d === '1' ? 'primary' : 'default'}
                    key={`${Math.random() + 100}`}
                  >
                    {index === 0 && 'Monday'}
                    {index === 1 && 'Tuesday'}
                    {index === 2 && 'Wednesday'}
                    {index === 3 && 'Thursday'}
                    {index === 4 && 'Friday'}
                    {index === 5 && 'Saturday'}
                    {index === 6 && 'Sunday'}
                  </Button>
                );
              })}
            </Space>
          </Col>
        </Row>
      </>
    );
  }
}

export default FilterDate;

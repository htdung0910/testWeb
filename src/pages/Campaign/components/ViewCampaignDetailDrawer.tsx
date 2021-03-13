import { LOCATION_DISPATCHER } from '@/pages/Location';
import LeafletMapComponent from '@/pages/Location/components/LeafletMapComponent';
import { reverseGeocoding } from '@/services/MapService/LocationIQService';
import { Button, Col, DatePicker, Divider, Drawer, Input, Row, Space } from 'antd';
import L from 'leaflet';
import moment from 'moment';
import * as React from 'react';
import type { CampaignModelState, Dispatch, LocationModelState } from 'umi';
import { connect } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { CAMPAIGN } from '..';

export type ViewCampaignDetailDrawerProps = {
  dispatch: Dispatch;
  campaign: CampaignModelState;
  // deviceStore: DeviceModelState;
  // scenarios: ScenarioModelState;
  location: LocationModelState;
};

class ViewCampaignDetailDrawer extends React.Component<ViewCampaignDetailDrawerProps> {
  componentDidMount() {
    const { mapComponent } = this.props.location;

    if (mapComponent.map) {
      const { selectedCampaign } = this.props.campaign;
      if (selectedCampaign.location.split('-').length >= 2) {
        // const lat = Number.parseFloat(selectedCampaign.location.split('-')[0]);
        // const lng = Number.parseFloat(selectedCampaign.location.split('-')[1]);
        // mapComponent.map.setView([lat, lng]);
        // if (!mapComponent.marker) {
        //   if (lat && lng) {
        //     const marker = L.marker([lat, lng]);
        //     marker.addTo(mapComponent.map);
        //     this.setMapComponent({
        //       marker,
        //     });
        //   }
        // } else {
        //   mapComponent.marker.setLatLng([lat, lng]).addTo(mapComponent.map);
        // }
        // if (mapComponent.circle) {
        //   mapComponent.circle.setLatLng([lat, lng]);
        //   mapComponent.circle.setRadius(selectedCampaign.radius * 1000);
        //   mapComponent.circle.redraw();
        // } else {
        //   const circle = L.circle([lat, lng]).setRadius(selectedCampaign.radius * 1000);
        //   circle.addTo(mapComponent.map);
        //   this.setMapComponent({
        //     circle,
        //   });
        // }
      }
    }
  }

  componentDidUpdate = () => {
    const { mapComponent } = this.props.location;

    if (mapComponent.map) {
      const { selectedCampaign } = this.props.campaign;
      if (selectedCampaign.location.split('-').length === 2) {
        const lat = Number.parseFloat(selectedCampaign.location.split('-')[0]);
        const lng = Number.parseFloat(selectedCampaign.location.split('-')[1]);
        mapComponent.map.setView([lat, lng]);
        if (!mapComponent.marker) {
          if (lat && lng) {
            const marker = L.marker([lat, lng]);
            marker.addTo(mapComponent.map);
            this.setMapComponent({
              marker,
            });
          }
        } else {
          mapComponent.marker.setLatLng([lat, lng]).addTo(mapComponent.map);
        }

        if (mapComponent.circle) {
          mapComponent.circle.setLatLng([lat, lng]);
          mapComponent.circle.setRadius(selectedCampaign.radius * 1000);
          mapComponent.circle.redraw();
        } else {
          const circle = L.circle([lat, lng]).setRadius(selectedCampaign.radius * 1000);
          circle.addTo(mapComponent.map);
          this.setMapComponent({
            circle,
          });
        }
      }
    }
  };

  setMapComponent = async (payload: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setMapComponentReducer`,
      payload: {
        ...this.props.location.mapComponent,
        ...payload,
      },
    });
  };

  reverseGeocodingToAddress = async (lat: string, lng: string) => {
    const { data } = await reverseGeocoding(Number.parseFloat(lat), Number.parseFloat(lng));
    if (data) {
      return data.display_name;
    }

    return '';
  };
  setEditCampaignDrawer = async (modal: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setEditCampaignReducer`,
      payload: {
        ...this.props.campaign.editCampaignDrawer,
        ...modal,
      },
    });
  };
  render() {
    const { selectedCampaign, editCampaignDrawer } = this.props.campaign;
    const { mapComponent } = this.props.location;
    return (
      <>
        <Drawer
          title={<>Campaign Detail</>}
          width={'80%'}
          closable={false}
          afterVisibleChange={(e) => {
            if (!e) {
              if (mapComponent.map) {
                if (mapComponent.marker) {
                  mapComponent.marker.remove();
                  this.setMapComponent({
                    marker: undefined,
                  });
                }
                if (mapComponent.circle) {
                  mapComponent.circle.remove();
                  this.setMapComponent({
                    circle: undefined,
                  });
                }
              }
            }
          }}
          onClose={() => {
            this.setEditCampaignDrawer({
              visible: false,
            });
          }}
          visible={editCampaignDrawer.visible}
          destroyOnClose={true}
          forceRender={true}
          getContainer={false}
        >
          <Row>
            <Col span={10}>Budget</Col>
            <Col span={14}>
              <Input readOnly value={selectedCampaign.budget} />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Max Bid</Col>
            <Col span={14}>
              <Input readOnly value={selectedCampaign.maxBid} />
            </Col>
          </Row>
          <Row>
            <Col span={10}>Types</Col>
            <Col span={14}>
              {selectedCampaign.types.map((type) => {
                return type.name;
              })}
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>From - To</Col>
            <Col span={14}>
              <DatePicker.RangePicker
                disabled={true}
                value={[
                  moment(moment(selectedCampaign.startDate).format('YYYY-MM-DD')),
                  moment(moment(selectedCampaign.endDate).format('YYYY-MM-DD')),
                ]}
                inputReadOnly={true}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Time Filter</Col>
            <Col span={14}>
              <Space wrap={true}>
                {selectedCampaign.timeFilter.split('').map((time, index) => {
                  const start = index;
                  const end = index + 1 === 24 ? 0 : index + 1;
                  if (time === '1') {
                    return (
                      <Button
                        key={uuidv4()}
                        style={{ textAlign: 'center' }}
                      >{`${start}h - ${end}h`}</Button>
                    );
                  }
                  return '';
                })}
              </Space>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Date Filter</Col>
            <Col span={14}>
              <Space wrap={true}>
                {selectedCampaign.dateFilter.split('').map((date, index) => {
                  return (
                    <Button key={uuidv4()} type={date === '1' ? 'primary' : 'default'}>
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
          <Divider></Divider>
          <Row>
            <Col span={10}>Address</Col>
            <Col span={14}>{selectedCampaign.address}</Col>
          </Row>
          <Row>
            <Col span={24}>
              <LeafletMapComponent {...this.props} />
            </Col>
          </Row>
        </Drawer>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(ViewCampaignDetailDrawer);

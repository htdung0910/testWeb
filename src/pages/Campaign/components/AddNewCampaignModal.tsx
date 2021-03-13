import AutoCompleteComponent from '@/pages/common/AutoCompleteComponent';
import { LOCATION_DISPATCHER } from '@/pages/Location';
import LeafletMapComponent from '@/pages/Location/components/LeafletMapComponent';
import { forwardGeocoding } from '@/services/MapService/LocationIQService';
import {
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  List,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
} from 'antd';
import L from 'leaflet';
import moment from 'moment';
import * as React from 'react';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import type {
  CampaignModelState,
  DeviceModelState,
  Dispatch,
  LocationModelState,
  ScenarioModelState,
} from 'umi';
import { connect } from 'umi';
import { CAMPAIGN } from '..';
import FilterDate from './FilterDate';
import TimeFilterComponent from './TimeFilterComponent';

export type AddNewCampaignModalProps = {
  dispatch: Dispatch;
  campaign: CampaignModelState;
  deviceStore: DeviceModelState;
  scenarios: ScenarioModelState;
  location: LocationModelState;
};

class AddNewCampaignModal extends React.Component<AddNewCampaignModalProps> {
  datePickerRef?: React.RefObject<any> = undefined;
  /**
   *
   */
  constructor(props: AddNewCampaignModalProps) {
    super(props);
    this.datePickerRef = React.createRef();
  }

  setAddNewCampaignModal = async (modal: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setAddNewCampaignModalReducer`,
      payload: {
        ...this.props.campaign.addNewCampaignModal,
        ...modal,
      },
    });
  };

  setCreateNewCampaignParam = async (param: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setCreateCampaignParamReducer`,
      payload: {
        ...this.props.campaign.createCampaignParam,
        ...param,
      },
    });
  };

  clearCreateNewCampaignParam = async () => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/clearCreateCampaignParamReducer`,
    });
  };

  callGetListScenario = async (param?: any) => {
    this.props.dispatch({
      type: 'scenarios/getListScenarios',
      payload: {
        ...this.props.scenarios.getListScenarioParam,
        ...param,
      },
    });
  };

  setTableLoading = async (loading: boolean) => {
    await this.props.dispatch({
      type: 'scenarios/setTableLoadingReducer',
      payload: loading,
    });
  };

  setGetListScenarioParam = async (modal: any) => {
    await this.props.dispatch({
      type: 'scenarios/setGetListScenarioParamReducer',
      payload: {
        ...this.props.scenarios.getListScenarioParam,
        ...modal,
      },
    });
  };

  selectScenario = async (id: string) => {
    await this.props.dispatch({
      type: `scenarios/setListScenarioReducer`,
      payload: this.props.scenarios.listScenario.map((scenario) => {
        if (scenario.id === id) {
          return {
            ...scenario,
            isSelected: true,
          };
        }

        return {
          ...scenario,
          isSelected: false,
        };
      }),
    });
  };

  setListLocations = async (payload: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setListLocationsReducer`,
      payload,
    });
  };

  selectLocation = async (id: string) => {
    const { listLocations } = this.props.location;

    const newList = listLocations.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isSelected: true,
        };
      }

      return {
        ...item,
        isSelected: false,
      };
    });
    await this.setListLocations(newList);
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

  createNewCampaign = async () => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/createCampaign`,
      payload: this.props.campaign.createCampaignParam,
    });
  };
  callGetListCampaigns = async (param?: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/getListCampaigns`,
      payload: {
        ...this.props.campaign.getListCampaignParam,
        ...param,
      },
    });
  };
  okConfirm = async () => {
    this.setAddNewCampaignModal({
      isLoading: true,
    })
      .then(() => {
        this.createNewCampaign().then(() => {
          this.callGetListCampaigns().then(() => {
            this.setAddNewCampaignModal({
              visible: false,
              isLoading: false,
            });
          });
        });
      })
      .catch(() => {
        this.setAddNewCampaignModal({
          visible: false,
          isLoading: false,
        });
      });
  };

  callGetListLocations = async (param?: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/getListLocation`,
      payload: {
        ...this.props.location.getListLocationParam,
        ...param,
      },
    });
  };

  setRadiusOfLocation = (radius: any) => {
    const { mapComponent } = this.props.location;

    if (mapComponent.map) {
      if (mapComponent.circle) {
        mapComponent.circle.setRadius(radius);
      } else if (mapComponent.marker) {
        const { marker } = mapComponent;
        const circle = L.circle(marker.getLatLng(), { radius }).addTo(mapComponent.map);

        this.setMapComponent({
          circle,
        });
      }
    }
  };

  handleAutoCompleteSearch = async (address: string) => {
    if (address !== '') {
      // const { createCampaignParam } = this.props.campaign;
      const { mapComponent } = this.props.location;
      // const { data } = await forwardGeocoding(address);
      const coordination = address.split('-');
      const lat = Number.parseFloat(coordination[0]);
      const lon = Number.parseFloat(coordination[1]);
      await this.setAddNewCampaignModal({
        address,
      });

      if (mapComponent.map) {
        mapComponent.map.setView([lat, lon]);

        if (mapComponent.marker) {
          mapComponent.marker.setLatLng([lat, lon]);
          L.popup().setLatLng([lat, lon]).setContent(address).openOn(mapComponent.map);
        } else {
          const marker = L.marker([lat, lon]).addTo(mapComponent.map);
          L.popup().setLatLng([lat, lon]).setContent(address).openOn(mapComponent.map);
          await this.setMapComponent({
            marker,
          });
        }
      }

      await this.setCreateNewCampaignParam({ location: `${lat}-${lon}` });
    }
  };

  listAddressGeocoding = async (address: string) => {
    const { data } = await forwardGeocoding(address);
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    return data;
  };

  resetMap = async () => {
    const { mapComponent } = this.props.location;
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
  };
  render() {
    const { addNewCampaignModal, createCampaignParam } = this.props.campaign;

    const { listDeviceTypes } = this.props.deviceStore;

    const { listScenario, getListScenarioParam, totalItem } = this.props.scenarios;

    const { mapComponent } = this.props.location;

    console.log('====================================');
    console.log(mapComponent);
    console.log('====================================');
    return (
      <>
        <Modal
          width="80%"
          title="Add New Campaign"
          visible={addNewCampaignModal.visible}
          centered
          destroyOnClose={true}
          closable={false}
          afterClose={() => {
            this.clearCreateNewCampaignParam().then(() => {
              this.resetMap();
            });
          }}
          onOk={() => {
            this.okConfirm();
          }}
          onCancel={() => {
            this.setAddNewCampaignModal({
              visible: false,
            });
          }}
        >
          <Skeleton active loading={addNewCampaignModal.isLoading}>
            <Row>
              <Col span={10}>Time Filter</Col>
            </Row>
            <Row>
              <Col span={24}>
                <TimeFilterComponent {...this.props} />
              </Col>
            </Row>
            <Divider></Divider>
            <Row>
              <Col span={10}>Date Filter</Col>
              <Col span={14}></Col>
            </Row>
            <Space>
              <FilterDate {...this.props} />
            </Space>
            <Divider></Divider>

            <Divider></Divider>
            <Row>
              <Col span={10}>Budget</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: 200 }}
                  min={0}
                  step="0.0001"
                  value={createCampaignParam.budget}
                  onChange={(e) => {
                    this.setCreateNewCampaignParam({
                      budget: e,
                    });
                  }}
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}>Description</Col>
              <Col span={14}>
                <Input
                  value={createCampaignParam.description}
                  onChange={(e) => {
                    this.setCreateNewCampaignParam({
                      description: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}>Max Bid</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: 200 }}
                  min={0}
                  max={createCampaignParam.budget}
                  step="0.0001"
                  value={createCampaignParam.maxBid}
                  onChange={(e) => {
                    this.setCreateNewCampaignParam({
                      maxBid: e,
                    });
                  }}
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}>Start-End</Col>
              <Col span={14}>
                <DatePicker.RangePicker
                  ref={this.datePickerRef}
                  format={'YYYY/MM/DD'}
                  disabledDate={(current) => {
                    return current < moment().endOf('day');
                  }}
                  value={[
                    moment(moment(createCampaignParam.startDate).format('YYYY/MM/DD')),
                    moment(moment(createCampaignParam.endDate).format('YYYY/MM/DD')),
                  ]}
                  onChange={(e) => {
                    if (e) {
                      if (e[0] && e[1]) {
                        const startDate = e[0].format('YYYY-MM-DD');
                        const endDate = e[1].format('YYYY-MM-DD');
                        this.setCreateNewCampaignParam({
                          startDate,
                          endDate,
                        });
                        if (this.datePickerRef) {
                          this.datePickerRef.current.blur();
                        }
                      }
                    }
                  }}
                ></DatePicker.RangePicker>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}>Type</Col>
              <Col span={14}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    this.setCreateNewCampaignParam({
                      typeIds: e,
                    });
                  }}
                  autoClearSearchValue={false}
                  defaultValue={listDeviceTypes[0]?.id}
                  showSearch
                  value={createCampaignParam.typeIds}
                >
                  {listDeviceTypes.map((type) => {
                    return (
                      <Select.Option key={type.id} value={type.id}>
                        {type.typeName}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}>Radius</Col>
              <Col span={14}>
                <InputNumber
                  style={{ width: 200 }}
                  min={0}
                  value={createCampaignParam.radius}
                  onChange={async (e) => {
                    if (e) {
                      this.setCreateNewCampaignParam({
                        radius: e,
                      }).then(() => {
                        this.setRadiusOfLocation(Number.parseFloat(e.toString()) * 1000);
                      });
                    }
                  }}
                />
              </Col>
            </Row>
            <Divider />
            <Row style={{ textAlign: 'center' }}>
              <Col span={24}>Choose Scenario</Col>
            </Row>
            <List
              bordered
              dataSource={listScenario}
              pagination={{
                current: getListScenarioParam.pageNumber + 1,
                total: totalItem,
                onChange: (e) => {
                  this.callGetListScenario({
                    pageNumber: e - 1,
                  });
                },
              }}
              renderItem={(item) => (
                <List.Item
                  style={item.isSelected ? { backgroundColor: '#b3def5', transition: 'ease' } : {}}
                  onClick={async () => {
                    this.setCreateNewCampaignParam({
                      scenarioId: item.id,
                    }).then(() => {
                      this.selectScenario(item.id);
                    });
                  }}
                >
                  <List.Item.Meta title={item.title} description={item.description} />
                </List.Item>
              )}
            ></List>
            <Row style={{ textAlign: 'center' }}>
              <Col span={24}>Choose Location</Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <Col span={10}>Address</Col>
              <Col span={14}>
                <AutoCompleteComponent
                  {...this.props}
                  inputValue={addNewCampaignModal.address}
                  onInputChange={(e) => {
                    this.setAddNewCampaignModal({
                      address: e,
                    });
                  }}
                  handleOnSelect={(e) => {
                    this.handleAutoCompleteSearch(e);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <LeafletMapComponent {...this.props} />
              </Col>
            </Row>
          </Skeleton>
        </Modal>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewCampaignModal);

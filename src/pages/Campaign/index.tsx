import { reverseGeocoding } from '@/services/MapService/LocationIQService';
import {
  CaretRightOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  EyeTwoTone,
  PlusSquareTwoTone,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Modal, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import moment from 'moment';
import * as React from 'react';
import type {
  Campaign,
  CampaignModelState,
  DeviceModelState,
  Dispatch,
  LocationModelState,
  ScenarioModelState,
} from 'umi';
import { connect } from 'umi';
import { LOCATION_DISPATCHER } from '../Location';
import AddNewCampaignModal from './components/AddNewCampaignModal';
import ViewCampaignDetailDrawer from './components/ViewCampaignDetailDrawer';

export type CampaignScreenProps = {
  dispatch: Dispatch;
  campaign: CampaignModelState;
  deviceStore: DeviceModelState;
  scenarios: ScenarioModelState;
  location: LocationModelState;
};

export const CAMPAIGN = 'campaign';

export class CampaignScreen extends React.Component<CampaignScreenProps> {
  componentDidMount = async () => {
    // await this.setCampaignTableLoading(true);
    // await this.callGetListCampaigns();
    // await this.callGetListDeviceTypes();
    // await this.callGetListScenario();
    // await this.callGetListLocations();
    // await this.setCampaignTableLoading(false);
    this.setCampaignTableLoading(true)
      .then(() => {
        this.callGetListCampaigns().then(() => {
          this.callGetListDeviceTypes().then(() => {
            this.callGetListScenario().then(() => {
              this.callGetListLocations().then(() => {
                this.setCampaignTableLoading(false);
              });
            });
          });
        });
      })
      .catch(() => {
        this.setCampaignTableLoading(false);
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

  callGetListDeviceTypes = async () => {
    await this.props.dispatch({
      type: `deviceStore/getDeviceType`,
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

  setGetListCampaignParam = async (param: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setGetListCampaignParamReducer`,
      payload: {
        ...this.props.campaign.getListCampaignParam,
        ...param,
      },
    });
  };

  setCampaignTableLoading = async (loading: boolean) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setCampaignTableLoadingReducer`,
      payload: loading,
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

  setListScenarioWithAtLeastOneItems = async () => {
    const { listScenario } = this.props.scenarios;

    const newList = listScenario.filter((s) => s.scenarioItems.length > 0);
    console.log('====================================');
    console.log('Filter Scenarios', listScenario, newList);
    console.log('====================================');
    await this.setListScenarios(newList);
  };

  setListScenarios = async (list: any) => {
    await this.props.dispatch({
      type: `scenarios/setListScenarioReducer`,
      payload: list,
    });
  };

  setTableLoading = async (loading: boolean) => {
    await this.props.dispatch({
      type: 'scenarios/setTableLoadingReducer',
      payload: loading,
    });
  };

  setAddNewCampaignModal = async (modal: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setAddNewCampaignModalReducer`,
      payload: {
        ...this.props.campaign.addNewCampaignModal,
        ...modal,
      },
    });
  };

  deleteCampaign = async (id: string) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/deleteCampaign`,
      payload: id,
    });
  };

  deleteCampaignConfirm = async (item: Campaign) => {
    Modal.confirm({
      title: `Do you want to delete this Campaign ?`,
      icon: <ExclamationCircleOutlined />,
      closable: false,
      centered: true,
      onOk: () => {
        this.setTableLoading(true)
          .then(() => {
            this.deleteCampaign(item.id).then(() => {
              this.callGetListCampaigns().then(() => {
                this.setTableLoading(true);
              });
            });
          })
          .catch(() => {
            this.setTableLoading(false);
          });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  setSelectedCampaign = async (param: any) => {
    await this.props.dispatch({
      type: `${CAMPAIGN}/setSelectedCampaignReducer`,
      payload: {
        ...this.props.campaign.selectedCampaign,
        ...param,
      },
    });
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

  setLocationAddressInMap = async (item: any) => {
    if (item.longitude !== '' && item.latitude !== '') {
      const { mapComponent } = this.props.location;

      const lat = Number.parseFloat(item.location.split('-')[0]);
      const lng = Number.parseFloat(item.location.split('-')[1]);

      const { data } = await reverseGeocoding(lat, lng);

      this.setSelectedCampaign({
        address: data.display_name,
      }).then(() => {
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
      });
    }
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
    const { listCampaign, campaignsTableLoading } = this.props.campaign;
    return (
      <>
        <PageContainer>
          <Table
            dataSource={listCampaign}
            scroll={{
              x: 1000,
              y: 400,
            }}
            loading={campaignsTableLoading}
            title={() => (
              <>
                <Button
                  onClick={async () => {
                    this.setListScenarioWithAtLeastOneItems().then(() => {
                      this.setAddNewCampaignModal({
                        visible: true,
                      });
                    });
                  }}
                  icon={<PlusSquareTwoTone />}
                >
                  Add New Campaign
                </Button>
              </>
            )}
          >
            <Column key="location" dataIndex="location" title="Coordinator"></Column>
            <Column key="description" dataIndex="description" title="Description"></Column>
            <Column
              align="center"
              key="dateRange"
              title="From-To"
              render={(text, record: Campaign) => {
                return (
                  <>
                    {moment(record.startDate).format('YYYY/MM/DD')}
                    <CaretRightOutlined />
                    {moment(record.endDate).format('YYYY/MM/DD')}
                  </>
                );
              }}
            ></Column>
            <Column key="budget" dataIndex="budget" title="Budget"></Column>
            <Column key="maxBid" dataIndex="maxBid" title="MaxBid"></Column>
            <Column
              key="action"
              title="Action"
              fixed="right"
              width={200}
              render={(text, record: Campaign) => {
                return (
                  <>
                    <Space align={'center'}>
                      <Button
                        onClick={() => {
                          this.setSelectedCampaign(record).then(() => {
                            this.setLocationAddressInMap(record).then(() => {
                              this.setEditCampaignDrawer({
                                visible: true,
                              });
                            });
                          });
                        }}
                      >
                        <EyeTwoTone />
                      </Button>
                      <Button
                        onClick={() => {
                          this.deleteCampaignConfirm(record);
                        }}
                      >
                        <DeleteTwoTone twoToneColor="#f93e3e" />
                      </Button>
                    </Space>
                  </>
                );
              }}
            ></Column>
          </Table>
          <AddNewCampaignModal {...this.props} />
          <ViewCampaignDetailDrawer {...this.props} />
        </PageContainer>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(CampaignScreen);

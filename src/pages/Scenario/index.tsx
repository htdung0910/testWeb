import { PageContainer } from '@ant-design/pro-layout';
import { Button, Drawer, Modal, Skeleton, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import * as React from 'react';
import type {
  Dispatch,
  LayoutModelState,
  PlayListModelState,
  ScenarioItem,
  ScenarioModelState,
  UserTestModelState,
} from 'umi';
import { connect } from 'umi';
import AddNewScenarioModal from './components/AddNewScenarioModal';
import EditScenarioDrawer from './components/EditScenarioDrawer';
import SelectPlaylistDrawer from './components/SelectPlaylistDrawer';
import { v4 as uuidv4 } from 'uuid';
import type { UpdateScenarioParam } from '@/services/ScenarioService/ScenarioService';
import { cloneDeep } from 'lodash';

type ScenarioProps = {
  dispatch: Dispatch;
  scenarios: ScenarioModelState;
  userTest: UserTestModelState;
  playlists: PlayListModelState;
  layouts: LayoutModelState;
};

class Scenario extends React.Component<ScenarioProps> {
  componentDidMount = async () => {
    this.setTableLoading(true)
      .then(() => {
        this.callGetListScenario().then(() => {
          this.callGetListLayout().then(() => {
            this.setTableLoading(false);
          });
        });
      })
      .catch(() => {
        this.setTableLoading(false);
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

  callGetListLayout = async (param?: any) => {
    this.props.dispatch({
      type: 'layouts/getLayouts',
      payload: {
        ...this.props.layouts.getListLayoutParam,
        ...param,
      },
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

  setTableLoading = async (loading: boolean) => {
    await this.props.dispatch({
      type: 'scenarios/setTableLoadingReducer',
      payload: loading,
    });
  };

  setAddNewScenarioModal = async (modal: any) => {
    await this.props.dispatch({
      type: 'scenarios/setAddNewScenarioModalReducer',
      payload: {
        ...this.props.scenarios.addNewScenarioModal,
        ...modal,
      },
    });
  };

  createNewScenario = async () => {
    await this.props.dispatch({
      type: 'scenarios/createScenario',
      payload: {
        ...this.props.scenarios.createScenarioParam,
      },
    });
  };

  setSelectedScenarios = async (item: any) => {
    await this.props.dispatch({
      type: 'scenarios/setSelectedScenarioReducer',
      payload: {
        ...this.props.scenarios.selectedSenario,
        ...item,
      },
    });
  };

  setEditScenariosDrawer = async (modal: any) => {
    await this.props.dispatch({
      type: 'scenarios/setEditScenarioDrawerReducer',
      payload: {
        ...this.props.scenarios.editScenarioDrawer,
        ...modal,
      },
    });
  };

  setPlaylistDrawer = async (payload: any) => {
    await this.props.dispatch({
      type: 'scenarios/setPlaylistsDrawerReducer',
      payload: {
        ...this.props.scenarios.playlistsDrawer,
        ...payload,
      },
    });
  };

  choosePlaylist = () => {
    const { selectedSenario, selectedArea, playlistsDrawer } = this.props.scenarios;

    const selectedPlaylist = playlistsDrawer.listPlaylists.filter((item) => item.isSelected)[0];

    const selectedScenarioItem = selectedSenario.scenarioItems.filter(
      (item) => item.area.id === selectedArea.id,
    );
    if (selectedScenarioItem.length > 0) {
      this.setSelectedScenarios({
        scenarioItems: selectedSenario.scenarioItems.map((item) => {
          if (selectedScenarioItem[0].id === item.id) {
            return {
              ...item,
              playlist: selectedPlaylist,
              scenario: selectedSenario,
            };
          }

          return item;
        }),
      });
    } else {
      const newScenarioItem: ScenarioItem = {
        area: selectedArea,
        audioArea: false,
        displayOrder: 1,
        id: uuidv4(),
        isActive: true,
        playlist: selectedPlaylist,
        scenario: selectedSenario,
      };

      selectedSenario.scenarioItems.push(newScenarioItem);
      this.setSelectedScenarios({
        scenarioItems: selectedSenario.scenarioItems,
      });
    }
    this.setPlaylistDrawer({
      visible: false,
    });
  };

  updateScenario = async (updateScenarioParam: UpdateScenarioParam) => {
    await this.setEditScenariosDrawer({
      visible: false,
    });

    await this.setTableLoading(true);
    this.props
      .dispatch({
        type: 'scenarios/updateScenario',
        payload: updateScenarioParam,
      })
      .then(() => {
        this.callGetListScenario().then(() => {
          this.setTableLoading(false);
        });
      })
      .catch(() => {
        this.setTableLoading(false);
      });
  };

  removeScenario = async (id: string) => {
    await this.setEditScenariosDrawer({
      visible: false,
    });

    await this.setTableLoading(true);
    this.props
      .dispatch({
        type: 'scenarios/removeScenario',
        payload: id,
      })
      .then(() => {
        this.callGetListScenario().then(() => {
          this.setTableLoading(false);
        });
      })
      .catch(() => {
        this.setTableLoading(false);
      });
  };

  setSelectedPlaylistItems = async (modal: any) => {
    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistItemsReducer',
      payload: modal,
    });
  };

  clearSelectedPlaylistItems = async () => {
    await this.setSelectedPlaylistItems([]);
  };

  render() {
    const {
      getListScenarioParam,
      totalItem,
      listScenario,
      addNewScenarioModal,
      editScenarioDrawer,
      playlistsDrawer,
      selectedSenario,
      tableLoading,
    } = this.props.scenarios;

    return (
      <PageContainer>
        <Table
          dataSource={listScenario}
          loading={tableLoading}
          pagination={{
            current: getListScenarioParam.pageNumber + 1,
            total: totalItem,
            onChange: async (e) => {
              this.setGetListScenarioParam({
                pageNumber: e,
              }).then(() => {
                this.callGetListScenario();
              });
            },
          }}
          title={() => {
            return (
              <>
                <Button
                  onClick={() => {
                    this.setAddNewScenarioModal({
                      visible: true,
                    });
                  }}
                >
                  Add New Scenario
                </Button>
              </>
            );
          }}
          onRow={(item) => {
            return {
              onClick: async () => {
                await this.setEditScenariosDrawer({
                  visible: true,
                  isLoading: true,
                });
                const clone = cloneDeep(item);
                this.setSelectedScenarios(clone)
                  .then(() => {
                    this.setEditScenariosDrawer({
                      isLoading: false,
                    });
                  })
                  .catch(() => {
                    this.setEditScenariosDrawer({
                      isLoading: false,
                    });
                  });
              },
            };
          }}
        >
          <Column dataIndex="title" title="Title" key="title"></Column>
          <Column dataIndex="description" title="Description" key="description"></Column>
        </Table>

        {/* Add New Scenario Modal */}
        <Modal
          visible={addNewScenarioModal.visible}
          confirmLoading={addNewScenarioModal.isLoading}
          closable={false}
          destroyOnClose={true}
          onCancel={() => {
            this.setAddNewScenarioModal({
              visible: false,
            });
          }}
          onOk={async () => {
            await this.setTableLoading(true);
            await this.setAddNewScenarioModal({
              isLoading: true,
            });
            this.createNewScenario()
              .then(() => {
                this.callGetListScenario().then(() => {
                  this.setAddNewScenarioModal({
                    visible: false,
                    isLoading: false,
                  }).then(() => {
                    this.setTableLoading(false);
                  });
                });
              })
              .catch(() => {
                this.setTableLoading(false);
              });
          }}
        >
          <AddNewScenarioModal {...this.props} />
        </Modal>

        {/* Edit Scenario Drawer */}
        <Drawer
          visible={editScenarioDrawer.visible}
          destroyOnClose={true}
          getContainer={false}
          afterVisibleChange={() => {
            this.clearSelectedPlaylistItems();
          }}
          closable={false}
          footer={
            <>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button
                    danger
                    onClick={() => {
                      this.removeScenario(selectedSenario.id);
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={() => {
                      const updateParam: UpdateScenarioParam = {
                        description: selectedSenario.description,
                        id: selectedSenario.id,
                        layoutId: selectedSenario.layoutId,
                        scenarioItems: selectedSenario.scenarioItems.map((item) => {
                          return {
                            id: item.id,
                            areaId: item.area.id,
                            audioArea: item.audioArea,
                            displayOrder: item.displayOrder,
                            isActive: item.isActive,
                            playlistId: item.playlist.id,
                            scenarioId: selectedSenario.id,
                          };
                        }),
                        title: selectedSenario.title,
                      };

                      this.updateScenario(updateParam);
                    }}
                  >
                    Save Change
                  </Button>
                </Space>
              </div>
            </>
          }
          onClose={() => {
            this.setEditScenariosDrawer({
              visible: false,
            });
          }}
          width={'80%'}
        >
          <Skeleton active loading={editScenarioDrawer.isLoading}>
            <EditScenarioDrawer {...this.props} />

            <Drawer
              title="Playlist"
              width={`80%`}
              closable={false}
              destroyOnClose={true}
              afterVisibleChange={() => {
                this.clearSelectedPlaylistItems();
              }}
              onClose={() => {
                this.setPlaylistDrawer({
                  visible: false,
                });
              }}
              visible={playlistsDrawer.visible}
              footer={
                <>
                  <div style={{ textAlign: 'right' }}>
                    <Button type="primary" onClick={async () => this.choosePlaylist()}>
                      Choose Playlist
                    </Button>
                  </div>
                </>
              }
            >
              <SelectPlaylistDrawer {...this.props} />
            </Drawer>
          </Skeleton>
        </Drawer>
      </PageContainer>
    );
  }
}

export default connect((state) => ({ ...state }))(Scenario);

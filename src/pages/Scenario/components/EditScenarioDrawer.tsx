import { sortArea } from '@/utils/utils';
import { DeleteTwoTone, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import { Col, Divider, Image, Input, List, Row, Space } from 'antd';
import * as React from 'react';
import ReactPlayer from 'react-player';
import type { Area, Dispatch, PlayListModelState, ScenarioItem, ScenarioModelState } from 'umi';
import { connect } from 'umi';

export type EditScenarioDrawerProps = {
  dispatch: Dispatch;
  scenarios: ScenarioModelState;
  playlists: PlayListModelState;
};

class EditScenarioDrawer extends React.Component<EditScenarioDrawerProps> {
  componentDidMount = () => {
    this.ratioCalculation();
  };
  callGetPlaylist = async (payload?: any) => {
    await this.props.dispatch({
      type: 'scenarios/getListPlaylist',
      payload: {
        ...this.props.scenarios.getListPlaylistParam,
        ...payload,
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

  setSelectedScenarios = async (item: any) => {
    await this.props.dispatch({
      type: 'scenarios/setSelectedScenarioReducer',
      payload: {
        ...this.props.scenarios.selectedSenario,
        ...item,
      },
    });
  };

  setSelectedArea = async (payload: any) => {
    await this.props.dispatch({
      type: 'scenarios/setSelectedAreaReducer',
      payload: {
        ...this.props.scenarios.selectedArea,
        ...payload,
      },
    });
  };

  checkAreaIsUsed = (area: Area) => {
    const { selectedSenario } = this.props.scenarios;
    const scenarioItems = selectedSenario.scenarioItems.filter((s) => s.area.id === area.id);
    if (scenarioItems.length > 0) {
      return scenarioItems[0];
    }
    return null;
  };

  setHoverScenarioItem = async (item: ScenarioItem, hover: boolean) => {
    const { selectedSenario } = this.props.scenarios;

    await this.setSelectedScenarios({
      scenarioItems: selectedSenario.scenarioItems.map((s) => {
        if (s.id === item.id) {
          return {
            ...s,
            isHover: hover,
          };
        }
        return s;
      }),
    });
  };

  ratioCalculation = () => {
    const element = document.getElementById('areaWrapper');
    if (element) {
      const width = element?.clientWidth;

      const height = (width * 9) / 16;
      element.style.height = `${height}px`;
    }
  };

  removeScenarioItems = async (item: ScenarioItem) => {
    const { selectedSenario } = this.props.scenarios;

    await this.setSelectedScenarios({
      scenarioItems: selectedSenario.scenarioItems.filter((s) => s.id !== item.id),
    });
  };

  setSelectedPlaylist = async (modal: any) => {
    const { selectedPlaylist } = this.props.playlists;

    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistReducer',
      payload: {
        ...selectedPlaylist,
        ...modal,
      },
    });
  };

  getSelectedPlaylistItem = () => {
    const { selectedPlaylistItems } = this.props.playlists;

    const result = selectedPlaylistItems.filter((p) => p.isSelected);
    if (result.length > 0) {
      return result[0];
    }

    return null;
  };

  renderPreviewMedia = () => {
    const selectedPlaylistItem = this.getSelectedPlaylistItem();
    if (selectedPlaylistItem) {
      if (selectedPlaylistItem.typeName === 'Image') {
        return (
          <>
            <Image src={selectedPlaylistItem.url} loading="lazy" />
          </>
        );
      }

      if (selectedPlaylistItem.typeName === 'Video') {
        return (
          <>
            <ReactPlayer url={selectedPlaylistItem.url} controls={true} width={'100%'} />
          </>
        );
      }
    }
    return null;
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

  callGetItemsByPlaylistId = async (params: any) => {
    await this.props.dispatch({
      type: 'playlists/getItemsByPlaylist',
      payload: {
        ...this.props.playlists.getItemsByPlaylistIdParam,
        ...params,
      },
    });
  };

  setSelectedPlaylistItems = async (modal: any) => {
    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistItemsReducer',
      payload: modal,
    });
  };

  render() {
    const { selectedSenario, editScenarioDrawer } = this.props.scenarios;
    const { selectedPlaylistItems, selectedPlaylist } = this.props.playlists;
    return (
      <>
        <Row>
          <Col span={10}>Title</Col>
          <Col span={14}>
            <Input value={selectedSenario.title} />
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col span={10}>Description</Col>
          <Col span={14}>
            <Input value={selectedSenario.description} />
          </Col>
        </Row>
        <Divider></Divider>

        {/* AREA */}
        <div
          id="areaWrapper"
          style={{
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {sortArea(selectedSenario.layout.areas).map((area) => {
            const scenarioItem = this.checkAreaIsUsed(area);
            return (
              <div
                key={area.id}
                style={{
                  flex: `${area.width * 100}%`,
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: `${area.height * 100}%`,
                  textAlign: 'center',
                  border: `1px solid black`,
                  transition: 'ease',
                  transitionDuration: '1s',
                }}
                onDoubleClick={async () => {
                  this.setSelectedArea(area).then(() => {
                    this.setPlaylistDrawer({
                      visible: true,
                    });
                  });
                }}
              >
                {scenarioItem ? (
                  <div
                    onMouseOver={() => {
                      const item = scenarioItem;
                      if (item) {
                        this.setHoverScenarioItem(item, true);
                      }
                    }}
                    onMouseLeave={() => {
                      const item = scenarioItem;
                      if (item) {
                        this.setHoverScenarioItem(item, false);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {scenarioItem.playlist.title}
                    {scenarioItem.isHover ? (
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          top: 0,
                          left: 0,
                          backgroundColor: `rgba(30, 30, 30, 0.5)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Space>
                          <DeleteTwoTone
                            style={{
                              fontSize: '2em',
                            }}
                            twoToneColor="#f93e3e"
                            onClick={() => {
                              this.removeScenarioItems(scenarioItem);
                            }}
                          />

                          <EyeTwoTone
                            style={{
                              fontSize: '2em',
                            }}
                            onClick={() => {
                              this.setEditScenariosDrawer({
                                playlistLoading: true,
                              })
                                .then(() => {
                                  this.callGetItemsByPlaylistId({
                                    id: scenarioItem.playlist.id,
                                  }).then(() => {
                                    this.setSelectedPlaylist(scenarioItem.playlist).then(() => {
                                      this.setEditScenariosDrawer({
                                        playlistLoading: false,
                                      });
                                    });
                                  });
                                })
                                .catch(() => {
                                  this.setEditScenariosDrawer({
                                    playlistLoading: false,
                                  });
                                });
                            }}
                          />
                        </Space>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  <UploadOutlined />
                )}
              </div>
            );
          })}
        </div>

        <Divider></Divider>
        <Row gutter={20}>
          <Col span={12}> {this.renderPreviewMedia()} </Col>
          <Col span={12}>
            {selectedPlaylist ? (
              <>
                <Row>
                  <Col span={10}>Title</Col>
                  <Col span={14}>{selectedPlaylist.title}</Col>
                </Row>
                <Row>
                  <Col span={10}>Description</Col>
                  <Col span={14}>{selectedPlaylist.description}</Col>
                </Row>
                <Divider />
                <List
                  dataSource={selectedPlaylistItems}
                  loading={editScenarioDrawer.playlistLoading}
                  renderItem={(item) => {
                    return (
                      <>
                        <List.Item
                          key={item.id}
                          style={item.isSelected ? { backgroundColor: '#424ef5' } : {}}
                          onClick={() => {
                            this.setSelectedPlaylistItems(
                              selectedPlaylistItems.map((p) => {
                                if (p.id === item.id) {
                                  return {
                                    ...p,
                                    isSelected: true,
                                  };
                                }
                                return {
                                  ...p,
                                  isSelected: false,
                                };
                              }),
                            );
                          }}
                        >
                          <List.Item.Meta title={item.title} description={item.typeName} />
                        </List.Item>
                      </>
                    );
                  }}
                ></List>
              </>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(EditScenarioDrawer);

import { List, Skeleton, Image, Row, Col, Divider, Typography } from 'antd';
import * as React from 'react';
import ReactPlayer from 'react-player';
import type { Dispatch, PlayListModelState, ScenarioModelState } from 'umi';
import { connect } from 'umi';

export type SelectPlaylistDrawerProps = {
  dispatch: Dispatch;
  scenarios: ScenarioModelState;
  playlists: PlayListModelState;
};

class SelectPlaylistDrawer extends React.Component<SelectPlaylistDrawerProps> {
  componentDidMount = async () => {
    await this.setPlaylistDrawer({
      isLoading: true,
    });

    this.callGetPlaylist().then(() => {
      this.setPlaylistDrawer({
        isLoading: false,
      });
    });
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

  setGetPlaylistParam = async (payload: any) => {
    await this.props.dispatch({
      type: 'scenarios/setGetListPlaylistParamReducer',
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

  setSelectedPlaylist = async (item: any) => {
    const { playlistsDrawer } = this.props.scenarios;
    await this.props.dispatch({
      type: 'scenarios/setPlaylistsDrawerReducer',
      payload: {
        ...playlistsDrawer,
        listPlaylists: playlistsDrawer.listPlaylists.map((playlist) => {
          if (item.id === playlist.id) {
            return {
              ...playlist,
              isSelected: true,
            };
          }

          return {
            ...playlist,
            isSelected: false,
          };
        }),
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

  getSelectedPlaylistItem = () => {
    const { selectedPlaylistItems } = this.props.playlists;

    if (selectedPlaylistItems.length > 0) {
      const playlistItem = selectedPlaylistItems.filter((item) => item.isSelected);

      if (playlistItem.length > 0) {
        return playlistItem[0];
      }
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

  setSelectedPlaylistItems = async (modal: any) => {
    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistItemsReducer',
      payload: modal,
    });
  };
  render() {
    const { playlistsDrawer, getListPlaylistParam } = this.props.scenarios;

    const { selectedPlaylistItems } = this.props.playlists;

    return (
      <>
        <Skeleton active loading={playlistsDrawer.isLoading}>
          <List
            itemLayout="vertical"
            bordered
            size="large"
            pagination={{
              current: getListPlaylistParam.pageNumber + 1,
              onChange: (e) => {
                this.setGetPlaylistParam({
                  pageNumber: e - 1,
                });
              },
            }}
            style={{ transition: `1s ease`, width: '100%' }}
            dataSource={playlistsDrawer.listPlaylists}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={async () => {
                  this.setPlaylistDrawer({
                    isLoading: true,
                  })
                    .then(() => {
                      this.callGetItemsByPlaylistId({
                        id: item.id,
                      }).then(() => {
                        this.setSelectedPlaylist(item).then(() => {
                          this.setPlaylistDrawer({
                            isLoading: false,
                          });
                        });
                      });
                    })
                    .catch(() => {
                      this.setPlaylistDrawer({
                        isLoading: false,
                      });
                    });
                }}
                style={item.isSelected ? { backgroundColor: '#424ef5' } : {}}
              >
                <List.Item.Meta title={item.title}></List.Item.Meta>
              </List.Item>
            )}
          ></List>
        </Skeleton>
        <Divider></Divider>
        <Row gutter={20}>
          <Col span={12}>{this.renderPreviewMedia()}</Col>
          <Col span={12}>
            <Row>
              <Col span={10}>Title</Col>
              <Col span={14}>{this.getSelectedPlaylistItem()?.title}</Col>
            </Row>
            <Divider></Divider>
            <Row>
              <Col span={10}>Link</Col>
              <Col span={14}>
                <Typography.Link href={this.getSelectedPlaylistItem()?.url}>
                  {this.getSelectedPlaylistItem()?.url}
                </Typography.Link>
              </Col>
            </Row>
            <Divider></Divider>
            <Skeleton active loading={playlistsDrawer.isLoading}>
              <List
                dataSource={selectedPlaylistItems}
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
            </Skeleton>
          </Col>
        </Row>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(SelectPlaylistDrawer);

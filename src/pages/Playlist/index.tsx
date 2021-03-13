import {
  CloseSquareTwoTone,
  DeleteTwoTone,
  PlusCircleTwoTone,
  PlusSquareTwoTone,
  SettingTwoTone,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Drawer, Modal, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import React from 'react';
import type { Dispatch, MediaSourceModelState, PlayListModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';
import AddNewPlaylistItemDrawer from './components/AddNewPlaylistItemDrawer';
import AddNewPlaylistModal from './components/AddNewPlaylistModal';
import EditPlaylistDrawer from './components/EditPlaylistDrawer';
import { cloneDeep } from 'lodash';
import type { UpdatePlaylistItemsByPlaylistIdParam } from '@/services/PlaylistPageService/PlaylistItemService';
import { v4 as uuidv4 } from 'uuid';

type PlaylistProps = {
  dispatch: Dispatch;
  playlists: PlayListModelState;
  userTest: UserTestModelState;
  media: MediaSourceModelState;
};

class Playlist extends React.Component<PlaylistProps> {
  state = {};

  componentDidMount = () => {
    Promise.all([this.callGetListPlaylist()]);
  };

  callGetListPlaylist = async () => {
    this.setTableLoading(true);
    const { getPlaylistParam } = this.props.playlists;
    await this.props
      .dispatch({
        type: 'playlists/getListPlaylist',
        payload: getPlaylistParam,
      })
      .then(() => {
        this.setTableLoading(false);
      })
      .catch(() => {
        this.setTableLoading(false);
      });
  };

  setAddNewPlaylistModal = async (modal: any) => {
    const { addNewPlaylistModal } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/setAddNewPlaylistModalReducer',
      payload: {
        ...addNewPlaylistModal,
        ...modal,
      },
    });
  };

  setAddNewPlaylistParam = async (modal: any) => {
    const { addNewPlaylistParam } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/setGetPlaylistParamReducer',
      payload: {
        ...addNewPlaylistParam,
        ...modal,
      },
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

  setTableLoading = async (loading: boolean) => {
    await this.props.dispatch({
      type: 'playlists/setTableLoadingReducer',
      payload: loading,
    });
  };

  setEditPlaylistDrawer = async (drawer: any) => {
    const { editPlaylistDrawer } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/setEditPlaylistDrawerReducer',
      payload: {
        ...editPlaylistDrawer,
        ...drawer,
      },
    });
  };

  callGetItemsByPlaylistId = async () => {
    const { getItemsByPlaylistIdParam } = this.props.playlists;

    await this.props.dispatch({
      type: 'playlists/getItemsByPlaylist',
      payload: getItemsByPlaylistIdParam,
    });
  };

  callGetListMediaNotBelongToPlaylist = async (param: any) => {
    this.props.dispatch({
      type: 'playlists/getMediaNotBelongToPlaylist',
      payload: {
        ...this.props.playlists.getListMediaParam,
        ...param,
      },
    });
  };

  setGetItemsByPlaylistIdParam = async (modal: any) => {
    const { getItemsByPlaylistIdParam } = this.props.playlists;
    this.props.dispatch({
      type: 'playlists/setGetItemsByPlaylistIdParamReducer',
      payload: {
        ...getItemsByPlaylistIdParam,
        ...modal,
      },
    });
  };
  setGetListMediaParam = async (modal: any) => {
    const { getListMediaParam } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/setGetListMediaParamReducer',
      payload: {
        ...getListMediaParam,
        ...modal,
      },
    });
  };

  setAddNewPlaylistItemsDrawer = async (modal: any) => {
    const { addNewPlaylistItemsDrawer } = this.props.playlists;

    await this.props.dispatch({
      type: 'playlists/setAddNewPlaylistItemsDrawerReducer',
      payload: {
        ...addNewPlaylistItemsDrawer,
        ...modal,
      },
    });
  };

  addNewPlaylistItem = async () => {
    await this.addNewItemToSelectedItems()
      .then(() => {
        this.removeMediaFromListMedia().then(() => {
          this.calculateTotalDuration().then(() => {
            this.clearDuration().then(() => {
              this.setAddNewPlaylistItemsDrawer({
                visible: false,
              });
            });
          });
        });
      })
      .catch(() => {
        this.setAddNewPlaylistItemsDrawer({
          visible: false,
        });
      });
  };

  addNewItemToSelectedItems = async () => {
    const {
      selectedPlaylistItems,
      selectedMedia,
      selectedPlaylist,
      currentNewItemDuration,
    } = this.props.playlists;

    const newList = cloneDeep(selectedPlaylistItems);

    newList.push({
      id: uuidv4(),
      createTime: '',
      modifyBy: '',
      index: selectedPlaylistItems.length,
      displayOrder: selectedPlaylistItems.length,
      duration: currentNewItemDuration,
      isActive: true,
      key: `${uuidv4()}`,
      mediaSrcId: selectedMedia.id,
      modifyTime: '',
      playlistId: selectedPlaylist.id,
      createBy: '',
      title: selectedMedia.title ? selectedMedia.title : '',
      typeName: selectedMedia.type.name,
      url: selectedMedia.urlPreview,
    });
    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistItemsReducer',
      payload: newList,
    });
  };
  removeMediaFromListMedia = async () => {
    const { listMediaNotBelongToPlaylist, selectedMedia } = this.props.playlists;
    const newList = listMediaNotBelongToPlaylist.filter(
      (media: any) => media.id !== selectedMedia.id,
    );
    await this.props.dispatch({
      type: 'playlists/setListMediaNotBelongToPlaylistReducer',
      payload: newList,
    });
  };
  updatePlaylist = async () => {
    const { selectedPlaylistItems, selectedPlaylist } = this.props.playlists;

    const param: UpdatePlaylistItemsByPlaylistIdParam = {
      id: this.props.playlists.selectedPlaylist.id,
      title: selectedPlaylist.title,
      description: selectedPlaylist.description,
      updatePlaylistItems: selectedPlaylistItems,
    };

    await this.props.dispatch({
      type: 'playlists/updatePlaylist',
      payload: param,
    });
  };

  removePlaylist = async () => {
    await this.props.dispatch({
      type: 'playlists/removePlaylist',
      payload: this.props.playlists.selectedPlaylist.id,
    });

    await this.callGetListPlaylist();
  };

  setTotalDuration = async (total: number) => {
    await this.props.dispatch({
      type: 'playlists/setTotalDurationReducer',
      payload: total,
    });
  };

  calculateTotalDuration = async () => {
    const { selectedPlaylistItems } = this.props.playlists;

    let total: number = 0;
    selectedPlaylistItems.forEach((item) => {
      total += item.duration;
    });
    await this.setTotalDuration(total);
  };

  clearDuration = async () => {
    await this.props.dispatch({
      type: 'playlists/setCurrentDurationReducer',
      payload: 10,
    });
  };

  clearSelectedMedia = async () => {
    const { listMediaNotBelongToPlaylist } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/clearSelectedMediaReducer',
    });

    await this.props.dispatch({
      type: 'playlists/setListMediaNotBelongToPlaylistReducer',
      payload: listMediaNotBelongToPlaylist.map((media: any) => {
        return {
          ...media,
          isSelected: false,
        };
      }),
    });
  };

  setGetListPlaylistParam = async (modal: any) => {
    this.props.dispatch({
      type: 'playlists/setGetPlaylistParamReducer',
      payload: {
        ...this.props.playlists.getPlaylistParam,
        ...modal,
      },
    });
  };

  setSelectedPlaylistItems = async (payload: any) => {
    await this.props.dispatch({
      type: `playlists/setSelectedPlaylistItemsReducer`,
      payload,
    });
  };

  clearSelectedPlaylist = async () => {
    await this.props.dispatch({
      type: `playlists/clearSelectedPlaylistReducer`,
    });
  };

  clearSearchListMediaParam = async () => {
    await this.props.dispatch({
      type: 'media/clearSearchListMediaParamReducer',
    });
  };
  render() {
    const {
      listPlaylist,
      addNewPlaylistModal,
      getPlaylistParam,
      totalItem,
      tableLoading,
      addNewPlaylistParam,
      editPlaylistDrawer,
      totalDuration,
      maxDuration,
      minDuration,
      listMediaNotBelongToPlaylist,
    } = this.props.playlists;

    const isMediaSelected = listMediaNotBelongToPlaylist.some(
      (media: any) => media.isSelected === true,
    );

    return (
      <PageContainer>
        <Table
          bordered
          dataSource={listPlaylist}
          loading={tableLoading}
          pagination={{
            current: getPlaylistParam.pageNumber + 1,
            total: totalItem,
            onChange: async (e) => {
              this.setGetListPlaylistParam({
                pageNumber: e - 1,
              }).then(() => {
                this.callGetListPlaylist();
              });
            },
          }}
          onRow={(record) => {
            return {
              onClick: async () => {
                await this.setSelectedPlaylist(record);

                // await this.setGetListMediaParam({
                //   id: record.id,
                // });

                await this.setGetItemsByPlaylistIdParam({
                  id: record.id,
                });

                await this.setEditPlaylistDrawer({
                  visible: true,
                  isLoading: true,
                });
                this.callGetItemsByPlaylistId()
                  .then(() => {
                    this.calculateTotalDuration().then(() => {
                      this.setEditPlaylistDrawer({
                        isLoading: false,
                      });
                    });
                  })
                  .catch(() => {
                    this.setEditPlaylistDrawer({
                      isLoading: false,
                    });
                  });
              },
            };
          }}
          title={() => {
            return (
              <>
                <Button
                  onClick={async () => {
                    await this.setAddNewPlaylistModal({
                      visible: true,
                    });
                  }}
                >
                  <PlusSquareTwoTone /> Add New Playlist
                </Button>
              </>
            );
          }}
        >
          <Column key="title" title="Title" dataIndex="title"></Column>
          <Column key="description" title="Description" dataIndex="description"></Column>
        </Table>

        <Modal
          title="Add New Playlist"
          visible={addNewPlaylistModal.visible}
          destroyOnClose={true}
          confirmLoading={addNewPlaylistModal.isLoading}
          onCancel={async () => {
            await this.setAddNewPlaylistModal({
              visible: false,
            });
          }}
          afterClose={() => {
            this.props.dispatch({
              type: 'playlists/clearAddNewPlaylistParamReducer',
            });
          }}
          onOk={async () => {
            await this.setAddNewPlaylistModal({
              isLoading: true,
            });
            await this.props
              .dispatch({
                type: 'playlists/addNewPlaylist',
                payload: {
                  ...addNewPlaylistParam,
                },
              })
              .then(() => {
                this.setAddNewPlaylistModal({
                  visible: false,
                });
                this.setAddNewPlaylistModal({
                  isLoading: false,
                });
              })
              .catch(() => {
                this.setAddNewPlaylistModal({
                  isLoading: false,
                });
              });
            await this.callGetListPlaylist();
          }}
        >
          <AddNewPlaylistModal {...this.props} />
        </Modal>

        {/* //Edit Drawer */}
        <Drawer
          getContainer={false}
          closable={false}
          destroyOnClose={true}
          visible={editPlaylistDrawer.visible}
          afterVisibleChange={(e) => {
            this.setSelectedPlaylistItems([]);
            if (!e) {
              this.clearSelectedPlaylist();
            }
          }}
          width={'80%'}
          onClose={async () => {
            await this.setEditPlaylistDrawer({
              visible: false,
            });
          }}
          footer={
            <>
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button
                    onClick={async () => {
                      await this.setEditPlaylistDrawer({
                        visible: false,
                      });
                    }}
                    icon={<CloseSquareTwoTone />}
                  >
                    Cancel
                  </Button>
                  <Button
                    danger
                    onClick={async () => {
                      this.setEditPlaylistDrawer({
                        visible: true,
                      });
                      this.removePlaylist()
                        .then(() => {
                          this.setEditPlaylistDrawer({
                            visible: false,
                          });
                        })
                        .catch(() => {
                          this.setEditPlaylistDrawer({
                            visible: false,
                          });
                        });
                    }}
                    icon={<DeleteTwoTone twoToneColor="#f93e3e" />}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={async () => {
                      this.setEditPlaylistDrawer({
                        visible: true,
                      });
                      this.updatePlaylist()
                        .then(() => {
                          this.setEditPlaylistDrawer({
                            visible: false,
                          });
                        })
                        .catch(() => {
                          this.setEditPlaylistDrawer({
                            visible: false,
                          });
                        });
                    }}
                    icon={<SettingTwoTone />}
                  >
                    Save Change
                  </Button>
                </Space>
              </div>
            </>
          }
        >
          <EditPlaylistDrawer {...this.props}></EditPlaylistDrawer>

          {/* Add New Playlist Item */}
          <Drawer
            title="Media"
            width="80%"
            destroyOnClose={true}
            afterVisibleChange={() => {
              this.clearSearchListMediaParam();
            }}
            closable={false}
            footer={
              <>
                <Button
                  onClick={this.addNewPlaylistItem}
                  disabled={maxDuration - totalDuration < minDuration || !isMediaSelected}
                >
                  <PlusCircleTwoTone />
                  Add New PlaylistItem
                </Button>
              </>
            }
            onClose={async () => {
              this.calculateTotalDuration().then(() => {
                this.clearDuration().then(() => {
                  this.clearSelectedMedia().then(() => {
                    this.setAddNewPlaylistItemsDrawer({
                      visible: false,
                    });
                  });
                });
              });
            }}
            visible={this.props.playlists.addNewPlaylistItemsDrawer.visible}
          >
            <AddNewPlaylistItemDrawer {...this.props} />
          </Drawer>
        </Drawer>
      </PageContainer>
    );
  }
}

export default connect((state) => ({ ...state }))(Playlist);

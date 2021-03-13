import { Skeleton, Image, Slider, Divider, Row, Col, List } from 'antd';
// import Column from 'antd/lib/table/Column';
import React, { Component } from 'react';
import type { Dispatch, MediaSourceModelState, PlayListModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';
import HoverVideoPlayer from 'react-hover-video-player';
import styles from '../index.less';
import Input from 'antd/es/input';

type AddNewPlaylistItemProps = {
  dispatch: Dispatch;
  playlists: PlayListModelState;
  userTest: UserTestModelState;
  media: MediaSourceModelState;
};

class AddNewPlaylistItemModal extends Component<AddNewPlaylistItemProps> {
  state = {
    duration: 0,
  };

  componentDidMount() {
    Promise.all([this.getMediaNotBelongToPlaylist({ isSigned: -1 })]);
  }

  getMediaNotBelongToPlaylist = async (param: any) => {
    const { getListMediaParam } = this.props.playlists;
    await this.setAddNewPlaylistItemsDrawer({
      isLoading: true,
    });

    this.props
      .dispatch({
        type: 'playlists/getMediaNotBelongToPlaylist',
        payload: {
          ...getListMediaParam,
          ...param,
        },
      })
      .then(() => {
        this.setAddNewPlaylistItemsDrawer({
          isLoading: false,
        });
      })
      .catch(() => {
        this.setAddNewPlaylistItemsDrawer({
          isLoading: false,
        });
      });
  };

  callGetListMedia = async (param: any) => {
    const { searchListMediaParam } = this.props.media;
    await this.props.dispatch({
      type: 'media/searchListMedia',
      payload: {
        ...searchListMediaParam,
        ...param,
      },
    });
  };

  setEditPlaylistDrawer = async (modal: any) => {
    const { editPlaylistDrawer } = this.props.playlists;

    await this.props.dispatch({
      type: 'playlists/setEditPlaylistDrawerReducer',
      payload: {
        ...editPlaylistDrawer,
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

  setIsSelectedMediaSource = async (record: any, isSelected: boolean) => {
    const { listMediaNotBelongToPlaylist } = this.props.playlists;

    await this.setAddNewPlaylistItemsDrawer({
      isLoading: true,
    });

    await this.props.dispatch({
      type: 'playlists/setListMediaNotBelongToPlaylistReducer',
      payload: listMediaNotBelongToPlaylist.map((media: any) => {
        if (media.id === record.id) {
          return {
            ...media,
            isSelected,
          };
        }
        return {
          ...media,
          isSelected: false,
        };
      }),
    });

    await this.setSelectedMedia(record)
      .then(() => {
        this.setAddNewPlaylistItemsDrawer({
          isLoading: false,
        });
      })
      .catch(() => {
        this.setAddNewPlaylistItemsDrawer({
          isLoading: false,
        });
      });
  };

  setSelectedMedia = async (media: any) => {
    const { selectedMedia } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/setSelectedMediaReducer',
      payload: {
        ...selectedMedia,
        ...media,
      },
    });
  };

  setNewPlaylistItemParam = async (modal: any) => {
    const { newPlaylistItemParam } = this.props.playlists;

    await this.props.dispatch({
      type: 'playlists/setNewPlaylistItemParamReducer',
      payload: {
        ...newPlaylistItemParam,
        ...modal,
      },
    });
  };
  setCurrentNewItemDuration = async (duration: number) => {
    await this.props.dispatch({
      type: 'playlists/setCurrentDurationReducer',
      payload: duration,
    });
  };
  render() {
    const {
      addNewPlaylistItemsDrawer,
      listMediaNotBelongToPlaylist,
      totalDuration,
      minDuration,
      maxDuration,
      currentNewItemDuration,
      getListMediaParam,
    } = this.props.playlists;
    const availableDuration = maxDuration - totalDuration;
    console.log('====================================');
    console.log(listMediaNotBelongToPlaylist);
    console.log('====================================');
    return (
      <>
        <Skeleton active loading={addNewPlaylistItemsDrawer.isLoading}>
          <Row style={{ verticalAlign: 'middle', alignItems: 'center' }}>
            <Col span={8}>Select Duration (seconds)</Col>
            <Col span={16}>
              <Slider
                min={minDuration}
                max={availableDuration}
                disabled={availableDuration < minDuration}
                value={currentNewItemDuration}
                onChange={(e: any) => {
                  this.setCurrentNewItemDuration(e);
                }}
              ></Slider>
            </Col>
          </Row>
          <Divider></Divider>

          {/** =================================================================== */}

          {/** =================================================================== */}
          {/* //Table Media Source */}
          {/* <Table
            dataSource={listMediaNotBelongToPlaylist}
            pagination={false}
            scroll={{
              y: 500,
              x: 1000,
            }}
            onRow={(record: any) => {
              return {
                onClick: async () => {
                  await this.setIsSelectedMediaSource(record, !record.isSelected);
                },
              };
            }}
            rowClassName={(record) => {
              return record.isSelected ? `${styles.selectedRow}` : `${styles.customRow}`;
            }}
          >
            <Column key="title" title="Title" dataIndex="title"></Column>
            <Column key="description" title="Description" dataIndex="description"></Column>
            <Column
              key="image"
              title="Resource"
              width={300}
              fixed="right"
              render={(record) => {
                if (record.type.name === 'Image') {
                  return (
                    <>
                      <Image src={record.urlPreview} width={300} height={200}></Image>
                    </>
                  );
                }
                return (
                  <HoverVideoPlayer
                    videoSrc={record.urlPreview}
                    restartOnPaused
                    style={{ width: 300, height: 200 }}
                  />
                );
              }}
            ></Column>
          </Table> */}
          {/** =================================================================== */}

          {/** =================================================================== */}
          {/** List */}
          <List
            itemLayout="vertical"
            dataSource={listMediaNotBelongToPlaylist}
            split
            pagination={{
              pageSize: 10,
              current: getListMediaParam.pageNumber + 1,
              total: addNewPlaylistItemsDrawer.totalItem,
              onChange: (e) => {
                this.getMediaNotBelongToPlaylist({
                  pageNumber: e - 1,
                });
              },
            }}
            loading={addNewPlaylistItemsDrawer.isLoading}
            style={{ height: 500 }}
            header={
              <>
                <Input.Search
                  placeholder="input search text"
                  value={getListMediaParam.title}
                  onSearch={(e) => {
                    this.getMediaNotBelongToPlaylist({ title: e, pageNumber: 0 });
                  }}
                  enterButton
                />
              </>
            }
            renderItem={(item) => {
              return (
                <List.Item
                  className={item.isSelected ? `${styles.selectedRow}` : ``}
                  key={item.id}
                  onClick={async () => {
                    await this.setIsSelectedMediaSource(item, !item.isSelected);
                  }}
                  extra={
                    item.type.name === 'Image' ? (
                      <Image preview={false} src={item.urlPreview} width={300} height={200}></Image>
                    ) : (
                      <HoverVideoPlayer
                        videoSrc={item.urlPreview}
                        restartOnPaused
                        style={{ width: 300, height: 200 }}
                      />
                    )
                  }
                >
                  <List.Item.Meta
                    avatar={<></>}
                    title={item.title}
                    description={item.description}
                  />
                  {item.content}
                </List.Item>
              );
            }}
          ></List>
        </Skeleton>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewPlaylistItemModal);

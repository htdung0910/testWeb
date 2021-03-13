import {
  DeleteTwoTone,
  MenuOutlined,
  PlaySquareTwoTone,
  PlusSquareTwoTone,
} from '@ant-design/icons';
import { Col, Divider, Input, Row, Button, Skeleton, Table, Image, Space } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import React, { Component } from 'react';
import type {
  Dispatch,
  MediaSourceModelState,
  PlaylistItem,
  PlayListModelState,
  UserTestModelState,
} from 'umi';
import { connect } from 'umi';
import arrayMove from 'array-move';
import Column from 'antd/lib/table/Column';
import ReactPlayer from 'react-player';
import styles from '../index.less';

type EditPlaylistDrawerProps = {
  dispatch: Dispatch;
  playlists: PlayListModelState;
  media: MediaSourceModelState;
  userTest: UserTestModelState;
};

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItemComponent = SortableElement((props: any) => <tr {...props} />);
const SortableContainerComponent = SortableContainer((props: any) => <tbody {...props} />);

class EditPlaylistDrawer extends Component<EditPlaylistDrawerProps> {
  state = {};

  componentDidMount = () => {};

  setSelectedPlaylist = async (modal: any) => {
    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistReducer',
      payload: {
        ...this.props.playlists.selectedPlaylist,
        ...modal,
      },
    });
  };

  onSortEnd = ({ oldIndex, newIndex }: any) => {
    const { selectedPlaylistItems } = this.props.playlists;
    if (oldIndex !== newIndex) {
      const array: PlaylistItem[] = [];
      const newData = arrayMove(array.concat(selectedPlaylistItems), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      console.log('Sorted items: ', newData);

      this.props.dispatch({
        type: 'playlists/setSelectedPlaylistItemsReducer',
        payload: newData.map((playlist, index) => {
          return {
            ...playlist,
            displayOrder: index,
            index,
          };
        }),
      });
    }
  };

  DraggableContainer = (props: any) => {
    return (
      <SortableContainerComponent
        key={Math.random() + 100}
        useDragHandle
        disableAutoscroll
        helperClass={styles.drag}
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
  };

  setSelectedPlaylistItems = async (payload: any) => {
    await this.props.dispatch({
      type: `playlists/setSelectedPlaylistItemsReducer`,
      payload,
    });
  };

  selectPlaylistItem = async (record: any) => {
    const { selectedPlaylistItems } = this.props.playlists;
    if (selectedPlaylistItems.some((playlist) => playlist.id === record.id)) {
      const newList = selectedPlaylistItems.map((item) => {
        if (item.id === record.id) {
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
      await this.setSelectedPlaylistItems(newList);
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }: any) => {
    const { selectedPlaylistItems } = this.props.playlists;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = selectedPlaylistItems.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItemComponent key={Math.random() + 100} index={index} {...restProps} />;
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

  removeItem = async (record: any) => {
    const { selectedPlaylistItems } = this.props.playlists;
    await this.props.dispatch({
      type: 'playlists/setSelectedPlaylistItemsReducer',
      payload: selectedPlaylistItems
        .filter((item) => item.id !== record.id)
        .map((item, index) => {
          return {
            ...item,
            displayOrder: index,
            index,
          };
        }),
    });
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

  getSelectedPlaylistItem = () => {
    const { selectedPlaylistItems } = this.props.playlists;
    if (selectedPlaylistItems.some((item) => item.isSelected)) {
      const selected = selectedPlaylistItems.filter((playlist) => playlist.isSelected)[0];
      return selected;
    }

    return null;
  };

  renderPreviewMedia = () => {
    const selectedPlaylistItem = this.getSelectedPlaylistItem();
    if (selectedPlaylistItem) {
      if (selectedPlaylistItem.typeName === 'Image') {
        return (
          <>
            <Image src={selectedPlaylistItem.url} loading="lazy" width="100%" />
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
  render() {
    const { selectedPlaylist, editPlaylistDrawer, selectedPlaylistItems } = this.props.playlists;
    return (
      <>
        <Skeleton active loading={editPlaylistDrawer.isLoading}>
          <Row>
            <Col span={4}>Title</Col>
            <Col span={20}>
              <Input
                type="text"
                value={selectedPlaylist.title}
                onChange={(e) => {
                  this.setSelectedPlaylist({
                    title: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={4}>Description</Col>
            <Col span={20}>
              <Input
                type="text"
                value={selectedPlaylist.description}
                onChange={(e) => {
                  this.setSelectedPlaylist({
                    description: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Table
            bordered
            rowKey="index"
            key={Math.random() + 200}
            components={{
              body: {
                wrapper: this.DraggableContainer,
                row: this.DraggableBodyRow,
              },
            }}
            dataSource={selectedPlaylistItems}
            title={() => {
              return (
                <>
                  <Button
                    onClick={async () => {
                      await this.setAddNewPlaylistItemsDrawer({
                        visible: true,
                      });
                    }}
                  >
                    <PlusSquareTwoTone /> Add New Playlist Items
                  </Button>
                </>
              );
            }}
          >
            <Column
              key="drag"
              dataIndex="sort"
              className={styles.dragVisible}
              render={() => <DragHandle />}
            ></Column>
            <Column key="index" title="No" dataIndex="index"></Column>
            <Column key="title" title="Title" dataIndex="title" className="drag-visible"></Column>
            <Column key="description" title="Duration" dataIndex="duration"></Column>
            <Column
              key="action"
              title="Action"
              render={(record: any) => {
                return (
                  <>
                    <Space>
                      <PlaySquareTwoTone
                        size={20}
                        onClick={() => {
                          this.selectPlaylistItem(record);
                        }}
                      />
                      <DeleteTwoTone
                        size={20}
                        twoToneColor="#f93e3e"
                        onClick={async () => {
                          this.removeItem(record).then(() => {
                            this.calculateTotalDuration().then(() => {
                              this.clearDuration();
                            });
                          });
                        }}
                      />
                    </Space>
                  </>
                );
              }}
            ></Column>
          </Table>
          <Row>
            <Col span={24}>{this.renderPreviewMedia()}</Col>
          </Row>
        </Skeleton>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(EditPlaylistDrawer);

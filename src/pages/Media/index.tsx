import { PageContainer } from '@ant-design/pro-layout';
import {
  Image,
  Button,
  Modal,
  Divider,
  Space,
  Drawer,
  List,
  Card,
  Skeleton,
  Breadcrumb,
  Popconfirm,
  Input,
  Row,
  Col,
  Select,
  Alert,
} from 'antd';
import * as React from 'react';
import type { Dispatch, FolderType, MediaSourceModelState, UserTestModelState } from 'umi';
import { connect } from 'umi';
// import VideoThumbnail from 'react-video-thumbnail';
// import ReactPlayer from 'react-player';
import HoverVideoPlayer from 'react-hover-video-player';
import AddNewModal from './components/AddNewFileModal';
import EditMediaDrawer from './components/EditMediaDrawer';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { cloneDeep } from 'lodash';

import {
  DeleteTwoTone,
  EditOutlined,
  ExclamationCircleOutlined,
  FolderOpenTwoTone,
  FormOutlined,
  HomeTwoTone,
  SettingTwoTone,
} from '@ant-design/icons';
import AddNewFolderModal from './components/AddNewFolderModal';
import { Keccak } from 'sha3';
import type { EditMediaParam } from '@/services/MediaSourceService';

export type MediaSourceProps = {
  dispatch: Dispatch;
  media: MediaSourceModelState;
  userTest: UserTestModelState;
};

class Media extends React.Component<MediaSourceProps> {
  state = {
    removeConfirmVisible: false,
  };

  componentDidMount = async () => {
    await this.setListLoading(true);

    this.getCurrentUser()
      .then(() => {
        this.callGetListFolders().then(() => {
          this.callGetListMedia().then(() => {
            this.callGetListMediaType().then(() => {
              this.addBreadscrumbHome().then(() => {
                this.setListLoading(false);
              });
            });
          });
        });
      })
      .catch(() => {
        this.setListLoading(false);
      });
  };

  addBreadscrumbHome = async () => {
    const { userTest } = this.props;
    await this.props.dispatch({
      type: 'media/setBreadScrumbReducer',
      payload: [
        {
          id: userTest.currentUser.rootFolderId,
          name: 'Home',
          path: '',
          parent_id: '',
          created_at: '',
          updated_at: '',
        },
      ],
    });
  };

  setListLoading = async (loading: boolean) => {
    await this.props.dispatch({
      type: 'media/setListLoadingReducer',
      payload: loading,
    });
  };

  getCurrentUser = async () => {
    const res = await this.props.dispatch({
      type: 'userTest/getCurrentUser',
      payload: '',
    });

    await this.setCreateFileParam({
      accountId: this.props.userTest.currentUser.id,
    });

    await this.setGetListFilesParam({
      folder: res.rootFolderId,
    });

    await this.setGetListFolderParam({
      parent_id: res.rootFolderId,
    });
  };

  setCreateFileParam = async (param: any) => {
    await this.props.dispatch({
      type: 'media/setCreateFileParamReducer',
      payload: {
        ...this.props.media.createFileParam,
        ...param,
      },
    });
  };

  setGetListFolderParam = async (param?: any) => {
    await this.props.dispatch({
      type: 'media/setGetListFolderParamReducer',
      payload: {
        ...this.props.media.getListFolderParam,
        ...param,
      },
    });
  };

  setGetListFilesParam = async (param?: any) => {
    await this.props.dispatch({
      type: 'media/setGetListFileParamReducer',
      payload: {
        ...this.props.media.getListFileParam,
        ...param,
      },
    });
  };

  async callGetListMedia(payload?: any) {
    const { dispatch, media } = this.props;
    await dispatch({
      type: 'media/getListMediaFromFileId',
      payload: {
        ...media.getListFileParam,
        ...payload,
      },
    });
  }

  callSearchListMedia = async (payload?: any) => {
    await this.props.dispatch({
      type: 'media/searchListMedia',
      payload: {
        ...this.props.media.searchListMediaParam,
        ...payload,
      },
    });
  };

  callGetListFolders = async (payload?: any) => {
    await this.props.dispatch({
      type: 'media/getListFolder',
      payload: {
        ...this.props.media.getListFolderParam,
        ...payload,
      },
    });
  };
  async callGetListMediaType() {
    await this.props.dispatch({
      type: 'media/getListMediaType',
    });
  }

  setListMediaLoading = async (isLoading: boolean) => {
    await this.props.dispatch({
      type: 'media/setListMediaLoading',
      payload: isLoading,
    });
  };

  setSelectedFolder = async (folder: any) => {
    const { listFolder } = this.props.media;
    this.props.dispatch({
      type: 'media/setListFolderReducer',
      payload: listFolder.map((f: any) => {
        if (f.id === folder.id) {
          return {
            ...f,
            isSelected: true,
          };
        }

        return {
          ...f,
          isSelected: false,
        };
      }),
    });
  };

  toNextFolder = async (item: any) => {
    const { getListFolderParam, getListFileParam, breadScrumb } = this.props.media;
    this.callGetListFolders({
      ...getListFolderParam,
      parent_id: item.id,
    }).then(() => {
      this.callGetListMedia({
        ...getListFileParam,
        folder: item.id,
      }).then(() => {
        const newItem: FolderType = {
          id: item.id,
          name: item.name,
          created_at: '',
          updated_at: '',
          parent_id: '',
          path: '',
        };
        const newList = cloneDeep(breadScrumb);
        newList.push(newItem);
        this.props.dispatch({
          type: 'media/setBreadScrumbReducer',
          payload: newList,
        });
      });
    });
  };

  setAddNewFolderModal = async (modal: any) => {
    const { addNewFolderModal } = this.props.media;
    await this.props.dispatch({
      type: 'media/setAddNewFolderModalReducer',
      payload: {
        ...addNewFolderModal,
        ...modal,
      },
    });
  };

  setAddNewFileModal = async (modal: any) => {
    const { addNewFileModal } = this.props.media;
    await this.props.dispatch({
      type: 'media/setAddNewFileModalReducer',
      payload: {
        ...addNewFileModal,
        ...modal,
      },
    });
  };

  addNewFile = async () => {
    const { createFileParam } = this.props.media;
    const { ether } = this.props.userTest.currentUser;
    const hash = new Keccak(256);
    const byte = await createFileParam.file.arrayBuffer();
    hash.update(Buffer.from(byte));
    const security = hash.digest('hex');
    if (createFileParam.isSigned) {
      await ether?.addDocument(security, createFileParam.isSigned);
    }

    await this.props.dispatch({
      type: 'media/createFile',
      payload: {
        ...createFileParam,
        securityHash: security,
        public_id: security,
        accountId: this.props.userTest.currentUser.id,
        fileId: createFileParam.fileId,
        isSigned: createFileParam.isSigned,
      },
    });

    this.setListLoading(true)
      .then(() => {
        this.callGetListMedia().then(() => {
          this.callGetListFolders().then(() => {
            this.clearCreateFileParam().then(() => {
              this.clearFilelist().then(() => {
                this.setListLoading(false);
              });
            });
          });
        });
      })
      .catch(() => {
        this.setListLoading(false);
      });
  };
  clearFilelist = async () => {
    this.props.dispatch({
      type: 'media/clearAddNewFileNodalFileList',
      payload: '',
    });
  };

  signMedia = async () => {
    Modal.confirm({
      centered: true,
      title: 'Do you want to sign this media?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        // const { createFileParam } = this.props.media;
        // await this.setCreateFileParam({
        //   isSigned: 1,
        // });
        this.setListLoading(true)
          .then(() => {
            this.updateFile({
              isSigned: 1,
            }).then(() => {
              this.callGetListMedia().then(() => {
                this.setListLoading(false);
              });
            });
          })
          .catch(() => {
            this.setListLoading(false);
          });
      },
      onCancel: async () => {},
    });
  };

  showConfirmCreateNewFile = async () => {
    this.setAddNewFileModal({
      isLoading: true,
    })
      .then(() => {
        this.addNewFile().then(() => {
          this.setAddNewFileModal({
            isLoading: false,
          });
        });
      })
      .catch(() => {
        this.setAddNewFileModal({
          isLoading: false,
        });
      });
  };

  createFolder = async () => {
    const { breadScrumb, createFolderParam } = this.props.media;
    const res = await this.props.dispatch({
      type: 'media/createFolder',
      payload: {
        ...createFolderParam,
        parent_id: breadScrumb[breadScrumb.length - 1].id,
      },
    });
    console.log('====================================');
    console.log('Created Folder >>>>', res);
    console.log('====================================');
    this.setListLoading(true);
    this.callGetListFolders()
      .then(() => {
        this.setListLoading(false);
      })
      .catch(() => {
        this.setListLoading(false);
      });
  };

  setEditFileDrawer = async (modal: any) => {
    await this.props.dispatch({
      type: 'media/setEditFileDrawerReducer',
      payload: {
        ...this.props.media.editFileDrawer,
        ...modal,
      },
    });
  };

  setSelectedFile = async (item: any) => {
    this.props.dispatch({
      type: 'media/setSelectedFileReducer',
      payload: {
        ...this.props.media.selectedFile,
        ...item,
      },
    });
  };

  updateFile = async (modal?: any) => {
    const { selectedFile } = this.props.media;

    const param: EditMediaParam = {
      id: selectedFile.id,
      description: selectedFile.description,
      title: selectedFile.title,
      typeId: selectedFile.type.id,
      isSigned: selectedFile.isSigned,
      ...modal,
    };

    this.props.dispatch({
      type: 'media/updateFile',
      payload: param,
    });
  };

  removeMedia = async (item: any) => {
    await this.props.dispatch({
      type: 'media/removeMedia',
      payload: {
        ...item,
        privacy: 0,
      },
    });
  };

  clearCreateFileParam = async () => {
    await this.props.dispatch({
      type: 'media/clearCreateFileParamReducer',
      payload: '',
    });
  };

  breadScrumbNavigate = async (index: number) => {
    const { breadScrumb, getListFileParam } = this.props.media;
    const newBreadScrumb = breadScrumb.slice(0, index + 1);

    await this.setListLoading(true);
    this.setBreadScrumb(newBreadScrumb)
      .then(() => {
        this.callGetListFolders({
          parent_id: breadScrumb[index].id,
        }).then(() => {
          this.callGetListMedia({
            ...getListFileParam,
            folder: breadScrumb[index].id,
          }).then(() => {
            this.setListLoading(false);
          });
        });
      })
      .catch(() => {
        this.setListLoading(false);
      });
  };

  setBreadScrumb = async (list: any) => {
    await this.props.dispatch({
      type: 'media/setBreadScrumbReducer',
      payload: list,
    });
  };

  setSearchListMediaParam = async (params: any) => {
    await this.props.dispatch({
      type: 'media/setSearchListMediaParamReducer',
      payload: {
        ...this.props.media.searchListMediaParam,
        ...params,
      },
    });
  };
  render() {
    const {
      totalItem,
      getListFileParam,
      listMedia,
      listLoading,
      listFolder,
      breadScrumb,
      addNewFileModal,
      addNewFolderModal,
      editFileDrawer,
      selectedFile,
      searchListMediaParam,
    } = this.props.media;

    const signatureOfMedia = (status: number) => {
      if (status === 0) {
        return 'error';
      }

      if (status === 1) {
        return 'warning';
      }
      return 'success';
    };

    const messageOfSignature = (status: number) => {
      if (status === 0) {
        return 'Not Verify';
      }

      if (status === 1) {
        return 'Waiting for server';
      }
      return 'Approved';
    };
    return (
      <>
        <PageContainer>
          <Skeleton active loading={listLoading}>
            <Breadcrumb>
              <Breadcrumb.Item></Breadcrumb.Item>
              {breadScrumb.map((item: FolderType, index: number) => {
                return (
                  <Breadcrumb.Item
                    key={item.id}
                    onClick={() => {
                      this.breadScrumbNavigate(index);
                    }}
                  >
                    {item.name === 'Home' ? <HomeTwoTone /> : item.name}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </Skeleton>

          {/* ========================================================================================================================== */}

          <Skeleton active loading={listLoading}>
            <Row>
              <Col span={12}>
                <Input.Search
                  value={searchListMediaParam.title}
                  onChange={async (e) => {
                    this.setSearchListMediaParam({
                      title: e.target.value,
                    });
                  }}
                  onSearch={async (e) => {
                    await this.setListLoading(true);
                    if (e !== '') {
                      this.callSearchListMedia({
                        title: e,
                      })
                        .then(() => {
                          this.setListLoading(false);
                        })
                        .catch(() => {
                          this.setListLoading(false);
                        });
                    } else {
                      this.callGetListMedia({
                        folder: breadScrumb[breadScrumb.length - 1].id,
                      })
                        .then(() => {
                          this.setListLoading(false);
                        })
                        .catch(() => {
                          this.setListLoading(false);
                        });
                    }
                  }}
                />
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <Space>
                    <Button
                      onClick={() => {
                        this.setAddNewFolderModal({
                          visible: true,
                        });
                      }}
                    >
                      Add New Folder
                    </Button>
                    <Button
                      onClick={() => {
                        this.setAddNewFileModal({
                          visible: true,
                        });
                      }}
                    >
                      Add New File
                    </Button>
                    <Select
                      style={{ width: '100px' }}
                      defaultValue={-1}
                      value={searchListMediaParam.isSigned}
                      onChange={(e) => {
                        this.setListLoading(true)
                          .then(() => {
                            this.callSearchListMedia({
                              isSigned: e === -1 ? undefined : e,
                            }).then(() => {
                              this.setListLoading(false);
                            });
                          })
                          .catch(() => {
                            this.setListLoading(false);
                          });
                      }}
                    >
                      <Select.Option key={'all'} value={-1}>
                        All
                      </Select.Option>
                      <Select.Option key={'Not Sign'} value={0}>
                        Not Sign
                      </Select.Option>
                      <Select.Option key={'Waiting'} value={1}>
                        Waiting
                      </Select.Option>
                      <Select.Option key={'Approved'} value={2}>
                        Approved
                      </Select.Option>
                    </Select>
                    <Select
                      defaultValue={'Current Files'}
                      value={
                        getListFileParam.filter_privacy === 'public'
                          ? 'Current Files'
                          : 'Deleted Files'
                      }
                      showSearch
                      onChange={async (e) => {
                        this.callGetListMedia({
                          filter_privacy: e,
                        });
                      }}
                    >
                      <Select.Option key={'Public'} value={'public'}>
                        Current Files
                      </Select.Option>
                      <Select.Option key={'Private'} value={'private'}>
                        Deleted Files
                      </Select.Option>
                    </Select>
                  </Space>
                </div>
              </Col>
            </Row>
          </Skeleton>
          <Divider></Divider>
          {/* ========================================================================================================================== */}

          {/* ========================================================================================================================== */}
          {/** List Folders */}
          <List
            grid={{
              gutter: 20,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 6,
            }}
            dataSource={listFolder}
            renderItem={(item) => {
              return (
                <>
                  {listFolder.length > 0 && (
                    <Skeleton active loading={listLoading}>
                      <List.Item style={{ height: 50 }}>
                        <Button
                          size="large"
                          type={item.isSelected ? 'primary' : 'default'}
                          style={{
                            width: 200,
                            height: 50,
                            borderRadius: '5px',
                            textAlign: 'left',
                          }}
                          icon={<FolderOpenTwoTone twoToneColor="#ffbb55" />}
                          onClick={() => {
                            this.setSelectedFolder(item);
                          }}
                          onDoubleClick={() => {
                            this.toNextFolder(item);
                          }}
                        >
                          {item.name}
                        </Button>
                      </List.Item>
                    </Skeleton>
                  )}
                </>
              );
            }}
          ></List>

          <Divider></Divider>
          {/* ========================================================================================================================== */}

          {/* ========================================================================================================================== */}

          {/** List Media */}

          <List
            grid={{
              gutter: 10,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 4,
            }}
            split
            style={{ alignItems: 'center', alignContent: 'center' }}
            dataSource={listMedia}
            pagination={{
              current: 1 + getListFileParam.pageNumber,
              total: totalItem,
              pageSize: getListFileParam.limit,
              onChange: async (e) => {
                if (searchListMediaParam.title === '') {
                  if (getListFileParam.limit) {
                    await this.setListLoading(true);

                    this.callGetListMedia({
                      offset: (e - 1) * getListFileParam.limit,
                    })
                      .then(() => {
                        this.setListLoading(false);
                      })
                      .catch(() => {
                        this.setListLoading(false);
                      });
                  }
                } else {
                  await this.setListLoading(true);

                  this.callSearchListMedia({
                    pageNumber: e + 1,
                  })
                    .then(() => {
                      this.setListLoading(false);
                    })
                    .catch(() => {
                      this.setListLoading(false);
                    });
                }
              },
            }}
            header={<>{/* <Skeleton active loading={listLoading}></Skeleton> */}</>}
            renderItem={(item) => {
              return (
                <>
                  {listMedia.length > 0 && (
                    <Skeleton active avatar loading={listLoading}>
                      <List.Item>
                        <Card
                          bordered
                          hoverable
                          onClick={() => {
                            this.setSelectedFile(item);
                          }}
                          style={{ width: '100%', height: '100%' }}
                          cover={
                            item.type.name.toLowerCase().includes('image') ? (
                              <Image src={item.urlPreview} alt="image" height={300} />
                            ) : (
                              <HoverVideoPlayer
                                style={{ height: 300 }}
                                videoSrc={item.urlPreview}
                                restartOnPaused
                              />
                            )
                          }
                          title={item.title}
                          actions={[
                            <Alert
                              style={{ height: '40px' }}
                              type={signatureOfMedia(item.isSigned)}
                              message={messageOfSignature(item.isSigned)}
                              icon={<FormOutlined />}
                              showIcon={true}
                              onClick={() => {
                                if (item.isSigned === 0) {
                                  this.signMedia();
                                }
                              }}
                            ></Alert>,

                            <SettingTwoTone
                              style={{ height: '40px', lineHeight: '40px', fontSize: '1.5em' }}
                              onClick={async () => {
                                this.setSelectedFile(item).then(() => {
                                  this.setEditFileDrawer({
                                    visible: true,
                                  });
                                });
                              }}
                            />,
                          ]}
                        >
                          <Card.Meta />
                        </Card>
                      </List.Item>
                    </Skeleton>
                  )}
                </>
              );
            }}
          ></List>
          {/* ========================================================================================================================== */}

          {/* ========================================================================================================================== */}
          {/** Add New File Modal */}
          <Modal
            centered
            title={
              <>
                <Skeleton active loading={listLoading}>
                  Add New File
                </Skeleton>
              </>
            }
            visible={addNewFileModal.visible}
            closable={false}
            onOk={() => {
              this.showConfirmCreateNewFile();
            }}
            destroyOnClose={true}
            confirmLoading={addNewFileModal.isLoading}
            onCancel={() => {
              this.clearFilelist();
            }}
          >
            <AddNewModal {...this.props}></AddNewModal>
          </Modal>
          {/* ========================================================================================================================== */}

          {/* ========================================================================================================================== */}
          {/** Add New Folder Modal */}

          <Modal
            title={
              <>
                <Skeleton active loading={listLoading}>
                  Create New Folder
                </Skeleton>
              </>
            }
            visible={addNewFolderModal.visible}
            confirmLoading={addNewFolderModal.isLoading}
            closable={false}
            destroyOnClose={true}
            onOk={() => {
              this.setAddNewFolderModal({
                isLoading: true,
              });

              this.createFolder()
                .then(() => {
                  this.setAddNewFolderModal({
                    isLoading: false,
                    visible: false,
                  });
                })
                .catch(() => {
                  this.setAddNewFolderModal({
                    isLoading: false,
                    visible: false,
                  });
                });
            }}
            onCancel={() => {
              this.setAddNewFolderModal({
                visible: false,
              });
            }}
          >
            <AddNewFolderModal {...this.props} />
          </Modal>

          {/* ========================================================================================================================== */}

          {/** Edit File */}
          {/* ========================================================================================================================== */}
          <Drawer
            closable={false}
            destroyOnClose={true}
            visible={editFileDrawer.visible}
            width={700}
            onClose={async () => {
              await this.setEditFileDrawer({
                visible: false,
              });
            }}
            title={
              <>
                <div>{selectedFile.title}</div>
              </>
            }
            footer={
              <>
                <div style={{ textAlign: 'right' }}>
                  <Popconfirm
                    title={`Remove ${selectedFile.title}`}
                    visible={this.state.removeConfirmVisible}
                    onConfirm={async () => {
                      await this.setListLoading(true);

                      await this.setEditFileDrawer({
                        visible: false,
                      });
                      this.removeMedia(selectedFile)
                        .then(() => {
                          this.callGetListMedia().then(() => {
                            this.setListLoading(false).then(() => {
                              this.setState({
                                removeConfirmVisible: false,
                              });
                            });
                          });
                        })
                        .catch(() => {
                          this.setListLoading(false).then(() => {
                            this.setState({
                              removeConfirmVisible: false,
                            });
                          });
                        });
                    }}
                    okButtonProps={{ loading: this.props.media.listLoading }}
                    onCancel={() => {
                      this.setState({
                        removeConfirmVisible: false,
                      });
                    }}
                  >
                    <Button
                      danger
                      onClick={() => {
                        this.setState({
                          removeConfirmVisible: true,
                        });
                      }}
                    >
                      <DeleteTwoTone twoToneColor={'#f64842'} /> Remove
                    </Button>
                  </Popconfirm>
                  <Button
                    type="primary"
                    onClick={async () => {
                      await this.setEditFileDrawer({
                        visible: false,
                      });
                      this.setListLoading(true)
                        .then(() => {
                          this.updateFile().then(() => {
                            this.callGetListMedia().then(() => {
                              this.setListLoading(false);
                            });
                          });
                        })
                        .catch(() => {
                          this.setListLoading(false);
                        });
                    }}
                  >
                    <EditOutlined /> Update Media
                  </Button>
                </div>
              </>
            }
          >
            <EditMediaDrawer {...this.props}></EditMediaDrawer>
          </Drawer>
          {/* ========================================================================================================================== */}
        </PageContainer>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(Media);

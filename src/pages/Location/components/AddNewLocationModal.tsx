import { geocoding } from '@/services/MapService/RapidAPI';
import { Col, Divider, Input, Modal, Row, Select } from 'antd';
import * as React from 'react';
import type {
  BrandModelState,
  CampaignModelState,
  DeviceModelState,
  Dispatch,
  LocationModelState,
} from 'umi';
import { connect } from 'umi';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { LOCATION_DISPATCHER } from '..';
import LeafletMapComponent from './LeafletMapComponent';
import L from 'leaflet';
import AutoCompleteComponent from '@/pages/common/AutoCompleteComponent';

export type AddNewLocationModalProps = {
  dispatch: Dispatch;
  location: LocationModelState;
  deviceStore: DeviceModelState;
  brand: BrandModelState;
  campaign: CampaignModelState;
};

class AddNewLocationModal extends React.Component<AddNewLocationModalProps> {
  setAddNewLocationModal = async (modal: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setAddNewLocationModalReducer`,
      payload: {
        ...this.props.location.addNewLocationModal,
        ...modal,
      },
    });
  };

  setCreateLocationParam = async (param: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setCreateLocationParamReducer`,
      payload: {
        ...this.props.location.createLocationParam,
        ...param,
      },
    });
  };

  createNewLocation = async () => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/createLocation`,
      payload: this.props.location.createLocationParam,
    });
  };

  onCreateNewLocation = async () => {
    this.setAddNewLocationModal({
      isLoading: true,
    })
      .then(() => {
        this.createNewLocation().then(() => {
          this.callGetListLocations().then(() => {
            this.clearCreateLocationParam().then(() => {
              this.setAddNewLocationModal({
                isLoading: false,
                visible: false,
              });
            });
          });
        });
      })
      .catch(() => {
        this.setAddNewLocationModal({
          isLoading: false,
          visible: false,
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

  clearCreateLocationParam = async () => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/clearCreateLocationParamReducer`,
    });
  };

  setAddressSearchList = async (payload: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setAddressSearchListReducer`,
      payload,
    });
  };

  convertAddress = async (address: string) => {
    const res = await geocoding(address);

    return res;
  };

  handleAutoCompleteSearch = async (location: string, address: string) => {
    const { mapComponent } = this.props.location;
    if (address !== '') {
      // const { data } = await this.convertAddress(address);

      // const addressList = data.results[0];
      // const { lat, lng } = addressList.geometry.location;
      const coordination = location.split('-');
      const lat = Number.parseFloat(coordination[0]);
      const lon = Number.parseFloat(coordination[1]);
      console.log('====================================');
      console.log(coordination);
      console.log('====================================');
      if (mapComponent.map) {
        mapComponent.map.setView([lat, lon]);

        if (mapComponent.marker) {
          mapComponent.marker.setLatLng([lat, lon]);
          L.popup()
            .setLatLng([lat, lon])
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
            .openOn(mapComponent.map);
        } else {
          const marker = L.marker([lat, lon]).addTo(mapComponent.map);
          L.popup()
            .setLatLng([lat, lon])
            .setContent('<p>Hello world!<br />This is a nice popup.</p>')
            .openOn(mapComponent.map);
          await this.setMapComponent({
            marker,
          });
        }
      }

      await this.setCreateLocationParam({
        longitude: lon,
        latitude: lat,
        address,
      });
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
  render() {
    const { addNewLocationModal, createLocationParam, mapComponent } = this.props.location;

    const { listDeviceTypes } = this.props.deviceStore;

    const { listBrand } = this.props.brand;

    console.log('====================================');
    console.log(createLocationParam);
    console.log('====================================');
    return (
      <>
        <Modal
          title="Add New Location"
          visible={addNewLocationModal.visible}
          confirmLoading={addNewLocationModal.isLoading}
          width={'80%'}
          afterClose={() => {
            if (mapComponent.map) {
              if (mapComponent.marker) {
                mapComponent.marker.removeFrom(mapComponent.map);
                this.setMapComponent({
                  marker: undefined,
                });
              }
            }
            this.clearCreateLocationParam();
          }}
          destroyOnClose={true}
          closable={false}
          onOk={() => {
            this.onCreateNewLocation();
          }}
          onCancel={() => {
            this.setAddNewLocationModal({
              visible: false,
            });
          }}
        >
          <Row>
            <Col span={10}>Name</Col>
            <Col span={14}>
              <Input
                value={createLocationParam.name}
                onChange={(e) => {
                  this.setCreateLocationParam({
                    name: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Description</Col>
            <Col span={14}>
              <Input
                value={createLocationParam.description}
                onChange={(e) => {
                  this.setCreateLocationParam({
                    description: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Address</Col>
            <Col span={14}>
              {/* <Input
                value={createLocationParam.address}
                onChange={(e) => {
                  this.setCreateLocationParam({
                    address: e.target.value,
                  });
                }}
              /> */}

              {/* <GooglePlacesAutocomplete
                apiKey="AIzaSyCuMJ3dhADqNoE4tGuWTI3_NlwBihj5BtE"
                apiOptions={{
                  language: 'vi',
                  region: 'vi',
                }}
                key="map"
                selectProps={{
                  // value: createLocationParam.address,
                  inputValue: createLocationParam.address,
                  isLoading: addNewLocationModal.addressSearchBoxLoading,
                  styles: {
                    menu: (provided: any) => {
                      return {
                        ...provided,
                        zIndex: 9999,
                      };
                    },
                  },
                  onChange: async (e: any) => {
                    console.log('====================================');
                    console.log(e);
                    console.log('====================================');
                    await this.setCreateLocationParam({
                      address: e.value.description,
                    });
                    await this.handleSearch(e.value.description);
                  },
                  escapeClearsValue: false,
                  blurInputOnSelect: true,
                  // captureMenuScroll: true,
                  controlShouldRenderValue: true,
                  // closeMenuOnSelect: false,
                  onInputChange: (e: any) => {
                    this.setCreateLocationParam({
                      address: e,
                    });
                  },
                }}
              /> */}
              <AutoCompleteComponent
                {...this.props}
                inputValue={createLocationParam.address}
                onInputChange={(e) => {
                  this.setCreateLocationParam({
                    address: e,
                  });
                }}
                handleOnSelect={(e, address) => {
                  this.handleAutoCompleteSearch(e, address);
                }}
              />
              {/* {createLocationParam.address !== '' && <Input value={createLocationParam.address} />} */}
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={24}>
              <LeafletMapComponent {...this.props} />
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Type</Col>
            <Col span={14}>
              <Select
                style={{ width: '100%' }}
                onChange={(e) => {
                  console.log('====================================');
                  console.log(e);
                  console.log('====================================');
                  this.setCreateLocationParam({
                    typeId: e,
                  });
                }}
              >
                {listDeviceTypes.map((type: any) => {
                  return (
                    <Select.Option key={type.id} value={type.id}>
                      {type.typeName}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={10}>Brand</Col>
            <Col span={14}>
              <Select
                style={{ width: '100%' }}
                onChange={(e) => {
                  this.setCreateLocationParam({
                    brandId: e,
                  });
                }}
              >
                {listBrand.map((brand) => {
                  return (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(AddNewLocationModal);

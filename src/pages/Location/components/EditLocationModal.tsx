import AutoCompleteComponent from '@/pages/common/AutoCompleteComponent';
import type { UpdateLocationParam } from '@/services/LocationService/LocationService';
import { reverseGeocoding } from '@/services/MapService/LocationIQService';
import { geocoding } from '@/services/MapService/RapidAPI';
import { Col, Divider, Input, Modal, Row, Select, Skeleton } from 'antd';
import L from 'leaflet';
import * as React from 'react';
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import type {
  BrandModelState,
  CampaignModelState,
  DeviceModelState,
  Dispatch,
  LocationModelState,
} from 'umi';
import { connect } from 'umi';
import { LOCATION_DISPATCHER } from '..';
import LeafletMapComponent from './LeafletMapComponent';

export type EditLocationModalProps = {
  dispatch: Dispatch;
  location: LocationModelState;
  deviceStore: DeviceModelState;
  brand: BrandModelState;
  campaign: CampaignModelState;
};

class EditLocationModal extends React.Component<EditLocationModalProps> {
  componentDidUpdate = () => {
    const { mapComponent, selectedLocation } = this.props.location;
    if (mapComponent.map) {
      const lat = Number.parseFloat(selectedLocation.latitude);
      const lng = Number.parseFloat(selectedLocation.longitude);
      mapComponent.map.setView([lat, lng]);
      if (!mapComponent.marker) {
        if (selectedLocation.longitude !== '' && selectedLocation.latitude !== '') {
          const marker = L.marker([lat, lng]);
          marker.addTo(mapComponent.map);

          this.setMapComponent({
            marker,
          });
        }
      }
    }
  };

  setEditLocationModal = async (modal: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setEditLocationModalReduder`,
      payload: {
        ...this.props.location.editLocationModal,
        ...modal,
      },
    });
  };

  reverseGeocoding = async (lat: string, lng: string) => {
    const res = await reverseGeocoding(Number.parseFloat(lat), Number.parseFloat(lng));
    return res;
  };

  setSelectedLocation = async (item: any) => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/setSelectedLocationReducer`,
      payload: {
        ...this.props.location.selectedLocation,
        ...item,
      },
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
  updateLocation = async () => {
    const { selectedLocation } = this.props.location;
    console.log('====================================');
    console.log('Update Location', selectedLocation);
    console.log('====================================');

    const updateParam: UpdateLocationParam = {
      id: selectedLocation.id,
      brandId: selectedLocation.brandId,
      description: selectedLocation.description,
      isActive: selectedLocation.isActive,
      isApprove: selectedLocation.isApprove,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      name: selectedLocation.name,
      typeId: selectedLocation.typeId,
    };

    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/updateLocation`,
      payload: updateParam,
    });
  };

  updateConfirm = async () => {
    this.setEditLocationModal({
      isLoading: true,
    })
      .then(() => {
        this.updateLocation().then(() => {
          this.callGetListLocations().then(() => {
            this.setEditLocationModal({
              visible: false,
              isLoading: false,
            });
          });
        });
      })
      .catch(() => {
        this.setEditLocationModal({
          visible: false,
          isLoading: false,
        });
      });
  };

  convertAddress = async (address: string) => {
    const res = await geocoding(address);

    return res;
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

  handleAutoCompleteSearch = async (address: string) => {
    const { mapComponent } = this.props.location;
    if (address !== '') {
      // const { data } = await this.convertAddress(address);

      // const addressList = data.results[0];
      // const { lat, lng } = addressList.geometry.location;
      const coordination = address.split('-');
      const lat = Number.parseFloat(coordination[0]);
      const lon = Number.parseFloat(coordination[1]);
      console.log('====================================');
      console.log(coordination, lat.toString(), lon.toString());
      console.log('====================================');
      if (mapComponent.map) {
        mapComponent.map.setView([lat, lon]);

        if (mapComponent.marker) {
          mapComponent.marker.setLatLng([lat, lon]);
        } else {
          const marker = L.marker([lat, lon]).addTo(mapComponent.map);
          // marker.setPopupContent('Marker');
          this.setMapComponent({
            marker,
          });
        }
      }

      // console.log('====================================');
      // console.log(coordination, lat.toString(), lon.toString());
      // console.log('====================================');

      // await this.setSelectedLocation({
      //   longitude: lon,
      //   latitude: lat,
      //   address,
      // });
    }
  };

  clearSelectedLocation = async () => {
    await this.props.dispatch({
      type: `${LOCATION_DISPATCHER}/clearSelectedLocationReducer`,
    });
  };
  render() {
    const { selectedLocation, editLocationModal, mapComponent } = this.props.location;

    const { listDeviceTypes } = this.props.deviceStore;

    const { listBrand } = this.props.brand;

    console.log('====================================');
    console.log('Selected Location>>>>', selectedLocation);
    console.log('====================================');
    return (
      <>
        <Modal
          title="Update Location"
          destroyOnClose={true}
          width={'80%'}
          visible={editLocationModal.visible}
          confirmLoading={editLocationModal.isLoading}
          afterClose={() => {
            if (mapComponent.map) {
              if (mapComponent.marker) {
                mapComponent.marker.removeFrom(mapComponent.map);
                this.setMapComponent({
                  marker: undefined,
                });
              }
            }
            this.clearSelectedLocation();
          }}
          closable={false}
          onOk={() => {
            this.updateConfirm();
          }}
          onCancel={() => {
            this.setEditLocationModal({
              visible: false,
            });
          }}
        >
          <Skeleton active loading={editLocationModal.isLoading}>
            <Row>
              <Col span={10}>Name</Col>
              <Col span={14}>
                <Input
                  value={selectedLocation.name}
                  onChange={(e) => {
                    this.setSelectedLocation({
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
                  value={selectedLocation.description}
                  onChange={(e) => {
                    this.setSelectedLocation({
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
                {/* <GooglePlacesAutocomplete
                  apiKey="AIzaSyCuMJ3dhADqNoE4tGuWTI3_NlwBihj5BtE"
                  apiOptions={{
                    language: 'vi',
                    region: 'vi',
                  }}
                  key="map"
                  selectProps={{
                    // value: createLocationParam.address,
                    inputValue: selectedLocation.address,

                    styles: {
                      menu: (provided: any) => {
                        return {
                          ...provided,
                          zIndex: 9999,
                        };
                      },
                    },
                    onChange: async (e: any) => {
                      await this.setSelectedLocation({
                        address: e.value.description,
                      });
                      await this.handleSearch(e.value.description);
                    },
                    // escapeClearsValue: false,
                    blurInputOnSelect: true,
                    // captureMenuScroll: true,
                    // controlShouldRenderValue: true,
                    // closeMenuOnSelect: false,
                    onInputChange: (e: any) => {
                      this.setSelectedLocation({
                        address: e,
                      });
                    },
                  }}
                /> */}
                <AutoCompleteComponent
                  {...this.props}
                  inputValue={selectedLocation.address}
                  onInputChange={(e) => {
                    this.setSelectedLocation({
                      address: e,
                    });
                  }}
                  handleOnSelect={async (e, address) => {
                    await this.handleAutoCompleteSearch(e);

                    const coordination = e.split('-');
                    const lat = coordination[0];
                    const lon = coordination[1];
                    await this.setSelectedLocation({
                      longitude: lon,
                      latitude: lat,
                      address,
                    });
                  }}
                />
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
                  defaultValue={selectedLocation.typeId}
                  onChange={(e) => {
                    console.log('====================================');
                    console.log(e);
                    console.log('====================================');
                    this.setSelectedLocation({
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
                  defaultValue={selectedLocation.brandId}
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    this.setSelectedLocation({
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
          </Skeleton>
        </Modal>
      </>
    );
  }
}

export default connect((state) => ({ ...state }))(EditLocationModal);

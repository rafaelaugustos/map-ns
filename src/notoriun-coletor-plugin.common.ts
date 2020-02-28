import { Color } from "tns-core-modules/color/color";
import { ContentView } from "tns-core-modules/ui/content-view";
import { booleanConverter, Property } from "tns-core-modules/ui/core/view";

export enum MapStyle {
  GRAY = <any>"gray",
  HYBRID = <any>"hybrid",
  NATIONAL_GEOGRAPHIC = <any>"national_geographic",
  OCEANS = <any>"oceans",
  OSM = <any>"osm",
  SATELLITE = <any>"satellite",
  STREETS = <any>"streets",
  TOPO = <any>"topographic"
}
export interface LatLng {
  lat: number;
  lng: number;
  zoom?: number;
  json?:string;
}

export interface QueryRenderedFeaturesOptions {
  point: LatLng;
  layerIds?: string[];
}

export interface Feature {
  id: any;
  type?: string;
  properties: Object;
}

export interface AddPolygonOptions {
  /**
   * Set this in case you want to later pass it to 'removePolygons'. TODO doesn't exist yet ;)
   */
  id?: any;
  points: LatLng[];

  spatialReference?: string;

  fillColor?: string | Color;
  /**
   * Transparency / alpha, ranging from 0 to 1.
   * Default fully opaque (1).
   */
  fillOpacity?: number;

  /**
   * The line around the polygon. Barely visible on Android.
   */
  strokeColor?: string | Color;
  /**
   * iOS only.
   */
  strokeWidth?: number;
  /**
   * iOS only.
   */
  strokeOpacity?: number;
}

export interface UserLocation {
  location: LatLng;
  speed: number;
}

export interface SetCenterOptions extends LatLng {
  animated?: boolean;
}
export interface ShowCallOutOptions extends LatLng {
  description?:string;
}

export interface AddPolylineOptions {
  /**
   * Set this in case you want to later pass it to 'removePolylines'.
   */
  id?: any;
  /**
   * Width of the line, default 5.
   */
  width?: number;
  spatialReference?: string;

  /**
   * Color of the line, default black.
   */
  color?: string | Color;
  /**
   * Transparency / alpha, ranging from 0 to 1.
   * Default fully opaque (1).
   */
  opacity?: number;
  points: LatLng[];
}

export interface EsrimapMarker extends LatLng {
  /**
   * Set this in case you want to later pass it to 'removeMarker'.
   */
  id?: any;
  title?: string;
  label?: string;
  description?: string;

  type?: string;
  url?: string;
  permission?: string;

  spatialReference?: string;
  /**
   * Prefix with 'res://' and load a file from the resources folder.
   * Details on how 'res://' is used can be found here: https://docs.nativescript.org/ui/images#load-images-from-resource
   * Example: "res://icon.file"
   */
  icon?: string;

  width?: number;
  height?: number;
  xoffset?: number;
  yoffset?: number;
  /**
   * The preferred way is using the 'icon' property, but you can still reference a local file directly.
   * Example: "res/markers/green_pin_marker.png"
   */
  iconPath?: string;
  /**
   * A callback function to invoke when the marker is tapped.
   */
  onTap?: Function;
  /**
   * A callback function to invoke when the callout (popup) of this marker is tapped.
   */
  onCalloutTap?: Function;
  /**
   * Set to true to select the marker when rendered - effectively showing any configured callout.
   * Note that only 1 callout will be shown at any time on a Esrimap map.
   * Default false.
   */
  selected?: boolean;
  update?: (newSettings: EsrimapMarker) => void;
  ios?: any;
  android?: any;
}

export interface SetZoomLevelOptions {
  level: number;
  animated: boolean;
}

export interface SetTiltOptions {
  /**
   * default 30 (degrees)
   */
  tilt: number;
  /**
   * default 5000 (milliseconds)
   */
  duration: number;
}

export interface ShowOptionsMargins {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface Bounds {
  north: number;
  east: number;
  south: number;
  west: number;
}

export interface Viewport {
  bounds: Bounds;
  zoomLevel: number;
}

export interface SetViewportOptions {
  bounds?: Bounds;
  /**
   * Add an animation of about 1 second.
   * Default true.
   */
  animated?: boolean;
  json?: string;
  /**
   * Optional padding.
   */
  padding?: number;
}

export interface DeleteOfflineRegionOptions {
  /**
   * The name of the offline region to delete.
   */
  name: string;
}

export interface EsrimapCluster {
  points: number;
  color: string;
}

export interface AddGeoJsonClusteredOptions {
  /**
   * A unique identifier, like: "earthquakes"
   */
  name: string;
  /**
   * URL, like: "https://www.Esrimap.com/Esrimap-gl-js/assets/earthquakes.geojson"
   */
  data: string;
  clusterMaxZoom?: number;
  clusterRadius?: number;
  clusters?: Array<EsrimapCluster>;
}

export interface AddSourceOptions {
  id: string;

  url: string;
  type: string;
}

export interface AddLayerOptions {
  id: string;
  source: string;
  sourceLayer: string;
  type: string;

  /**
   * 'circle' paint properties
   */
  circleColor?: string | Color;
  circleOpacity?: number;
  circleRadius?: number;
  circleStrokeColor?: string | Color;
  circleStrokeWidth?: number;

  /**
   * 'fill' paint properties
   */
  fillColor?: string | Color;
  fillOpacity?: number;

  /**
   * 'line' layout properties
   */
  lineCap?: string;
  lineJoin?: string;

  /**
   * 'line' paint properties
   */
  lineColor?: string | Color;
  lineOpacity?: number;
  lineWidth?: number;
}

export type UserTrackingMode = "NONE" | "FOLLOW" | "FOLLOW_WITH_HEADING" | "FOLLOW_WITH_COURSE";

export interface TrackUserOptions {
  mode: UserTrackingMode;
  /**
   * iOS only, as Android is always animated. Default true (because of Android).
   */
  animated?: boolean;
}

export interface AddExtrusionOptions {

}

export interface OfflineRegion {
  name: string;
  bounds: Bounds;
  minZoom: number;
  maxZoom: number;
  style: MapStyle;
}

export interface DownloadProgress {
  name: string;
  completed: number;
  expected: number;
  percentage: number;
  complete: boolean;
  /**
   * Android only, the size in bytes of the download so far.
   */
  completedSize?: number;
}

export interface DownloadOfflineRegionOptions extends OfflineRegion {
  onProgress?: (data: DownloadProgress) => void;
  /**
   * Optional, used on Android only.
   * Set this, in case no map has been show yet (and thus, no accessToken has been passed in yet).
   */
  accessToken?: string;
}

export interface ListOfflineRegionsOptions {
  /**
   * Optional, used on Android only.
   * Set this, in case no map has been show yet (and thus, no accessToken has been passed in yet).
   */
  accessToken?: string;
}

/**
 * The options object passed into the show function.
 */
export interface ShowOptions {
  accessToken: string;
  /**
   * default 'streets'
   */
  style?: MapStyle;
  margins?: ShowOptionsMargins;
  center?: LatLng;
  /**
   * default 0 (which is almost the entire planet)
   */
  zoomLevel?: number;
  /**
   * default false (true requires adding `NSLocationWhenInUseUsageDescription` or `NSLocationAlwaysUsageDescription` to the .plist)
   */
  showUserLocation?: boolean;
  /**
   * default false (required for the 'starter' plan)
   */
  hideLogo?: boolean;
  /**
   * default true
   */
  hideAttribution?: boolean;
  /**
   * default false
   */
  hideCompass?: boolean;
  /**
   * default false
   */
  disableRotation?: boolean;
  /**
   * default false
   */
  disableScroll?: boolean;
  /**
   * default false
   */
  disableZoom?: boolean;
  /**
   * default false
   */
  disableTilt?: boolean;
  /**
   * Immediately add markers to the map
   */
  markers?: EsrimapMarker[];
}

export interface ShowResult {
  ios: any
  /* MGLMapView */
  ;
  android: any
  /* com.Esrimap.Esrimapsdk.maps.MapView */
  ;
}

export interface AnimateCameraOptions {
  target: LatLng;
  /**
   * For Android, 0.0 - 20.0
   */
  zoomLevel?: number;
  /**
   * For iOS, in meters from the ground
   */
  altitude?: number;
  bearing?: number;
  tilt?: number;
  duration?: number;
}

export interface EsrimapCommonApi {
  requestFineLocationPermission(): Promise<any>;

  hasFineLocationPermission(): Promise<boolean>;
}

export interface EsrimapApi {
  show(options: ShowOptions): Promise<ShowResult>;

  hide(): Promise<any>;

  unhide(): Promise<any>;

  destroy(nativeMap?: any): Promise<any>;

  setMapStyle(style: string | MapStyle, nativeMap?: any): Promise<any>;

  addMarkers(markers: EsrimapMarker[], nativeMap?: any): Promise<any>;

  removeMarkers(options?: any, nativeMap?: any): Promise<any>;

  setCenter(options: SetCenterOptions, nativeMap?: any): Promise<any>;

  showCallout(options: ShowCallOutOptions, nativeMap?: any): Promise<any>;

  clearCallouts(nativeMap?: any): Promise<any>;

  setCenterOnCurrentLocation( nativeMap?: any): Promise<any>;

  getCenter(nativeMap?: any): Promise<LatLng>;

  setZoomLevel(options: SetZoomLevelOptions, nativeMap?: any): Promise<any>;

  getZoomLevel(nativeMap?: any): Promise<number>;

  setTilt(options: SetTiltOptions, nativeMap?: any): Promise<any>;

  getTilt(nativeMap?: any): Promise<number>;

  getUserLocation(nativeMap?: any): Promise<UserLocation>;

  trackUser(options: TrackUserOptions, nativeMap?: any): Promise<void>;

  queryRenderedFeatures(options: QueryRenderedFeaturesOptions, nativeMap?: any): Promise<Array<Feature>>;

  addPolygon(options: AddPolygonOptions, nativeMap?: any): Promise<any>;

  removePolygons(ids?: Array<any>, nativeMap?: any): Promise<any>;

  addPolyline(options: AddPolylineOptions, nativeMap?: any): Promise<any>;

  removePolylines(ids?: Array<any>, nativeMap?: any): Promise<any>;

  animateCamera(options: AnimateCameraOptions, nativeMap?: any): Promise<any>;

  setOnMapClickListener(listener: (data: LatLng) => void, nativeMap?): Promise<any>;

  setOnMapLongClickListener(listener: (data: LatLng) => void, nativeMap?): Promise<any>;

  setOnScrollListener(listener: (data?: LatLng) => void, nativeMap?: any): Promise<void>;

  setOnFlingListener(listener: () => void, nativeMap?: any): Promise<any>;

  setOnCameraMoveListener(listener: () => void, nativeMap?: any): Promise<any>;

  setOnCameraMoveCancelListener(listener: () => void, nativeMap?: any): Promise<any>;

  setOnCameraIdleListener(listener: () => void, nativeMap?: any): Promise<any>;

  requestFineLocationPermission(): Promise<any>;

  hasFineLocationPermission(): Promise<boolean>;

  getViewport(nativeMap?: any): Promise<Viewport>;

  setViewport(options: SetViewportOptions, nativeMap?: any): Promise<any>;

  downloadOfflineRegion(options: DownloadOfflineRegionOptions): Promise<any>;

  listOfflineRegions(options?: ListOfflineRegionsOptions): Promise<Array<OfflineRegion>>;

  deleteOfflineRegion(options: DeleteOfflineRegionOptions): Promise<any>;

  addGeoJsonClustered(options: AddGeoJsonClusteredOptions): Promise<any>;

  addSource(options: AddSourceOptions): Promise<any>;

  removeSource(id: string, nativeMap?: any): Promise<any>;

  addLayer(options: AddLayerOptions): Promise<any>;

  removeLayer(id: string, nativeMap?: any): Promise<any>;

  // addExtrusion(options: AddExtrusionOptions): Promise<any>;
}

export abstract class EsrimapCommon implements EsrimapCommonApi {
  public static defaults = {
    style: MapStyle.TOPO.toString(),
    mapStyle: MapStyle.TOPO.toString(),
    margins: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    zoomLevel: 0, // 0 (a big part of the world) to 20 (street level)
    showUserLocation: false, // true requires adding `NSLocationWhenInUseUsageDescription` or `NSLocationAlwaysUsageDescription` in the .plist
    hideLogo: false, // required for the 'starter' plan
    hideAttribution: true,
    hideCompass: false,
    disableRotation: false,
    disableScroll: false,
    disableZoom: false,
    disableTilt: false,
    delay: 0
  };

  public static merge(obj1: {}, obj2: {}): any { // Our merge function
    let result = {}; // return result
    for (let i in obj1) {      // for every property in obj1
      if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
        result[i] = this.merge(obj1[i], obj2[i]); // if it's an object, merge
      } else {
        result[i] = obj1[i]; // add it to result
      }
    }
    for (let i in obj2) { // add the remaining properties from object 2
      if (i in result) { // conflict
        continue;
      }
      result[i] = obj2[i];
    }
    return result;
  }

  requestFineLocationPermission(): Promise<any> {
    return new Promise(resolve => {
      resolve();
    });
  }

  hasFineLocationPermission(): Promise<boolean> {
    return new Promise(resolve => {
      resolve(true);
    });
  }
}

/*************** XML definition START ****************/
export interface EsrimapViewApi {
  // these functions can be called after the mapReady event fired
  addMarkers(markers: EsrimapMarker[]): Promise<any>;
  
  removeMarkers(options?: any): Promise<any>;

  queryRenderedFeatures(options: QueryRenderedFeaturesOptions): Promise<Array<Feature>>;

  setOnMapClickListener(listener: (data: LatLng) => void): Promise<any>;

  setOnMapLongClickListener(listener: (data: LatLng) => void): Promise<any>;

  setOnScrollListener(listener: (data?: LatLng) => void): Promise<void>;

  setOnFlingListener(listener: () => void): Promise<any>;

  setOnCameraMoveListener(listener: () => void): Promise<any>;

  setOnCameraMoveCancelListener(listener: () => void): Promise<any>;

  setOnCameraIdleListener(listener: () => void): Promise<any>;

  getViewport(): Promise<Viewport>;

  setViewport(options: SetViewportOptions): Promise<any>;

  setMapStyle(style: string | MapStyle): Promise<any>;

  getCenter(): Promise<LatLng>;

  setCenter(options: SetCenterOptions): Promise<any>;

  setCenterOnCurrentLocation(): Promise<any>;

  showCallout(options:ShowCallOutOptions): Promise<any>;

  clearCallouts(): Promise<any>;

  getZoomLevel(): Promise<number>;

  setZoomLevel(options: SetZoomLevelOptions): Promise<any>;

  getTilt(): Promise<number>;

  setTilt(options: SetTiltOptions): Promise<any>;

  getUserLocation(): Promise<UserLocation>;

  trackUser(options: TrackUserOptions): Promise<any>;

  queryRenderedFeatures(options: QueryRenderedFeaturesOptions): Promise<Array<Feature>>;

  addPolygon(options: AddPolygonOptions): Promise<any>;

  removePolygons(ids?: Array<any>): Promise<any>;

  addPolyline(options: AddPolylineOptions): Promise<any>;

  removePolylines(ids?: Array<any>): Promise<any>;

  animateCamera(options: AnimateCameraOptions): Promise<any>;

  destroy(): Promise<any>;
}

export abstract class EsrimapViewCommonBase extends ContentView implements EsrimapViewApi {
  protected Esrimap: EsrimapApi;

  abstract getNativeMapView(): any;

  addMarkers(markers: EsrimapMarker[]): Promise<any> {
    return this.Esrimap.addMarkers(markers, this.getNativeMapView());
  }

  removeMarkers(options?: any): Promise<any> {
    return this.Esrimap.removeMarkers(options, this.getNativeMapView());
  }

  setOnMapClickListener(listener: (data: LatLng) => void): Promise<any> {
    return this.Esrimap.setOnMapClickListener(listener, this.getNativeMapView());
  }

  setOnMapLongClickListener(listener: (data: LatLng) => void): Promise<any> {
    return this.Esrimap.setOnMapLongClickListener(listener, this.getNativeMapView());
  }

  setOnScrollListener(listener: (data?: LatLng) => void, nativeMap?: any): Promise<void> {
    console.log("setOnScrollListener");
    return this.Esrimap.setOnScrollListener(listener, this.getNativeMapView());
  }

  setOnFlingListener(listener: () => void, nativeMap?: any): Promise<any> {
    return this.Esrimap.setOnFlingListener(listener, this.getNativeMapView());
  }

  setOnCameraMoveListener(listener: () => void, nativeMap?: any): Promise<any> {
    return this.Esrimap.setOnCameraMoveListener(listener, this.getNativeMapView());
  }

  setOnCameraMoveCancelListener(listener: () => void, nativeMap?: any): Promise<any> {
    return this.Esrimap.setOnCameraMoveCancelListener(listener, this.getNativeMapView());
  }

  setOnCameraIdleListener(listener: () => void, nativeMap?: any): Promise<any> {
    return this.Esrimap.setOnCameraIdleListener(listener, this.getNativeMapView());
  }

  getViewport(): Promise<Viewport> {
    return this.Esrimap.getViewport(this.getNativeMapView());
  }

  setViewport(options: SetViewportOptions): Promise<any> {
    return this.Esrimap.setViewport(options, this.getNativeMapView());
  }

  setMapStyle(style: string | MapStyle): Promise<any> {
    return this.Esrimap.setMapStyle(style, this.getNativeMapView());
  }

  getCenter(): Promise<LatLng> {
    return this.Esrimap.getCenter(this.getNativeMapView());
  }

  setCenter(options: SetCenterOptions): Promise<any> {
    return this.Esrimap.setCenter(options, this.getNativeMapView());
  }

  setCenterOnCurrentLocation(): Promise<any> {
    return this.Esrimap.setCenterOnCurrentLocation(this.getNativeMapView());
  }

  showCallout(options: ShowCallOutOptions): Promise<any> {
    return this.Esrimap.showCallout(options, this.getNativeMapView());
  }
  clearCallouts(): Promise<number> {
    return this.Esrimap.clearCallouts(this.getNativeMapView());
  }

  getZoomLevel(): Promise<number> {
    return this.Esrimap.getZoomLevel(this.getNativeMapView());
  }

  setZoomLevel(options: SetZoomLevelOptions): Promise<any> {
    return this.Esrimap.setZoomLevel(options, this.getNativeMapView());
  }

  getTilt(): Promise<number> {
    return this.Esrimap.getTilt(this.getNativeMapView());
  }

  setTilt(options: SetTiltOptions): Promise<any> {
    return this.Esrimap.setTilt(options, this.getNativeMapView());
  }

  getUserLocation(): Promise<UserLocation> {
                console.log("getUserLocation");

    return this.Esrimap.getUserLocation(this.getNativeMapView());
  }

  trackUser(options: TrackUserOptions): Promise<any> {
            console.log("trackUser");

    return this.Esrimap.trackUser(options, this.getNativeMapView());
  }

  queryRenderedFeatures(options: QueryRenderedFeaturesOptions): Promise<Array<Feature>> {
        console.log("queryRenderedFeatures");

    return this.Esrimap.queryRenderedFeatures(options, this.getNativeMapView());
  }

  addPolygon(options: AddPolygonOptions): Promise<any> {
    return this.Esrimap.addPolygon(options, this.getNativeMapView());
  }

  removePolygons(ids?: Array<any>): Promise<any> {
    return this.Esrimap.removePolygons(ids, this.getNativeMapView());
  }

  addPolyline(options: AddPolylineOptions): Promise<any> {
    return this.Esrimap.addPolyline(options, this.getNativeMapView());
  }

  removePolylines(ids?: Array<any>): Promise<any> {
    return this.Esrimap.removePolylines(ids, this.getNativeMapView());
  }

  animateCamera(options: AnimateCameraOptions): Promise<any> {
                console.log("animateCamera");

    return this.Esrimap.animateCamera(options, this.getNativeMapView());
  }

  destroy(): Promise<any> {
            console.log("destroy");

    try {
    return this.Esrimap.destroy(this.getNativeMapView());
  }catch (ex){
    console.log("destroy catch");
  }
  return null;
  }
}

export const zoomLevelProperty = new Property<EsrimapViewCommonBase, number>({name: "zoomLevel"});
zoomLevelProperty.register(EsrimapViewCommonBase);

export const accessTokenProperty = new Property<EsrimapViewCommonBase, string>({name: "accessToken"});
accessTokenProperty.register(EsrimapViewCommonBase);

export const mapStyleProperty = new Property<EsrimapViewCommonBase, string>({name: "mapStyle"});
mapStyleProperty.register(EsrimapViewCommonBase);

export const latitudeProperty = new Property<EsrimapViewCommonBase, number>({name: "latitude"});
latitudeProperty.register(EsrimapViewCommonBase);

export const longitudeProperty = new Property<EsrimapViewCommonBase, number>({name: "longitude"});
longitudeProperty.register(EsrimapViewCommonBase);

export const showUserLocationProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "showUserLocation",
  defaultValue: EsrimapCommon.defaults.showUserLocation,
  valueConverter: booleanConverter
});
showUserLocationProperty.register(EsrimapViewCommonBase);

export const hideLogoProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "hideLogo",
  defaultValue: EsrimapCommon.defaults.hideLogo,
  valueConverter: booleanConverter
});
hideLogoProperty.register(EsrimapViewCommonBase);


export const hideAttributionProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "hideAttribution",
  defaultValue: EsrimapCommon.defaults.hideAttribution,
  valueConverter: booleanConverter
});
hideAttributionProperty.register(EsrimapViewCommonBase);

export const hideCompassProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "hideCompass",
  defaultValue: EsrimapCommon.defaults.hideCompass,
  valueConverter: booleanConverter
});
hideCompassProperty.register(EsrimapViewCommonBase);

export const disableZoomProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "disableZoom",
  defaultValue: EsrimapCommon.defaults.disableZoom,
  valueConverter: booleanConverter
});
disableZoomProperty.register(EsrimapViewCommonBase);

export const disableRotationProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "disableRotation",
  defaultValue: EsrimapCommon.defaults.disableRotation,
  valueConverter: booleanConverter
});
disableRotationProperty.register(EsrimapViewCommonBase);

export const disableScrollProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "disableScroll",
  defaultValue: EsrimapCommon.defaults.disableScroll,
  valueConverter: booleanConverter
});
disableScrollProperty.register(EsrimapViewCommonBase);

export const disableTiltProperty = new Property<EsrimapViewCommonBase, boolean>({
  name: "disableTilt",
  defaultValue: EsrimapCommon.defaults.disableTilt,
  valueConverter: booleanConverter
});
disableTiltProperty.register(EsrimapViewCommonBase);

export const delayProperty = new Property<EsrimapViewCommonBase, number>({name: "delay"});
delayProperty.register(EsrimapViewCommonBase);



export abstract class EsrimapViewBase extends EsrimapViewCommonBase {

  static mapReadyEvent: string = "mapReady";
  static mapMoveEvent: string = "mapMove";

  static singleTapEvent: string = "singleTap";
  static longTapEvent: string = "longTap";

  static locationPermissionGrantedEvent: string = "locationPermissionGranted";
  static locationPermissionDeniedEvent: string = "locationPermissionDenied";

  protected config: any = {};


  [zoomLevelProperty.setNative](value: number) {
    this.config.zoomLevel = +value;
  }

  [mapStyleProperty.setNative](value: string) {
    this.config.style = value;
    this.config.mapStyle = value;
  }

  [accessTokenProperty.setNative](value: string) {
    this.config.accessToken = value;
  }

 
  [delayProperty.setNative](value: number) {
    this.config.delay = parseInt("" + value);
  }

  [latitudeProperty.setNative](value: number) {
    this.config.center = this.config.center || {};
    this.config.center.lat = +value;
    this.config.latitude = +value;
  }

  [longitudeProperty.setNative](value: number) {
    this.config.center = this.config.center || {};
    this.config.center.lng = +value;
    this.config.longitude = +value;
  }

  [showUserLocationProperty.setNative](value: boolean) {
    this.config.showUserLocation = value;
  }

  [hideLogoProperty.setNative](value: boolean) {
    this.config.hideLogo = value;
  }

  [hideAttributionProperty.setNative](value: boolean) {
    this.config.hideAttribution = value;
  }

  [hideCompassProperty.setNative](value: boolean) {
    this.config.hideCompass = value;
  }

  [disableZoomProperty.setNative](value: boolean) {
    this.config.disableZoom = value;
  }

  [disableRotationProperty.setNative](value: boolean) {
    this.config.disableRotation = value;
  }

  [disableScrollProperty.setNative](value: boolean) {
    this.config.disableScroll = value;
  }

  [disableTiltProperty.setNative](value: boolean) {
    this.config.disableTilt = value;
  }
}

/*************** XML definition END ****************/

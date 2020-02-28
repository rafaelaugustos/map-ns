import { Color } from "tns-core-modules/color/color";
import { ContentView } from "tns-core-modules/ui/content-view";
import { Property } from "tns-core-modules/ui/core/view";
export declare enum MapStyle {
    GRAY,
    HYBRID,
    NATIONAL_GEOGRAPHIC,
    OCEANS,
    OSM,
    SATELLITE,
    STREETS,
    TOPO
}
export interface LatLng {
    lat: number;
    lng: number;
    zoom?: number;
    json?: string;
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
    id?: any;
    points: LatLng[];
    spatialReference?: string;
    fillColor?: string | Color;
    fillOpacity?: number;
    strokeColor?: string | Color;
    strokeWidth?: number;
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
    description?: string;
}
export interface AddPolylineOptions {
    id?: any;
    width?: number;
    spatialReference?: string;
    color?: string | Color;
    opacity?: number;
    points: LatLng[];
}
export interface EsrimapMarker extends LatLng {
    id?: any;
    title?: string;
    label?: string;
    description?: string;
    type?: string;
    url?: string;
    permission?: string;
    spatialReference?: string;
    icon?: string;
    width?: number;
    height?: number;
    xoffset?: number;
    yoffset?: number;
    iconPath?: string;
    onTap?: Function;
    onCalloutTap?: Function;
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
    tilt: number;
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
    animated?: boolean;
    json?: string;
    padding?: number;
}
export interface DeleteOfflineRegionOptions {
    name: string;
}
export interface EsrimapCluster {
    points: number;
    color: string;
}
export interface AddGeoJsonClusteredOptions {
    name: string;
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
    circleColor?: string | Color;
    circleOpacity?: number;
    circleRadius?: number;
    circleStrokeColor?: string | Color;
    circleStrokeWidth?: number;
    fillColor?: string | Color;
    fillOpacity?: number;
    lineCap?: string;
    lineJoin?: string;
    lineColor?: string | Color;
    lineOpacity?: number;
    lineWidth?: number;
}
export declare type UserTrackingMode = "NONE" | "FOLLOW" | "FOLLOW_WITH_HEADING" | "FOLLOW_WITH_COURSE";
export interface TrackUserOptions {
    mode: UserTrackingMode;
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
    completedSize?: number;
}
export interface DownloadOfflineRegionOptions extends OfflineRegion {
    onProgress?: (data: DownloadProgress) => void;
    accessToken?: string;
}
export interface ListOfflineRegionsOptions {
    accessToken?: string;
}
export interface ShowOptions {
    accessToken: string;
    style?: MapStyle;
    margins?: ShowOptionsMargins;
    center?: LatLng;
    zoomLevel?: number;
    showUserLocation?: boolean;
    hideLogo?: boolean;
    hideAttribution?: boolean;
    hideCompass?: boolean;
    disableRotation?: boolean;
    disableScroll?: boolean;
    disableZoom?: boolean;
    disableTilt?: boolean;
    markers?: EsrimapMarker[];
}
export interface ShowResult {
    ios: any;
    android: any;
}
export interface AnimateCameraOptions {
    target: LatLng;
    zoomLevel?: number;
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
    setCenterOnCurrentLocation(nativeMap?: any): Promise<any>;
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
    setOnMapClickListener(listener: (data: LatLng) => void, nativeMap?: any): Promise<any>;
    setOnMapLongClickListener(listener: (data: LatLng) => void, nativeMap?: any): Promise<any>;
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
}
export declare abstract class EsrimapCommon implements EsrimapCommonApi {
    static defaults: {
        style: string;
        mapStyle: string;
        margins: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        zoomLevel: number;
        showUserLocation: boolean;
        hideLogo: boolean;
        hideAttribution: boolean;
        hideCompass: boolean;
        disableRotation: boolean;
        disableScroll: boolean;
        disableZoom: boolean;
        disableTilt: boolean;
        delay: number;
    };
    static merge(obj1: {}, obj2: {}): any;
    requestFineLocationPermission(): Promise<any>;
    hasFineLocationPermission(): Promise<boolean>;
}
export interface EsrimapViewApi {
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
    showCallout(options: ShowCallOutOptions): Promise<any>;
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
export declare abstract class EsrimapViewCommonBase extends ContentView implements EsrimapViewApi {
    protected Esrimap: EsrimapApi;
    abstract getNativeMapView(): any;
    addMarkers(markers: EsrimapMarker[]): Promise<any>;
    removeMarkers(options?: any): Promise<any>;
    setOnMapClickListener(listener: (data: LatLng) => void): Promise<any>;
    setOnMapLongClickListener(listener: (data: LatLng) => void): Promise<any>;
    setOnScrollListener(listener: (data?: LatLng) => void, nativeMap?: any): Promise<void>;
    setOnFlingListener(listener: () => void, nativeMap?: any): Promise<any>;
    setOnCameraMoveListener(listener: () => void, nativeMap?: any): Promise<any>;
    setOnCameraMoveCancelListener(listener: () => void, nativeMap?: any): Promise<any>;
    setOnCameraIdleListener(listener: () => void, nativeMap?: any): Promise<any>;
    getViewport(): Promise<Viewport>;
    setViewport(options: SetViewportOptions): Promise<any>;
    setMapStyle(style: string | MapStyle): Promise<any>;
    getCenter(): Promise<LatLng>;
    setCenter(options: SetCenterOptions): Promise<any>;
    setCenterOnCurrentLocation(): Promise<any>;
    showCallout(options: ShowCallOutOptions): Promise<any>;
    clearCallouts(): Promise<number>;
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
export declare const zoomLevelProperty: Property<EsrimapViewCommonBase, number>;
export declare const accessTokenProperty: Property<EsrimapViewCommonBase, string>;
export declare const mapStyleProperty: Property<EsrimapViewCommonBase, string>;
export declare const latitudeProperty: Property<EsrimapViewCommonBase, number>;
export declare const longitudeProperty: Property<EsrimapViewCommonBase, number>;
export declare const showUserLocationProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const hideLogoProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const hideAttributionProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const hideCompassProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const disableZoomProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const disableRotationProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const disableScrollProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const disableTiltProperty: Property<EsrimapViewCommonBase, boolean>;
export declare const delayProperty: Property<EsrimapViewCommonBase, number>;
export declare abstract class EsrimapViewBase extends EsrimapViewCommonBase {
    static mapReadyEvent: string;
    static mapMoveEvent: string;
    static singleTapEvent: string;
    static longTapEvent: string;
    static locationPermissionGrantedEvent: string;
    static locationPermissionDeniedEvent: string;
    protected config: any;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var content_view_1 = require("tns-core-modules/ui/content-view");
var view_1 = require("tns-core-modules/ui/core/view");
var MapStyle;
(function (MapStyle) {
    MapStyle[MapStyle["GRAY"] = "gray"] = "GRAY";
    MapStyle[MapStyle["HYBRID"] = "hybrid"] = "HYBRID";
    MapStyle[MapStyle["NATIONAL_GEOGRAPHIC"] = "national_geographic"] = "NATIONAL_GEOGRAPHIC";
    MapStyle[MapStyle["OCEANS"] = "oceans"] = "OCEANS";
    MapStyle[MapStyle["OSM"] = "osm"] = "OSM";
    MapStyle[MapStyle["SATELLITE"] = "satellite"] = "SATELLITE";
    MapStyle[MapStyle["STREETS"] = "streets"] = "STREETS";
    MapStyle[MapStyle["TOPO"] = "topographic"] = "TOPO";
})(MapStyle = exports.MapStyle || (exports.MapStyle = {}));
var EsrimapCommon = (function () {
    function EsrimapCommon() {
    }
    EsrimapCommon.merge = function (obj1, obj2) {
        var result = {};
        for (var i in obj1) {
            if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                result[i] = this.merge(obj1[i], obj2[i]);
            }
            else {
                result[i] = obj1[i];
            }
        }
        for (var i in obj2) {
            if (i in result) {
                continue;
            }
            result[i] = obj2[i];
        }
        return result;
    };
    EsrimapCommon.prototype.requestFineLocationPermission = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    EsrimapCommon.prototype.hasFineLocationPermission = function () {
        return new Promise(function (resolve) {
            resolve(true);
        });
    };
    EsrimapCommon.defaults = {
        style: MapStyle.TOPO.toString(),
        mapStyle: MapStyle.TOPO.toString(),
        margins: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        zoomLevel: 0,
        showUserLocation: false,
        hideLogo: false,
        hideAttribution: true,
        hideCompass: false,
        disableRotation: false,
        disableScroll: false,
        disableZoom: false,
        disableTilt: false,
        delay: 0
    };
    return EsrimapCommon;
}());
exports.EsrimapCommon = EsrimapCommon;
var EsrimapViewCommonBase = (function (_super) {
    __extends(EsrimapViewCommonBase, _super);
    function EsrimapViewCommonBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EsrimapViewCommonBase.prototype.addMarkers = function (markers) {
        return this.Esrimap.addMarkers(markers, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.removeMarkers = function (options) {
        return this.Esrimap.removeMarkers(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnMapClickListener = function (listener) {
        return this.Esrimap.setOnMapClickListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnMapLongClickListener = function (listener) {
        return this.Esrimap.setOnMapLongClickListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnScrollListener = function (listener, nativeMap) {
        console.log("setOnScrollListener");
        return this.Esrimap.setOnScrollListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnFlingListener = function (listener, nativeMap) {
        return this.Esrimap.setOnFlingListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnCameraMoveListener = function (listener, nativeMap) {
        return this.Esrimap.setOnCameraMoveListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnCameraMoveCancelListener = function (listener, nativeMap) {
        return this.Esrimap.setOnCameraMoveCancelListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setOnCameraIdleListener = function (listener, nativeMap) {
        return this.Esrimap.setOnCameraIdleListener(listener, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.getViewport = function () {
        return this.Esrimap.getViewport(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setViewport = function (options) {
        return this.Esrimap.setViewport(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setMapStyle = function (style) {
        return this.Esrimap.setMapStyle(style, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.getCenter = function () {
        return this.Esrimap.getCenter(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setCenter = function (options) {
        return this.Esrimap.setCenter(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setCenterOnCurrentLocation = function () {
        return this.Esrimap.setCenterOnCurrentLocation(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.showCallout = function (options) {
        return this.Esrimap.showCallout(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.clearCallouts = function () {
        return this.Esrimap.clearCallouts(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.getZoomLevel = function () {
        return this.Esrimap.getZoomLevel(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setZoomLevel = function (options) {
        return this.Esrimap.setZoomLevel(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.getTilt = function () {
        return this.Esrimap.getTilt(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.setTilt = function (options) {
        return this.Esrimap.setTilt(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.getUserLocation = function () {
        console.log("getUserLocation");
        return this.Esrimap.getUserLocation(this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.trackUser = function (options) {
        console.log("trackUser");
        return this.Esrimap.trackUser(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.queryRenderedFeatures = function (options) {
        console.log("queryRenderedFeatures");
        return this.Esrimap.queryRenderedFeatures(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.addPolygon = function (options) {
        return this.Esrimap.addPolygon(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.removePolygons = function (ids) {
        return this.Esrimap.removePolygons(ids, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.addPolyline = function (options) {
        return this.Esrimap.addPolyline(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.removePolylines = function (ids) {
        return this.Esrimap.removePolylines(ids, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.animateCamera = function (options) {
        console.log("animateCamera");
        return this.Esrimap.animateCamera(options, this.getNativeMapView());
    };
    EsrimapViewCommonBase.prototype.destroy = function () {
        console.log("destroy");
        try {
            return this.Esrimap.destroy(this.getNativeMapView());
        }
        catch (ex) {
            console.log("destroy catch");
        }
        return null;
    };
    return EsrimapViewCommonBase;
}(content_view_1.ContentView));
exports.EsrimapViewCommonBase = EsrimapViewCommonBase;
exports.zoomLevelProperty = new view_1.Property({ name: "zoomLevel" });
exports.zoomLevelProperty.register(EsrimapViewCommonBase);
exports.accessTokenProperty = new view_1.Property({ name: "accessToken" });
exports.accessTokenProperty.register(EsrimapViewCommonBase);
exports.mapStyleProperty = new view_1.Property({ name: "mapStyle" });
exports.mapStyleProperty.register(EsrimapViewCommonBase);
exports.latitudeProperty = new view_1.Property({ name: "latitude" });
exports.latitudeProperty.register(EsrimapViewCommonBase);
exports.longitudeProperty = new view_1.Property({ name: "longitude" });
exports.longitudeProperty.register(EsrimapViewCommonBase);
exports.showUserLocationProperty = new view_1.Property({
    name: "showUserLocation",
    defaultValue: EsrimapCommon.defaults.showUserLocation,
    valueConverter: view_1.booleanConverter
});
exports.showUserLocationProperty.register(EsrimapViewCommonBase);
exports.hideLogoProperty = new view_1.Property({
    name: "hideLogo",
    defaultValue: EsrimapCommon.defaults.hideLogo,
    valueConverter: view_1.booleanConverter
});
exports.hideLogoProperty.register(EsrimapViewCommonBase);
exports.hideAttributionProperty = new view_1.Property({
    name: "hideAttribution",
    defaultValue: EsrimapCommon.defaults.hideAttribution,
    valueConverter: view_1.booleanConverter
});
exports.hideAttributionProperty.register(EsrimapViewCommonBase);
exports.hideCompassProperty = new view_1.Property({
    name: "hideCompass",
    defaultValue: EsrimapCommon.defaults.hideCompass,
    valueConverter: view_1.booleanConverter
});
exports.hideCompassProperty.register(EsrimapViewCommonBase);
exports.disableZoomProperty = new view_1.Property({
    name: "disableZoom",
    defaultValue: EsrimapCommon.defaults.disableZoom,
    valueConverter: view_1.booleanConverter
});
exports.disableZoomProperty.register(EsrimapViewCommonBase);
exports.disableRotationProperty = new view_1.Property({
    name: "disableRotation",
    defaultValue: EsrimapCommon.defaults.disableRotation,
    valueConverter: view_1.booleanConverter
});
exports.disableRotationProperty.register(EsrimapViewCommonBase);
exports.disableScrollProperty = new view_1.Property({
    name: "disableScroll",
    defaultValue: EsrimapCommon.defaults.disableScroll,
    valueConverter: view_1.booleanConverter
});
exports.disableScrollProperty.register(EsrimapViewCommonBase);
exports.disableTiltProperty = new view_1.Property({
    name: "disableTilt",
    defaultValue: EsrimapCommon.defaults.disableTilt,
    valueConverter: view_1.booleanConverter
});
exports.disableTiltProperty.register(EsrimapViewCommonBase);
exports.delayProperty = new view_1.Property({ name: "delay" });
exports.delayProperty.register(EsrimapViewCommonBase);
var EsrimapViewBase = (function (_super) {
    __extends(EsrimapViewBase, _super);
    function EsrimapViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = {};
        return _this;
    }
    EsrimapViewBase.prototype[exports.zoomLevelProperty.setNative] = function (value) {
        this.config.zoomLevel = +value;
    };
    EsrimapViewBase.prototype[exports.mapStyleProperty.setNative] = function (value) {
        this.config.style = value;
        this.config.mapStyle = value;
    };
    EsrimapViewBase.prototype[exports.accessTokenProperty.setNative] = function (value) {
        this.config.accessToken = value;
    };
    EsrimapViewBase.prototype[exports.delayProperty.setNative] = function (value) {
        this.config.delay = parseInt("" + value);
    };
    EsrimapViewBase.prototype[exports.latitudeProperty.setNative] = function (value) {
        this.config.center = this.config.center || {};
        this.config.center.lat = +value;
        this.config.latitude = +value;
    };
    EsrimapViewBase.prototype[exports.longitudeProperty.setNative] = function (value) {
        this.config.center = this.config.center || {};
        this.config.center.lng = +value;
        this.config.longitude = +value;
    };
    EsrimapViewBase.prototype[exports.showUserLocationProperty.setNative] = function (value) {
        this.config.showUserLocation = value;
    };
    EsrimapViewBase.prototype[exports.hideLogoProperty.setNative] = function (value) {
        this.config.hideLogo = value;
    };
    EsrimapViewBase.prototype[exports.hideAttributionProperty.setNative] = function (value) {
        this.config.hideAttribution = value;
    };
    EsrimapViewBase.prototype[exports.hideCompassProperty.setNative] = function (value) {
        this.config.hideCompass = value;
    };
    EsrimapViewBase.prototype[exports.disableZoomProperty.setNative] = function (value) {
        this.config.disableZoom = value;
    };
    EsrimapViewBase.prototype[exports.disableRotationProperty.setNative] = function (value) {
        this.config.disableRotation = value;
    };
    EsrimapViewBase.prototype[exports.disableScrollProperty.setNative] = function (value) {
        this.config.disableScroll = value;
    };
    EsrimapViewBase.prototype[exports.disableTiltProperty.setNative] = function (value) {
        this.config.disableTilt = value;
    };
    EsrimapViewBase.mapReadyEvent = "mapReady";
    EsrimapViewBase.mapMoveEvent = "mapMove";
    EsrimapViewBase.singleTapEvent = "singleTap";
    EsrimapViewBase.longTapEvent = "longTap";
    EsrimapViewBase.locationPermissionGrantedEvent = "locationPermissionGranted";
    EsrimapViewBase.locationPermissionDeniedEvent = "locationPermissionDenied";
    return EsrimapViewBase;
}(EsrimapViewCommonBase));
exports.EsrimapViewBase = EsrimapViewBase;
//# sourceMappingURL=notoriun-coletor-plugin.common.js.map
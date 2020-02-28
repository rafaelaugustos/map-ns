"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("tns-core-modules/utils/utils");
var application = require("tns-core-modules/application");
var color_1 = require("tns-core-modules/color");
var http = require("tns-core-modules/http");
var notoriun_coletor_plugin_common_1 = require("./notoriun-coletor-plugin.common");
exports.MapStyle = notoriun_coletor_plugin_common_1.MapStyle;
var _Esrimap = {};
var _accessToken;
var _markers = [];
var _polylines = [];
var _polygons = [];
var _markerIconDownloadCache = [];
var _locationLayerPlugin = null;
var ACCESS_FINE_LOCATION_PERMISSION_REQUEST_CODE = 111;
var EsrimapView = (function (_super) {
    __extends(EsrimapView, _super);
    function EsrimapView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EsrimapView.prototype.getNativeMapView = function () {
        try {
            return this.mapView;
        }
        catch (ex) {
            console.log("getNativeMapView ex", ex);
            return null;
        }
    };
    EsrimapView.prototype.createNativeView = function () {
        var _this_1 = this;
        try {
            var nativeView = new android.widget.FrameLayout(this._context);
            console.log("createNativeView");
            setTimeout(function () {
                _this_1.initMap();
            }, 0);
            return nativeView;
        }
        catch (ex) {
            console.log("EsrimapView", ex);
            return null;
        }
    };
    EsrimapView.prototype.initMap = function () {
        var _this_1 = this;
        try {
            if (!this.mapView) {
                this.Esrimap = new Esrimap();
                var settings_1 = Esrimap.merge(this.config, Esrimap.defaults);
                var _this_2 = this;
                var drawMap = function () {
                    _this_1.mapView = new com.esri.arcgisruntime.mapping.view.MapView(_this_1._context);
                    _this_1.map = new com.esri.arcgisruntime.mapping.ArcGISMap(com.esri.arcgisruntime.mapping.Basemap.Type.TOPOGRAPHIC, settings_1.latitude, settings_1.longitude, settings_1.zoomLevel);
                    _this_1.mapView.setMap(_this_1.map);
                    var mapvar = _this_1.map;
                    var mapviewvar = _this_1.mapView;
                    com.esri.arcgisruntime.ArcGISRuntimeEnvironment.setLicense(settings_1.accessToken);
                    var ontouch = new EsriTouchListener(_this_1._context, _this_1.mapView);
                    ontouch.setDispatcher(_this_2);
                    mapviewvar.setOnTouchListener(ontouch);
                    _this_1.nativeView.addView(_this_1.mapView);
                    _this_1.setMapStyle(settings_1.mapStyle);
                    var newThread = new java.lang.Thread(new java.lang.Runnable({
                        run: function () {
                            var eventData = {
                                eventName: "mapReady",
                                object: mapvar
                            };
                            _this_2.notify(eventData);
                        }
                    }));
                    mapvar.addDoneLoadingListener(newThread);
                };
                setTimeout(drawMap, settings_1.delay ? settings_1.delay : 0);
            }
        }
        catch (ex) {
            console.log("oopns", ex);
        }
    };
    return EsrimapView;
}(notoriun_coletor_plugin_common_1.EsrimapViewBase));
exports.EsrimapView = EsrimapView;
var EsriTouchListener = (function (_super) {
    __extends(EsriTouchListener, _super);
    function EsriTouchListener(context, mapView) {
        var _this_1 = _super.call(this, context, mapView) || this;
        _this_1.mView = mapView;
        return global.__native(_this_1);
    }
    EsriTouchListener.prototype.setDispatcher = function (dispatch) {
        this.dispatcher = dispatch;
    };
    EsriTouchListener.prototype.onSingleTapConfirmed = function (e) {
        var screenPoint = new android.graphics.Point(e.getX(), e.getY());
        var mapPoint = this.mView.screenToLocation(screenPoint);
        var wgsWMKPoint = com.esri.arcgisruntime.geometry.GeometryEngine.project(mapPoint, com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator());
        var latd = wgsWMKPoint.getX();
        var long = wgsWMKPoint.getY();
        var obj = new org.json.JSONObject();
        obj.put('lat', latd);
        obj.put('lng', long);
        var eventData = {
            eventName: "singleTap",
            object: obj.toString()
        };
        this.dispatcher.notify(eventData);
        return this.super.onSingleTapConfirmed(e);
    };
    EsriTouchListener.prototype.onLongPress = function (e) {
        var screenPoint = new android.graphics.Point(e.getX(), e.getY());
        var mapPoint = this.mView.screenToLocation(screenPoint);
        var wgsWMKPoint = com.esri.arcgisruntime.geometry.GeometryEngine.project(mapPoint, com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator());
        var latd = wgsWMKPoint.getX();
        var long = wgsWMKPoint.getY();
        var obj = new org.json.JSONObject();
        obj.put('lat', latd);
        obj.put('lng', long);
        var eventData = {
            eventName: "longTap",
            object: obj.toString()
        };
        this.dispatcher.notify(eventData);
        return this.super.onLongPress(e);
    };
    return EsriTouchListener;
}(com.esri.arcgisruntime.mapping.view.DefaultMapViewOnTouchListener));
var _getMapStyle = function (input) {
    var Style = com.esri.android.map.MapOptions.MapType;
    if (/^Esrimap:\/\/styles/.test(input) || /^http:\/\//.test(input) || /^https:\/\//.test(input)) {
        return input;
    }
    else if (/^~\//.test(input)) {
        var assetsPath = 'asset://app/';
        input = input.replace(/^~\//, assetsPath);
        return input;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.GRAY || input === notoriun_coletor_plugin_common_1.MapStyle.GRAY.toString()) {
        return Style.GRAY;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.HYBRID || input === notoriun_coletor_plugin_common_1.MapStyle.HYBRID.toString()) {
        return Style.HYBRID;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.NATIONAL_GEOGRAPHIC || input === notoriun_coletor_plugin_common_1.MapStyle.NATIONAL_GEOGRAPHIC.toString()) {
        return Style.NATIONAL_GEOGRAPHIC;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.SATELLITE || input === notoriun_coletor_plugin_common_1.MapStyle.SATELLITE.toString()) {
        return Style.SATELLITE;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.STREETS || input === notoriun_coletor_plugin_common_1.MapStyle.STREETS.toString()) {
        return Style.STREETS;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.TOPO || input === notoriun_coletor_plugin_common_1.MapStyle.TOPO.toString()) {
        return Style.TOPO;
    }
    else if (input === notoriun_coletor_plugin_common_1.MapStyle.OSM || input === notoriun_coletor_plugin_common_1.MapStyle.OSM.toString()) {
        return Style.OSM;
    }
    else {
        return Style.STREETS;
    }
};
var _getUserLocationRenderMode = function (input) {
    var RenderMode = com.Esrimap.Esrimapsdk.plugins.locationlayer.modes.RenderMode;
    if (input === "FOLLOW_WITH_HEADING") {
        return RenderMode.COMPASS;
    }
    else if (input === "FOLLOW_WITH_COURSE") {
        return RenderMode.GPS;
    }
    else {
        return RenderMode.NORMAL;
    }
};
var _getUserLocationCameraMode = function (input) {
    var CameraMode = com.Esrimap.Esrimapsdk.plugins.locationlayer.modes.CameraMode;
    if (input === "FOLLOW") {
        return CameraMode.TRACKING;
    }
    else if (input === "FOLLOW_WITH_HEADING") {
        return CameraMode.TRACKING_COMPASS;
    }
    else if (input === "FOLLOW_WITH_COURSE") {
        return CameraMode.TRACKING_COMPASS;
    }
    else {
        return CameraMode.NONE;
    }
};
var _getEsrimapMapOptions = function (settings) {
    if (settings.zoomLevel && !settings.center) {
        settings.center = {
            lat: 48.858093,
            lng: 2.294694
        };
        settings.latitude = 48.858093;
        settings.longitude = 2.294694;
        settings.zoomLevel = 10;
    }
    var EsrimapMapOptions = new com.esri.android.map.MapOptions(settings.style, settings.center.lat, settings.center.lng, settings.zoomLevel);
    return EsrimapMapOptions;
};
var _fineLocationPermissionGranted = function () {
    var hasPermission = android.os.Build.VERSION.SDK_INT < 23;
    if (!hasPermission) {
        hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ===
            android.support.v4.content.ContextCompat.checkSelfPermission(application.android.foregroundActivity, android.Manifest.permission.ACCESS_FINE_LOCATION);
    }
    return hasPermission;
};
var _showLocation = function (theMapView, EsrimapMap) {
    _locationLayerPlugin = new com.Esrimap.Esrimapsdk.plugins.locationlayer.LocationLayerPlugin(theMapView, EsrimapMap);
};
var _getClickedMarkerDetails = function (clicked) {
    for (var m in _markers) {
        var cached = _markers[m];
        if (cached.lat == clicked.getPosition().getLatitude() &&
            cached.lng == clicked.getPosition().getLongitude() &&
            cached.title == clicked.getTitle() &&
            cached.subtitle == clicked.getSnippet()) {
            return cached;
        }
    }
};
var _downloadImage = function (marker) {
    return new Promise(function (resolve, reject) {
        if (_markerIconDownloadCache[marker.icon]) {
            marker.iconDownloaded = _markerIconDownloadCache[marker.icon];
            resolve(marker);
            return;
        }
        http.getImage(marker.icon).then(function (output) {
            marker.iconDownloaded = output.android;
            _markerIconDownloadCache[marker.icon] = marker.iconDownloaded;
            resolve(marker);
        }, function (e) {
            console.log("Download failed for ' " + marker.icon + "' with error: " + e);
            resolve(marker);
        });
    });
};
var _downloadMarkerImages = function (markers) {
    var iterations = [];
    var result = [];
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        if (marker.icon && marker.icon.startsWith("http")) {
            var p = _downloadImage(marker).then(function (mark) {
                result.push(mark);
            });
            iterations.push(p);
        }
        else {
            result.push(marker);
        }
    }
    return Promise.all(iterations).then(function (output) {
        return result;
    });
};
var _addMarkers = function (markers, nativeMap) {
    if (!markers) {
        console.log("No markers passed");
        return;
    }
    if (!Array.isArray(markers)) {
        console.log("markers must be passed as an Array: [{title:'foo'}]");
        return;
    }
    var theMap = nativeMap || _Esrimap;
    if (!theMap || !theMap.EsrimapMap) {
    }
    var graphicsOverlay = new com.esri.arcgisruntime.mapping.view.GraphicsOverlay();
    for (var m in markers) {
        var _marker = markers[m];
        var point = new com.esri.arcgisruntime.geometry.Point(_marker.lat, _marker.lng, _marker.spatialReference);
        var redCircleSymbol = new com.esri.arcgisruntime.symbology.SimpleMarkerSymbol(com.esri.arcgisruntime.symbology.SimpleMarkerSymbol.Style.CIRCLE, 0xFFFF0000, 10);
        var decodedBytes = android.util.Base64.decode(_marker.icon, 0);
        var icon = android.graphics.BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        var drawable = new android.graphics.drawable.BitmapDrawable(application.android.context.getResources(), icon);
        var markerSymbol = new com.esri.arcgisruntime.symbology.PictureMarkerSymbol(drawable);
        markerSymbol.setHeight(_marker.height);
        markerSymbol.setWidth(_marker.width);
        markerSymbol.setOffsetY(_marker.yoffset);
        markerSymbol.setOffsetX(_marker.xoffset);
        graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(point, markerSymbol));
    }
    theMap.getGraphicsOverlays().add(graphicsOverlay);
};
var _removeMarkers = function (ids, nativeMap) {
    var theMap = nativeMap || _Esrimap;
    if (!theMap || !theMap.EsrimapMap) {
        return;
    }
    for (var m in _markers) {
        var marker = _markers[m];
        if (!ids || (marker && marker.id && ids.indexOf(marker.id) > -1)) {
            if (marker && marker.android) {
                theMap.EsrimapMap.removeAnnotation(marker.android);
            }
        }
    }
    if (ids) {
        _markers = _markers.filter(function (marker) { return ids.indexOf(marker.id) === -1; });
    }
    else {
        _markers = [];
    }
};
var _getRegionName = function (offlineRegion) {
    var metadata = offlineRegion.getMetadata();
    var jsonStr = new java.lang.String(metadata, "UTF-8");
    var jsonObj = new org.json.JSONObject(jsonStr);
    return jsonObj.getString("name");
};
var _getOfflineManager = function () {
    if (!_Esrimap.offlineManager) {
        _Esrimap.offlineManager = com.Esrimap.Esrimapsdk.offline.OfflineManager.getInstance(application.android.context);
    }
    return _Esrimap.offlineManager;
};
var Esrimap = (function (_super) {
    __extends(Esrimap, _super);
    function Esrimap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Esrimap.prototype.hasFineLocationPermission = function () {
        return new Promise(function (resolve, reject) {
            try {
                resolve(_fineLocationPermissionGranted());
            }
            catch (ex) {
                console.log("Error in Esrimap.hasFineLocationPermission: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.requestFineLocationPermission = function () {
        return new Promise(function (resolve, reject) {
            console.log("requestFineLocationPermission");
            if (_fineLocationPermissionGranted()) {
                resolve();
                return;
            }
            var permissionCallback = function (args) {
                if (args.requestCode !== ACCESS_FINE_LOCATION_PERMISSION_REQUEST_CODE) {
                    return;
                }
                for (var i = 0; i < args.permissions.length; i++) {
                    if (args.grantResults[i] === android.content.pm.PackageManager.PERMISSION_DENIED) {
                        reject("Permission denied");
                        return;
                    }
                }
                application.android.off(application.AndroidApplication.activityRequestPermissionsEvent, permissionCallback);
                resolve();
            };
            application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, permissionCallback);
            android.support.v4.app.ActivityCompat.requestPermissions(application.android.foregroundActivity, [android.Manifest.permission.ACCESS_FINE_LOCATION], ACCESS_FINE_LOCATION_PERMISSION_REQUEST_CODE);
        });
    };
    Esrimap.prototype.show = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                console.log("show");
            }
            catch (ex) {
                console.log("Error in Esrimap.show: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.hide = function () {
        return new Promise(function (resolve, reject) {
            try {
                console.log("hide");
                if (_Esrimap.mapView) {
                    var viewGroup = _Esrimap.mapView.getParent();
                    if (viewGroup !== null) {
                    }
                }
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.hide: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.unhide = function () {
        console.log("unhide");
        return new Promise(function (resolve, reject) {
            try {
                if (_Esrimap.mapView) {
                    resolve();
                }
                else {
                    reject("No map found");
                }
            }
            catch (ex) {
                console.log("Error in Esrimap.unhide: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.destroy = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                if (_Esrimap.mapView) {
                    _Esrimap.mapView.destroyDrawingCache();
                    console.log("destroy");
                    resolve();
                }
                else {
                    reject("No map found");
                }
            }
            catch (ex) {
                console.log("Error in Esrimap.destroy: " + ex);
                reject(ex);
            }
            resolve();
        });
    };
    Esrimap.prototype.setMapStyle = function (style, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var settings = Esrimap.defaults;
                switch (style) {
                    case notoriun_coletor_plugin_common_1.MapStyle.GRAY:
                        theMap.Basemap = com.esri.arcgisruntime.mapping.Basemap.createLightGrayCanvas();
                        break;
                    case notoriun_coletor_plugin_common_1.MapStyle.TOPO:
                        theMap.Basemap = com.esri.arcgisruntime.mapping.Basemap.createTopographic();
                        break;
                    case notoriun_coletor_plugin_common_1.MapStyle.STREETS:
                        theMap.Basemap = com.esri.arcgisruntime.mapping.Basemap.createStreets();
                        break;
                }
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setMapStyle: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addMarkers = function (markers, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                _addMarkers(markers, nativeMap);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addMarkers: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.removeMarkers = function (ids, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                _removeMarkers(ids, nativeMap);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.removeMarkers: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.clearCallouts = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var mCallout = theMap.getCallout();
                mCallout.dismiss();
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.clearCallouts: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.showCallout = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var mapPoint = new com.esri.arcgisruntime.geometry.Point(options.lat, options.lng, com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator());
                var calloutContent = new android.widget.TextView(utils.ad.getApplicationContext());
                calloutContent.setTextColor(android.graphics.Color.BLACK);
                calloutContent.setSingleLine(false);
                calloutContent.setText(options.description);
                var mCallout = theMap.getCallout();
                mCallout.setLocation(mapPoint);
                mCallout.setContent(calloutContent);
                mCallout.show();
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.showCallout: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setCenterOnCurrentLocation = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var mLocationDisplay = theMap.getLocationDisplay();
                mLocationDisplay.setAutoPanMode(com.esri.arcgisruntime.mapping.view.LocationDisplay.AutoPanMode.RECENTER);
                if (!mLocationDisplay.isStarted()) {
                    mLocationDisplay.startAsync();
                }
                else {
                    mLocationDisplay.stop();
                }
            }
            catch (ex) {
                console.log("Error in Esrimap.setCenter: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setCenter = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var cameraPosition = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder()
                    .target(new com.Esrimap.Esrimapsdk.geometry.LatLng(options.lat, options.lng))
                    .build();
                if (options.animated === true) {
                    theMap.EsrimapMap.animateCamera(com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.newCameraPosition(cameraPosition), 1000, null);
                }
                else {
                    theMap.EsrimapMap.setCameraPosition(cameraPosition);
                }
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setCenter: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.getCenter = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var map = theMap.EsrimapMap;
                var centreX = theMap.getX() + theMap.getWidth() / 2;
                var centreY = theMap.getY() + theMap.getHeight() / 2;
                var screenPoint = new android.graphics.Point(Math.round(centreX), Math.round(centreY));
                var mapPoint = theMap.screenToLocation(screenPoint);
                var wgs84Point = com.esri.arcgisruntime.geometry.GeometryEngine.project(mapPoint, com.esri.arcgisruntime.geometry.SpatialReferences.getWgs84());
                var latd = wgs84Point.getY();
                var long_1 = wgs84Point.getX();
                var viewpoint = theMap.getCurrentViewpoint(com.esri.arcgisruntime.mapping.Viewpoint.Type.CENTER_AND_SCALE);
                var zoomlevel = viewpoint.getTargetScale();
                resolve({
                    lat: latd,
                    lng: long_1,
                    zoom: zoomlevel,
                    json: viewpoint.toJson()
                });
            }
            catch (ex) {
                console.log("Error in Esrimap.getCenter: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setZoomLevel = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var animated = options.animated === undefined || options.animated;
                var level = options.level;
                if (level >= 0 && level <= 20) {
                    var cameraUpdate = com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.zoomTo(level);
                    if (animated) {
                        theMap.EsrimapMap.easeCamera(cameraUpdate);
                    }
                    else {
                        theMap.EsrimapMap.moveCamera(cameraUpdate);
                    }
                    resolve();
                }
                else {
                    reject("invalid ZoomLevel, use any double value from 0 to 20 (like 8.3)");
                }
            }
            catch (ex) {
                console.log("Error in Esrimap.setZoomLevel: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.getZoomLevel = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var level = theMap.EsrimapMap.getCameraPosition().zoom;
                resolve(level);
            }
            catch (ex) {
                console.log("Error in Esrimap.getZoomLevel: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setTilt = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var tilt = options.tilt ? options.tilt : 30;
                var cameraPositionBuilder = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder()
                    .tilt(tilt);
                var cameraUpdate = com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.newCameraPosition(cameraPositionBuilder.build());
                var durationMs = options.duration ? options.duration : 5000;
                theMap.EsrimapMap.easeCamera(cameraUpdate, durationMs);
                setTimeout(function () {
                    resolve();
                }, durationMs);
            }
            catch (ex) {
                console.log("Error in Esrimap.setTilt: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.getTilt = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var tilt = theMap.EsrimapMap.getCameraPosition().tilt;
                resolve(tilt);
            }
            catch (ex) {
                console.log("Error in Esrimap.getTilt: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.getUserLocation = function () {
        return new Promise(function (resolve, reject) {
            try {
                var loc = _locationLayerPlugin ? _locationLayerPlugin.getLocationEngine().getLastLocation() : null;
                if (loc === null) {
                    reject("Location not available");
                }
                else {
                    resolve({
                        location: {
                            lat: loc.getLatitude(),
                            lng: loc.getLongitude()
                        },
                        speed: loc.getSpeed()
                    });
                }
            }
            catch (ex) {
                console.log("Error in Esrimap.getUserLocation: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.queryRenderedFeatures = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var point = options.point;
                if (point === undefined) {
                    reject("Please set the 'point' parameter");
                    return;
                }
                var EsrimapPoint = new com.Esrimap.Esrimapsdk.geometry.LatLng(options.point.lat, options.point.lng);
                var screenLocation = theMap.EsrimapMap.getProjection().toScreenLocation(EsrimapPoint);
                if (theMap.EsrimapMap.queryRenderedFeatures) {
                    var features = theMap.EsrimapMap.queryRenderedFeatures(screenLocation, null, options.layerIds);
                    var result = [];
                    for (var i = 0; i < features.size(); i++) {
                        var feature = features.get(i);
                        result.push({
                            id: feature.id(),
                            type: feature.type(),
                            properties: JSON.parse(feature.properties().toString())
                        });
                    }
                    resolve(result);
                }
                else {
                    reject("Feature not supported by this Esrimap version");
                }
            }
            catch (ex) {
                console.log("Error in Esrimap.queryRenderedFeatures: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addPolygon = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var points = options.points;
                if (points === undefined) {
                    reject("Please set the 'points' parameter");
                    return;
                }
                var spatial = Number(options.spatialReference);
                var pointcollection = new com.esri.arcgisruntime.geometry.PointCollection(com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
                for (var i = 0; i < options.points.length; i++) {
                    var lat = Number(options.points[i].lat);
                    var lng = Number(options.points[i].lng);
                    var point = new com.esri.arcgisruntime.geometry.Point(lat, lng, com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
                    pointcollection.add(point);
                }
                var polygon = new com.esri.arcgisruntime.geometry.Polygon(pointcollection);
                var fillSymbol = new com.esri.arcgisruntime.symbology.SimpleFillSymbol(com.esri.arcgisruntime.symbology.SimpleFillSymbol.Style.CROSS, android.graphics.Color.BLUE, null);
                var graphicsOverlay = new com.esri.arcgisruntime.mapping.view.GraphicsOverlay();
                graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(polygon, fillSymbol));
                theMap.getGraphicsOverlays().add(graphicsOverlay);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addPolygon: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addPolyline = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var points = options.points;
                if (points === undefined) {
                    reject("Please set the 'points' parameter");
                    return;
                }
                var spatial = Number(options.spatialReference);
                var pointcollection = new com.esri.arcgisruntime.geometry.PointCollection(com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
                for (var i = 0; i < options.points.length; i++) {
                    var lat = Number(options.points[i].lat);
                    var lng = Number(options.points[i].lng);
                    var point = new com.esri.arcgisruntime.geometry.Point(lat, lng, com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
                    pointcollection.add(point);
                }
                var polyline = new com.esri.arcgisruntime.geometry.Polyline(pointcollection);
                var lineSymbol = new com.esri.arcgisruntime.symbology.SimpleLineSymbol(com.esri.arcgisruntime.symbology.SimpleLineSymbol.Style.SOLID, android.graphics.Color.BLUE, 5);
                var graphicsOverlay = new com.esri.arcgisruntime.mapping.view.GraphicsOverlay();
                graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(polyline, lineSymbol));
                theMap.getGraphicsOverlays().add(graphicsOverlay);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addPolyline: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.removePolygons = function (ids, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                for (var p in _polygons) {
                    var polygon = _polygons[p];
                    if (!ids || (polygon.id && ids.indexOf(polygon.id) > -1)) {
                        theMap.EsrimapMap.removePolygon(polygon.android);
                    }
                }
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.removePolygons: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.removePolylines = function (ids, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                for (var p in _polylines) {
                    var polyline = _polylines[p];
                    if (!ids || (polyline.id && ids.indexOf(polyline.id) > -1)) {
                        theMap.EsrimapMap.removePolyline(polyline.android);
                    }
                }
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.removePolylines: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.animateCamera = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var target = options.target;
                if (target === undefined) {
                    reject("Please set the 'target' parameter");
                    return;
                }
                var cameraPositionBuilder = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder(theMap.EsrimapMap.getCameraPosition())
                    .target(new com.Esrimap.Esrimapsdk.geometry.LatLng(target.lat, target.lng));
                if (options.bearing) {
                    cameraPositionBuilder.bearing(options.bearing);
                }
                if (options.tilt) {
                    cameraPositionBuilder.tilt(options.tilt);
                }
                if (options.zoomLevel) {
                    cameraPositionBuilder.zoom(options.zoomLevel);
                }
                var durationMs = options.duration ? options.duration : 10000;
                theMap.EsrimapMap.animateCamera(com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.newCameraPosition(cameraPositionBuilder.build()), durationMs, null);
                setTimeout(function () {
                    resolve();
                }, durationMs);
            }
            catch (ex) {
                console.log("Error in Esrimap.animateCamera: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.createPointFunc = function (listener) {
        return function (point) {
            listener({
                lat: point.getLatitude(),
                lng: point.getLongitude()
            });
        };
    };
    Esrimap.prototype.setOnMapClickListener = function (listener, nativeMap) {
        var _this_1 = this;
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.addOnMapClickListener(new com.esri.arcgisruntime.mapping.view.MapView.OnTouchListener({
                    onMapClick: _this_1.createPointFunc(listener),
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnMapClickListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setOnMapLongClickListener = function (listener, nativeMap) {
        var _this_1 = this;
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.addOnMapLongClickListener(new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnMapLongClickListener({
                    onMapLongClick: _this_1.createPointFunc(listener),
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnMapLongClickListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setOnScrollListener = function (listener, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap_1 = nativeMap || _Esrimap;
                if (!theMap_1) {
                    reject("No map has been loaded");
                    return;
                }
                theMap_1.EsrimapMap.addOnMoveListener(new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnMoveListener({
                    onMoveBegin: function (detector) {
                    },
                    onMove: function (detector) {
                        var coordinate = theMap_1.EsrimapMap.getCameraPosition().target;
                        listener({
                            lat: coordinate.getLatitude(),
                            lng: coordinate.getLongitude(),
                            zoom: 12
                        });
                    },
                    onMoveEnd: function (detector) {
                    }
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnScrollListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setOnFlingListener = function (listener, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.addOnFlingListener(new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnFlingListener({
                    onFling: function () {
                        listener();
                    }
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnFlingListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setOnCameraMoveListener = function (listener, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.addOnCameraMoveListener(new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnCameraMoveListener({
                    onCameraMove: function () {
                        listener();
                    }
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnCameraMoveListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setOnCameraMoveCancelListener = function (listener, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.addOnCameraMoveCancelListener(new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnCameraMoveCanceledListener({
                    onCameraMoveCanceled: function () {
                        listener();
                    }
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnCameraMoveCancelListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setOnCameraIdleListener = function (listener, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.addOnCameraIdleListener(new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnCameraIdleListener({
                    onCameraIdle: function () {
                        listener();
                    }
                }));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setOnCameraIdleListener: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.getViewport = function (nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                var bounds = theMap.EsrimapMap.getProjection().getVisibleRegion().latLngBounds;
                resolve({
                    bounds: {
                        north: bounds.getLatNorth(),
                        east: bounds.getLonEast(),
                        south: bounds.getLatSouth(),
                        west: bounds.getLonWest()
                    },
                    zoomLevel: theMap.EsrimapMap.getCameraPosition().zoom
                });
            }
            catch (ex) {
                console.log("Error in Esrimap.getViewport: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.setViewport = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var map = theMap.EsrimapMap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.getMap().setInitialViewpoint(com.esri.arcgisruntime.mapping.Viewpoint.fromJson(options.json));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.setViewport: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.downloadOfflineRegion = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var styleURL = _getMapStyle(options.style);
                var bounds = new com.Esrimap.Esrimapsdk.geometry.LatLngBounds.Builder()
                    .include(new com.Esrimap.Esrimapsdk.geometry.LatLng(options.bounds.north, options.bounds.east))
                    .include(new com.Esrimap.Esrimapsdk.geometry.LatLng(options.bounds.south, options.bounds.west))
                    .build();
                var retinaFactor = utils.layout.getDisplayDensity();
                var offlineRegionDefinition = new com.Esrimap.Esrimapsdk.offline.OfflineTilePyramidRegionDefinition(styleURL, bounds, options.minZoom, options.maxZoom, retinaFactor);
                var info = '{name:"' + options.name + '"}';
                var infoStr = new java.lang.String(info);
                var encodedMetadata = infoStr.getBytes();
                if (!_accessToken && !options.accessToken) {
                    reject("First show a map, or pass in an 'accessToken' param");
                    return;
                }
                if (!_accessToken) {
                    _accessToken = options.accessToken;
                    com.Esrimap.Esrimapsdk.Esrimap.getInstance(application.android.context, _accessToken);
                }
                _getOfflineManager().createOfflineRegion(offlineRegionDefinition, encodedMetadata, new com.Esrimap.Esrimapsdk.offline.OfflineManager.CreateOfflineRegionCallback({
                    onError: function (error) {
                        reject(error);
                    },
                    onCreate: function (offlineRegion) {
                        offlineRegion.setDownloadState(com.Esrimap.Esrimapsdk.offline.OfflineRegion.STATE_ACTIVE);
                        offlineRegion.setObserver(new com.Esrimap.Esrimapsdk.offline.OfflineRegion.OfflineRegionObserver({
                            onStatusChanged: function (status) {
                                var percentage = status.getRequiredResourceCount() >= 0 ?
                                    (100.0 * status.getCompletedResourceCount() / status.getRequiredResourceCount()) :
                                    0.0;
                                if (options.onProgress) {
                                    options.onProgress({
                                        name: options.name,
                                        completedSize: status.getCompletedResourceSize(),
                                        completed: status.getCompletedResourceCount(),
                                        expected: status.getRequiredResourceCount(),
                                        percentage: Math.round(percentage * 100) / 100,
                                        complete: status.isComplete()
                                    });
                                }
                                if (status.isComplete()) {
                                    resolve();
                                }
                                else if (status.isRequiredResourceCountPrecise()) {
                                }
                            },
                            onError: function (error) {
                                reject(error.getMessage() + ", reason: " + error.getReason());
                            },
                            EsrimapTileCountLimitExceeded: function (limit) {
                                console.log("dl EsrimapTileCountLimitExceeded: " + limit);
                            }
                        }));
                    }
                }));
            }
            catch (ex) {
                console.log("Error in Esrimap.downloadOfflineRegion: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.listOfflineRegions = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                if (!_accessToken && !options.accessToken) {
                    reject("First show a map, or pass in an 'accessToken' param");
                    return;
                }
                if (!_accessToken) {
                    _accessToken = options.accessToken;
                    com.Esrimap.Esrimapsdk.Esrimap.getInstance(application.android.context, _accessToken);
                }
                _getOfflineManager().listOfflineRegions(new com.Esrimap.Esrimapsdk.offline.OfflineManager.ListOfflineRegionsCallback({
                    onError: function (error) {
                        reject(error);
                    },
                    onList: function (offlineRegions) {
                        var regions = [];
                        if (offlineRegions !== null) {
                            for (var i = 0; i < offlineRegions.length; i++) {
                                var offlineRegion = offlineRegions[i];
                                var name_1 = _getRegionName(offlineRegion);
                                var offlineRegionDefinition = offlineRegion.getDefinition();
                                var bounds = offlineRegionDefinition.getBounds();
                                regions.push({
                                    name: name_1,
                                    style: offlineRegionDefinition.getStyleURL(),
                                    minZoom: offlineRegionDefinition.getMinZoom(),
                                    maxZoom: offlineRegionDefinition.getMaxZoom(),
                                    bounds: {
                                        north: bounds.getLatNorth(),
                                        east: bounds.getLonEast(),
                                        south: bounds.getLatSouth(),
                                        west: bounds.getLonWest()
                                    }
                                });
                            }
                        }
                        resolve(regions);
                    }
                }));
            }
            catch (ex) {
                console.log("Error in Esrimap.listOfflineRegions: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.deleteOfflineRegion = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                if (!options || !options.name) {
                    reject("Pass in the 'name' param");
                    return;
                }
                _getOfflineManager().listOfflineRegions(new com.Esrimap.Esrimapsdk.offline.OfflineManager.ListOfflineRegionsCallback({
                    onError: function (error) {
                        reject(error);
                    },
                    onList: function (offlineRegions) {
                        var regions = [];
                        var found = false;
                        if (offlineRegions !== null) {
                            for (var i = 0; i < offlineRegions.length; i++) {
                                var offlineRegion = offlineRegions[i];
                                var name_2 = _getRegionName(offlineRegion);
                                if (name_2 === options.name) {
                                    found = true;
                                    offlineRegion.delete(new com.Esrimap.Esrimapsdk.offline.OfflineRegion.OfflineRegionDeleteCallback({
                                        onError: function (error) {
                                            reject(error);
                                        },
                                        onDelete: function () {
                                            resolve();
                                        }
                                    }));
                                }
                            }
                        }
                        if (!found) {
                            reject("Region not found");
                        }
                    }
                }));
            }
            catch (ex) {
                console.log("Error in Esrimap.listOfflineRegions: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addExtrusion = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                var fillExtrusionLayer = new com.Esrimap.Esrimapsdk.style.layers.FillExtrusionLayer("3d-buildings", "composite");
                fillExtrusionLayer.setSourceLayer("building");
                fillExtrusionLayer.setFilter(com.Esrimap.Esrimapsdk.style.expressions.Expression.eq(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("extrude"), "true"));
                fillExtrusionLayer.setMinZoom(15);
                fillExtrusionLayer.setProperties(com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionColor(android.graphics.Color.LTGRAY), com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionHeight(com.Esrimap.Esrimapsdk.style.functions.Function.property("height", new com.Esrimap.Esrimapsdk.style.functions.stops.IdentityStops())), com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionBase(com.Esrimap.Esrimapsdk.style.functions.Function.property("min_height", new com.Esrimap.Esrimapsdk.style.functions.stops.IdentityStops())), com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionOpacity(new java.lang.Float(0.6)));
                theMap.EsrimapMap.addLayer(fillExtrusionLayer);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addExtrusion: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addGeoJsonClustered = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                theMap.EsrimapMap.addSource(new com.Esrimap.Esrimapsdk.style.sources.GeoJsonSource(options.name, new java.net.URL(options.data), new com.Esrimap.Esrimapsdk.style.sources.GeoJsonOptions()
                    .withCluster(true)
                    .withClusterMaxZoom(options.clusterMaxZoom || 13)
                    .withClusterRadius(options.clusterRadius || 40)));
                var layers = [];
                if (options.clusters) {
                    for (var i = 0; i < options.clusters.length; i++) {
                        layers.push([options.clusters[i].points, new color_1.Color(options.clusters[i].color).android]);
                    }
                }
                else {
                    layers.push([150, new color_1.Color("red").android]);
                    layers.push([20, new color_1.Color("green").android]);
                    layers.push([0, new color_1.Color("blue").android]);
                }
                var unclustered = new com.Esrimap.Esrimapsdk.style.layers.SymbolLayer("unclustered-points", options.name);
                unclustered.setProperties([
                    com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleColor(new color_1.Color("red").android),
                    com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleRadius(new java.lang.Float(16.0)),
                    com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleBlur(new java.lang.Float(0.2))
                ]);
                console.log(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("cluster"));
                unclustered.setFilter(com.Esrimap.Esrimapsdk.style.expressions.Expression.neq(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("cluster"), true));
                theMap.EsrimapMap.addLayer(unclustered);
                for (var i = 0; i < layers.length; i++) {
                    var circles = new com.Esrimap.Esrimapsdk.style.layers.CircleLayer("cluster-" + i, options.name);
                    circles.setProperties([
                        com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleColor(layers[i][1]),
                        com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleRadius(new java.lang.Float(22.0)),
                        com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleBlur(new java.lang.Float(0.2))
                    ]);
                    var pointCount = com.Esrimap.Esrimapsdk.style.expressions.Expression.toNumber(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("point_count"));
                    circles.setFilter(i === 0 ?
                        com.Esrimap.Esrimapsdk.style.expressions.Expression.gte(pointCount, com.Esrimap.Esrimapsdk.style.expressions.Expression.literal(java.lang.Integer.valueOf(layers[i][0]))) :
                        com.Esrimap.Esrimapsdk.style.expressions.Expression.all([
                            com.Esrimap.Esrimapsdk.style.expressions.Expression.gte(pointCount, com.Esrimap.Esrimapsdk.style.expressions.Expression.literal(java.lang.Integer.valueOf(layers[i][0]))),
                            com.Esrimap.Esrimapsdk.style.expressions.Expression.lt(pointCount, com.Esrimap.Esrimapsdk.style.expressions.Expression.literal(java.lang.Integer.valueOf(layers[i - 1][0])))
                        ]));
                    theMap.EsrimapMap.addLayer(circles);
                }
                var count = new com.Esrimap.Esrimapsdk.style.layers.SymbolLayer("count", options.name);
                count.setProperties([
                    com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.textField(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("point_count")),
                    com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.textSize(new java.lang.Float(12.0)),
                    com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.textColor(new color_1.Color("white").android)
                ]);
                theMap.EsrimapMap.addLayer(count);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addGeoJsonClustered: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addSource = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var id = options.id, url = options.url, type = options.type;
                var theMap = nativeMap || _Esrimap;
                var source = void 0;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                if (theMap.EsrimapMap.getSource(id)) {
                    reject("Source exists: " + id);
                    return;
                }
                switch (type) {
                    case "vector":
                        source = new com.Esrimap.Esrimapsdk.style.sources.VectorSource(id, url);
                        break;
                    default:
                        reject("Invalid source type: " + type);
                        return;
                }
                if (!source) {
                    var ex = "No source to add";
                    console.log("Error in Esrimap.addSource: " + ex);
                    reject(ex);
                    return;
                }
                theMap.EsrimapMap.addSource(source);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addSource: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.removeSource = function (id, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.removeSource(id);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.removeSource: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.addLayer = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var id = options.id, source = options.source, sourceLayer = options.sourceLayer, type = options.type;
                var theMap = nativeMap || _Esrimap;
                var layer = void 0;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                if (theMap.EsrimapMap.getLayer(id)) {
                    reject("Layer exists: " + id);
                    return;
                }
                switch (type) {
                    case "circle":
                        var circleColor = options.circleColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.circleColor);
                        var circleOpacity = options.circleOpacity === undefined ? new java.lang.Float(1) : new java.lang.Float(options.circleOpacity);
                        var circleRadius = options.circleRadius === undefined ? new java.lang.Float(10) : new java.lang.Float(options.circleRadius);
                        var circleStrokeColor = options.circleStrokeColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.circleStrokeColor);
                        var circleStrokeWidth = options.circleStrokeWidth === undefined ? new java.lang.Float(1) : new java.lang.Float(options.circleStrokeWidth);
                        layer = new com.Esrimap.Esrimapsdk.style.layers.CircleLayer(id, source);
                        layer.setSourceLayer(sourceLayer);
                        layer.setProperties([
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleColor(circleColor),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleOpacity(circleOpacity),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleRadius(circleRadius),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleStrokeColor(circleStrokeColor),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleStrokeWidth(circleStrokeWidth),
                        ]);
                        break;
                    case "fill":
                        var fillColor = options.fillColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.fillColor);
                        var fillOpacity = options.fillOpacity === undefined ? new java.lang.Float(1) : new java.lang.Float(options.fillOpacity);
                        layer = new com.Esrimap.Esrimapsdk.style.layers.FillLayer(id, source);
                        layer.setSourceLayer(sourceLayer);
                        layer.setProperties([
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillColor(fillColor),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillOpacity(fillOpacity),
                        ]);
                        break;
                    case "line":
                        var lineCap = options.lineCap === undefined ? 'LINE_CAP_ROUND' : 'LINE_CAP_' + options.lineCap.toUpperCase();
                        var lineJoin = options.lineJoin === undefined ? 'LINE_JOIN_ROUND' : 'LINE_JOIN_' + options.lineCap.toUpperCase();
                        var lineColor = options.lineColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.lineColor);
                        var lineOpacity = options.lineOpacity === undefined ? new java.lang.Float(1) : new java.lang.Float(options.lineOpacity);
                        var lineWidth = options.lineWidth === undefined ? new java.lang.Float(1) : new java.lang.Float(options.lineWidth);
                        layer = new com.Esrimap.Esrimapsdk.style.layers.LineLayer(id, source);
                        layer.setSourceLayer(sourceLayer);
                        layer.setProperties([
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.lineCap(lineCap),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.lineJoin(lineJoin),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.lineColor(lineColor),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.lineOpacity(lineOpacity),
                            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.lineWidth(lineWidth),
                        ]);
                        break;
                    default:
                        reject("Invalid layer type: " + options.type);
                        break;
                }
                if (!layer) {
                    var ex = "No layer to add";
                    console.log("Error in Esrimap.addLayer: " + ex);
                    reject(ex);
                }
                theMap.EsrimapMap.addLayer(layer);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.addLayer: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.removeLayer = function (id, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                theMap.EsrimapMap.removeLayer(id);
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.removeLayer: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.prototype.trackUser = function (options, nativeMap) {
        return new Promise(function (resolve, reject) {
            try {
                var theMap = nativeMap || _Esrimap;
                if (!theMap) {
                    reject("No map has been loaded");
                    return;
                }
                if (!_locationLayerPlugin) {
                    reject("The map is not currently showing the user location");
                    return;
                }
                _locationLayerPlugin.setRenderMode(_getUserLocationRenderMode(options.mode));
                _locationLayerPlugin.setCameraMode(_getUserLocationCameraMode(options.mode));
                resolve();
            }
            catch (ex) {
                console.log("Error in Esrimap.trackUser: " + ex);
                reject(ex);
            }
        });
    };
    Esrimap.getAndroidColor = function (color) {
        var androidColor;
        if (color && color_1.Color.isValid(color)) {
            androidColor = new color_1.Color("" + color).android;
        }
        else {
            androidColor = new color_1.Color('#000').android;
        }
        return androidColor;
    };
    return Esrimap;
}(notoriun_coletor_plugin_common_1.EsrimapCommon));
exports.Esrimap = Esrimap;
//# sourceMappingURL=notoriun-coletor-plugin.android.js.map
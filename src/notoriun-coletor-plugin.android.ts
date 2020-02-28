/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />
/// <reference path="./platforms/ios/esrinotoriun.d.ts" />


import * as utils from "tns-core-modules/utils/utils";
import * as application from "tns-core-modules/application";
import * as frame from "tns-core-modules/ui/frame";
import * as fs from "tns-core-modules/file-system";
import { Color } from "tns-core-modules/color";
import * as http from "tns-core-modules/http";
import { EventData } from "tns-core-modules/data/observable";

import {
  AddExtrusionOptions,
  AddGeoJsonClusteredOptions,
  AddLayerOptions,
  AddPolygonOptions,
  AddPolylineOptions,
  AddSourceOptions,
  AnimateCameraOptions,
  DeleteOfflineRegionOptions,
  DownloadOfflineRegionOptions,
  Feature,
  LatLng,
  ListOfflineRegionsOptions,
  EsrimapApi,
  EsrimapCommon,
  EsrimapMarker,
  EsrimapViewBase,
  MapStyle,
  OfflineRegion,
  QueryRenderedFeaturesOptions,
  SetCenterOptions,
  ShowCallOutOptions,
  SetTiltOptions,
  SetViewportOptions,
  SetZoomLevelOptions,
  ShowOptions,
  TrackUserOptions,
  UserLocation,
  UserTrackingMode,
  Viewport
} from "./notoriun-coletor-plugin.common";

// Export the enums for devs not using TS
export { MapStyle };

declare const android, com, java, org: any;

let _Esrimap: any = {};
let _accessToken: string;
let _markers = [];
let _polylines = [];
let _polygons = [];
let _markerIconDownloadCache = [];
let _locationLayerPlugin = null;

const ACCESS_FINE_LOCATION_PERMISSION_REQUEST_CODE = 111;


 


/*************** XML definition START ****************/
export class EsrimapView extends EsrimapViewBase {

  private mapView: any; // com.esri.arcgisruntime.mapping.view.MapView
  private map: any //com.esri.arcgisruntime.mapping.ArcGISMap
  getNativeMapView(): any {
   // console.log("getNativeMapView");
    try {
      return this.mapView;
    }catch(ex){
          console.log("getNativeMapView ex" , ex);
      return null;
    }
  }

  public createNativeView(): Object {
      try {
    let nativeView = new android.widget.FrameLayout(this._context);
    console.log("createNativeView");
    setTimeout(() => {
      this.initMap();
    }, 0);
    return nativeView;
  
}catch(ex){
  console.log("EsrimapView",ex);
  return null;
}
}

  /*disposeNativeView(): void {
    if (_locationLayerPlugin) {
      _locationLayerPlugin.onStop();
    }
  }*/

  initMap(): void {
  try {
      if (!this.mapView) { //&& this.config.accessToken
        this.Esrimap = new Esrimap();
        let settings = Esrimap.merge(this.config, Esrimap.defaults);
        //com.Esrimap.Esrimapsdk.Esrimap.getInstance(this._context, settings.accessToken);
       // console.log("config",this.config);
        let _this = this;

        let drawMap = () => {
          this.mapView = new com.esri.arcgisruntime.mapping.view.MapView(
              this._context);
          this.map = new com.esri.arcgisruntime.mapping.ArcGISMap(com.esri.arcgisruntime.mapping.Basemap.Type.TOPOGRAPHIC, settings.latitude, settings.longitude, settings.zoomLevel); 
          this.mapView.setMap(this.map);
          let mapvar = this.map;
          let mapviewvar= this.mapView;
          // _getEsrimapMapOptions(settings)
         // this.mapView.onCreate(null);
          com.esri.arcgisruntime.ArcGISRuntimeEnvironment.setLicense(settings.accessToken);



          //verify if this is a sketch/edit mode or just a touchlistener;

          var ontouch = new EsriTouchListener(this._context,this.mapView);
          ontouch.setDispatcher(_this);
          mapviewvar.setOnTouchListener(ontouch);


          this.nativeView.addView(this.mapView);

          this.setMapStyle(settings.mapStyle);

          var newThread = new java.lang.Thread(
              new java.lang.Runnable({
                  run: function(){
                      //console.log("Running this code in new thread!",settings);
                      let eventData: EventData = {
                        eventName: "mapReady",
                        object: mapvar
                      }
                      _this.notify(eventData);
                     // settings.mapReady(mapvar);
                  }
              })
          );
         mapvar.addDoneLoadingListener(newThread);

       

         //  let cachedMarker = _getClickedMarkerDetails(marker);
         /* var newListen = new com.esri.arcgisruntime.mapping.view.ViewpointChangedListener({
          viewpointChanged:function(visibleAreaChangedEvent ){
              let eventData: EventData = {
                        eventName: "mapMove",
                        object: mapvar
                      }
                      _this.notify(eventData);
          }
         }); 
         mapviewvar.addViewpointChangedListener(newListen);
         */
 
        };

        setTimeout(drawMap, settings.delay ? settings.delay : 0);
      }
    
  }catch(ex){
    console.log("oopns",ex);
  }
}
}

/*************** XML definition END ****************/
//https://developers.arcgis.com/android/latest/java/sample-code/identify-graphics/
//https://developers.arcgis.com/android/latest/java/sample-code/show-callout/
class EsriTouchListener extends com.esri.arcgisruntime.mapping.view.DefaultMapViewOnTouchListener {
       mView: any;
       dispatcher:any;
      constructor(context: android.content.Context,mapView: any) {
        super(context,mapView);
        this.mView = mapView;
        // necessary when extending TypeScript constructors
        return global.__native(this);
    }
    setDispatcher(dispatch:any):void {
      this.dispatcher= dispatch;
    }
    onSingleTapConfirmed(e: android.view.MotionEvent): boolean {
       let screenPoint = new android.graphics.Point(e.getX(), e.getY());
       let  mapPoint = this.mView.screenToLocation(screenPoint);
        // convert to WGS84 for lat/lon format
       let wgsWMKPoint = com.esri.arcgisruntime.geometry.GeometryEngine.project(mapPoint, com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator());
     
        let latd = wgsWMKPoint.getX();
        let long = wgsWMKPoint.getY();

    
        let obj =  new org.json.JSONObject();
        obj.put('lat',latd);
        obj.put('lng',long);

      let eventData: EventData = {
        eventName: "singleTap",
        object: obj.toString()
      }
        this.dispatcher.notify(eventData);

       return this.super.onSingleTapConfirmed(e);
    }

    onLongPress(e: android.view.MotionEvent): boolean {
       let screenPoint = new android.graphics.Point(e.getX(), e.getY());
       let  mapPoint = this.mView.screenToLocation(screenPoint);
        // convert to WGS84 for lat/lon format
       let wgsWMKPoint = com.esri.arcgisruntime.geometry.GeometryEngine.project(mapPoint, com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator());
     
        let latd = wgsWMKPoint.getX();
        let long = wgsWMKPoint.getY();

    
        let obj =  new  org.json.JSONObject ();
        obj.put('lat',latd);
        obj.put('lng',long);

      let eventData: EventData = {
        eventName: "longTap",
        object: obj.toString()
      }
        this.dispatcher.notify(eventData);
       return this.super.onLongPress(e);
    }

}

const _getMapStyle = (input: any): any => {
  const Style =com.esri.android.map.MapOptions.MapType;
  // allow for a style URL to be passed
  if (/^Esrimap:\/\/styles/.test(input) || /^http:\/\//.test(input) || /^https:\/\//.test(input)) {
    return input;
  } else if (/^~\//.test(input)) {
    let assetsPath = 'asset://app/';
    input = input.replace(/^~\//, assetsPath);
    return input;
  } else if (input === MapStyle.GRAY || input === MapStyle.GRAY.toString()) {
    return Style.GRAY;
  } else if (input === MapStyle.HYBRID || input === MapStyle.HYBRID.toString()) {
    return Style.HYBRID;
  } else if (input === MapStyle.NATIONAL_GEOGRAPHIC || input === MapStyle.NATIONAL_GEOGRAPHIC.toString()) {
    return Style.NATIONAL_GEOGRAPHIC;
  } else if (input === MapStyle.SATELLITE || input === MapStyle.SATELLITE.toString()) {
    return Style.SATELLITE;
  } else if (input === MapStyle.STREETS || input === MapStyle.STREETS.toString()) {
    return Style.STREETS;
  } else if (input === MapStyle.TOPO || input === MapStyle.TOPO.toString()) {
    return Style.TOPO;
  } else if (input === MapStyle.OSM || input === MapStyle.OSM.toString()) {
    return Style.OSM;
  } else {
    // default
    return Style.STREETS;
  }
};

const _getUserLocationRenderMode = (input: UserTrackingMode): any => {
  // see https://github.com/Esrimap/Esrimap-plugins-android/blob/3a92bdf28b3bd76c9e83627f985baeff1b26d401/plugin-locationlayer/src/main/java/com/Esrimap/Esrimapsdk/plugins/locationlayer/modes/RenderMode.java#L28
  const RenderMode = com.Esrimap.Esrimapsdk.plugins.locationlayer.modes.RenderMode;
  if (input === "FOLLOW_WITH_HEADING") {
    return RenderMode.COMPASS;
  } else if (input === "FOLLOW_WITH_COURSE") {
    return RenderMode.GPS;
  } else {
    return RenderMode.NORMAL;
  }
};

const _getUserLocationCameraMode = (input: UserTrackingMode): any => {
  // see https://github.com/Esrimap/Esrimap-plugins-android/blob/3a92bdf28b3bd76c9e83627f985baeff1b26d401/plugin-locationlayer/src/main/java/com/Esrimap/Esrimapsdk/plugins/locationlayer/modes/CameraMode.java#L28
  const CameraMode = com.Esrimap.Esrimapsdk.plugins.locationlayer.modes.CameraMode;
  if (input === "FOLLOW") {
    return CameraMode.TRACKING;
  } else if (input === "FOLLOW_WITH_HEADING") {
    return CameraMode.TRACKING_COMPASS;
  } else if (input === "FOLLOW_WITH_COURSE") {
    return CameraMode.TRACKING_COMPASS;
  } else {
    return CameraMode.NONE;
  }
};

const _getEsrimapMapOptions = (settings) => {
    if (settings.zoomLevel && !settings.center) {
    // Eiffel tower, Paris
    settings.center = {
      lat: 48.858093,
      lng: 2.294694
    };
    settings.latitude = 48.858093;
    settings.longitude = 2.294694;
    settings.zoomLevel = 10;
  }

  const EsrimapMapOptions = new com.esri.android.map.MapOptions(settings.style,settings.center.lat,settings.center.lng,settings.zoomLevel);
     ///.compassEnabled(!settings.hideCompass)
     // .rotateGesturesEnabled(!settings.disableRotation)
     // .scrollGesturesEnabled(!settings.disableScroll)
     // .tiltGesturesEnabled(!settings.disableTilt)
     // .zoomGesturesEnabled(!settings.disableZoom)
     // .attributionEnabled(!settings.hideAttribution)
     // .logoEnabled(!settings.hideLogo);

  // zoom level is not applied unless center is set


  /*if (settings.center && settings.center.lat && settings.center.lng) {
    const cameraPositionBuilder = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder()
        .zoom(settings.zoomLevel)
        .target(new com.Esrimap.Esrimapsdk.geometry.LatLng(settings.center.lat, settings.center.lng));
    EsrimapMapOptions.camera(cameraPositionBuilder.build());
  }*/

  return EsrimapMapOptions;
};

const _fineLocationPermissionGranted = () => {
  let hasPermission = android.os.Build.VERSION.SDK_INT < 23; // Android M. (6.0)
  if (!hasPermission) {
    hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ===
        android.support.v4.content.ContextCompat.checkSelfPermission(application.android.foregroundActivity, android.Manifest.permission.ACCESS_FINE_LOCATION);
  }
  return hasPermission;
};

const _showLocation = (theMapView, EsrimapMap) => {
  _locationLayerPlugin = new com.Esrimap.Esrimapsdk.plugins.locationlayer.LocationLayerPlugin(theMapView, EsrimapMap);
};

const _getClickedMarkerDetails = (clicked) => {
  for (let m in _markers) {
    let cached = _markers[m];
    // tslint:disable-next-line:triple-equals
    if (cached.lat == clicked.getPosition().getLatitude() &&
        // tslint:disable-next-line:triple-equals
        cached.lng == clicked.getPosition().getLongitude() &&
        // tslint:disable-next-line:triple-equals
        cached.title == clicked.getTitle() && // == because of null vs undefined
        // tslint:disable-next-line:triple-equals
        cached.subtitle == clicked.getSnippet()) {
      return cached;
    }
  }
};

const _downloadImage = (marker) => {
  return new Promise((resolve, reject) => {
    // to cache..
    if (_markerIconDownloadCache[marker.icon]) {
      marker.iconDownloaded = _markerIconDownloadCache[marker.icon];
      resolve(marker);
      return;
    }
    // ..or not to cache
    http.getImage(marker.icon).then(
        (output) => {
          marker.iconDownloaded = output.android;
          _markerIconDownloadCache[marker.icon] = marker.iconDownloaded;
          resolve(marker);
        }, (e) => {
          console.log(`Download failed for ' ${marker.icon}' with error: ${e}`);
          resolve(marker);
        });
  });
};

 
const _downloadMarkerImages = (markers) => {
  let iterations = [];
  let result = [];
  for (let i = 0; i < markers.length; i++) {
    let marker = markers[i];
    if (marker.icon && marker.icon.startsWith("http")) {
      let p = _downloadImage(marker).then((mark) => {
        result.push(mark);
      });
      iterations.push(p);
    } else {
      result.push(marker);
    }
  }
  return Promise.all(iterations).then((output) => {
    return result;
  });
};

const _addMarkers = (markers: EsrimapMarker[], nativeMap?) => {
  if (!markers) {
    console.log("No markers passed");
    return;
  }
  if (!Array.isArray(markers)) {
    console.log("markers must be passed as an Array: [{title:'foo'}]");
    return;
  }
  //console.log("loading up _addMarkers");
  const theMap = nativeMap || _Esrimap;
  if (!theMap || !theMap.EsrimapMap) {
     // console.log("theMap is null");
  //  return;
  }
   // let graphicsOverlay = null;
    //let gOverlayList = theMap.getGraphicsOverlays();
        //console.log("gOverlayList",gOverlayList,gOverlayList.size());
     const graphicsOverlay =  new com.esri.arcgisruntime.mapping.view.GraphicsOverlay();
    
   // console.log("preparing _addMarkers",graphicsOverlay);
  //let SPATIAL_REFERENCE = com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator();
  for (let m in markers) {
    let _marker: EsrimapMarker = markers[m];
    let point = new com.esri.arcgisruntime.geometry.Point(_marker.lat, _marker.lng, _marker.spatialReference);
    let redCircleSymbol = new com.esri.arcgisruntime.symbology.SimpleMarkerSymbol(com.esri.arcgisruntime.symbology.SimpleMarkerSymbol.Style.CIRCLE, 0xFFFF0000, 10);
 
   // console.log("adding",_marker);

    //console.log("_icon",_marker.icon);

    let decodedBytes = android.util.Base64.decode(_marker.icon, 0);
    let icon = android.graphics.BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
    let  drawable = new android.graphics.drawable.BitmapDrawable(application.android.context.getResources(), icon);

    let markerSymbol = new com.esri.arcgisruntime.symbology.PictureMarkerSymbol(drawable);

    markerSymbol.setHeight(_marker.height);
    markerSymbol.setWidth(_marker.width);
    markerSymbol.setOffsetY(_marker.yoffset);
    markerSymbol.setOffsetX(_marker.xoffset);

    graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(point, markerSymbol));

/*
    markerSymbol.loadAsync();
    markerSymbol.addDoneLoadingListener(new Runnable() {
      @Override
      public void run() {
      }
    });*/

    //graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(point, markerSymbol));
    //console.log("added",_marker);
  }
  theMap.getGraphicsOverlays().add(graphicsOverlay);
 // console.log("getGraphicsOverlays",graphicsOverlay);


  /*theMap.EsrimapMap.setOnMarkerClickListener(
      new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnMarkerClickListener({
        onMarkerClick: (marker) => {
          let cachedMarker = _getClickedMarkerDetails(marker);
          if (cachedMarker && cachedMarker.onTap) {
            cachedMarker.onTap(cachedMarker);
          }
          return false;
        }
      })
  );*/

  /*theMap.EsrimapMap.setOnInfoWindowClickListener(
      new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnInfoWindowClickListener({
        onInfoWindowClick: (marker) => {
          let cachedMarker = _getClickedMarkerDetails(marker);
          if (cachedMarker && cachedMarker.onCalloutTap) {
            cachedMarker.onCalloutTap(cachedMarker);
          }
          return true;
        }
      })
  );*/

 // const iconFactory = com.Esrimap.Esrimapsdk.annotations.IconFactory.getInstance(application.android.context);

  // if any markers need to be downloaded from the web they need to be available synchronously, so fetch them first before looping
 /* _downloadMarkerImages(markers).then(updatedMarkers => {
    for (let m in updatedMarkers) {
      let marker: any = updatedMarkers[m];
      _markers.push(marker);
      let markerOptions = new com.Esrimap.Esrimapsdk.annotations.MarkerOptions();
      markerOptions.setTitle(marker.title);
      markerOptions.setSnippet(marker.subtitle);
      markerOptions.setPosition(new com.Esrimap.Esrimapsdk.geometry.LatLng(parseFloat(marker.lat), parseFloat(marker.lng)));

      if (marker.icon) {
        // for markers from url see UrlMarker in https://github.com/Esrimap/Esrimap-gl-native/issues/5370
        if (marker.icon.startsWith("res://")) {
          let resourceName = marker.icon.substring(6);
          let res = utils.ad.getApplicationContext().getResources();
          let identifier = res.getIdentifier(resourceName, "drawable", utils.ad.getApplication().getPackageName());
          if (identifier === 0) {
            console.log(`No icon found for this device density for icon ' ${marker.icon}'. Falling back to the default icon.`);
          } else {
            markerOptions.setIcon(iconFactory.fromResource(identifier));
          }
        } else if (marker.icon.startsWith("http")) {
          if (marker.iconDownloaded !== null) {
            markerOptions.setIcon(iconFactory.fromBitmap(marker.iconDownloaded));
          }
        } else {
          console.log("Please use res://resourceName, http(s)://imageUrl or iconPath to use a local path");
        }

      } else if (marker.iconPath) {
        let iconFullPath = fs.knownFolders.currentApp().path + "/" + marker.iconPath;
        // if the file doesn't exist the app will crash, so checking it
        if (fs.File.exists(iconFullPath)) {
          // could set width, height, retina, see https://github.com/Telerik-Verified-Plugins/Esrimap/pull/42/files?diff=unified&short_path=1c65267, but that's what the marker.icon param is for..
          markerOptions.setIcon(iconFactory.fromPath(iconFullPath));
        } else {
          console.log(`Marker icon not found, using the default instead. Requested full path: '" + ${iconFullPath}'.`);
        }
      }
      marker.android = theMap.EsrimapMap.addMarker(markerOptions);

      if (marker.selected) {
        theMap.EsrimapMap.selectMarker(marker.android);
      }

      marker.update = (newSettings: EsrimapMarker) => {
        for (let m in _markers) {
          let _marker: EsrimapMarker = _markers[m];
          if (marker.id === _marker.id) {
            if (newSettings.onTap !== undefined) {
              _marker.onTap = newSettings.onTap;
            }
            if (newSettings.onCalloutTap !== undefined) {
              _marker.onCalloutTap = newSettings.onCalloutTap;
            }
            if (newSettings.title !== undefined) {
              _marker.title = newSettings.title;
              _marker.android.setTitle(newSettings.title);
            }
            if (newSettings.subtitle !== undefined) {
              _marker.subtitle = newSettings.title;
              _marker.android.setSnippet(newSettings.subtitle);
            }
            if (newSettings.lat && newSettings.lng) {
              _marker.lat = newSettings.lat;
              _marker.lng = newSettings.lng;
              _marker.android.setPosition(new com.Esrimap.Esrimapsdk.geometry.LatLng(parseFloat(<any>newSettings.lat), parseFloat(<any>newSettings.lng)));
            }
            if (newSettings.selected) {
              theMap.EsrimapMap.selectMarker(_marker.android);
            }
          }
        }
      };
    }
  });*/
};

const _removeMarkers = (ids?, nativeMap?) => {
  const theMap = nativeMap || _Esrimap;
  if (!theMap || !theMap.EsrimapMap) {
    return;
  }
  for (let m in _markers) {
    let marker = _markers[m];
    if (!ids || (marker && marker.id && ids.indexOf(marker.id) > -1)) {
      if (marker && marker.android) {
        theMap.EsrimapMap.removeAnnotation(marker.android);
      }
    }
  }
  // remove markers from cache
  if (ids) {
    _markers = _markers.filter(marker => ids.indexOf(marker.id) === -1);
  } else {
    _markers = [];
  }
};

const _getRegionName = (offlineRegion) => {
  const metadata = offlineRegion.getMetadata();
  const jsonStr = new java.lang.String(metadata, "UTF-8");
  const jsonObj = new org.json.JSONObject(jsonStr);
  return jsonObj.getString("name");
};

const _getOfflineManager = () => {
  if (!_Esrimap.offlineManager) {
    _Esrimap.offlineManager = com.Esrimap.Esrimapsdk.offline.OfflineManager.getInstance(application.android.context);
  }
  return _Esrimap.offlineManager;
};

 

export class Esrimap extends EsrimapCommon implements EsrimapApi {
  hasFineLocationPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        resolve(_fineLocationPermissionGranted());
      } catch (ex) {
        console.log("Error in Esrimap.hasFineLocationPermission: " + ex);
        reject(ex);
      }
    });
  }

  requestFineLocationPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
       console.log("requestFineLocationPermission");
      if (_fineLocationPermissionGranted()) {
        resolve();
        return;
      }

      // grab the permission dialog result
      const permissionCallback = (args: any) => {
        if (args.requestCode !== ACCESS_FINE_LOCATION_PERMISSION_REQUEST_CODE) {
          return;
        }
        for (let i = 0; i < args.permissions.length; i++) {
          if (args.grantResults[i] === android.content.pm.PackageManager.PERMISSION_DENIED) {
            reject("Permission denied");
            return;
          }
        }
        application.android.off(application.AndroidApplication.activityRequestPermissionsEvent, permissionCallback);
        resolve();
      };

      application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, permissionCallback);

      // invoke the permission dialog
      android.support.v4.app.ActivityCompat.requestPermissions(
          application.android.foregroundActivity,
          [android.Manifest.permission.ACCESS_FINE_LOCATION],
          ACCESS_FINE_LOCATION_PERMISSION_REQUEST_CODE);
    });
  }

  show(options: ShowOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
         console.log("show");
         /* const showIt = () => {
          const settings = Esrimap.merge(options, Esrimap.defaults);

          // if no accessToken was set the app may crash
          if (settings.accessToken === undefined) {
            reject("Please set the 'accessToken' parameter");
            return;
          }

          // if already added, make sure it's removed first
          if (_Esrimap.mapView) {
            let viewGroup = _Esrimap.mapView.getParent();
            if (viewGroup !== null) {
              viewGroup.removeView(_Esrimap.mapView);
            }
          }

          _accessToken = settings.accessToken;
          com.Esrimap.Esrimapsdk.Esrimap.getInstance(application.android.context, _accessToken);
          let EsrimapMapOptions = _getEsrimapMapOptions(settings);

          _Esrimap.mapView = new com.Esrimap.Esrimapsdk.maps.MapView(
              application.android.context,
              EsrimapMapOptions);

          _Esrimap.mapView.onCreate(null);

          _Esrimap.mapView.getMapAsync(
              new com.Esrimap.Esrimapsdk.maps.OnMapReadyCallback({
                onMapReady: mbMap => {
                  _Esrimap.EsrimapMap = mbMap;
                  _Esrimap.mapView.EsrimapMap = mbMap;

                  _polylines = [];
                  _polygons = [];
                  _markers = [];
                  _addMarkers(settings.markers, _Esrimap.mapView);

                  if (settings.showUserLocation) {
                    this.requestFineLocationPermission().then(() => {
                      _showLocation(_Esrimap.mapView, mbMap);
                    });
                  }
                  resolve({
                    android: _Esrimap.mapView
                  });
                }
              })
          );

          // mapView.onResume();

          const topMostFrame = frame.topmost(),
              context = application.android.context,
              mapViewLayout = new android.widget.FrameLayout(context),
              density = utils.layout.getDisplayDensity(),
              left = settings.margins.left * density,
              right = settings.margins.right * density,
              top = settings.margins.top * density,
              bottom = settings.margins.bottom * density,
              viewWidth = topMostFrame.currentPage.android.getWidth(),
              viewHeight = topMostFrame.currentPage.android.getHeight(),
              params = new android.widget.FrameLayout.LayoutParams(viewWidth - left - right, viewHeight - top - bottom);

          params.setMargins(left, top, right, bottom);
          _Esrimap.mapView.setLayoutParams(params);

          mapViewLayout.addView(_Esrimap.mapView);
          if (topMostFrame.currentPage.android.getParent()) {
            topMostFrame.currentPage.android.getParent().addView(mapViewLayout);
          } else {
            topMostFrame.currentPage.android.addView(mapViewLayout);
          }
        };

        // if the map is invoked immediately after launch this delay will prevent an error
        setTimeout(showIt, 200);
*/
      } catch (ex) {
        console.log("Error in Esrimap.show: " + ex);
        reject(ex);
      }
    });
  }

  hide(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
      console.log("hide");
        if (_Esrimap.mapView) {
          const viewGroup = _Esrimap.mapView.getParent();
          if (viewGroup !== null) {
            //viewGroup.setVisibility(android.view.View.INVISIBLE);
          }
        }
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.hide: " + ex);
        reject(ex);
      }
    });
  }

  unhide(): Promise<any> {
    console.log("unhide");
    return new Promise((resolve, reject) => {
      try {
        if (_Esrimap.mapView) {
         // _Esrimap.mapView.getParent().setVisibility(android.view.View.VISIBLE);
          resolve();
        } else {
          reject("No map found");
        }
      } catch (ex) {
        console.log("Error in Esrimap.unhide: " + ex);
        reject(ex);
      }
    });
  }

  destroy(nativeMap?: any): Promise<any> {

    return new Promise((resolve, reject) => {
          try {
        if (_Esrimap.mapView) {
          _Esrimap.mapView.destroyDrawingCache();
              console.log("destroy");
         // _Esrimap.mapView.getParent().setVisibility(android.view.View.VISIBLE);
          resolve();
        } else {
          reject("No map found");
        }
      } catch (ex) {
        console.log("Error in Esrimap.destroy: " + ex);
        reject(ex);
      }
     /* const theMap = nativeMap || _Esrimap;
      if (theMap.mapView) {
        const viewGroup = theMap.mapView.getParent();
        if (viewGroup !== null) {
        //  viewGroup.removeView(theMap.mapView);
        }
        if (_locationLayerPlugin) {
         // _locationLayerPlugin.onStop();
        }
        theMap.mapView = null;
        theMap.EsrimapMap = null;
        _Esrimap = {};
      }*/
      resolve();
    });
  }

  setMapStyle(style: string | MapStyle, nativeMap?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const settings = Esrimap.defaults;//Esrimap.merge(options, Esrimap.defaults);
        //const mapStyle = _getMapStyle(style);
       // settings.style = style;

        //let EsrimapMapOptions = _getEsrimapMapOptions(settings);
        //theMap.setMapOptions(EsrimapMapOptions);

        //https://developers.arcgis.com/android/latest/java/sample-code/change-basemaps/

      //https://github.com/Esri/arcgis-runtime-samples-dotnet/blob/master/src/Android/Xamarin.Android/Samples/Map/ChangeBasemap/ChangeBasemap.cs
        switch(style){
          case MapStyle.GRAY: 
          theMap.Basemap = com.esri.arcgisruntime.mapping.Basemap.createLightGrayCanvas();
          break;
          case MapStyle.TOPO:
          theMap.Basemap = com.esri.arcgisruntime.mapping.Basemap.createTopographic();
          break;
          case MapStyle.STREETS:
          theMap.Basemap =com.esri.arcgisruntime.mapping.Basemap.createStreets();
          break;
        }

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setMapStyle: " + ex);
        reject(ex);
      }
    });
  }

  addMarkers(markers: EsrimapMarker[], nativeMap?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        _addMarkers(markers, nativeMap);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addMarkers: " + ex);
        reject(ex);
      }
    });
  }

  removeMarkers(ids?: any, nativeMap?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        _removeMarkers(ids, nativeMap);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.removeMarkers: " + ex);
        reject(ex);
      }
    });
  }

 clearCallouts( nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        let mCallout = theMap.getCallout();
        mCallout.dismiss();

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.clearCallouts: " + ex);
        reject(ex);
      }
    });
  }

 showCallout(options: ShowCallOutOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;


        let mapPoint = new com.esri.arcgisruntime.geometry.Point(options.lat, options.lng,com.esri.arcgisruntime.geometry.SpatialReferences.getWebMercator());

       // let screenPoint = new android.graphics.Point(options.lat,options.lng);
        // create a map point from screen point
       // let mapPoint = theMap.screenToLocation(screenPoint);
        let calloutContent = new android.widget.TextView(utils.ad.getApplicationContext());

        calloutContent.setTextColor(android.graphics.Color.BLACK);
        calloutContent.setSingleLine(false);
        calloutContent.setText(options.description);

        // get callout, set content and show
        let mCallout = theMap.getCallout();
        mCallout.setLocation(mapPoint);
        mCallout.setContent(calloutContent);
        mCallout.show();

        // center on tapped point
        //theMap.setViewpointCenterAsync(mapPoint);
        //console.log("ShowCallOutOptions",options);

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.showCallout: " + ex);
        reject(ex);
      }
    });
  }

setCenterOnCurrentLocation( nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        
        let mLocationDisplay = theMap.getLocationDisplay();
        mLocationDisplay.setAutoPanMode(com.esri.arcgisruntime.mapping.view.LocationDisplay.AutoPanMode.RECENTER);
        if (!mLocationDisplay.isStarted()){
              mLocationDisplay.startAsync();
        }else {
          mLocationDisplay.stop();
        }
    }catch (ex) {
        console.log("Error in Esrimap.setCenter: " + ex);
        reject(ex);
     }
    });
  }

  setCenter(options: SetCenterOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const cameraPosition = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder()
            .target(new com.Esrimap.Esrimapsdk.geometry.LatLng(options.lat, options.lng))
            .build();

        if (options.animated === true) {
          theMap.EsrimapMap.animateCamera(
              com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.newCameraPosition(cameraPosition),
              1000,
              null);
        } else {
          theMap.EsrimapMap.setCameraPosition(cameraPosition);
        }

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setCenter: " + ex);
        reject(ex);
      }
    });
  }

  getCenter(nativeMap?): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const map = theMap.EsrimapMap;
        //let mLocationDisplay = theMap.getLocationDisplay();

        let centreX=theMap.getX() + theMap.getWidth()  / 2;
        let centreY=theMap.getY() + theMap.getHeight() / 2;

        let screenPoint = new android.graphics.Point(Math.round(centreX), Math.round(centreY));
        let mapPoint = theMap.screenToLocation(screenPoint);
        let wgs84Point = com.esri.arcgisruntime.geometry.GeometryEngine.project(mapPoint, com.esri.arcgisruntime.geometry.SpatialReferences.getWgs84());

        let latd = wgs84Point.getY();
        let long = wgs84Point.getX();

        let viewpoint = theMap.getCurrentViewpoint(com.esri.arcgisruntime.mapping.Viewpoint.Type.CENTER_AND_SCALE);
        let zoomlevel = viewpoint.getTargetScale();
        resolve({
          lat: latd,
          lng: long,
          zoom: zoomlevel,
          json: viewpoint.toJson()
        });
      } catch (ex) {
        console.log("Error in Esrimap.getCenter: " + ex);
        reject(ex);
      }
    });
  }

  setZoomLevel(options: SetZoomLevelOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const animated = options.animated === undefined || options.animated;
        const level = options.level;

        if (level >= 0 && level <= 20) {
          const cameraUpdate = com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.zoomTo(level);
          if (animated) {
            theMap.EsrimapMap.easeCamera(cameraUpdate);
          } else {
            theMap.EsrimapMap.moveCamera(cameraUpdate);
          }
          resolve();
        } else {
          reject("invalid ZoomLevel, use any double value from 0 to 20 (like 8.3)");
        }
      } catch (ex) {
        console.log("Error in Esrimap.setZoomLevel: " + ex);
        reject(ex);
      }
    });
  }

  getZoomLevel(nativeMap?): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const level = theMap.EsrimapMap.getCameraPosition().zoom;
        resolve(level);
      } catch (ex) {
        console.log("Error in Esrimap.getZoomLevel: " + ex);
        reject(ex);
      }
    });
  }

  setTilt(options: SetTiltOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const tilt = options.tilt ? options.tilt : 30;

        const cameraPositionBuilder = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder()
            .tilt(tilt);

        const cameraUpdate = com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.newCameraPosition(cameraPositionBuilder.build());
        const durationMs = options.duration ? options.duration : 5000;

        theMap.EsrimapMap.easeCamera(cameraUpdate, durationMs);

        setTimeout(() => {
          resolve();
        }, durationMs);
      } catch (ex) {
        console.log("Error in Esrimap.setTilt: " + ex);
        reject(ex);
      }
    });
  }

  getTilt(nativeMap?): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const tilt = theMap.EsrimapMap.getCameraPosition().tilt;
        resolve(tilt);
      } catch (ex) {
        console.log("Error in Esrimap.getTilt: " + ex);
        reject(ex);
      }
    });
  }

  getUserLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      try {
        const loc = _locationLayerPlugin ? _locationLayerPlugin.getLocationEngine().getLastLocation() : null;
        if (loc === null) {
          reject("Location not available");
        } else {
          resolve({
            location: {
              lat: loc.getLatitude(),
              lng: loc.getLongitude()
            },
            speed: loc.getSpeed()
          });
        }
      } catch (ex) {
        console.log("Error in Esrimap.getUserLocation: " + ex);
        reject(ex);
      }
    });
  }

  queryRenderedFeatures(options: QueryRenderedFeaturesOptions, nativeMap?): Promise<Array<Feature>> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const point = options.point;
        if (point === undefined) {
          reject("Please set the 'point' parameter");
          return;
        }
        const EsrimapPoint = new com.Esrimap.Esrimapsdk.geometry.LatLng(options.point.lat, options.point.lng);
        const screenLocation = theMap.EsrimapMap.getProjection().toScreenLocation(EsrimapPoint);
        if (theMap.EsrimapMap.queryRenderedFeatures) {
          const features /* List<Feature> */ = theMap.EsrimapMap.queryRenderedFeatures(screenLocation, null, options.layerIds);
          const result: Array<Feature> = [];
          for (let i = 0; i < features.size(); i++) {
            // see https://www.Esrimap.com/android-docs/api/Esrimap-java/libjava-geojson/3.4.1/com/Esrimap/geojson/Feature.html
            const feature = features.get(i);
            result.push({
              id: feature.id(),
              type: feature.type(),
              properties: JSON.parse(feature.properties().toString())
            });
          }
          resolve(result);
        } else {
          reject("Feature not supported by this Esrimap version");
        }
      } catch (ex) {
        console.log("Error in Esrimap.queryRenderedFeatures: " + ex);
        reject(ex);
      }
    });
  }

//https://developers.arcgis.com/android/latest/guide/add-graphics-and-text-to-graphics-overlays.htm
  addPolygon(options: AddPolygonOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const points = options.points;
        if (points === undefined) {
          reject("Please set the 'points' parameter");
          return;
        }

      const spatial:number = Number(options.spatialReference);
      var pointcollection = new com.esri.arcgisruntime.geometry.PointCollection(com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
      for(var i=0;i< options.points.length;i++){
        let lat:number = Number(options.points[i].lat);
        let lng:number = Number(options.points[i].lng);
        let point = new com.esri.arcgisruntime.geometry.Point(lat, lng, com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
        pointcollection.add(point);
      }
      var polygon = new com.esri.arcgisruntime.geometry.Polygon(pointcollection);
      var fillSymbol = new com.esri.arcgisruntime.symbology.SimpleFillSymbol(com.esri.arcgisruntime.symbology.SimpleFillSymbol.Style.CROSS, android.graphics.Color.BLUE, null);

      const graphicsOverlay =  new com.esri.arcgisruntime.mapping.view.GraphicsOverlay();
      graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(polygon, fillSymbol));

  
        theMap.getGraphicsOverlays().add(graphicsOverlay);
       /* _polygons.push({
          id: options.id || new Date().getTime(),
          android: theMap.EsrimapMap.addGraphic(polygonOptions)
        });*/
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addPolygon: " + ex);
        reject(ex);
      }
    });
  }
 
  addPolyline(options: AddPolylineOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const points = options.points;
        if (points === undefined) {
          reject("Please set the 'points' parameter");
          return;
        }

      const spatial:number = Number(options.spatialReference);
      var pointcollection = new com.esri.arcgisruntime.geometry.PointCollection(com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
      for(var i=0;i< options.points.length;i++){
        let lat:number = Number(options.points[i].lat);
        let lng:number = Number(options.points[i].lng);
        let point = new com.esri.arcgisruntime.geometry.Point(lat, lng, com.esri.arcgisruntime.geometry.SpatialReference.create(spatial));
        pointcollection.add(point);
      }
      var polyline = new com.esri.arcgisruntime.geometry.Polyline(pointcollection);
      var lineSymbol = new com.esri.arcgisruntime.symbology.SimpleLineSymbol(com.esri.arcgisruntime.symbology.SimpleLineSymbol.Style.SOLID,  android.graphics.Color.BLUE, 5);

      const graphicsOverlay =  new com.esri.arcgisruntime.mapping.view.GraphicsOverlay();
      graphicsOverlay.getGraphics().add(new com.esri.arcgisruntime.mapping.view.Graphic(polyline, lineSymbol));

      /*  _polylines.push({
          id: options.id || new Date().getTime(),
          android: theMap.EsrimapMap.addPolyline(polylineOptions)
        });*/
        theMap.getGraphicsOverlays().add(graphicsOverlay);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addPolyline: " + ex);
        reject(ex);
      }
    });
  }

  removePolygons(ids?: Array<any>, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        for (let p in _polygons) {
          let polygon = _polygons[p];
          if (!ids || (polygon.id && ids.indexOf(polygon.id) > -1)) {
            theMap.EsrimapMap.removePolygon(polygon.android);
          }
        }
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.removePolygons: " + ex);
        reject(ex);
      }
    });
  }

  removePolylines(ids?: Array<any>, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        for (let p in _polylines) {
          let polyline = _polylines[p];
          if (!ids || (polyline.id && ids.indexOf(polyline.id) > -1)) {
            theMap.EsrimapMap.removePolyline(polyline.android);
          }
        }
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.removePolylines: " + ex);
        reject(ex);
      }
    });
  }

  animateCamera(options: AnimateCameraOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const target = options.target;
        if (target === undefined) {
          reject("Please set the 'target' parameter");
          return;
        }

        const cameraPositionBuilder = new com.Esrimap.Esrimapsdk.camera.CameraPosition.Builder(theMap.EsrimapMap.getCameraPosition())
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

        const durationMs = options.duration ? options.duration : 10000;

        theMap.EsrimapMap.animateCamera(
            com.Esrimap.Esrimapsdk.camera.CameraUpdateFactory.newCameraPosition(cameraPositionBuilder.build()),
            durationMs,
            null);

        setTimeout(() => {
          resolve();
        }, durationMs);
      } catch (ex) {
        console.log("Error in Esrimap.animateCamera: " + ex);
        reject(ex);
      }
    });
  }

  private createPointFunc(listener: (data: LatLng) => void) {
    return (point: { getLatitude: () => number; getLongitude: () => number; }) => {
      listener({
        lat: point.getLatitude(),
        lng: point.getLongitude()
      });
    };
  }

//https://developers.arcgis.com/android/latest/java/sample-code/show-callout/
  setOnMapClickListener(listener: (data: LatLng) => void, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }


        theMap.EsrimapMap.addOnMapClickListener(
            new com.esri.arcgisruntime.mapping.view.MapView.OnTouchListener({
              onMapClick: this.createPointFunc(listener),
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnMapClickListener: " + ex);
        reject(ex);
      }
    });
  }

  setOnMapLongClickListener(listener: (data: LatLng) => void, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.addOnMapLongClickListener(
            new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnMapLongClickListener({
              onMapLongClick: this.createPointFunc(listener),
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnMapLongClickListener: " + ex);
        reject(ex);
      }
    });
  }

  setOnScrollListener(listener: (data?: LatLng) => void, nativeMap?): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        // the 'onMove' event seems like the one closest to the iOS implementation
        theMap.EsrimapMap.addOnMoveListener(
            new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnMoveListener({
              onMoveBegin: (detector: any /* MoveGestureDetector */) => {
              },
              onMove: (detector: any /* MoveGestureDetector */) => {
                const coordinate = theMap.EsrimapMap.getCameraPosition().target;
                listener({
                  lat: coordinate.getLatitude(),
                  lng: coordinate.getLongitude(),
                  zoom: 12
                });
              },
              onMoveEnd: (detector: any /* MoveGestureDetector */) => {
              }
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnScrollListener: " + ex);
        reject(ex);
      }
    });
  }

  setOnFlingListener(listener: () => void, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.addOnFlingListener(
            new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnFlingListener({
              onFling: () => {
                listener();
              }
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnFlingListener: " + ex);
        reject(ex);
      }
    });
  }

  setOnCameraMoveListener(listener: () => void, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.addOnCameraMoveListener(
            new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnCameraMoveListener({
              onCameraMove: () => {
                listener();
              }
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnCameraMoveListener: " + ex);
        reject(ex);
      }
    });
  }

  setOnCameraMoveCancelListener(listener: () => void, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.addOnCameraMoveCancelListener(
            new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnCameraMoveCanceledListener({
              onCameraMoveCanceled: () => {
                listener();
              }
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnCameraMoveCancelListener: " + ex);
        reject(ex);
      }
    });
  }

  setOnCameraIdleListener(listener: () => void, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.addOnCameraIdleListener(
            new com.Esrimap.Esrimapsdk.maps.EsrimapMap.OnCameraIdleListener({
              onCameraIdle: () => {
                listener();
              }
            })
        );

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setOnCameraIdleListener: " + ex);
        reject(ex);
      }
    });
  }

  getViewport(nativeMap?): Promise<Viewport> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        const bounds = theMap.EsrimapMap.getProjection().getVisibleRegion().latLngBounds;

        resolve({
          bounds: {
            north: bounds.getLatNorth(),
            east: bounds.getLonEast(),
            south: bounds.getLatSouth(),
            west: bounds.getLonWest()
          },
          zoomLevel: theMap.EsrimapMap.getCameraPosition().zoom
        });
      } catch (ex) {
        console.log("Error in Esrimap.getViewport: " + ex);
        reject(ex);
      }
    });
  }

  setViewport(options: SetViewportOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;
        const map = theMap.EsrimapMap;
        if (!theMap) {
          reject("No map has been loaded");
          return;
        }
        theMap.getMap().setInitialViewpoint(com.esri.arcgisruntime.mapping.Viewpoint.fromJson(options.json));

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.setViewport: " + ex);
        reject(ex);
      }
    });
  }

  downloadOfflineRegion(options: DownloadOfflineRegionOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const styleURL = _getMapStyle(options.style);

        const bounds = new com.Esrimap.Esrimapsdk.geometry.LatLngBounds.Builder()
            .include(new com.Esrimap.Esrimapsdk.geometry.LatLng(options.bounds.north, options.bounds.east))
            .include(new com.Esrimap.Esrimapsdk.geometry.LatLng(options.bounds.south, options.bounds.west))
            .build();

        const retinaFactor = utils.layout.getDisplayDensity();

        const offlineRegionDefinition = new com.Esrimap.Esrimapsdk.offline.OfflineTilePyramidRegionDefinition(
            styleURL,
            bounds,
            options.minZoom,
            options.maxZoom,
            retinaFactor);

        const info = '{name:"' + options.name + '"}';
        const infoStr = new java.lang.String(info);
        const encodedMetadata = infoStr.getBytes();

        if (!_accessToken && !options.accessToken) {
          reject("First show a map, or pass in an 'accessToken' param");
          return;
        }
        if (!_accessToken) {
          _accessToken = options.accessToken;
          com.Esrimap.Esrimapsdk.Esrimap.getInstance(application.android.context, _accessToken);
        }

        _getOfflineManager().createOfflineRegion(offlineRegionDefinition, encodedMetadata, new com.Esrimap.Esrimapsdk.offline.OfflineManager.CreateOfflineRegionCallback({
          onError: (error: string) => {
            reject(error);
          },

          onCreate: (offlineRegion) => {
            // if (options.onCreate) {
            //   options.onCreate(offlineRegion);
            // }

            offlineRegion.setDownloadState(com.Esrimap.Esrimapsdk.offline.OfflineRegion.STATE_ACTIVE);

            // Monitor the download progress using setObserver
            offlineRegion.setObserver(new com.Esrimap.Esrimapsdk.offline.OfflineRegion.OfflineRegionObserver({
              onStatusChanged: (status) => {
                // Calculate the download percentage and update the progress bar
                let percentage = status.getRequiredResourceCount() >= 0 ?
                    (100.0 * status.getCompletedResourceCount() / status.getRequiredResourceCount()) :
                    0.0;

                if (options.onProgress) {
                  options.onProgress({
                    name: options.name,
                    completedSize: status.getCompletedResourceSize(),
                    completed: status.getCompletedResourceCount(),
                    expected: status.getRequiredResourceCount(),
                    percentage: Math.round(percentage * 100) / 100,
                    // downloading: status.getDownloadState() == com.Esrimap.Esrimapsdk.offline.OfflineRegion.STATE_ACTIVE,
                    complete: status.isComplete()
                  });
                }

                if (status.isComplete()) {
                  resolve();
                } else if (status.isRequiredResourceCountPrecise()) {
                  // TODO should something happen here?
                }
              },

              onError: (error) => {
                reject(`${error.getMessage()}, reason: ${error.getReason()}`);
              },

              EsrimapTileCountLimitExceeded: (limit) => {
                console.log(`dl EsrimapTileCountLimitExceeded: ${limit}`);
              }
            }));
          }
        }));
      } catch (ex) {
        console.log("Error in Esrimap.downloadOfflineRegion: " + ex);
        reject(ex);
      }
    });
  }

  listOfflineRegions(options?: ListOfflineRegionsOptions): Promise<OfflineRegion[]> {
    return new Promise((resolve, reject) => {
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
          onError: (error: string) => {
            reject(error);
          },
          onList: (offlineRegions) => {
            const regions = [];
            if (offlineRegions !== null) {
              for (let i = 0; i < offlineRegions.length; i++) {
                let offlineRegion = offlineRegions[i];
                let name = _getRegionName(offlineRegion);
                let offlineRegionDefinition = offlineRegion.getDefinition();
                let bounds = offlineRegionDefinition.getBounds();

                regions.push({
                  name: name,
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

      } catch (ex) {
        console.log("Error in Esrimap.listOfflineRegions: " + ex);
        reject(ex);
      }
    });
  }

  deleteOfflineRegion(options: DeleteOfflineRegionOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (!options || !options.name) {
          reject("Pass in the 'name' param");
          return;
        }

        _getOfflineManager().listOfflineRegions(new com.Esrimap.Esrimapsdk.offline.OfflineManager.ListOfflineRegionsCallback({
          onError: (error: string) => {
            reject(error);
          },
          onList: (offlineRegions) => {
            const regions = [];
            let found = false;
            if (offlineRegions !== null) {
              for (let i = 0; i < offlineRegions.length; i++) {
                let offlineRegion = offlineRegions[i];
                let name = _getRegionName(offlineRegion);
                if (name === options.name) {
                  found = true;
                  offlineRegion.delete(new com.Esrimap.Esrimapsdk.offline.OfflineRegion.OfflineRegionDeleteCallback({
                    onError: (error: string) => {
                      reject(error);
                    },
                    onDelete: () => {
                      resolve();
                      // don't return, see note below
                    }
                  }));
                  // don't break the loop as there may be multiple packs with the same name
                }
              }
            }
            if (!found) {
              reject("Region not found");
            }
          }
        }));

      } catch (ex) {
        console.log("Error in Esrimap.listOfflineRegions: " + ex);
        reject(ex);
      }
    });
  }

  addExtrusion(options: AddExtrusionOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        // Create fill extrusion layer
        const fillExtrusionLayer = new com.Esrimap.Esrimapsdk.style.layers.FillExtrusionLayer("3d-buildings", "composite");
        fillExtrusionLayer.setSourceLayer("building");
        fillExtrusionLayer.setFilter(com.Esrimap.Esrimapsdk.style.expressions.Expression.eq(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("extrude"), "true"));
        fillExtrusionLayer.setMinZoom(15);

        // Set data-driven styling properties
        fillExtrusionLayer.setProperties(
            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionColor(android.graphics.Color.LTGRAY),
            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionHeight(com.Esrimap.Esrimapsdk.style.functions.Function.property("height", new com.Esrimap.Esrimapsdk.style.functions.stops.IdentityStops())),
            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionBase(com.Esrimap.Esrimapsdk.style.functions.Function.property("min_height", new com.Esrimap.Esrimapsdk.style.functions.stops.IdentityStops())),
            com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillExtrusionOpacity(new java.lang.Float(0.6))
        );

        theMap.EsrimapMap.addLayer(fillExtrusionLayer);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addExtrusion: " + ex);
        reject(ex);
      }
    });
  }

  addGeoJsonClustered(options: AddGeoJsonClusteredOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        theMap.EsrimapMap.addSource(
            new com.Esrimap.Esrimapsdk.style.sources.GeoJsonSource(options.name,
                new java.net.URL(options.data),
                new com.Esrimap.Esrimapsdk.style.sources.GeoJsonOptions()
                    .withCluster(true)
                    .withClusterMaxZoom(options.clusterMaxZoom || 13)
                    .withClusterRadius(options.clusterRadius || 40)
            )
        );

        const layers = [];
        if (options.clusters) {
          for (let i = 0; i < options.clusters.length; i++) {
            // TODO also allow Color object
            layers.push([options.clusters[i].points, new Color(options.clusters[i].color).android]);
          }
        } else {
          layers.push([150, new Color("red").android]);
          layers.push([20, new Color("green").android]);
          layers.push([0, new Color("blue").android]);
        }

        const unclustered = new com.Esrimap.Esrimapsdk.style.layers.SymbolLayer("unclustered-points", options.name);
        unclustered.setProperties([
          com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleColor(new Color("red").android),
          com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleRadius(new java.lang.Float(16.0)),
          com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleBlur(new java.lang.Float(0.2))
        ]);
        console.log(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("cluster")); // TODO remove leftover debug log?
        unclustered.setFilter(com.Esrimap.Esrimapsdk.style.expressions.Expression.neq(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("cluster"), true));
        theMap.EsrimapMap.addLayer(unclustered);

        for (let i = 0; i < layers.length; i++) {
          // Add some nice circles
          const circles = new com.Esrimap.Esrimapsdk.style.layers.CircleLayer("cluster-" + i, options.name);
          circles.setProperties([
                // com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.iconImage("icon")
                com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleColor(layers[i][1]),
                com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleRadius(new java.lang.Float(22.0)),
                com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.circleBlur(new java.lang.Float(0.2))
              ]
          );

          const pointCount = com.Esrimap.Esrimapsdk.style.expressions.Expression.toNumber(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("point_count"));

          circles.setFilter(
              i === 0 ?
                  com.Esrimap.Esrimapsdk.style.expressions.Expression.gte(pointCount, com.Esrimap.Esrimapsdk.style.expressions.Expression.literal(java.lang.Integer.valueOf(layers[i][0]))) :
                  com.Esrimap.Esrimapsdk.style.expressions.Expression.all([
                    com.Esrimap.Esrimapsdk.style.expressions.Expression.gte(pointCount, com.Esrimap.Esrimapsdk.style.expressions.Expression.literal(java.lang.Integer.valueOf(layers[i][0]))),
                    com.Esrimap.Esrimapsdk.style.expressions.Expression.lt(pointCount, com.Esrimap.Esrimapsdk.style.expressions.Expression.literal(java.lang.Integer.valueOf(layers[i - 1][0])))
                  ])
          );

          theMap.EsrimapMap.addLayer(circles); // , "building");
        }

        // Add the count labels (note that this doesn't show.. #sad)
        const count = new com.Esrimap.Esrimapsdk.style.layers.SymbolLayer("count", options.name);
        count.setProperties([
              com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.textField(com.Esrimap.Esrimapsdk.style.expressions.Expression.get("point_count")),
              com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.textSize(new java.lang.Float(12.0)),
              com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.textColor(new Color("white").android)
            ]
        );
        theMap.EsrimapMap.addLayer(count);

        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addGeoJsonClustered: " + ex);
        reject(ex);
      }
    });
  }

  addSource(options: AddSourceOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const { id, url, type } = options;
        const theMap = nativeMap || _Esrimap;
        let source;

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
          const ex = "No source to add";
          console.log("Error in Esrimap.addSource: " + ex);
          reject(ex);
          return;
        }

        theMap.EsrimapMap.addSource(source);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addSource: " + ex);
        reject(ex);
      }
    });
  }

  removeSource(id: string, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.removeSource(id);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.removeSource: " + ex);
        reject(ex);
      }
    });
  }

  addLayer(options: AddLayerOptions, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const { id, source, sourceLayer, type } = options;
        const theMap = nativeMap || _Esrimap;
        let layer;

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
            const circleColor = options.circleColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.circleColor);
            const circleOpacity = options.circleOpacity === undefined ? new java.lang.Float(1) : new java.lang.Float(options.circleOpacity);
            const circleRadius = options.circleRadius === undefined ? new java.lang.Float(10) : new java.lang.Float(options.circleRadius);
            const circleStrokeColor = options.circleStrokeColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.circleStrokeColor);
            const circleStrokeWidth = options.circleStrokeWidth === undefined ? new java.lang.Float(1) : new java.lang.Float(options.circleStrokeWidth);

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
            const fillColor = options.fillColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.fillColor);
            const fillOpacity = options.fillOpacity === undefined ? new java.lang.Float(1) : new java.lang.Float(options.fillOpacity);

            layer = new com.Esrimap.Esrimapsdk.style.layers.FillLayer(id, source);
            layer.setSourceLayer(sourceLayer);

            layer.setProperties([
              com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillColor(fillColor),
              com.Esrimap.Esrimapsdk.style.layers.PropertyFactory.fillOpacity(fillOpacity),
            ]);
            break;
          case "line":
            const lineCap = options.lineCap === undefined ? 'LINE_CAP_ROUND' : 'LINE_CAP_' + options.lineCap.toUpperCase();
            const lineJoin = options.lineJoin === undefined ? 'LINE_JOIN_ROUND' : 'LINE_JOIN_' + options.lineCap.toUpperCase();

            const lineColor = options.lineColor === undefined ? '#000000' : Esrimap.getAndroidColor(options.lineColor);
            const lineOpacity = options.lineOpacity === undefined ? new java.lang.Float(1) : new java.lang.Float(options.lineOpacity);
            const lineWidth = options.lineWidth === undefined ? new java.lang.Float(1) : new java.lang.Float(options.lineWidth);

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
          const ex = "No layer to add";
          console.log("Error in Esrimap.addLayer: " + ex);
          reject(ex);
        }

        theMap.EsrimapMap.addLayer(layer);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.addLayer: " + ex);
        reject(ex);
      }
    });
  }

  removeLayer(id: string, nativeMap?): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

        if (!theMap) {
          reject("No map has been loaded");
          return;
        }

        theMap.EsrimapMap.removeLayer(id);
        resolve();
      } catch (ex) {
        console.log("Error in Esrimap.removeLayer: " + ex);
        reject(ex);
      }
    });
  }

  trackUser(options: TrackUserOptions, nativeMap?): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const theMap = nativeMap || _Esrimap;

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
      } catch (ex) {
        console.log("Error in Esrimap.trackUser: " + ex);
        reject(ex);
      }
    });
  }

  private static getAndroidColor(color: string | Color): any {
    let androidColor;
    if (color && Color.isValid(color)) {
      androidColor = new Color("" + color).android;
    } else {
      androidColor = new Color('#000').android;
    }
    return androidColor;
  }
}
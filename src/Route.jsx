import { GeoJsonLayer, IconLayer } from 'deck.gl';
import { lineString, featureCollection } from '@turf/helpers';
import { LineSegment } from '@turf/line-segment';

// Icon Layer atlas icon
const atlasIcon = require('./res/icon-atlas.png');

const ICON_MAPPING = {
  marker: {
    x: 0, y: 0, width: 128, height: 128, mask: true,
  },
};

export function getStopMarkersLayer(route, getStopInfo) {
  /* returns new DeckGL Icon Layer displaying all stops on given routes */

  // Push stop markers into data array
  const data = route.stops.map(stop => ({
    position: [stop.lon, stop.lat],
    icon: 'marker',
    size: 72,
    color: [255, 0, 0],
  }));

  return (new IconLayer({
    id: 'stop-icon-layer',
    data,
    iconAtlas: atlasIcon,
    iconMapping: ICON_MAPPING,
    pickable: true,
    onClick: info => getStopInfo(info),
  }));
}

export function getRoutesLayer(geojson) {
  return (new GeoJsonLayer({
    id: 'muni-routes-geojson',
    data: {
      ...geojson,
    },
    lineWidthScale: 8,
    filled: true,
    stroked: true,
    extruded: true,
  }));
}

export function getUserCreatedRoutesLayer(geojson,point1,point2) {
  let pt1=point1.lngLat[0].toString();
  debugger;
  pt1=pt1.substring(0,pt1.indexOf(".")+4);
  let pt2=point2.lngLat[0].toString();
  pt2=pt2.substring(0,pt2.indexOf(".")+4);
  let linestring1 = lineString.linestring(geojson.features[0].geometry.coordinates[0]);
  return (new GeoJsonLayer({
    id: 'user-routes-geojson',
    data: {
      ...linestring1,
    },
    lineWidthScale: 8,
    filled: true,
    stroked: true,
    extruded: true,
    getLineColor: f => [155, 75, 205],
  }));
}

export function getVehicleMarkersLayer(route, displayVehicleInfo) {
  /* returns new DeckGL Icon Layer displaying all vehicles on given routes */
  const data = route.routeStates[0].vehicles.map(vehicle => ({
    position: [vehicle.lon, vehicle.lat],
    icon: 'marker',
    size: 72,
    color: [0, 0, 255],
    // added vid & heading info to display onClick pop-up
    vid: vehicle.vid,
    heading: vehicle.heading,
  }));

  return (new IconLayer({
    id: 'vehicle-icon-layer',
    data,
    iconAtlas: atlasIcon,
    iconMapping: ICON_MAPPING,
    pickable: true,
    // calls pop-up function
    onClick: info => displayVehicleInfo(info),
  }));
}

import { Component, EventEmitter, Output } from '@angular/core';
import * as data from './geo.json';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  standalone: true,
  imports: [LeafletModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  //==============================
  // The selected layer
  //==============================
  selectedLayer: string = '';

  //==============================
  // Emitter for Selected Country
  //==============================
  @Output()
  onFeatureSelect = new EventEmitter<any>();

  geoJsonData: any = data;
  //=========================
  // The Geo JSON Layers
  //=========================
  geoJsonLayers: any = [];

  leafletOptions: any = {
    zoom: 2,
    minZoom: 2,
    maxZoom: 4,
    zoomControl: false,
    center: L.latLng({ lat: 38.991709, lng: -76.886109 }),
    maxBounds: new L.LatLngBounds(
      new L.LatLng(-89.98155760646617, -180),
      new L.LatLng(89.99346179538875, 180)
    ),
    maxBoundsViscosity: 1.0,
  };

  /**
   * Create the Geo JSON Layers
   * and add the zoom control.
   */
  mapReady(map: L.Map) {
    //==============================
    // Add the Zoom Control
    //==============================
    map.addControl(L.control.zoom({ position: 'bottomright' }));

    //==============================
    // Allow leaflet to update itself
    // in the event that the size
    // of the map container changed.
    //==============================
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
    //==============================
    // Initialize Geo JSON Layers
    //==============================
    this.geoJsonLayers = this.createGeoJsonLayer(map);
  }

  /**
   * Creates all the GeoJSON layers and adds
   * event handlers.
   */
  private createGeoJsonLayer(map: L.Map): L.GeoJSON<any> {
    const layers: L.GeoJSON<any> = L.geoJSON(this.geoJsonData, {
      style: {
        weight: 2,
        color: 'orange',
        opacity: 0.8,
        fillColor: 'red',
        fillOpacity: 0.6,
      },
      onEachFeature: (feature, layer) => {
        this.onEachFeature(feature, layer);
      },
    });
    //==============================
    // Add layers to map
    //==============================
//    layers.addTo(map);

    return layers;
  }

  /**
   * Creates all the GeoJSON layers and adds
   * event handlers.
   */
  private createGeoJsonLayer2(): L.GeoJSON<any> {
    const layers: L.GeoJSON<any> = L.geoJSON(this.geoJsonData, {
      style: {
        weight: 2,
        color: 'orange',
        opacity: 0.8,
        fillColor: 'red',
        fillOpacity: 0.6,
      },
      onEachFeature: (feature, layer) => {
        this.onEachFeature(feature, layer);
      },
    });
    return layers;
  }
  /**
   * Add event handling for the features.
   */
  private onEachFeature(feature:any, layer:any) {
    layer.on({
      mouseover: (e:any) => this.onMouseOver(e.target),
      mouseout: (e:any) => this.onMouseOut(e.target),
      click: (e:any) => this.onClick(e.target),
    });
  }

  /**
   * Event handling for mouse out
   */
  private onMouseOut(featureLayer:any) {
    if (featureLayer !== this.selectedLayer) {
      this.resetHighlight(featureLayer);

      // Highlight the selected layer again
      // in the event that countries
      // have a common border
      this.onMouseOver(this.selectedLayer);
    }
  }

  private resetHighlight(featureLayer:any) {
    if (featureLayer) {
      this.geoJsonLayers.resetStyle(featureLayer);
    }
  }

  private onMouseOver(featureLayer:any) {
    if (featureLayer) {
      featureLayer.setStyle({
        weight: '2', //border width
        color: 'yellow', //border color
        fillColor: 'blue',
      });

      if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
        featureLayer.bringToFront();
      }
    }
  }

  /**
   * Select the feature layer when its clicked.
   * @param featureLayer The GeoJson Feature Layer.
   */
  private onClick(featureLayer:any) {
    if (featureLayer !== this.selectedLayer) {
      this.resetHighlight(this.selectedLayer);
      this.onMouseOver(featureLayer);
      this.selectedLayer = featureLayer;
      this.onFeatureSelect.emit(featureLayer.feature.properties.name);
    }
  }

  /**
   * Return the geo json feature layer
   * that matches the country.
   * @param country The country to match
   */
  private findFeature(country: string) {
    return this.geoJsonLayers.getLayers().find((layer:any) => {
      return layer.feature.name === country;
    });
  }

  ngAfterViewInit() {
    this.geoJsonLayers = this.createGeoJsonLayer2();
  }
}

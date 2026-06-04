import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
//Hack to fix missing marker icons in Leaflet when using with Webpack or similar bundlers
// build instead of runtime to avoid issues with dynamic imports and asset loading

delete L.Icon.Default.prototype._getIconUrl;

// Set the new default icon URLs
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

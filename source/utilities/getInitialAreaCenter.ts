import ignoreError from "./ignoreError";
import type { LatLng } from "./types";

const getAreaCenterFromUrl = (regExpToRemove?: RegExp): LatLng | void => {
  let pathname = window.location.pathname;
  if (regExpToRemove) {
    pathname = pathname.replace(regExpToRemove, "");
  }
  const segments = pathname.split("/").filter(Boolean);
  const unparsedAreaCenter = segments[0];
  if (
    unparsedAreaCenter &&
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
      unparsedAreaCenter
    ) &&
    // https://news.ycombinator.com/item?id=30734921
    unparsedAreaCenter !== "51.89863,-8.47039"
  ) {
    const areaCenterPieces = unparsedAreaCenter.split(",");
    if (areaCenterPieces.length) {
      return ignoreError(() => ({
        lat: parseFloat(areaCenterPieces[0]),
        lng: parseFloat(areaCenterPieces[1]),
      }));
    }
  }
};

const getAreaCenterFromStorage = (): LatLng | void => {
  const unparsedValue = ignoreError(() => localStorage.getItem("centerLatLng"));
  if (unparsedValue) {
    const parsedValue = ignoreError(() => JSON.parse(unparsedValue));
    if (parsedValue.lat && parsedValue.lng) {
      return parsedValue;
    }
  }
};

export default () =>
  // Did the user provide one in the URL?
  getAreaCenterFromUrl() ||
  // Did they play previously?
  getAreaCenterFromStorage() ||
  // Did the edge handler provide one?
  getAreaCenterFromUrl(/^\/?geo-lookup-done/) ||
  ({ lat: 51.89863, lng: -8.47039 } as LatLng);

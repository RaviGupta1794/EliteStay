maptilersdk.config.apiKey = "HfyJGdpNtjt67080rJ5i";


const map = new maptilersdk.Map({
  container: "map",
 style: maptilersdk.MapStyle.SATELLITE_HYBRID,
  center: [listing.lng, listing.lat],
  zoom: 10,
});

map.flyTo({
  center: [listing.lng, listing.lat],
  zoom: 15,
  speed: 1.2
});


// marker
new maptilersdk.Marker({color : "#ff385c"})
  .setLngLat([listing.lng, listing.lat])
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setText(listing.title)
  )
  .addTo(map);
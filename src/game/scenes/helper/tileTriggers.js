export function hasMeditationTrigger(tilemap, position) {
  return tilemap.layers.some((layer) => {
    const tile = tilemap.getTileAt(position.x, position.y, false, layer.name);
    return tile?.properties?.meditationTrigger;
  });
}

export function hasBroadcastTrigger(tilemap, position) {
  return tilemap.layers.some((layer) => {
    const tile = tilemap.getTileAt(position.x, position.y, false, layer.name);
    return tile?.properties?.broadcastTrigger;
  });
}

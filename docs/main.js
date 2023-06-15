// PMTilesの読み込み
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);

let PMtiles_URL = "https://tochirinuru.github.io/testest10/geofiles/Provinces_All_1889_C71.pmtiles";

// 地図1（地理院タイル 淡色地図）の設定
const map = new maplibregl.Map({
	container: 'map',
	style: {
		version: 8,
		sources: {
			gsi_pale: {
				type: 'raster',
				tiles: [
					'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
				],
				tileSize: 256,
				attribution:
					"Produced by <a href='https://twitter.com/tochirinuru' target='_blank'>とちりぬる</a>. Map tiles by <a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
			}
		},
		layers: [
			{
				id: 'gsi_pale',
				type: 'raster',
				source: 'gsi_pale',
				minzoom: 4,
				maxzoom: 18,
			}
		]
	},
	center: [139.68786, 35.68355],
	zoom: 6
});  

// ポリゴンレイヤ設定
map.on('load', () => {

// PMTiles（ポリゴン）
	map.addSource("pmtiles1", {
		type: "vector",
		url: "pmtiles://" + PMtiles_URL,
		attribution: 'attribution'
	});

	map.addLayer({
		"id": "pmitles-line",
		"type": "line",
		"source": "pmtiles1",
		"source-layer": "Provinces_All_1889_C71",
		minzoom: 12,
		maxzoom: 16,
		'paint': {
			'line-color': '#0000ff',
			'line-width': 1.5
		}
	});

	map.showTileBoundaries = false;

});

// スケールバーの表示
map.addControl(new maplibregl.ScaleControl());

// ズームバーの表示
map.addControl(new maplibregl.NavigationControl());

// フルスクリーンボタンの表示
map.addControl(new maplibregl.FullscreenControl());

// 現在位置の表示
map.addControl(new maplibregl.GeolocateControl({
	positionOptions: {
		enableHighAccuracy: false
	},
	fitBoundsOptions: {maxZoom: 6},
	trackUserLocation: true,
	showUserLocation: true
}));
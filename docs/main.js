// PMTilesの読み込み
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles',protocol.tile);

const PMTiles_URL = 'https://tochirinuru.github.io/testest10/geofiles/Provinces_All_1889_C71.pmtiles';

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
					'Produced by <a href="https://twitter.com/tochirinuru" target="_blank">とちりぬる</a>. Map tiles by <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
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

// hoveredStateIdのリセット
const hoveredStateId = null;

// ポリゴンレイヤ設定
map.on('load', () => {

// PMTilesファイルの読み込み
	map.addSource('pmtiles1', {
		type: 'vector',
		url: 'pmtiles://' + PMTiles_URL,
		attribution: 'attribution'
	});

// ポリゴンレイヤのフィル表示設定
	map.addLayer({
		'id': 'pmtiles_fills',
		'type': 'fill',
		'source': 'pmtiles1',
		'source-layer': 'Provinces_All_1889_C71',
		'paint': {
			'fill-color': '#005AFF',
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.5,
				0.1
			]
		}
	});

// ポリゴンレイヤのライン表示設定
	map.addLayer({
		'id': 'pmitles_lines',
		'type': 'line',
		'source': 'pmtiles1',
		'source-layer': 'Provinces_All_1889_C71',
		minzoom: 4,
		maxzoom: 18,
		'paint': {
			'line-color': '#005AFF',
			'line-width': 2
		}
	});
/*
// ポリゴンレイヤのマウスクリック時の属性表示動作
	map.on('click', 'pmtiles_fills', (e) => {

// 属性設定
		const code = e.features[0].properties['CODE'];
		const name = e.features[0].properties['KUNI'];

		new maplibregl.Popup()
			.setLngLat(e.lngLat)
			.setHTML(
				'番号: ' + code + '<br>'
				+ '国名: ' + name
			)
			.addTo(map);
	});
*/
// ポリゴンレイヤのマウスホバー時の表示動作
	map.on('mousemove', 'pmtiles_fills', (e) => {
		if (e.features.length > 0) {
			if (hoveredStateId) {
				map.setFeatureState(
					{ source: 'pmtiles1', code: hoveredStateId },
					{ hover: false }
				);
			}
			hoveredStateId = e.features[0].properties['CODE'];
			map.setFeatureState(
				{ source: 'pmtiles1', code: hoveredStateId },
				{ hover: true }
			);
		}
	});

// ポリゴンレイヤのマウスアウト時の表示動作
	map.on('mouseleave', 'pmtiles_fills', () => {
		if (hoveredStateId) {
			map.setFeatureState(
				{ source: 'pmtiles1', code: hoveredStateId },
				{ hover: false }
			);
		}
		hoveredStateId = null;
	});

// タイル境界の非表示
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
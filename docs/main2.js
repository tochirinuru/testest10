import OpacityControl from 'maplibre-gl-opacity';

// PMTilesの読み込み
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles',protocol.tile);

// PMTilesファイルの読み込み
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

// レイヤ設定
map.on('load', function () {

// OpenStreetMap
	map.addSource('o_std', {
		type: 'raster',
		tiles: [
			'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
			'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
		],
		tileSize: 256,
	});
	map.addLayer({
		id: 'o_std',
		type: 'raster',
		source: 'o_std',
		minzoom: 0,
		maxzoom: 18,
	});

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

// ポリゴンレイヤのラベル表示設定
	map.addLayer({
		'id': 'pmitles_labels',
		'type': 'symbol',
		'source': 'pmtiles1',
		'source-layer': 'Provinces_All_1889_C71',
		'minzoom': 4,
		'maxzoom': 18,
		'layout': {
			'text-field': ['concat', ['get', 'name']],
			'text-font': ['BIZ UDPGothic', 'BIZ UDPGothic'],
			'text-size': 12
		},
		'paint': {
			'text-color': '#005AFF',
			'text-halo-color': '#FFFFFF',
			'text-halo-width': 1.5
		}
	});

// ポリゴンレイヤのマウスクリック時の属性表示動作
	map.on('click', 'pmtiles_fills', function (e) {

// 属性設定
		const id = e.features[0].properties['id'];
		const name = e.features[0].properties['name'];

		new maplibregl.Popup()
			.setLngLat(e.lngLat)
			.setHTML(
				'番号: ' + id + '<br>'
				+ '国名: ' + name
			)
			.addTo(map);
	});

	map.setLayoutProperty('label_country', 'text-field', [
		'format',
		['get', 'name'],
		{ 'font-scale': 1.2 },
	]);

// ベースレイヤ
	const mapBaseLayer = {
		gsi_pale: '地理院地図',
		o_std: 'OpenStreetMap',
	};

// オーバレイヤ
	const mapOverLayer = {
		pmtiles_fills: 'a',
		pmtiles_lines: 'b',
	};

// OpacityControl
	let Opacity = new OpacityControl({
		baseLayers: mapBaseLayer,
		overLayers: mapOverLayer,
		opacityControl: true,
	});
	map.addControl(Opacity, 'top-left');

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
//地図1（地理院タイル 淡色地図）の設定
var map = new maplibregl.Map({
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

//ポリゴンレイヤ設定
map.on('load', function () {
//GeoJSONファイルの読み込み
	map.addSource('Provinces_All_1889_C71', {
		'type': 'geojson',
		'data': './geofiles/Provinces_All_1889_C71.geojson',
	});

//ポリゴンレイヤのフィル表示設定
	map.addLayer({
		'id': 'provinces_1889_fills',
		'type': 'fill',
		'source': 'Provinces_All_1889_C71',
		'layout': {},
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

//ポリゴンレイヤのライン表示設定
	map.addLayer({
		'id': 'provinces_1889_borders',
		'type': 'line',
		'source': 'Provinces_All_1889_C71',
		'layout': {},
		'paint': {
			'line-color': '#005AFF',
			'line-width': 2
		}
	});

// ポリゴンレイヤのマウスクリック時の属性表示動作
	map.on('click', 'provinces_1889_fills', function (e) {
		const coordinates = e.lngLat;
// 属性設定
		const description =
			'コード: ' + e.features[0].properties.CODE + '<br>' +
			'国名: ' + e.features[0].properties.KUNI;
		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}
		new maplibregl.Popup()
			.setLngLat(coordinates)
			.setHTML(description)
			.addTo(map);
	});
// ポリゴンレイヤのマウスホバー/アウト時の表示動作
	map.on('mouseenter', 'provinces_1889_fills', function () {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'provinces_1889_fills', function () {
		map.getCanvas().style.cursor = '';
	});	

});

// スケールバーの表示
map.addControl(new maplibregl.ScaleControl());

// ズームバーの表示
map.addControl(new maplibregl.NavigationControl());

// フルスクリーンボタンの表示
map.addControl(new maplibregl.FullscreenControl());
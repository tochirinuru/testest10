//地図1（地理院タイル 淡色地図）の設定
var map = new maplibregl.Map({
	container: 'map',
	style: {
		version: 8,
		sources: {
			rtile: {
				type: 'raster',
				tiles: [
					'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
				],
				tileSize: 256,
				attribution:
					"Produced by <a href='https://twitter.com/tochirinuru' target='_blank'>とちりぬる</a>. Map tiles by <a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
			},
		},
		layers: [
			{
				id: 'rtile',
				type: 'raster',
				source: 'rtile',
				minzoom: 4,
				maxzoom: 18,
			},
		],
	},
	center: [139.68786, 35.68355],
	zoom: 6,
});

// スケールバーの表示
map.addControl(new maplibregl.ScaleControl());

// ズームバーの表示
map.addControl(new maplibregl.NavigationControl());

// フルスクリーンボタンの表示
map.addControl(new maplibregl.FullscreenControl());
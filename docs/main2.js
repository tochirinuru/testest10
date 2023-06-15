// PMTilesの読み込み
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);

const PMTILES_URL = "https://tochirinuru.github.io/testest10/geofiles/Provinces_All_1889_C71.pmtiles";

const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources:{
            pmtiles: {
                type:'vector',
                url: 'pmtiles://' + PMTILES_URL,
                attribution: 'test'
            }
        },
        layers:[
            {
                id: 'water',
                source: 'pmtiles',
                'source-layer': 'Provinces_All_1889_C71',
                type: 'fill',
                paint: {
                    'fill-color': '#0000ff',
                },
            },
        ],
    }
});
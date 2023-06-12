// PMTilesの読み込み
const protocol_pmtiles = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles",protocol_pmtiles.tile);

const map = new Map({
    container: 'map',
    style: {
        version: 8,
        sources:{
            pmtiles: {
                type:'vector',
                url: 'pmtiles://https://tochirinuru.github.io/testest10/geofiles/Provinces_All_1889_C71.pmtiles',
                attribution: 'test'
            }
        },
        layers:[
            {
                id: 'water',
                source: 'pmtiles',
                type: 'fill',
                paint: {
                    'fill-color': '#0000ff',
                },
            },
        ],
    }
});

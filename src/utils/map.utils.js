/* Written by Ye Liu */

const mapStyles = {
    Basic: 'mapbox://styles/yliudev/ckfevhte00nwj19qpjsituvh9',
    Outdoors: 'mapbox://styles/yliudev/ckfevk9rn0o1719oegzh653xk',
    Light: 'mapbox://styles/yliudev/ckfevipxf0fip19s0czuk30qi',
    Dark: 'mapbox://styles/yliudev/ckfevi2se0o2m1apilmluij9g',
    Night: 'mapbox://styles/yliudev/ckfevjtaa0o3h1anrp7zbq1ky',
    LeShine: 'mapbox://styles/yliudev/ckfeviay50fia19s00nyaitzi',
    NorthStar: 'mapbox://styles/yliudev/ckfevk27r0o0y19oekx967qa8',
    Moonlight: 'mapbox://styles/yliudev/ckfevj4hw0o1h19o8ew2vgrva'
};

const buildHeatmapStyle = (color) => {
    const heatmap = {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 10, 10, 16, 16],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 10, 19, 19],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 12, 19, 30],
        'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)', 0.2, '#67A9CF', 0.4, '#D1E5F0', 1]
    };

    heatmap['heatmap-color'].push(color);
    return heatmap;
}

export { mapStyles, buildHeatmapStyle };

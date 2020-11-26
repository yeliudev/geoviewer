/* Written by Ye Liu */

const mapStyles = {
    Basic: 'mapbox://styles/yliudev/ckhyxq27v1gtd19p5uyc5nfij',
    Outdoors: 'mapbox://styles/yliudev/ckhyxu293294n19mtign8c6t3',
    Light: 'mapbox://styles/yliudev/ckhyxr3zd292019mt5lpygcw4',
    Dark: 'mapbox://styles/yliudev/ckhyxroej29mg19no822l0aur',
    Night: 'mapbox://styles/yliudev/ckhyxst9k29au19mxy9qekzqt',
    Standard: 'mapbox://styles/yliudev/ckhyxwze829b919o25jfyhqah',
    Blueprint: 'mapbox://styles/yliudev/ckhyxxxfh29c419o2scpgmje1',
    Decimal: 'mapbox://styles/yliudev/ckhyxw8ga29bt19qiioxpkdhh'
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

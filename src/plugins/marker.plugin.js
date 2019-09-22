/* Written by Ye Liu */

const marker = {
    width: 200,
    height: 200,
    data: new Uint8Array(200 * 200 * 4),

    onAdd: function (map) {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
        this.map = map;
    },

    render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = 200 / 2 * 0.3;
        var outerRadius = 200 / 2 * 0.7 * t + radius;
        var context = this.context;

        // Draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(200, 200, 255,' + (1 - t) + ')';
        context.fill();

        // Draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(100, 100, 255, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // Keep the map repainting
        this.map.triggerRepaint();

        // Return `true` to let the map know that the image was updated
        return true;
    }
};

export default marker;

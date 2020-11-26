/* Written by Ye Liu */

const marker = {
    width: 200,
    height: 200,
    data: new Uint8Array(200 * 200 * 4),

    onAdd: function (map) {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
        this.map = map;
    },

    render: function () {
        const context = this.context;
        const t = (performance.now() % 1000) / 1000;

        // Draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, 70 * t + 30, 0, Math.PI * 2);
        context.fillStyle = 'rgba(200, 200, 255,' + (1 - t) + ')';
        context.fill();

        // Draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, 30, 0, Math.PI * 2);
        context.fillStyle = 'rgba(100, 100, 255, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update image with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // Keep the map repainting
        this.map.triggerRepaint();

        return true;
    }
};

export default marker;

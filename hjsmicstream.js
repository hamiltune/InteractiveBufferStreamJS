
export default class HJSMicStream {

    constructor(bufferSize, sampleRate, callBack) {
        this.bufferSize = bufferSize;
        this.sampleRate = sampleRate;
        this.userCallback = callBack;
    }

    start() {
        let cb = this.success.bind(this);
        navigator.mediaDevices.getUserMedia({audio:true, video:false}).then(cb);
    }


    async success (stream) {
        console.log("FSF")
        var active = false;
        var bufferSize = this.bufferSize;
        var sampleRate = this.sampleRate;

        let self = this;

        var ctx = new AudioContext({sampleRate: sampleRate});
        this.ctx = ctx;
        var strm = ctx.createMediaStreamSource(stream);
        await ctx.audioWorklet.addModule('worklet.js');
        var scriptNode = new AudioWorkletNode(ctx, 'worklet-processor');
        scriptNode.port.postMessage({buffer_size:bufferSize});
        strm.connect(scriptNode);
        //strm.connect(ctx.destination);

        scriptNode.port.onmessage = function (e) {
            self.userCallback(e.data);
        };

        active = true;        
    }
}
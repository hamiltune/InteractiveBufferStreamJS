class WorkletProcessor extends AudioWorkletProcessor {

    // When constructor() undefined, the default constructor will be
    // implicitly used.
    constructor() {
        super();
        this._pos = 0;
        this._init = false;
        this.port.onmessage = this.handleMessage_.bind(this);
    }

    handleMessage_(event) {
        this.buffer_size = event.data.buffer_size;
        this._buffer = new Float32Array(this.buffer_size);
        this._init = true;
        this._t = 0;
        console.log("Started Script Node: " + this.buffer_size);
    }   
  
    process(inputs, outputs) {
        if (!this._init) return true;
        if (inputs[0] == undefined) return true;
        if (inputs[0][0] == undefined) return true;
        //console.log(input[0].length + ", " + this._pos);
        for (let i = 0; i < inputs[0][0].length; i++) {
            this._buffer[this._pos] = inputs[0][0][i];
            this._pos++;
            if (this._pos >= this.buffer_size) {
                this.port.postMessage(this._buffer);
                //this.call_back(this._buffer);
                this._pos = 0;
            }
        }      
        
        return true;
    }


  }
  
  registerProcessor('worklet-processor', WorkletProcessor);
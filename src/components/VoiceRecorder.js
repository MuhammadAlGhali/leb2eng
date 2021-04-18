import React, { Component } from "react";
import { baseUrl } from "../shared/baseUrl";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import axios from "axios";

class VoiceRecorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordState: null,
    };
  }

  start = () => {
    this.setState({
      recordState: RecordState.START,
    });
  };

  stop = () => {
    this.setState({
      recordState: RecordState.STOP,
    });
  };

  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log("audioData", audioData.blob);
    console.log("audioData", audioData.url);
    console.log("audioData", audioData.type);

    var data = new FormData();
    data.append("file", audioData.blob);
    axios
      .post(baseUrl + "/api/upload", data)
      .then(this.props.parentLoading(true))
      .then((res) => {
        console.log(res);
        this.props.parentCallback(res);
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { recordState } = this.state;

    return (
      <div>
        <AudioReactRecorder state={recordState} onStop={this.onStop} />
        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>
      </div>
    );
  }
}
export default VoiceRecorder;

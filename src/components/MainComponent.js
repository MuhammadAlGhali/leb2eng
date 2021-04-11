import React, { Component } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import Header from "./HeaderComponent";
import axios from "axios";
import VoiceRecorder from "./VoiceRecorder";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea_input: "",
      ourInput: "",
      result: "",
      result2: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlesubmit = this.handlesubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleChange(event) {
    this.setState({
      textarea_input: event.target.value,
    });
  }
  handleCallback = (response) => {
    this.setState({
      ourInput: response.data[0],
      result: response.data[1],
      result2: response.data[2],
    });
  };

  handlesubmit(e) {
    e.preventDefault(); // Stop form submit
    alert("this might take a while");
    if (
      this.state.textarea_input !== "" &&
      this.fileInput.current.files[0] == null
    ) {
      console.log(this.state.textarea_input);

      this.setState({
        ourInput: this.state.textarea_input,
        //result: translation.map(({ GenericPlus_Model }) => GenericPlus_Model),
        //result2: translation.map(({ IT_Model }) => IT_Model),
      });

      this.setState({ textarea_input: "" });
    } else if (
      this.state.textarea_input === "" &&
      this.fileInput.current.files[0].name !== null
    ) {
      console.log(`Selected file - ${this.fileInput.current.files[0].name}`);
      const data = new FormData();
      data.append("file", this.fileInput.current.files[0]);

      axios
        .post("https://075d851574a6.ngrok.io/api/upload", data)
        .then((response) => {
          console.log(response.data);

          this.setState({
            ourInput: response.data[0],
            result: response.data[1],
            result2: response.data[2],
          });
        })
        .catch((err) => console.log(err));

      this.fileInput.current.value = null;
    } else {
      alert("You should input a file or text to translate");
    }
  }
  render() {
    return (
      <>
        <Header />
        <div className="holder">
          <div className="container">
            <div className="row h-100 mt-2 mb-2">
              <div className="inputs col-12 col-lg-4">
                <Card className="h-30">
                  <CardHeader>Upload Voice Recording:</CardHeader>
                  <CardBody>
                    <VoiceRecorder parentCallback={this.handleCallback} />
                  </CardBody>
                </Card>

                <form
                  onSubmit={this.handlesubmit}
                  encType="multipart/form-data"
                >
                  <h1>OR</h1>
                  <Card className="h-40">
                    <CardHeader>Upload Voice Recorded file:</CardHeader>
                    <CardBody>
                      <input type="file" ref={this.fileInput} />
                    </CardBody>
                  </Card>
                  <h1>OR</h1>

                  <Card className="h-40">
                    <CardHeader>Enter text for translation:</CardHeader>
                    <CardBody>
                      <textarea
                        className="w-100 h-100 mb-1"
                        name="textarea_input"
                        rows="5"
                        placeholder="Enter the text you want translate"
                        value={this.state.textarea_input}
                        onChange={this.handleChange}
                      />
                    </CardBody>
                  </Card>
                  <br />
                  <button type="submit">Send</button>
                </form>
              </div>
              <div className="translations col-12 col-lg-8">
                <div className="our-Input">
                  <Card>
                    <CardHeader>The phrase you entered is: </CardHeader>
                    <CardBody>{this.state.ourInput}</CardBody>
                  </Card>
                </div>
                <div className="english-trans">
                  <Card>
                    <CardHeader>
                      The English for the phrase you entered is:
                    </CardHeader>
                    <CardBody>
                      GenericPlus Model:{" "}
                      {this.state.result["GenericPlus Model"]}
                      <br />
                      IT Model: {this.state.result["IT Model"]}
                    </CardBody>
                  </Card>
                </div>
                <div className="eng-to-arab-trans">
                  <Card>
                    <CardHeader>
                      The MSA for the phrase you entered is:
                    </CardHeader>
                    <CardBody>
                      GenericPlus Model:{" "}
                      {this.state.result2["GenericPlus Model"]}
                      <br />
                      IT Model: {this.state.result2["IT Model"]}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Header />
      </>
    );
  }
}

export default Main;

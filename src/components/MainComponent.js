import React, { Component } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import Header from "./HeaderComponent";
import axios from "axios";
import VoiceRecorder from "./VoiceRecorder";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./Loading";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea_input: "",
      ourInput: "",
      result: "",
      result2: "",
      isLoading: false,
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
      isLoading: false,
      ourInput: response.data[0],
      result: response.data[1],
      result2: response.data[2],
    });
  };
  parentLoading = (isloading) => {
    this.setState({ isLoading: isloading });
  };

  handlesubmit(e) {
    e.preventDefault(); // Stop form submit
    if (
      this.state.textarea_input !== "" &&
      this.fileInput.current.files[0] == null
    ) {
      console.log(this.state.textarea_input);
      this.setState({
        ourInput: this.state.textarea_input,
      });
      axios
        .get(`${baseUrl}/api/translate?input=${this.state.textarea_input}`)
        .then(this.setState({ isLoading: true }))
        .then((response) => {
          console.log(response.data);
          this.setState({
            isLoading: false,
            result: response.data[0],
            result2: response.data[1],
          });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.log(err);
          alert("Something went wrong please try again.");
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
        .post(baseUrl + "/api/upload", data)
        .then(this.setState({ isLoading: true }))
        .then((response) => {
          console.log(response.data);

          this.setState({
            isLoading: false,
            ourInput: response.data[0],
            result: response.data[1],
            result2: response.data[2],
          });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.log(err);
          alert("Something went wrong please try again.");
        });
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
                <Card className="h-20">
                  <CardHeader>Upload Voice Recording:</CardHeader>
                  <CardBody>
                    <VoiceRecorder
                      parentCallback={this.handleCallback}
                      parentLoading={this.parentLoading}
                    />
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
                  <Card className="h-34">
                    <CardHeader>The phrase you entered is: </CardHeader>
                    <CardBody className="h-100">
                      {" "}
                      {this.state.isLoading ? (
                        <Loading />
                      ) : (
                        <p className="card-text">( this.state.ourInput )</p>
                      )}
                    </CardBody>
                  </Card>
                </div>
                <br />
                <div className="english-trans">
                  <Card className="h-33">
                    <CardHeader>
                      The English for the phrase you entered is:{" "}
                    </CardHeader>
                    <CardBody>
                      {this.state.isLoading ? (
                        <Loading />
                      ) : (
                        <p className="card-text">this.state.result</p>
                      )}
                    </CardBody>
                  </Card>
                </div>
                <br />
                <div className="eng-to-arab-trans">
                  <Card className="h-33">
                    <CardHeader>
                      The MSA for the phrase you entered is:{" "}
                    </CardHeader>
                    <CardBody>
                      {this.state.isLoading ? (
                        <Loading />
                      ) : (
                        <p className="card-text">
                          ( this.state.result2["Microsoft Model"] )
                        </p>
                      )}
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

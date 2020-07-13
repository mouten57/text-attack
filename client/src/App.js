import React, { Component } from "react";
import "./App.css";
import {
  Grid,
  Header,
  Button,
  List,
  Container,
  TextArea,
  Form,
  Segment,
} from "semantic-ui-react";
import { SemanticToastContainer, toast } from "react-semantic-toasts";
import "react-semantic-toasts/styles/react-semantic-alert.css";
import phonebook from "../src/phonebook";

const convertTimestamp = function (timestamp) {
  var d = new Date(timestamp), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh === 0) {
    h = 12;
  }

  // ie: 2013-02-18, 8:35 AM
  time = mm + "/" + dd + "/" + yyyy + ", " + h + ":" + min + " " + ampm;
  return time;
};

//
class App extends Component {
  state = {
    page: 1,
    item: 1,
    post: "",
    newFact: "",
    contact: {
      name: "Matt",
      phone: phonebook["Matt"].number,
      convoHistory: [],
    },
    customMessageBool: false,
    customMessageValue: "",
    customButtonColor: "yellow",
  };

  async componentDidMount() {
    const response = await fetch("/api/fact", {
      method: "GET",
    });
    const all_facts = await response.json();
    let facts = await all_facts.facts.list;
    let currentCount = await all_facts.latestCount;
    let page = currentCount.page;
    let item = currentCount.item;
    this.setState({ newFact: facts[item - 1].fact, page, item });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/fact", {
      method: "GET",
    });
    const all_facts = await response.json();
    let facts = await all_facts.facts.list;
    let currentCount = await all_facts.latestCount;
    let page = currentCount.page;
    let item = currentCount.item;

    this.setState({ newFact: facts[item - 1].fact, page, item });
  };

  handleSend = async (e) => {
    e.preventDefault();
    let val_to_send = this.state.customMessageBool
      ? this.state.customMessageValue
      : this.state.newFact;
    const data = {
      fact: val_to_send,
      phone: this.state.contact.phone,
    };
    console.log(data);
    fetch("/api/send", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        setTimeout(() => {
          toast({
            type: "success",
            icon: "phone",
            title: "Success!",
            description: "You have successfully sent a fact!",
            animation: "bounce",
            time: 2000,
          });
          //Remove auto-generate new fact
          // this.handleSubmit(e);
        }, 500);
      })
      .catch((err) => console.log(err));

    //this.handleSubmit(e);
  };

  setContact = (e) => {
    let name = e.currentTarget.textContent;
    this.setState({ contact: { name, phone: phonebook[name].number } });
    this.getConvoHistory(phonebook[name].number);
  };

  handleReset = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/reset", {
      method: "GET",
    });
    const body = await response.json();
    this.setState({ page: 1, item: 1, newFact: body.facts.list[0].fact });
  };
  initCustomMessage = (e) => {
    let customButtonColor =
      this.state.customButtonColor == "yellow" ? "orange" : "yellow";
    this.setState({
      customMessageBool: !this.state.customMessageBool,
      customButtonColor,
    });
  };

  handleCustomMessageInput = (e) => {
    let customMessageValue = e.target.value;
    this.setState({ customMessageValue });
  };

  getConvoHistory = async (phone_number = this.state.contact.phone) => {
    const data = {
      phone: phone_number,
    };
    const response = await fetch("/api/get_convo_history", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const body = await response.json();
    const body_sorted_by_dates = body.sort(function (a, b) {
      var dateA = new Date(a.dateCreated),
        dateB = new Date(b.dateCreated);
      return dateA - dateB;
    });
    console.log(body);
    const contact = {
      ...this.state.contact,
      convoHistory: body_sorted_by_dates,
    };
    this.setState({ contact });
  };

  render() {
    return (
      <Container style={{ marginTop: "15px" }}>
        <SemanticToastContainer position="top-right" />
        <Grid divided>
          <Header as="h2" icon textAlign="center">
            <Header.Content>CHUCK NORRIS JOKE CENTRAL</Header.Content>
          </Header>
          <Grid.Row columns={2}>
            <Grid.Column style={{ minHeight: "150px" }}>
              <p>
                FACT #{this.state.item + (this.state.page - 1) * 20} :{" "}
                {this.state.newFact}
              </p>
            </Grid.Column>
            <Grid.Column>
              <List>
                <Header as="h5" icon textAlign="center">
                  <Header.Content>Contact List</Header.Content>
                </Header>
                {Object.keys(phonebook)
                  .filter((name) => !name.includes("Twilio"))
                  .map((name, i) => {
                    return (
                      <List.Item key={i}>
                        <List.Icon name="phone" />
                        <List.Content>
                          <p onClick={this.setContact}>{name}</p>
                        </List.Content>
                      </List.Item>
                    );
                  })}
              </List>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <Form onSubmit={this.handleSubmit} floated={"left"}>
                <Button type="submit" floated={"left"} fluid>
                  New Fact
                </Button>
              </Form>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <Form onSubmit={this.handleReset}>
                <Button type="submit" color={"blue"} fluid>
                  Reset
                </Button>
              </Form>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <Button
                type="submit"
                color={this.state.customButtonColor}
                fluid
                onClick={this.initCustomMessage}
              >
                Custom Message
              </Button>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <Button color="purple" fluid onClick={this.getConvoHistory}>
                Get Convo History
              </Button>
            </Grid.Column>
          </Grid.Row>

          {this.state.customMessageBool ? (
            <Grid.Row columns={1}>
              <Grid.Column>
                <Form>
                  <TextArea
                    placeholder="Enter custom message"
                    onInput={this.handleCustomMessageInput}
                    value={this.state.customMessageValue}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          ) : (
            <div></div>
          )}
          <Grid.Row columns={1}>
            <Grid.Column>
              <div>RECAP:</div>
              <p>
                Sending{" "}
                <i>
                  "
                  <u>
                    {this.state.customMessageBool
                      ? this.state.customMessageValue
                      : this.state.newFact}
                  </u>
                  "
                </i>{" "}
                to{" "}
                <i>
                  "<u>{this.state.contact.name || "No Contact Selected"}</u>"
                </i>
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <form onSubmit={this.handleSend}>
                <Button fluid type="submit" color={"green"}>
                  SEND!
                </Button>
              </form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column width={16}>
              <Segment raised>
                <h4>Conversation history for: {this.state.contact.name}</h4>
                {this.state.contact.convoHistory
                  ? this.state.contact.convoHistory.map((msg, i) => {
                      return (
                        <p key={i}>
                          <i>
                            {msg.to == this.state.contact.phone
                              ? "Matt Sent"
                              : `${this.state.contact.name} Replied`}
                          </i>{" "}
                          <b>{msg.body || msg.Body}</b> at{" "}
                          <i>{convertTimestamp(msg.dateCreated)}</i>
                        </p>
                      );
                    })
                  : ""}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default App;

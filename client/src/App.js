import React, { Component } from 'react';
import './App.css';
import {
  Grid,
  Header,
  Button,
  List,
  Container,
  TextArea,
  Form,
} from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import phonebook from '../src/phonebook';

//
class App extends Component {
  state = {
    page: 1,
    item: 1,
    post: '',
    newFact: '',
    contact: { name: 'Matt', phone: phonebook['Matt'].number },
    customMessageBool: false,
    customMessageValue: '',
    customButtonColor: 'yellow',
  };

  async componentDidMount() {
    const response = await fetch('/api/fact', {
      method: 'GET',
    });
    const all_facts = await response.json();
    console.log(all_facts);
    let facts = await all_facts.facts.list;
    let currentCount = await all_facts.latestCount;
    let page = currentCount.page;
    let item = currentCount.item;
    this.setState({ newFact: facts[item - 1].fact, page, item });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/fact', {
      method: 'GET',
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
    fetch('/api/send', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        setTimeout(() => {
          toast({
            type: 'success',
            icon: 'phone',
            title: 'Success!',
            description: 'You have successfully sent a fact!',
            animation: 'bounce',
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
    console.log(phonebook[e.currentTarget.textContent]);
    this.setState({ contact: { name, phone: phonebook[name].number } });
  };

  handleReset = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/reset', {
      method: 'GET',
    });
    const body = await response.json();
    this.setState({ page: 1, item: 1, newFact: body.facts.list[0].fact });
  };
  initCustomMessage = (e) => {
    let customButtonColor =
      this.state.customButtonColor == 'yellow' ? 'orange' : 'yellow';
    this.setState({
      customMessageBool: !this.state.customMessageBool,
      customButtonColor,
    });
  };

  handleCustomMessageInput = (e) => {
    let customMessageValue = e.target.value;
    this.setState({ customMessageValue });
  };

  render() {
    return (
      <div className="App">
        <Container>
          <SemanticToastContainer position="top-right" />
          <Grid divided>
            <Header as="h2" icon textAlign="center">
              <Header.Content>CHUCK NORRIS JOKE CENTRAL</Header.Content>
            </Header>
            <Grid.Row columns={2}>
              <Grid.Column style={{ minHeight: '150px' }}>
                <p>
                  FACT #{this.state.item + (this.state.page - 1) * 20} :{' '}
                  {this.state.newFact}
                </p>
              </Grid.Column>
              <Grid.Column>
                <List>
                  <Header as="h5" icon textAlign="center">
                    <Header.Content>Contact List</Header.Content>
                  </Header>
                  {Object.keys(phonebook)
                    .filter((name) => !name.includes('Twilio'))
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
              <Grid.Column width={3}>
                <Form onSubmit={this.handleSubmit} floated={'left'}>
                  <Button type="submit" floated={'left'} fluid>
                    New Fact
                  </Button>
                </Form>
              </Grid.Column>
              <Grid.Column width={3}>
                <Form onSubmit={this.handleReset}>
                  <Button type="submit" color={'blue'} fluid>
                    Reset
                  </Button>
                </Form>
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  type="submit"
                  color={this.state.customButtonColor}
                  fluid
                  onClick={this.initCustomMessage}
                >
                  Custom Message
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
                  Sending{' '}
                  <i>
                    "
                    <u>
                      {this.state.customMessageBool
                        ? this.state.customMessageValue
                        : this.state.newFact}
                    </u>
                    "
                  </i>{' '}
                  to{' '}
                  <i>
                    "<u>{this.state.contact.name || 'No Contact Selected'}</u>"
                  </i>
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column width={12}>
                <form onSubmit={this.handleSend}>
                  <Button fluid type="submit" color={'green'}>
                    SEND!
                  </Button>
                </form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;

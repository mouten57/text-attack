import React, { Component } from 'react';
import './App.css';
import { Grid, Header, Button, List, Container } from 'semantic-ui-react';
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
  };

  async componentDidMount() {
    const response = await fetch('http://localhost:5000/api/fact', {
      method: 'GET',
    });
    const all_facts = await response.json();
    console.log(all_facts)
    let facts = await all_facts.facts.list;
    let currentCount = await all_facts.latestCount;
    let page = currentCount.page;
    let item = currentCount.item;
    this.setState({ newFact: facts[item - 1].fact, page, item });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/fact', {
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
    const data = {
      fact: this.state.newFact,
      phone: this.state.contact.phone,
    };
    fetch('http://localhost:5000/api/send', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          toast({
            type: 'success',
            icon: 'phone',
            title: 'Success!',
            description: 'You have successfully sent a fact!',
            animation: 'bounce',
            time: 2000,
          });
          this.handleSubmit(e);
        }, 500);
      })
      .catch((err) => console.log(err));

    //this.handleSubmit(e);
  };

  setContact = (e) => {
    let name = e.currentTarget.textContent;
    this.setState({ contact: { name, phone: phonebook[name].number } });
  };

  handleReset = async (e)=> {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/reset', {
      method: 'GET',
    })
    const body = await response.json()
    this.setState({page: 1, item: 1, newFact: body.facts.list[0].fact })
  }

  render() {
    return (
      <div className="App">
        <Container>
        <SemanticToastContainer position="top-right" />
          <Grid divided centered>
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
                  <List.Item>
                    <List.Icon name="phone" />
                    <List.Content>
                      <p onClick={this.setContact}>Alex</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="phone" />
                    <List.Content>
                      <p onClick={this.setContact}>Matt</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="phone" />
                    <List.Content>
                      <p onClick={this.setContact}>Emily</p>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Icon name="phone" />
                    <List.Content>
                      <p onClick={this.setContact}>Eddie</p>
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <form onSubmit={this.handleSubmit}>
                  <Button type="submit">New Fact</Button>
                </form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={1}>
              <Grid.Column>
                <div>RECAP:</div>
                <p>
                  Sending{' '}
                  <i>
                    "<u>{this.state.newFact}</u>"
                  </i>{' '}
                  to{' '}
                  <i>
                    "<u>{this.state.contact.name || 'No Contact Selected'}</u>"
                  </i>
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <form onSubmit={this.handleSend}>
                  <Button fluid type="submit" color={'green'}>
                    SEND!
                  </Button>
                </form>
              </Grid.Column>
              <Grid.Column>
              <form onSubmit={this.handleReset}>
              <Button fluid  type="submit" color={'blue'}>
                    RESET COUNTER
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

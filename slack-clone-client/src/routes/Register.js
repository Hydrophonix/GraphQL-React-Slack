import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';

class Register extends Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onChange = ({target: {name, value }}) =>
    this.setState({ [name]: value });

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { username, email, password } = this.state;
    const responce = await this.props.mutate({
      variables: { username, email, password },
    });

    const { ok, errors } = responce.data.register;
    if (ok) {
      this.props.history.push('/')
    } else {
      const err = {};
      errors.forEach(({path, message}) => {
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }
  }

  render() {
    const { username, email, password, usernameError, emailError, passwordError } = this.state;

    const errorList = [];
    if (usernameError) {
      errorList.push(usernameError);
    }
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input
          error={!!usernameError}
          name="username"
          onChange={this.onChange}
          value={username}
          placeholder="Username"
          fluid
        />
        <Input
          error={!!emailError}
          name="email"
          onChange={this.onChange}
          value={email}
          placeholder="Email"
          fluid
        />
        <Input
          error={!!passwordError}
          name="password"
          onChange={this.onChange}
          value={password}
          type="password"
          placeholder="Password"
          fluid
        />
        <Button onClick={this.onSubmit}>Submit</Button>
        {usernameError || emailError || passwordError
          ? <Message
              error
              header="There was some errors with your submission"
              list={errorList}
            />
          : null}
      </Container>
    )
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`

export default graphql(registerMutation)(Register);
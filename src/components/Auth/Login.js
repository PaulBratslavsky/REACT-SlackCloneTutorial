import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Login extends React.Component {

    state = {
        email: "",
        password: "",
        errors: [],
        loading: false
    }

    handleChange = (event) => this.setState({[event.target.name]: event.target.value});

    displayErrors = errors => errors.map( (error, i) => <p key={i}>{error.message}</p> );

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                    console.log(signedInUser);
                }
            )
            .catch( error => {
                console.error(error);
                this.setState({errors: this.state.errors.concat(error), loading: false})
            });
        }
    }

    isFormValid = ({email, password}) => email && password;

    handleInputError = (errors, inputName) => {
        return errors.some( error =>  error.message.toLowerCase().includes(inputName))
            ? "error"
            : "";
    }

    render() {

        const { email, password, errors, loading } = this.state;

        return(
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='violet' textAlign='center'>
                    <Icon name="puzzle piece" /> Log-in to your account
                </Header>
                <Form size='large' onSubmit={this.handleSubmit}>
                    <Segment stacked>
                    <Form.Input
                        fluid
                        name='email'
                        icon='mail'
                        iconPosition='left'
                        placeholder='Email'
                        type='email'
                        value={email}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        fluid
                        name='password'
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={this.handleChange}
                    />

                    <Button 
                        disabled={loading}
                        className={loading ? "loading" : ""} 
                        color='violet' 
                        fluid size='large'>
                        Login
                    </Button>
                    </Segment>
                </Form>
                {
                    errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )
                }
                <Message>
                    New to us? <Link to='/register'>Sign Up</Link>
                </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;

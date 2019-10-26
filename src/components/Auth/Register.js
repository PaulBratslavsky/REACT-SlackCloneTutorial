import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }

    handleChange = event => this.setState({ [event.target.name]: event.target.value});

    isFormValid = () => {

        let errors = [];
        let error;

        if ( this.isFormEmpty(this.state) ) {
            // throw error
            error = { message: 'Fill in all the empty fields'};
            console.log(error)

            this.setState({ errors: errors.concat(error) })
            return false;

        } else if ( !this.isPasswordValid(this.state) ) {

            // throw erro
            error = { message: 'Password is invalid'};
            console.log(error)

            this.setState({ errors: errors.concat(error) })
            return false;

        } else {
            // form is valid
            return true;
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        const isFormEmpty = !username.length || !email.length || !password.length || !passwordConfirmation.length
        console.log('checking if form is empty', isFormEmpty);

        return isFormEmpty;
    }   

    isPasswordValid = ({ password, passwordConfirmation }) => {
        // check length
        if ( password.length < 6 || passwordConfirmation.length < 6 ) {
            return false;
        } else if ( password !== passwordConfirmation ) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = (errors) => errors.map( (error, i) => <p key={i}>{error.message}</p>);

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName))
        ? "error"
        : "";
    };

    
    handleSubmit = event => {
        event.preventDefault();

        if ( this.isFormValid() ) {
            this.setState({ loading: true, errors: [] });
            // CREATE USER WITH FIREBASE
            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then( () => {
                    this.saveUser(createdUser).then( () => {
                        console.log('user saved');
                    });    

                    this.setState({
                        username: '',
                        email: '',
                        password: '',
                        passwordConfirmation: '',
                        loading: false
                    })
                })
                .catch( (error) => {
                    console.error(error);
                    this.setState({ errors: this.state.errors.concat(error), loading: false  })
                })
            
                
            
            })
            .catch( error => {
                console.error(error);
                this.setState({ errors: this.state.errors.concat(error), loading: false })
            });
        }
        
    }

    saveUser = createdUser => {
        return this.state.userRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    render() {

        const { username, email, password, passwordConfirmation, errors, loading } = this.state;
        return(
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Icon name="puzzle piece" /> Register a new account
                </Header>
                <Form onSubmit={this.handleSubmit} size='large'>
                    <Segment stacked>
                    <Form.Input 
                        fluid 
                        name='username'
                        icon='user' 
                        iconPosition='left' 
                        placeholder='Username' 
                        type='text'
                        onChange={this.handleChange}
                        value={username}
                        className={this.handleInputError(errors, 'username')}

                    />
                    <Form.Input
                        fluid
                        name='email'
                        icon='mail'
                        iconPosition='left'
                        placeholder='Email'
                        type='email'
                        onChange={this.handleChange}
                        value={email}
                        className={this.handleInputError(errors, 'email')}
                    />
                    <Form.Input
                        fluid
                        name='password'
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        onChange={this.handleChange}
                        value={password}
                        className={this.handleInputError(errors, 'password')}

                    />

                    <Form.Input
                        fluid
                        name='passwordConfirmation'
                        icon='repeat'
                        iconPosition='left'
                        placeholder='Password Confirmation'
                        type='password'
                        onChange={this.handleChange}
                        value={passwordConfirmation}
                        className={this.handleInputError(errors, 'password')}
                    />

                    <Button disabled={loading} className={ loading ? 'loading' : ''} color='teal' fluid size='large'>
                        Register
                    </Button>
                    </Segment>
                </Form>
                {
                    this.state.errors.length > 0 && 
                    <Message error>
                        <h3>Error</h3>
                        {this.displayErrors(errors)}
                    </Message>
                }
                <Message>
                    Have account? <Link to="/login">Login</Link>
                </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;


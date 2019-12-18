import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends Component {

    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        isLoading: false,
        errors: []
    }

    

    handleChange = (event) => this.setState({ [event.target.name]: event.target.value })

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            content: this.state.message,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        }

        return message;
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        console.log(channel.currentChannel.id, "WHAT DOES THOS SAY");

        if ( message  ) {
            this.setState({ isLoading: true });
            // Send Message via Firebase
            messagesRef.child(channel.currentChannel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ isLoading: false, message: '', errors: [] } );
                })
                .catch( errors => {
                    console.error(errors);
                    this.setState({
                        isLoading: false,
                        errors: this.state.errors.concat(errors),
                    })
                })

        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message.' })
            })
            console.log('Show Error');
        }
    }
    render() { 
        const { message, errors } = this.state;



        return (
            
            <Segment className="message__form">
                <Input 
                    fluid
                    name="message"
                    value={message}
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write yout message"
                    className={errors.some( error => error.message.includes('message')) 
                        ?  'error' 
                        : ''
                    }
                />
                <Button.Group icons width="2">
                    <Button 
                        onClick={this.sendMessage}
                        color="orange" 
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />

                    <Button 
                        color="teal" 
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;

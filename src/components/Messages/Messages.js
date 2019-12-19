import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';
import Message from './Message';
import firebase from '../../firebase';

class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true
    }

    componentDidMount() {
        const { channel, user } =  this.state;
        
        console.log(channel && user, 'channel', channel, 'user', user);
        
        if ( channel && user ) {
            this.addListeners(channel.id);
            console.log(channel.id, "IS THIS SWITCHING")
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }
    
    addMessageListener = channelId => {

        const { messagesRef } = this.state;
            
        let loadedMessages = [];
        messagesRef.child(channelId).on('child_added', snapshot => {
            loadedMessages.push(snapshot.val());

            this.setState({ 
                messages: loadedMessages,
                messagesLoading: false
            })

        })
    }

    displayMessage = (messages) => messages.length > 0 && messages
    .map( message => <Message 
            key={message.timestamp}
            message={message}
            user={this.state.user}
        /> 
    );
    


    render() {

        const { messagesRef, channel, user, messages, messagesLoading } = this.state;
        console.log(messages, messagesLoading, "FROM STATE");
        return (
            <React.Fragment>
                <MessagesHeader />
                    <Segment>
                        <Comment.Group className="messages">
                            {this.displayMessage(messages)}
                        </Comment.Group>
                    </Segment>

                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                />  

            </React.Fragment>
        )
    }
}

export default Messages;
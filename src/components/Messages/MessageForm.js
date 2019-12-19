import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';
import ModalFile from './ModalFile';
import uuidv4 from 'uuid/v4';

class MessageForm extends Component {

    state = {
        storageRef: firebase.storage().ref(),
        uploadTask: null,
        uploadState: '',
        percentUploaded: 0,
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        isLoading: false,
        errors: [],
        modal: false,
    }

    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});
    
    handleChange = (event) => this.setState({ [event.target.name]: event.target.value })

    createMessage = ( fileUrl = null ) => {

        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        }

        // Adds Appropriate Content to message object
        if ( fileUrl !== null ) {
            message['image'] = fileUrl
        } else {
            message['content'] = this.state.message
        }     

        return message;
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if ( message  ) {
            this.setState({ isLoading: true });
            // Send Message via Firebase
            messagesRef.child(channel.id)
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

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filepath = `chat/public/${uuidv4()}.jpg`

        this.setState({
            uploadState: 'uploding',
            uploadTask: this.state.storageRef.child(filepath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snapshot => {
                const percentUploaded = Math.round( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
                this.setState({ percentUploaded})
            }, 
            errors => {
                console.error(errors);
                this.setState({ 
                    errors: this.state.errors.concat(errors) ,
                    uploadState: 'error',
                    uploadTask: null
                });

            }, 
            () => {
                this.state.uploadTask.snapshot.ref
                .getDownloadURL()
                .then( downloadURL => {
                    this.sendFileMessage(downloadURL, ref, pathToUpload);
                }) 
                .catch( errors => {
                    console.error(errors);
                    this.setState({ 
                    errors: this.state.errors.concat(errors) ,
                    uploadState: 'error',
                    uploadTask: null
                });

                });
            })
        })
        console.log(file, metadata);
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({
                    uploadState: 'done'
                })
            })
            .catch(errors => {
                console.error(errors);
                this.setState({
                    errors: this.state.errors.concat(errors)
                })
            })
    }

    render() { 
        const { message, errors, isLoading, modal } = this.state;
        return (
            
            <Segment className="message__form">
                <Input 
                    fluid
                    name="message"
                    value={message}
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon='add' />}
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
                        disabled={isLoading}
                    />

                    <Button 
                        color="teal" 
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                        onClick={this.openModal}
                    />
                    <ModalFile 
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;

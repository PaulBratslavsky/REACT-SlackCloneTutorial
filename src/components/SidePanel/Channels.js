import React, { Component } from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends Component {

    state = {
        user: this.props.currentUser,
        channelsRef: firebase.database().ref('channels'),
        channelName: '',
        channelDetails: '',
        isModalOn: false,
        channels: []
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];

         // Add Listener
        this.state.channelsRef.on('child_added', snapshot => {
            loadedChannels.push(snapshot.val());
            console.log(loadedChannels, "LOADED CHANNELS");
            this.setState({channels: loadedChannels})
        })
    }

    handleSubmit = event => {
        event.preventDefault();

        // Check if form is valid
        if (this.isFormValid(this.state)) {
            // Submit
            this.addChannel();
            console.log('Submit')
        } else {
            // Show error
            // this.showError()
            console.log('Error')
        }
        console.log("Submit Button Called");
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        // Create Unique key 
        const key = channelsRef.push().key;

        // Data to save
        const newChannelData = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        console.log("Send this data: ", newChannelData);

        // Add data to firebae
        channelsRef
            .child(key) 
            .update(newChannelData)
            .then(() => {
                this.setState({ channelName: '', channelDetails: ''});
                this.closeModal();
            })
            .catch((error) => {
                console.error( "Firebase error: ", error);
            }) 

    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    closeModal = () => {
        this.setState({
            isModalOn: false
        })
    }

    openModal = () => {
        this.setState({
            isModalOn: true
        })
    }

    dispalayChannels = (channels) => (
        channels.length > 0 && channels.map( channel => (
            <Menu.Item 
                key={channel.id}
                onClick={() => console.log(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )
    
    render() {

        const { channels, isModalOn, channelName, channelDetails } = this.state;

        return (
            <><Menu.Menu style={{ paddingBottom: '2rem'}}>
                <Menu.Item onClick={this.openModal}>
                    <span><Icon name="exchange"/>CHANNELS</span>
                    {' '}({channels.length})<Icon name="add"/>
                </Menu.Item>
                {this.dispalayChannels(channels)}
            </Menu.Menu>
            <Modal basic open={isModalOn} onClose={ this.closeModal }>
                    <Modal.Header>
                        Add a Channel
                    </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid 
                                    label="Name of Channel" 
                                    name="channelName"
                                    value={channelName}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input 
                                    fluid 
                                    label="About the Channel" 
                                    name="channelDetails"
                                    value={channelDetails}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>

                        <Button onClick={this.closeModal} color="red" inverted >
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal></>
        );
    } 

}

export default Channels;

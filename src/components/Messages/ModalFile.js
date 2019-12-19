import React, { Component } from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

class ModalFile extends Component {

    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    addFile = event => {
        const file = event.target.files[0];
        console.log(file, "File");
        if ( file ) {
            this.setState({file});
        }
    }

    isAuthorized = (filename) => this.state.authorized.includes(mime.lookup(filename));


    sendFile = () => {
        const { uploadFile, closeModal } = this.props;
        const { file } = this.state;

        if ( file !== null ) {
            // Check send file type
            if ( this.isAuthorized(file.name) ) {
                const metadata = { contentType: mime.lookup(file.name) }
                console.log('File Sent')

                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
                
            } else {
                console.log('Please select the proper file type!')
            }
        }
    }

    clearFile = () => this.setState({ file: null });
    
    render() {

        const { modal, closeModal } = this.props; 

        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image File</Modal.Header>
                <Modal.Content>
                    <Input 
                        onChange={this.addFile}
                        fluid
                        label="File types: jpg, png"
                        name="file"
                        type="file"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.sendFile}>
                        <Icon name="checkmark" /> Send
                    </Button>
                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default  ModalFile;

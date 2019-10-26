import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image  } from 'semantic-ui-react';
import firebase from './../../firebase';

class UserPanel extends Component {

    state = {
        currentUser: this.props.currentUser
    }


    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Singned in as <strong>{<span>{this.state.currentUser.displayName}</span>}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout} >Sign Out</span>
        }
    ]

    handleSignout = () => {
        firebase
        .auth()
        .signOut()
        .then( () => {
            console.log('Signed out');
        })
    }

    render() {

        const { displayName, photoURL } = this.state.currentUser;
        
        return (
            <Grid style={{ background: '#4c3c4c'}} >
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2rem', margin: '0' }}>
                        <Header inverted floated="left" as="h2">
                            <Header.Content>
                                <span style={{ color: '#EC6F1D'}}>bug</span><span style={{ fontSize: '1.2rem', fontWeight: 'bolder' }}>TRACK<Icon name="code" color="orange"/></span>
                            </Header.Content>
                        </Header>
                        <Header style={{ pading: '1.2rem', }} as="h4" inverted>
                            <Dropdown 
                                trigger={
                                    <span>
                                        <Image src={photoURL} spaced="right" avatar/>
                                        {displayName}
                                    </span>
                                } 
                                options={this.dropdownOptions()} />
                        </Header>
                    </Grid.Row>    
                </Grid.Column>
            </Grid> 
        )
    }
}

export default UserPanel;

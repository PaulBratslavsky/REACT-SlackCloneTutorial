import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown  } from 'semantic-ui-react';
import firebase from './../../firebase';

class UserPanel extends Component {

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Singned in as <strong>User</strong></span>,
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
        return (
            <Grid style={{ background: '#4c3c4c'}} >
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2rem', margin: '0' }}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>
                                <span style={{ color: 'orange'}}>bug</span>/<span style={{ fontSize: '1.2rem', fontWeight: 'bolder' }}>TRACK</span>
                            </Header.Content>
                        </Header>
                    </Grid.Row>
                        <Header style={{ pading: '0.2rem' }} as="h4" inverted>
                            <Dropdown trigger={<span>User</span>} options={this.dropdownOptions()} />
                        </Header>
                </Grid.Column>
            </Grid> 
        )
    }
}

export default UserPanel;

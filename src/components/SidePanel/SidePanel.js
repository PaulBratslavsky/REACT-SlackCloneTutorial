import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';


class SidePanel extends Component {
    render() {
        return (
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
            >
                <UserPanel currentUser={this.props.currentUser}/>
                <Channels currentUser={this.props.currentUser}/>
            </Menu>
        )
    }
}

export default SidePanel;
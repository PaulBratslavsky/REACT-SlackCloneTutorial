import React from 'react';
import { Grid } from 'semantic-ui-react';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import { connect } from 'react-redux';

const App = (props) => {

  console.log(props.currentUser, "Need to pass this");

  return (
    <Grid columns="equal" className="app" style={{ background: '#eee' }}>

      <ColorPanel />
      <SidePanel currentUser={props.currentUser}/>

      <Grid.Column style={{ marginLeft: '320px' }}>
        <Messages />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>

    </Grid>
  )
}
const mapStateToProps = (state) => {
  console.log('map state to props:', state)
  return{
    currentUser: state.user.currentUser
  }
}
export default connect(mapStateToProps)(App);

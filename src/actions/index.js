import * as actionTypes from './types';

// USER ACTIOS
export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
} 

export const clearUser = () => {
    return {
        type: actionTypes.CLEAR_USER
    }
}

// CHANNEL ACTIONS
export const setCurrentChannelAction = (channel) => {
    return {
        type: actionTypes.SET_CURRNET_CHANNEL,
        payload: {
            currentChannel: channel
        }
    }
}
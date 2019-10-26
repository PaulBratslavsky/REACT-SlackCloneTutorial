import React from 'react';
import { Loader, Dimmer} from 'semantic-ui-react';

const Spinner = () => {
    return (
        <div>
            <Dimmer active >
                <Loader size="huge" content="Loading..." />
            </Dimmer>
        </div>
    )
}

export default Spinner;

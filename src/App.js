import React, { PureComponent } from 'react';

import Scene from './core/scene';

class App extends PureComponent {
  componentDidMount() {
    (new Scene()).init();
  }

  onContextMenu(e) {
    e.preventDefault();
    return false;
  }

  render() {
    return (
        <canvas id="scene" width="1000" height="600" tabIndex="1" onContextMenu={this.onContextMenu}></canvas>
    );
  }
}

export default App;

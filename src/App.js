import React, { PureComponent } from 'react';

import Scene from './core/scene';

const width = 1000;
const height = 600;

class App extends PureComponent {
  componentDidMount() {
    (new Scene()).init(width, height);
  }

  onContextMenu(e) {
    e.preventDefault();
    return false;
  }

  render() {
    return (
        <canvas id="scene" width={width} height={height} onContextMenu={this.onContextMenu}></canvas>
    );
  }
}

export default App;

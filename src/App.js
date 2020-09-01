import React from "react";

import styles from "./App.module.css";
import Data from "./data";
import JSONParser from "./JSONParser";

function App() {
  const [colorizeArrays, setColorizeArrays] = React.useState(false);
  const [highlightObjects, setHighlightObjects] = React.useState(false);
  const [outlineObjects, setOutlineObjects] = React.useState(false);
  const [outlineArrays, setOutlineArrays] = React.useState(false);
  const [outlineFields, setOutlineFields] = React.useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to JSON Parser</h1>
        <div className={styles.appOptions}>
          <span>
            <label htmlFor="colorize-arrays">Highlight Array Items</label>
            <input
              type="checkbox"
              id="colorize-arrays"
              checked={colorizeArrays}
              onChange={() => setColorizeArrays(!colorizeArrays)}
            />
          </span>
          <span>
            <label htmlFor="colorize-objects">Highlight Objects</label>
            <input
              type="checkbox"
              id="colorize-objects"
              checked={highlightObjects}
              onChange={() => setHighlightObjects(!highlightObjects)}
            />
          </span>
          <span>
            <label htmlFor="outline-objects">Outline Objects on Hover</label>
            <input
              type="checkbox"
              id="outline-objects"
              checked={outlineObjects}
              onChange={() => setOutlineObjects(!outlineObjects)}
            />
          </span>
          <span>
            <label htmlFor="outline-arrays">Outline Arrays on Hover</label>
            <input
              type="checkbox"
              id="outline-arrays"
              checked={outlineArrays}
              onChange={() => setOutlineArrays(!outlineArrays)}
            />
          </span>
          <span>
            <label htmlFor="outline-fields">Outline Fields on Hover</label>
            <input
              type="checkbox"
              id="outline-fields"
              checked={outlineFields}
              onChange={() => setOutlineFields(!outlineFields)}
            />
          </span>
        </div>
        <JSONParser
          collapsable={false}
          highlightObjects={highlightObjects}
          highlightArrays={colorizeArrays}
          outlineObjects={outlineObjects}
          outlineArrays={outlineArrays}
          outlineFields={outlineFields}
          json={Data}
        />
      </header>
    </div>
  );
}

export default App;

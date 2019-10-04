import React from "react";
import set from "lodash.set";

import styles from "./JSONParser.module.css";

function getRandomRgb() {
  var num = Math.round(0xffffff * Math.random());
  const r = num >> 16;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return {
    r,
    g,
    b,
    rgb: `rgb(${r}, ${g}, ${b})`
  };
}

export default function JSONParser({
  collapsable = false,
  highlightArrays = false,
  highlightObjects = false,
  outlineArrays = false,
  outlineObjects = false,
  outlineFields = false,
  json
}) {
  const [jsonState, updateJsonState] = React.useState(json);

  function setJson(newJson) {
    updateJsonState(JSON.parse(JSON.stringify(newJson)));
  }

  if (typeof jsonState === "object" || Array.isArray(jsonState)) {
    return (
      <JSONParserContext.Provider
        value={{
          collapsable,
          highlightArrays,
          highlightObjects,
          json: jsonState,
          setJson,
          outlineArrays,
          outlineFields,
          outlineObjects
        }}
      >
        <JSONTypeParser jsonData={jsonState} />
      </JSONParserContext.Provider>
    );
  }
  throw new Error("Must pass a valid JSON object");
}

export const JSONParserContext = React.createContext();

function JSONInput({ label, ...props }) {
  const { outlineFields } = React.useContext(JSONParserContext);
  return (
    <div className={outlineFields ? styles.outlineHover : null}>
      <label htmlFor={label}>{label}</label>
      <input id={label} {...props} />
    </div>
  );
}

function JSONTypeParser({ currentPath = [], jsonData, jsonKey = "" }) {
  const { json, setJson } = React.useContext(JSONParserContext);

  function updateJson(e) {
    setJson(set(json, [...currentPath, jsonKey], e.target.value));
  }

  const inputProps = {
    label: jsonKey,
    value: jsonData,
    onChange: updateJson
  };

  if (typeof jsonData === "string") {
    return <JSONInput type="text" {...inputProps} />;
  }
  if (typeof jsonData === "number") {
    return <JSONInput type="number" {...inputProps} />;
  }
  if (typeof jsonData === "boolean") {
    return <JSONInput type="checkbox" {...inputProps} />;
  }
  if (typeof jsonData === "object" && Array.isArray(jsonData)) {
    let updatedPath = [...currentPath];
    if (jsonKey) updatedPath.push(jsonKey);
    return (
      <JSONArrayParser
        currentPath={updatedPath}
        jsonKey={jsonKey}
        array={jsonData}
      />
    );
  }
  if (typeof jsonData === "object") {
    let updatedPath = [...currentPath];
    if (jsonKey) updatedPath.push(jsonKey);
    return (
      <JSONObjectParser
        currentPath={updatedPath}
        jsonKey={jsonKey}
        obj={jsonData}
      />
    );
  }
  return null;
}

function JSONObjectParser({ currentPath, jsonKey, obj }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const { current } = React.useRef(getRandomRgb());
  const { r, g, b } = current;
  const { collapsable, highlightObjects, outlineObjects } = React.useContext(
    JSONParserContext
  );
  const opacity = highlightObjects ? "1" : "0";

  return (
    <div
      style={{
        borderLeft: `4px solid rgb(${r}, ${g}, ${b}, ${opacity})`
      }}
      className={outlineObjects ? styles.outlineHover : null}
    >
      {jsonKey && (
        <React.Fragment>
          <label htmlFor={jsonKey}>{jsonKey}</label>
          {collapsable && (
            <input
              id={jsonKey}
              type="checkbox"
              onClick={() => setIsOpen(!isOpen)}
              checked={isOpen}
            />
          )}
        </React.Fragment>
      )}
      {isOpen &&
        Object.keys(obj).map((key, index) => {
          return (
            <div key={`${jsonKey}-value-${index}`}>
              <JSONTypeParser
                currentPath={currentPath}
                jsonData={obj[key]}
                jsonKey={key}
              />
            </div>
          );
        })}
    </div>
  );
}

function JSONArrayParser({ array, currentPath, jsonKey }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const { current } = React.useRef(getRandomRgb());
  const { r, g, b } = current;
  const { collapsable, highlightArrays, outlineArrays } = React.useContext(
    JSONParserContext
  );

  return (
    <div className={outlineArrays ? styles.outlineHover : null}>
      {jsonKey && (
        <React.Fragment>
          <label htmlFor={jsonKey}>{jsonKey}</label>
          {collapsable && (
            <input
              id={jsonKey}
              type="checkbox"
              checked={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </React.Fragment>
      )}
      {isOpen &&
        array.map((json, index) => {
          const a =
            index === 0
              ? "0.1"
              : (Math.round(100 / array.length) / 100) * index;
          const opacity = highlightArrays ? a : "0";

          const copiedPath = [...currentPath];
          copiedPath.push(index);
          return (
            <div
              key={`${jsonKey}-value-${index}`}
              style={{
                borderLeft: `4px solid rgb(${r}, ${g}, ${b}, ${opacity})`
              }}
            >
              <JSONTypeParser currentPath={copiedPath} jsonData={json} />
            </div>
          );
        })}
    </div>
  );
}

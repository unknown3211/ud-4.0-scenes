import React, { useState, useEffect } from "react";
import "./App.css";
import { debugData } from "../utils/debugData";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { FaPencilAlt } from "react-icons/fa";

debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  const [wordsRemaining, setWordsRemaining] = useState(255);
  const [text, setText] = useState<string>("");
  const [colors, setColors] = useState(['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Black', 'White']);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [fonts, setFonts] = useState(['Default', 'Fancy', 'Monospace', 'Comprime', 'GTA'])
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fontDropdownVisible, setFontDropdownVisible] = useState(false);

  useNuiEvent("setVisible", (data: any) => {
  });

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleFontDropdown = () => {
    setFontDropdownVisible(!fontDropdownVisible);
  };

  const handleWordsRemaining = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentText = event.target.value;
    setText(currentText);
    setWordsRemaining(255 - currentText.length);
  };

  const handleColorShit = (color: string) => {
    setSelectedColor(color);
    setDropdownVisible(false);
  };

  const handleFontShit = (font: string) => {
    setSelectedFont(font);
    setDropdownVisible(false);
  };

  const PlaceSceneEvent = (event: any) => {
    fetchNui<any>('placescene', {
      text: text,
      color: selectedColor,
      font: selectedFont,
    });
    ResetUI();
  };

  const ResetUI = () => {
    setText("");
    setSelectedColor("");
    setSelectedFont("");
    setWordsRemaining(255);
    CloseEvent();
  }

  const CloseEvent = () => {
    fetchNui('hideFrame', {});
  };

  return (
    <div id="textbox" className="wrapper center-wrapper">
      <input className="input-field" tabIndex={0} /><input className="input-field" tabIndex={-1} />
      <div className="wrapperTextbox">
        <div className="inputsTextbox">
          <div className="rowTextBox">
          <div className="iconBox"><FaPencilAlt className="iconTextBox" /></div>
            <div className="inputTextbox">
              <div className="label">Text ({wordsRemaining} remaining)</div>
              <input className="inputText" type="text" placeholder="Text" value={text} onChange={handleWordsRemaining} />
            </div>
          </div>
          <div className="rowTextBox">
            <div className="inputTextbox">
              <div className="label">Color</div>
              <div className="settings-dropdown" onClick={toggleDropdown}>
              <input className="np-text-box" type="text" readOnly placeholder="Select item..." value={selectedColor} />
                {dropdownVisible && (
                  <div className="optionsSelect">
                    {colors.map((color, index) => (
                      <div key={index} onClick={() => handleColorShit(color)}>{color}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="rowTextBox">
            <div className="inputTextbox">
              <div className="label">Font</div>
              <div className="settings-dropdown" onClick={toggleFontDropdown}>
              <input className="np-text-box" type="text" readOnly placeholder="Select font..." value={selectedFont} />
                {fontDropdownVisible && (
                  <div className="optionsSelect">
                    {fonts.map((font, index) => (
                      <div key={index} onClick={() => handleFontShit(font)}>{font}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="rowTextBox">
            <div className="inputTextbox">
              <div className="label">Caret</div>
              <div className="settings-switch-wrapper">
                <input className="np-switch" id="np-switch-caret" type="checkbox" /><label className="np-switch-toggle" htmlFor="np-switch-caret"><span className="np-switch-button" /></label>
              </div>
            </div>
          </div>
          <div className="rowTextBox">
            <div className="inputTextbox">
              <div className="label">White BG (Peek Only)</div>
              <div className="settings-switch-wrapper">
                <input className="np-switch" id="np-switch-solid" type="checkbox" /><label className="np-switch-toggle" htmlFor="np-switch-solid"><span className="np-switch-button" /></label>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonTextbox"onClick={PlaceSceneEvent}>Submit</div>
      </div>
      <input className="input-field" tabIndex={-1} /><input className="input-field" tabIndex={0} />
    </div>
  );
};

export default App;
/**
 * Created by leon on 12/18/2016.
 */
class ComboBox extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({"mode": "open"});

        //Important elements
        this._input = null;
        this._dropDown = null;
        this._toggleBtn = null;

        //Internal values
        this._open = false;
        this._value = null;

        // Bind event handlers
        this._toggleBtnClick = this._toggleBtnClick.bind(this);
        this._winResize = this._winResize.bind(this);
        this._inputKeyUp = this._inputKeyUp.bind(this);
        this._inputClick = this._inputClick.bind(this);
        this._optionSelect = this._optionSelect.bind(this);
    }
    connectedCallback() {
        this._root.innerHTML = `
            <style>
                :host {
                
                }
                #cb-drop-down {
                    height: 0;
                    will-change: transform;
                    pointer-events: none;
                    position: absolute;
                    overflow: hidden;
                    background-color: #FFF;
                    
                }
                #cb-drop-down.open {
                    padding-top: 10px;
                    max-height: 400px;
                    overflow-y: scroll;
                    pointer-events: inherit;
                    transition: height 300ms ease;                    
                }
                .controls {
                    position: relative;              
                }
                #cb-input {
                    width: 100%;
                    height: 2.5em;
                    padding: 0 .5em;
                    box-sizing : border-box;
                }
                .cb-ctrl-btn {
                    border: none;
                    background: none;
                    cursor: pointer;
                }
                #cb-toggle-btn {
                    font-size: 1.5em;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transform: rotate(0deg);            
                    transition: transform 300ms ease;
                    outline: 0;
                }
                #cb-toggle-btn.up {
                    transform: rotate(-180deg);            
                    transition: transform 300ms ease;
                }
                ::slotted(cb-option) {
                    display: block;
                    height: 2em;
                    padding: .5em;
                    line-height: 2em;
                    clear: both;
                }
                ::slotted(cb-option:hover) {
                    background-color: #F1F1F1;
                    cursor: pointer;
                }
            </style>
            <div class="controls">
                <input type="text" id="cb-input" />
                <button class="cb-ctrl-btn" id="cb-toggle-btn">&#9662;</button>
            </div>           
            <div id="cb-drop-down">
                <slot></slot>
            </div>           
        `;
        this._input = this._root.getElementById("cb-input");
        this._dropDown = this._root.getElementById("cb-drop-down");
        this._toggleBtn = this._root.getElementById("cb-toggle-btn");

        //Setup event handlers
        this._toggleBtn.addEventListener("click", this._toggleBtnClick);
        this._input.addEventListener("click", this._inputClick);
        this._input.addEventListener("keyup", this._inputKeyUp);
        window.addEventListener("resize", this._winResize);
        this._dropDown.addEventListener("click", this._optionSelect);
    }
    set open(value) {
        if (this._open === value) return;
        this._open = (value === true);
        if (this._open === true) {
            let height = 0;
            this.childNodes.forEach(($child) => {
                if ($child.nodeType === 1) { // ELEMENT_NODE
                    height += $child.offsetHeight;
                }
            });
            this._dropDown.style.height = `${height}px`;
            this._dropDown.style.width = `${this._input.offsetWidth}px`;
            this._dropDown.classList.add("open");
            this._toggleBtn.classList.add("up");
        } else {
            this._dropDown.style.height = 0;
            this._dropDown.classList.remove("open");
            this._toggleBtn.classList.remove("up");
        }
    }
    get open() {
        return this._open;
    }
    set value(value) {
        if (this._value === value) return;
        this._value = value;
        this._input.value = this._value.label;
    }
    get value() {
        return this._value;
    }
    //Event handlers
    _toggleBtnClick() {
        this.open = !this.open;
    }
    _winResize() {
        if (this.open === true) {
            this._dropDown.style.width = `${this._input.offsetWidth}px`;
        }
    }
    _inputClick() {
        this.open = true;
    }
    _inputKeyUp(event) {
        this.childNodes.forEach(($child) => {
            if ($child.nodeType === 1) {
                if ($child.innerHTML.indexOf(event.target.value) === -1) {
                    $child.style.display = "none";
                } else {
                    $child.style.display = "inherit";
                }
            }
        })
    }
    _optionSelect(event) {
        if (event.target.nodeName === "CB-OPTION"){
            this.value = {
                "value": event.target.getAttribute("value"),
                "label": event.target.innerHTML
            };
            this.open = false;
        }
    }

    disconnectCallback() {
        this._toggleBtn.removeEventListener("click", this._toggleBtnClick);
        window.removeEventListener("resize", this._winResize);
        this._input.removeEventListener("keyup", this._inputKeyUp);
        this._input.removeEventListener("click", this._inputClick);
    }
}

window.customElements.define("combo-box", ComboBox);

class CbOption extends HTMLElement {

}

window.customElements.define("cb-option", CbOption);
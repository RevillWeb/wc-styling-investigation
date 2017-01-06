/**
 * Created by leon on 12/18/2016.
 */
class DropSelect extends HTMLElement {
    constructor(self) {

        let $template = document.createElement("template");
        $template.innerHTML = `
            <style>
                :host {
                    --p-color: var(--primary-color, #333);
                    --s-color: var(--secondary-color, #E1E1E1);
                    --bg-color: var(--background-color, #FFF);
                }
                .ds-drop-down {
                    height: 0;                   
                    will-change: transform;
                    pointer-events: none;
                    position: absolute;
                    overflow: hidden;
                    box-sizing : border-box;
                    background-color: var(--bg-color, #FFF);                  
                    transition: height 300ms ease, margin-top 300ms ease, padding-top 300ms ease;
                    z-index: 1;
                    box-shadow: 0 1px 1px #CCC;
                }
                .ds-drop-down.open {
                    padding-top: 10px;
                    max-height: 400px;
                    overflow-y: scroll;
                    pointer-events: inherit;                   
                }
                .controls {
                    position: relative;              
                }
                #ds-input {
                    width: 100%;
                    height: 2.5em;
                    padding: 0 .5em;
                    border: solid 1px var(--s-color);
                    box-sizing : border-box;
                    color: var(--p-color);
                    background-color: var(--bg-color);
                    outline: 0;
                    position: relative;
                    z-index: 2;
                }
                #ds-input::-ms-clear {
                    display: none;
                }
                .ds-ctrl-btn {
                    border: none;
                    background: none;
                    cursor: pointer;
                }
                #ds-toggle-btn {
                    font-size: 1.5em;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transform: rotate(0deg);            
                    transition: transform 300ms ease;
                    outline: 0;
                    color: var(--p-color);
                    z-index: 2;
                }
                #ds-toggle-btn.up {
                    transform: rotate(-180deg);            
                    transition: transform 300ms ease;
                }
                .ds-drop-down ::slotted(ds-option) {
                    display: block;
                    height: 2em;
                    padding: .5em;
                    line-height: 2em;
                    clear: both;
                }
                .ds-drop-down ::slotted(ds-option:hover) {
                    background-color: var(--s-color);
                    cursor: pointer;
                }
            </style>
            <div class="controls">
                <input type="text" id="ds-input" />
                <button class="ds-ctrl-btn" id="ds-toggle-btn">&#9662;</button>
            </div>           
            <div class="ds-drop-down">
                <slot></slot>
            </div>           
        `;

        // If the ShadyCSS polyfill is present then prepare the template (auto no-ops)
        if (ShadyCSS) ShadyCSS.prepareTemplate($template, "drop-select");

        self = super(self);
        self._root = this.attachShadow({"mode": "open"});

        self._$template = document.importNode($template.content, true);

        //Important elements
        self._input = null;
        self._dropDown = null;
        self._toggleBtn = null;

        //Internal values
        self._open = false;
        self._value = null;

        // Bind event handlers
        self._toggleBtnClick = this._toggleBtnClick.bind(self);
        self._winResize = this._winResize.bind(self);
        self._inputKeyUp = this._inputKeyUp.bind(self);
        self._inputClick = this._inputClick.bind(self);
        self._optionSelect = this._optionSelect.bind(self);
        self._blur = this._blur.bind(self);
        return self;
    }
    connectedCallback() {
        // If the ShadyCSS polyfill is present, apply the style  (auto no-ops)
        if (ShadyCSS) ShadyCSS.applyStyle(this);
        this._root.appendChild(this._$template);
        this._input = this._root.querySelector("#ds-input");
        this._dropDown = this._root.querySelector(".ds-drop-down");
        this._toggleBtn = this._root.querySelector("#ds-toggle-btn");

        //Setup event handlers
        this._toggleBtn.addEventListener("click", this._toggleBtnClick);
        this._input.addEventListener("click", this._inputClick);
        this._input.addEventListener("keyup", this._inputKeyUp);
        window.addEventListener("resize", this._winResize);
        this._dropDown.addEventListener("click", this._optionSelect);
        this._input.addEventListener("blur", this._blur);
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
            this.childNodes.forEach(($child) => {
                if ($child.nodeType === 1) {
                    if ($child.style.display === "none") {
                        $child.style.display = "inherit";
                    }
                }
            });
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
        this.open = true;
        this.childNodes.forEach(($child) => {
            if ($child.nodeType === 1) {
                if ($child.innerHTML.indexOf(event.target.value) === -1) {
                    $child.style.display = "none";
                } else {
                    $child.style.display = "inherit";
                }
            }
        });
    }
    _optionSelect(event) {
        if (event.target.nodeName === "DS-OPTION") {
            this.value = {
                "value": event.target.getAttribute("value"),
                "label": event.target.innerHTML
            };
            this.open = false;
        }
    }
    _blur() {
        setTimeout(() => {
            this.open = false;
        }, 300);
    }

    disconnectCallback() {
        this._toggleBtn.removeEventListener("click", this._toggleBtnClick);
        window.removeEventListener("resize", this._winResize);
        this._input.removeEventListener("keyup", this._inputKeyUp);
        this._input.removeEventListener("click", this._inputClick);
    }
}

window.customElements.define("drop-select", DropSelect);
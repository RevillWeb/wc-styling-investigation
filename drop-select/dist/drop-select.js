"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by leon on 12/18/2016.
 */
var DropSelect = function (_HTMLElement) {
    _inherits(DropSelect, _HTMLElement);

    function DropSelect(self) {
        var _this, _ret;

        _classCallCheck(this, DropSelect);

        var $template = document.createElement("template");
        $template.innerHTML = "\n            <style>\n                :host {\n                    --p-color: var(--primary-color, #333);\n                    --s-color: var(--secondary-color, #E1E1E1);\n                    --bg-color: var(--background-color, #FFF);\n                }\n                .ds-drop-down {\n                    height: 0;                   \n                    will-change: transform;\n                    pointer-events: none;\n                    position: absolute;\n                    overflow: hidden;\n                    box-sizing : border-box;\n                    background-color: var(--bg-color, #FFF);                  \n                    transition: height 300ms ease, margin-top 300ms ease, padding-top 300ms ease;\n                    z-index: 1;\n                    box-shadow: 0 1px 1px #CCC;\n                }\n                .ds-drop-down.open {\n                    padding-top: 10px;\n                    max-height: 400px;\n                    overflow-y: scroll;\n                    pointer-events: inherit;                   \n                }\n                .controls {\n                    position: relative;              \n                }\n                #ds-input {\n                    width: 100%;\n                    height: 2.5em;\n                    padding: 0 .5em;\n                    border: solid 1px var(--s-color);\n                    box-sizing : border-box;\n                    color: var(--p-color);\n                    background-color: var(--bg-color);\n                    outline: 0;\n                    position: relative;\n                    z-index: 2;\n                }\n                #ds-input::-ms-clear {\n                    display: none;\n                }\n                .ds-ctrl-btn {\n                    border: none;\n                    background: none;\n                    cursor: pointer;\n                }\n                #ds-toggle-btn {\n                    font-size: 1.5em;\n                    position: absolute;\n                    right: 0;\n                    top: 0;\n                    transform: rotate(0deg);            \n                    transition: transform 300ms ease;\n                    outline: 0;\n                    color: var(--p-color);\n                    z-index: 2;\n                }\n                #ds-toggle-btn.up {\n                    transform: rotate(-180deg);            \n                    transition: transform 300ms ease;\n                }\n                .ds-drop-down ::slotted(ds-option) {\n                    display: block;\n                    height: 2em;\n                    padding: .5em;\n                    line-height: 2em;\n                    clear: both;\n                }\n                .ds-drop-down ::slotted(ds-option:hover) {\n                    background-color: var(--s-color);\n                    cursor: pointer;\n                }\n            </style>\n            <div class=\"controls\">\n                <input type=\"text\" id=\"ds-input\" />\n                <button class=\"ds-ctrl-btn\" id=\"ds-toggle-btn\">&#9662;</button>\n            </div>           \n            <div class=\"ds-drop-down\">\n                <slot></slot>\n            </div>           \n        ";

        // If the ShadyCSS polyfill is present then prepare the template (auto no-ops)
        if (ShadyCSS) ShadyCSS.prepareTemplate($template, "drop-select");

        self = (_this = _possibleConstructorReturn(this, (DropSelect.__proto__ || Object.getPrototypeOf(DropSelect)).call(this, self)), _this);
        self._root = _this.attachShadow({ "mode": "open" });

        self._$template = document.importNode($template.content, true);

        //Important elements
        self._input = null;
        self._dropDown = null;
        self._toggleBtn = null;

        //Internal values
        self._open = false;
        self._value = null;

        // Bind event handlers
        self._toggleBtnClick = _this._toggleBtnClick.bind(self);
        self._winResize = _this._winResize.bind(self);
        self._inputKeyUp = _this._inputKeyUp.bind(self);
        self._inputClick = _this._inputClick.bind(self);
        self._optionSelect = _this._optionSelect.bind(self);
        self._blur = _this._blur.bind(self);
        return _ret = self, _possibleConstructorReturn(_this, _ret);
    }

    _createClass(DropSelect, [{
        key: "connectedCallback",
        value: function connectedCallback() {
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
    }, {
        key: "_toggleBtnClick",

        //Event handlers
        value: function _toggleBtnClick() {
            this.open = !this.open;
        }
    }, {
        key: "_winResize",
        value: function _winResize() {
            if (this.open === true) {
                this._dropDown.style.width = this._input.offsetWidth + "px";
            }
        }
    }, {
        key: "_inputClick",
        value: function _inputClick() {
            this.open = true;
        }
    }, {
        key: "_inputKeyUp",
        value: function _inputKeyUp(event) {
            this.open = true;
            this.childNodes.forEach(function ($child) {
                if ($child.nodeType === 1) {
                    if ($child.innerHTML.indexOf(event.target.value) === -1) {
                        $child.style.display = "none";
                    } else {
                        $child.style.display = "inherit";
                    }
                }
            });
        }
    }, {
        key: "_optionSelect",
        value: function _optionSelect(event) {
            if (event.target.nodeName === "DS-OPTION") {
                this.value = {
                    "value": event.target.getAttribute("value"),
                    "label": event.target.innerHTML
                };
                this.open = false;
            }
        }
    }, {
        key: "_blur",
        value: function _blur() {
            var _this2 = this;

            setTimeout(function () {
                _this2.open = false;
            }, 300);
        }
    }, {
        key: "disconnectCallback",
        value: function disconnectCallback() {
            this._toggleBtn.removeEventListener("click", this._toggleBtnClick);
            window.removeEventListener("resize", this._winResize);
            this._input.removeEventListener("keyup", this._inputKeyUp);
            this._input.removeEventListener("click", this._inputClick);
        }
    }, {
        key: "open",
        set: function set(value) {
            if (this._open === value) return;
            this._open = value === true;
            if (this._open === true) {
                var height = 0;
                this.childNodes.forEach(function ($child) {
                    if ($child.nodeType === 1) {
                        // ELEMENT_NODE
                        height += $child.offsetHeight;
                    }
                });
                this._dropDown.style.height = height + "px";
                this._dropDown.style.width = this._input.offsetWidth + "px";
                this._dropDown.classList.add("open");
                this._toggleBtn.classList.add("up");
            } else {
                this._dropDown.style.height = 0;
                this._dropDown.classList.remove("open");
                this._toggleBtn.classList.remove("up");
                this.childNodes.forEach(function ($child) {
                    if ($child.nodeType === 1) {
                        if ($child.style.display === "none") {
                            $child.style.display = "inherit";
                        }
                    }
                });
            }
        },
        get: function get() {
            return this._open;
        }
    }, {
        key: "value",
        set: function set(value) {
            if (this._value === value) return;
            this._value = value;
            this._input.value = this._value.label;
        },
        get: function get() {
            return this._value;
        }
    }]);

    return DropSelect;
}(HTMLElement);

window.customElements.define("drop-select", DropSelect);

#Web Component Styling Investigation

This repo has been created as a playground for an investigation into methods for styling Web Components.

##Goal

The goal is to figure out what it will take to write cross platform vanilla Web Components which can be styled using CSS custom properties and @apply mixins while supporting the following browsers:

* Chrome
* Safari
* Edge
* FireFox
* Internet Explorer 11

Web Component users should also be able to easily opt-out of default built in styles without having to unpick every aspect of the styling.

##Initial Idea

Each component should define its own styling API which is surfaced as a set of CSS custom properties. With research it is probable that a set of common CSS properties will be discovered which will be required for most components (at least --primary-color & --secondary-color). Then depending on the component further CSS properties will be exposed to allow the user to modify various styling aspects of the component.

Because choosing colors (and other aspects of styling) that work well together is not a trivial task it would be desirable to provide a set of themes for each component. As CSS @apply mixins allow users to modify multiple CSS statements with a single definition @apply mixins would be perfect here.

##Components

A set of very basic vanilla Web Components will be added to this repo to prototype the ideas presented above. At least a drop select, carousel and nav menu will be added.

###drop-select

This component is incredibly simple (and not very well designed) but provides the following styling API as a way to experiment with CSS Custom Properties, CSS @apply mixins and the various polyfills to ensure cross platform support.

* --primary-color (Default: #333)
* --secondary-color (Default: #E1E1E1)
* --background-color (Default: #FFF)

##Polyfills used

* [document-register-element](https://github.com/WebReflection/document-register-element) - Custom Elements V1 polyfill
* [ShadyDOM](https://github.com/webcomponents/shadydom) - Shadow DOM V1 Shim
* [ShadyCSS](https://github.com/webcomponents/shadycss) - Shim for CSS Custom Properties, CSS Mixins with @apply support, and ShadowDOM V1 style encapsulation
* [webcomponentsjs - Template](https://github.com/webcomponents/webcomponentsjs/blob/master/src/Template/Template.js) - Template element polyfill **required for ShadyCSS** (IE11 Only)
* [array-from](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from) - Polyfill for Array.from() method **required for ShadyDOM and ShadyCSS** (IE11 Only)
* [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) - Polyfill for ES2015 style promises **required for ShadyDOM and ShadyCSS** (IE11 Only)

##Issues

* There is currently an outstanding bug ([#20](https://github.com/webcomponents/shadycss/issues/20)) in the ShadyCSS shim which means CSS Custom Properties are not shimmed for IE 11. There is already an [un-merged pull request](https://github.com/webcomponents/shadycss/pull/23) with this fix but this appears to cause further issues.
* The full webcomponents-lite.min.js polyfill couldn't be used because the WebComponentsReady event causes an exception in the ShadyDOM polyfill
* While the ShadyCSS polyfill provides encapsulation to prevent component styles leaking into the outer document it doesn't prevent outer document style leaking into the component

##To Do

* Fix the pull request fixing bug #20
* Investigate usage of the CSS @apply mixing and ensure cross platform compatibility
* Introduce additional components
* Discover a suitable method for users to opt-out of component default styling

##Contributing

1. Clone the repo
2. `npm install`
3. `npm run transpile` to transpile the `drop-select.js` Web Component
4. `npm run serve` to serve index.html via a node HTTP server
## lawyerfy
- advanced webpack boilerplate


### Features:
- CSS bundle separated from a JS bundle to achieve faster CSS loading
- automatically add vendor prefixes to CSS code
- eliminates unused JS and CSS code
- larger images and fonts are separated from js bundle using file-loader
- JavaScript code compiled using Babel (React, ES6, ES7)
- source maps for JS and CSS files for easier debugging
- bundle splitting (app separated from vendor)
- code splitting (dynamic imports enabled)
- performance budget
- JS and CSS minified
- caching (build files contain hashes, manifest extracted to a separate file)


## Getting Started
To try the example application out or to use the project, follow the instructions below.

1. **Clone repo**

    `git clone https://github.com/codinglawyer/lawyerfy.git`

2. **Install dependencies**

    `npm install`

3. **Run development server**

   `npm run dev`

   Your app will be served at: http://localhost:8080/

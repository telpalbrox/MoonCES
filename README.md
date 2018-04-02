MoonCES
==============

MoonCES is a port of [CES.js](http://github.com/qiao/ces.js/) to typescript. Original author is [qiao](http://github.com/qiao)

CES.js is a lightweight Component-Entity-System framework for JavaScript games.


Basic Usage
-----------

## TODO REWRITE WITH TYPESCRIPT
```

Installation (Browser)
-------

Download the [minified js file](http://github.com/qiao/ces.js/raw/master/dist/ces-browser.min.js) and include it in your web page.

```html
<script type="text/javascript" src="./ces-browser.min.js"></script>
```


Development
------------

Layout:

    .
    |-- dist         # browser distribution
    |-- src          # source code
    `-- test         # test scripts

You will need to install `node.js` and use `npm` and `tsd` to install the dependencies: 

    npm install -d 
    tsd install

To build the browser distribution 
(It will use [tsc](https://github.com/Microsoft/TypeScript) to generate a browser distribution,
and use [UglifyJS](https://github.com/mishoo/UglifyJS) to compress):

    make

To run the tests with
[mocha](http://mochajs.org/) and [chai](https://github.com/chaijs/chai) 

    make test

License
-------

[MIT License](http://www.opensource.org/licenses/mit-license.php)

Copyright 2013 Xueqiao Xu &lt;xueqiaoxu@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

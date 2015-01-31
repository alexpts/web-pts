var pts = {};

(function($, window){
    'use strict';

    /**
     * @param {String} name
     */
    var _namespace = function(name) {
        var context = this || window;

        var parts = name.split('.');
        var count = parts.length;

        for (var i = 0; i < count; i += 1) {
            if (context[parts[i]] === undefined) {
                context[parts[i]] = {};
            }
            context = context[parts[i]];
        }
    };

    var _util = function(){
        /**
         * @param {String} name
         * @param {Object} attrs
         * @returns {HTMLElement}
         */
        var _createNode = function(name, attrs) {
            var node = document.createElement(name),
                attr;

            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    node.setAttribute(attr, attrs[attr]);
                }
            }

            return node;
        };

        /**
         * @param {String} url
         * @returns {string}
         */
        var _getExt = function(url) {
            return url.replace(/.*\.(\w+)$/, '$1').toLowerCase(); // .js, .css, .json, .tpl
        };

        /**
         * @param {Function|Array} stack
         * @param {Array|Function} callback
         * @returns {Array}
         */
        var _addCallback = function(stack, callback) {
            stack = stack || [];
            if (!Array.isArray(stack)) {
                stack = [stack];
            }

            if (Array.isArray(callback)) {
                stack = stack.concat(callback);
            } else {
                stack.push(callback);
            }

            return stack;
        };

        /**
         * @param {*} val
         * @returns {Boolean}
         */
        var _isEmpty = function(val) {
            return (val instanceof Object)
                ? $.isEmptyObject(val)
                : !val;
        };

        return {
            createNode: _createNode,
            getExt: _getExt,
            addCallback: _addCallback,
            isEmpty: _isEmpty
        };
    };

    /** public **/
    window.pts.util = _util();
    window.pts.namespace = _namespace;

})(jQuery, window);
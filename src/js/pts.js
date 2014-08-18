var pts = {};

(function($, window, pts){
    'use strict';

    var _util = function(){
        /**
         * @param {String} fullName
         * @param {Object} [contenxt=
         * @returns {Object|*}
         */
        var _namespace = function(fullName, contenxt) {
            contenxt = contenxt || window;

            var parts = fullName.split('.');
            var count = parts.length;

            for (var i = 0; i < count; i += 1) {
                if (typeof contenxt[parts[i]] === undefined) {
                    contenxt[parts[i]] = {};
                }
                contenxt = contenxt[parts[i]];
            }
            return contenxt;
        };

        /**
         * @param {String} name
         * @param {Object} attrs
         * @returns {HTMLElement}
         */
        var _createNode = function(name, attrs) {
            var node = document.createElement(name), attr;

            for (attr in attrs) {
                if(attrs.hasOwnProperty(attr)) {
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
            if (!stack) {
                stack = [];
            } else if (!Array.isArray(stack)) {
                stack = [stack];
            }

            if (Array.isArray(callback)) {
                stack = stack.concat(callback);
            } else {
                stack.push(callback);
            }

            return stack;
        };

        var _isEmpty = function(val) {
            return (val instanceof Object) ?  $.isEmptyObject(val) :
                ( (val===""||val==0||val=="undefined"||val===null||val===false||($.isArray(val)&&val.length===0)) ? true : false);
        };

        return {
            namespace: _namespace,
            createNode: _createNode,
            getExt: _getExt,
            addCallback: _addCallback,
            isEmpty: _isEmpty
        };
    }();


    /** public **/
    pts.util = _util;

})(jQuery, window, pts);
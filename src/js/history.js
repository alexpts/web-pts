(function($, pts) {
    'use strict';
    /**
     *
     * @param {Function} handler(html, title)
     * @constructor
     */
    var _history = function(handler) {
        var _on = function(){
            window.addEventListener('popstate', _popstate, false);
            return this;
        };

        var _off = function() {
            window.removeEventListener('popstate', _popstate);
            return this;
        };

        var _popstate = function(event) {
            if (event.state && event.state.html && event.state.title) {
                handler(event.state.html, event.state.title);
            }
        };

        var _push = function() {
            return (window.history && window.history.pushState)
                ? function(data, title, url){window.history.pushState(data, title, url);}
                : function(){ return this; };
        }();

        var _replace = function() {
            return (window.history && window.history.replaceState)
                ? function(data, title, url){ window.history.replaceState(data, data.title, location.href);}
                : function(){ return this; };
        }();

        return {
            on: _on,
            off: _off,
            push: _push, // compatible version
            replace: _replace // compatible version
        };
    };

    pts.history = _history;

})(jQuery, pts);
(function($, pts) {
    'use strict';

    var ajaxStiker = function () {

        var _ajaxCompleteStikers = function (event, jqXHR, ajaxOptions) {
            var json = jqXHR.responseJSON;

            if (json && json.stikers) {
                for (var i = json.stikers.length; i--;) {
                    var stiker = json.stikers[i];
                    $(document).trigger('pts.stiker.create', stiker);
                }
            }
        };

        var _on = function () {
            $(document).on('ajaxComplete', _ajaxCompleteStikers);
        };

        var _off = function () {
            $(document).off('ajaxComplete', _ajaxCompleteStikers);
        };

        var _init = function () {
            _on();
        }();

        return {
            on: _on,
            off: _off,
            init: _init
        }
    };

    $(document).one('ready', function () {
        pts.loader.loads(['stiker.pts.js', 'stiker.pts.css'], function () {
            pts.stiker.ajax = new ajaxStiker();
        });
    });


})(jQuery, pts);
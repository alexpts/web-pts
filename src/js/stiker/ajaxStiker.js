(function($, pts) {
    'use strict';

    var ajaxStiker = function(){

        var _ajaxCompleteStikers =  function(event, jqXHR, ajaxOptions) {
            var json = jqXHR.responseJSON;

            if(json && json.stikers) {
                for(var i = json.stikers.length; i--;) {
                    var stiker = json.stikers[i];
                    $(document).trigger('pts.stiker.create', stiker);
                }
            }
        };

        /**
         * @param [event]
         * @param {String} [name]
         */
        var _on = function(event, name){
            if(event && name !== 'stiker') {
                return;
            }

            $(document).on('ajaxComplete', _ajaxCompleteStikers);
        };

        /**
         * @param [event]
         * @param {String} [name]
         */
        var _off = function(event, name){
            if(event && name !== 'stiker') {
                return;
            }

            $(document).off('ajaxComplete', _ajaxCompleteStikers);
        };

        var _constructor = function(){
            $(document).on('pts.module.on', _on);
            $(document).on('pts.module.off', _off);
            _on();
        }();

        return {
            on: _on,
            off: _off
        }
    };

    pts.stiker.ajax = new ajaxStiker();

})(jQuery, pts);
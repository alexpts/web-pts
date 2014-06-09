(function($, pts) {
    'use strict';

    var ajaxStiker = function(){

        var _ajaxCompleteStikers =  function(event, jqXHR, ajaxOptions) {
            var json = jqXHR.responseJSON;

            if(json && json.stikers) {
                for(var i = json.stikers.length; i--;) {
                    var stiker = json.stikers[i];
                    pts.stiker.create(stiker);
                }
            }
        };

        var _on = function(){
            // Обработка ajax запроса, модуль проверяет, есть ли стикеры в JSON ответе от сервера
            $(document).on('ajaxComplete', _ajaxCompleteStikers);
        };

        var _off = function(){
            $(document).off('ajaxComplete', _ajaxCompleteStikers);
        };

        var _constructor = function(){

            $(document).on('pts.module.on', function(e, name){
                if(name === 'stiker') {
                    _on();
                }
            });

            $(document).on('pts.module.off', function(e, name){
                if(name === 'stiker') {
                    _off();
                }
            });

            _on();
        }();

        return {
            on: _on,
            off: _off
        }
    };

    pts.stiker.ajax = new ajaxStiker();

})(jQuery, pts);
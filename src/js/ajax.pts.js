(function($, pts) {
    'use strict';

    var _Ajax =  function() {
        var $body = $('body');
        var ajaxRequestActive = 0;

        var _on = function(){
            $(document).on('click', 'a.ajax, button.ajax',_mySumbit) // Вешаем обработку щелчка на аяксовые ссылки
                .on('submit', 'form.ajax', _mySumbit) // Вешаем обработку submit на формы
                .on('ajaxSend', _ajaxSend)
                .on('ajaxComplete', _ajaxComplete)
                .on('ajaxError', _ajaxError);
        };

        var _off = function(){
            $(document).off('click', 'a.ajax, button.ajax',_mySumbit) // Вешаем обработку щелчка на аяксовые ссылки
                .off('submit', 'form.ajax', _mySumbit) // Вешаем обработку submit на формы
                .off('ajaxSend', _ajaxSend)
                .off('ajaxComplete', _ajaxComplete)
                .off('ajaxError', _ajaxError);
        };

        var _mySumbit = function(e){
            e.preventDefault();
            _submit.call(this);
        };

        // Удаляет пустые параметры, @todo стоит ли -  если поле есть но его не заполнитили, то оно null является по сути
        var _clearEmpty = function(params) {
            if (!pts.util.isEmpty(params)) {
                for(var i = params.length; i--;) {
                    var val = params[i]['value'];
                    if(pts.util.isEmpty(val) && (val!=0)) {
                        delete params[i];
                    }
                }
            }
            return params;
        };

        var _submit = function(action, data, ajaxParams) {
            !data ? data = [] : '';
            !ajaxParams ? ajaxParams = {} : '';

            var $this = $(this),
                form, name, val;

            var type = $this.attr('mehtod') || 'post';
            var dataType = $this.attr('datatype') ||'json';

            if(action) {
                // Ручной вариант передачи пользовательских данных
            } else if($this.is('form')) {
                action = $this.attr('action');
                data = _clearEmpty($this.serializeArray()); //  jQuery.param(params) происходит само видимо, это как-то с traditional связано
            } else if($this.is(':submit') || $this.is('button')) {
                action = $this.attr('formaction');
                if(!action) {
                    form = $this.closest("form.ajax");
                    action = form.attr('action');
                    data = _clearEmpty(form.serializeArray());
                }
            } else if($this.is('a')) {
                action = $this.attr('href');
                // С помощью пользовательских атрибутов name и val можно явно указывтаь параметр дополнительно, кроме того, что параметр передается в URL парамтерах любой
                if(name = $this.attr('name')) {
                    data[name] = $this.attr('val');
                }
            }



            $.ajax(
                $.extend({
                    url     : action,
                    data    : data,
                    context : this,
                    type    : type,
                    dataType: dataType
                }, ajaxParams)
            );
        };



        var _eval = function($, event, code, context) {
            (new Function('$', 'event', 'context', 'return ' + code)($, event, context));
        };

        // Логика перед запросом
        var _ajaxSend = function(event, jqXHR, options){
            _incProgress();
        };

        var _ajaxComplete = function(event, jqXHR, ajaxOptions){
            _decrProgress();

            if(jqXHR.status >= 300 && jqXHR.status < 400) {
                var url = jqXHR.getResponseHeader('Redirect');
                if(url) {
                    window.location.href = url;
                    return;
                }

                pts.stiker.create({
                    msg: 'Ошибка запроса, ответ не содержит адрес для перенаправления',
                    title: 'Ошибка',
                    type: 'error'
                });
            }

            var json = jqXHR.responseJSON;

            if(json) {
                var context = $(ajaxOptions.context);
                //$(this).triggerHandler('ajaxComplete.json', [json, context]);

                // Redirect @todo вынести в модуль, @todo проериять по коду ответа сервера 3xx
//                if(json && json.redirect) {
//                    pts.stiker.create({
//                        msg: 'Подождите, идет переадресация...',
//                        title: 'Перенаправление'
//                    });
//                    location.href = json.redirect;
//                }

                // jsCode
                if(json && json.jsCode && $.trim(json.jsCode)) {
                    var reg = /\$\(%SELF%\)/gm, i;
                    var jsCode = json.jsCode;
                    for(i = jsCode.length; i--;) {
                        var code = jsCode[i].replace(reg, "context");
                        _eval($, event, code, context);
                    }
                }
            }
        };

        var _ajaxError = function(event, jqXHR, ajaxOptions){
            _decrProgress();

            if(jqXHR.status < 400) {
                return; // not error
            }

            var json = jqXHR.responseJSON;
            var text = jqXHR.responseText;

            var responseDataType = jqXHR.getResponseHeader('Content-Type');

            // content-type не тот что мы ожидали
            if (!_isCorrectContentType(ajaxOptions, responseDataType)) {
                console.log('Response content type does not meet the expected');
                pts.stiker.create({
                    msg: "Ошибка обработки ajax запроса. Возможно ошибка на сервере",
                    title: 'Ошибка',
                    type: 'error'
                });
            }

            if(json && json.error) {
                pts.stiker.create({
                    msg: json.error,
                    title: 'Ошибка',
                    type: 'error'
                });
            } else {
                pts.stiker.create({
                    msg: text,
                    title: 'Ошибка',
                    type: 'error'
                }); // @todo послать в лог на сервер, что херню в ответе получили
            }
        };

        var _isCorrectContentType = function(ajaxOptions, responseDataType){
            var re = new RegExp(ajaxOptions.dataType);
            return re.test(responseDataType);
        };

        var _incProgress = function(){
            if(!ajaxRequestActive++) {
                $body.addClass('ajax');
            }
        };

        var _decrProgress = function(){
            if(!--ajaxRequestActive) {
                $body.removeClass('ajax');
            } else if (ajaxRequestActive < 0) {
                ajaxRequestActive = 0;
                $body.removeClass('ajax');
            }
        };

        var _init = function(){
            pts.loader.loads(['stiker.pts.js', 'stiker.pts.css'], _on);
        };

        return {
            on: _on,
            off: _off,
            submit: _submit,
            clearEmpty: _clearEmpty,
            eval: _eval,
            init: _init
        };
    };

    pts.ajax = new _Ajax();
})(jQuery, pts);


$(document).ready(function(){
    pts.ajax.init();
});
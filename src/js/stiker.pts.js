(function($, pts) {
    'use strict';

    var Stiker = function() {
        var _activeCount = 0,
            _id = 'pts_stikers',
            _wrapper,

            /**
             * @params {Object} stiker
             * @param {String} stiker.msg
             * @param {String} [stiker.title]
             * @param {String} [stiker.type]
             * @param {int} [stiker.delay]
             */
            _create = function(stiker) {
                stiker = $.extend({
                    msg: '',
                    title: 'Инфо',
                    type: 'info',
                    delay: 12 // sec
                }, stiker);

                var html = "<div class='stiker stiker_" + stiker.type + "'>";
                html += "<h3 class='stiker_title'>" + stiker.title + "</h3>";
                html += stiker.msg ? "<p class='msg'>" + stiker.msg + "</p>" : '';
                html += "</div>";

                var $stiker = $(html);
                $stiker.data('stiker', stiker);

                _add($stiker);
                setTimeout(function(){
                    _show($stiker);
                }, 300);

                _removeByDelay($stiker);

                return $stiker;
            },

            /**
             * @param {String} error
             */
            _error = function(error) {
                return _create({
                    msg: error,
                    title: 'Ошибка',
                    type: 'error',
                    delay: 0
                })
            },

            /**
             * @param event
             * @param {Object} stiker
             */
            _createFromEvent = function(event, stiker) {
                _create(stiker);
            },

            _getWrapper = function() {
                if (!_wrapper) {
                    _wrapper = $('#'+ _id);
                }

                return _wrapper;
            },

            /**
             * @param {jQuery} $stiker
             */
            _removeByDelay = function($stiker) {
                var delay = $stiker.data('stiker').delay;
                if (delay) {
                    var timeoutId = setTimeout(function() {
                        _hideAndRemove($stiker);
                    }, delay * 1000); // msec

                    $stiker.data('timeoutID', timeoutId);
                }
            },

            /**
             * @param {jQuery} $stiker
             */
            _add = function($stiker) {
                _getWrapper().append($stiker);
            },

            /**
             * @param {jQuery} $stiker
             */
            _show = function($stiker) {
                _activeCount += 1;
                _showRemoveAll();
                $stiker.addClass('show');
            },

            _showRemoveAll = function() {
                if (_activeCount > 1) {
                    _getWrapper().children(".removeAll").addClass('show');
                }
            },

            /**
             * @param {jQuery} $stiker
             */
            _remove = function($stiker) {
                var timeoutID = $stiker.data('timeoutID');
                if (timeoutID) {
                    clearTimeout(timeoutID);
                }

                $stiker.remove();
                _activeCount += -1;

                if (_activeCount < 2) {
                    _hideRA();
                }
            },

            _hideAndRemove = function($stiker){
                $stiker.addClass('remove');
                var h = $stiker.height();
                $stiker.css('margin-top', -h); //effect slideUp for dinamyc height
                setTimeout(function() {
                    _remove($stiker);
                }, 1000)
            },


            _hideRA = function() {
                _getWrapper().children('.removeAll').removeClass('show');
            },

            _handlers = {
                removeOne: function() {
                    var $stiker = $(this).parent();
                    if (!$stiker.hasClass('removeAll')) {
                        _hideAndRemove($(this).parent());
                    }
                },
                removeAll: function() {
                    if(_activeCount > 0) {
                        _hideRA();
                        _getWrapper().find('.stiker').not('.removeAll, .stiker_redirect, .remove').each(function(i) {
                            _hideAndRemove($(this));
                        });
                    }
                }
            },

            _on = function() {
                // Удалеят все стикеры, при нажатии на "Удалить все"
                $(document).on('click', '#'+_id+' .removeAll', _handlers.removeAll);
                // Удаляет стикер при щелчке на него
                $(document).on('click', '#'+_id+' .stiker_title', _handlers.removeOne);
                $(document).on('pts.stiker.create', _createFromEvent);

                $(document).trigger('pts.module.on', {name: 'stiker'});
            },

            _off = function() {
                $(document).off('click', '#'+_id+' .removeAll', _handlers.removeAll);
                $(document).off('click', '#'+_id+' .stiker_title', _handlers.removeOne);
                $(document).off('pts.stiker.create', _createFromEvent);

                $(document).trigger('pts.module.off', {name: 'stiker'});
            },

            _destroy = function() {
                _getWrapper().remove();
                _off();
            },

            _init = function() {
                if ($(_id).length) {
                    return;
                }

                $("body").append("<div id='"+_id+"'><div class='stiker removeAll'><div class='stiker_title'>Удалить все</div></div></div>");
                _on();
            };

        return {
            on: _on,
            off: _off,
            create: _create,
            destroy: _destroy,
            init: _init,
            error: _error
        };
    };

    var instance = new Stiker();
    pts.stiker = function(stiker){instance.create(stiker)};
    for (var attr in instance) {
        if (instance.hasOwnProperty(attr)){
            pts.stiker[attr] = instance[attr];
        }
    }
    pts.stiker['prototype'] = Object; // @todo посоветоваться как правильно

})(jQuery, pts);

$(document).ready(function(){
    pts.stiker.init();
});
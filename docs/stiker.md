# Уведомления в виде стикеров

# Demo
http://codepen.io/alexots/details/EaaBRV/

#EN
...

#RU

[Содержание - https://github.com/alexpts/web-pts/blob/master/README.md]

Модуль предоставляет объект для работы с всплывающими подсказками в виде закрепленных в верхней правой части экрана стикеров - pts.stiker.

### Методы 
pts.stiker.create - создает и отображает новое уведомление

`````javascript
    /**
     * @params {Object} stiker
     * @param {String} stiker.msg - сообщение
     * @param {String} [stiker.title] - заголовок
     * @param {String} [stiker.type] - тип/класс [info, error, success] влияет на вид уведомления
     * @param {int} [stiker.delay] - время, через которое стикер сам удалится
     */
    create = function(stiker) {
        stiker = $.extend({
            msg: '',
            title: 'Инфо',
            type: 'info',
            delay: 15
        }, stiker);
        
        
    pts.stiker.create({
        title: "Запрос обработан",
        msg: "Документ успешно добавлен в коллекцию",
        type: "success"
    });
`````

#####pts.stiker.on
Включает обработчики событий уведомлений. По умолчанию они включаются при создании первого экземпляра объекта уведомленией. Требуется на случай, если вы используете pts.stiker.off.

#####pts.stiker.off
Отключает обработчики событий модуля stiker. Вернуть обработчики можно методом pts.stiker.on

#####pts.stiker.destroy
Отключает обработчики событий модуля stiker. Вычищает из DOM все, что было добавлено модулем stiker.

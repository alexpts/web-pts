# Async loader javascript/css



#EN
...

#RU

[Содержание - https://github.com/alexpts/web-pts/blob/master/README.md]

Асинхронный кроссдоменный загрузчик статических ресурсов. Позволяет подгружать зависимости, управлять имеющимися зависимостями и вызывать функции обратного вызова в момент загрузки зависимости(ей). Что позволяет ускорить GUI сайта, сократив время загрузки страницы и время на разбор и применение неиспользуемых частей js и css.


[1. Иницилизация загрузчика](#init)  
[2. Загрузка скрипта](#load)  
[3. Загрузка зависимостей](#loads)  
[4. События](#events)  
[5. Установка](#install)  
[6. Преописание модулей](#description)  

## Загрузка скриптов

<a name="init"></a>
##### 1. Иницилизаци загрузчика

Объект загрузчика доступен сразу после подключения модуля loader в свойсвте pts.loader.
Если по каким-то причинам одной копии загрузчика не хватает или нужно установить другие параметры в загрузчик, то мохно создать новый объект загрузчика вызвав метод constructor
`````javascript
 var Loader = new pts.loader.constructor();
 pts.loader = new pts.loader.constructor({addFromPage:false}); // перепишет старый загрузчик новым
`````

Конструктор может принять объект с параметрами:

    moduleDir [""] - пусть для поиска подулей по относительному пути по умолчанию
    addFromPage [true] - добавляет в момент иницилизации зпгрузчика все, имеющиеся на странице, js и css в загрузчик
    components [[]] - настройки url или relUrl по умолчанию для модуля

##### Пример иницилизации собственной копии загрузчика

```javascript
    var Loader = pts.loader.constructor({
        moduleDir: '/modules',
        addFromPage: false
    });
```

*Это делать не обязательно и можно работать с существующем загрузчиком pts.loader;*

<a name="load"></a>
##### 2. Пример загрузки одиночного скрипта:

```javascript
    Loader.load({String}name, {Object}[params], {Function}[callback]);

    // загрузка по относительному пути (относительно moduleDir)
    Loader.load('bootstrap.js');  // moduleDir/bootstrap.js
    Loader.load('bootstrap.css'); // moduleDir/bootstrap.css
    Loader.load('theme.css', {relUrl: 'themes/'});  moduleDir/themes/theme.css

    //кросдоменная загрузка по полному пути
    Loader.load('http://yandex.st/bootstrap/3.1.1/js/bootstrap.min.js');

    // кросдоменная загрузка
    Loader.load('bootstrap.js', {
        url: 'http://yandex.st/bootstrap/3.1.1/js/bootstrap.min.js'
    });
```

Параметр ***params*** полностью поддерживает все опции пердоставляемые jQuery.ajax(***params***) [http://stage.api.jquery.com/jQuery.ajax/];
Поэтому можно повесить дополнительынй callback на любое состояние запроса и использовать почти все возможности ajax.

##### Вызов callback после загрузки скрипта

```javascript
    Loader.load('bootstrap.js', function(){
        alert('bootstrap is ready!');
    });
```

##### Тонкое управление (сложный уровень, не рекомендуется для использования)

```javascript
    Loader.load('bootstrap.js', {
        success: function(data, textStatus, jqXHR ){
            console.log('seccond  success callback');
        },
        complete: function(jqXHR, textStatus ){
            console.log('complete callback');
        },
        statusCode: {
            201: function(){
                console.log('last collback  (status=201)');
            }
        }
    }, function(){
        console.log('first success callback');
    });
```

<a name="loads"></a>
##### 3. Пимер загрузки нескольких зависимостей:

```javascript
    Loader.loads({Array}modules, {Function}[callback]);

    var dojoModule = {
        name: 'dojo',
        params: {
            url: 'http://yandex.st/dojo/1.9.1/dojo/dojo.js'
        }
    };
    Loader.loads([
        'bootstrap.js',
        'bootstrap.css',
        'http://yandex.st/d3/3.4.5/d3.js',
        dojoModule
        ],
        function(){
            console.log('after load all callback');
    });
```

Я так и не смог однозначно определиться с тербованиями для автоматической подгрузки зависимостей из-за специфики архитектуры проекта, поэтому предоставил всего лишь 1 метод loads, который скорее всего пригодится при реализации автоматической подгрузки зависимостей в рамках той или иной архитектуры проекта.

<a name="events"></a>
##### 4. События
Загрузчик выкидывает на элементе *document* событие ***Loader.load***, передавая в обработчик 3 параметра [name, extension, url]

```javascript
    $(document).on('Loader.load', function(event, name, extension, url){
        ...
    });
```

<a name="install"></a>
##### 5. Установка

С помощью bower

    bower install web-pts



<a name="description"></a>
##### 6. Преопиание модулей

Чтобы повторно не описывать зависиости их можно описать 1 раз и передать в констуктор загрузчика параметром ***components***

```javascript
    var Loader = new Loader({
        conponents: {
            'jquery-ui.js': {
                url: 'http://yandex.st/jquery-ui/1.10.4/jquery-ui.js'
            },
            'swfobject.js': {
                relUrl: 'bower_components/swfobject/swfobject.js'
            }
        }
    });
```

Или добавить описание через метод ***addComponent({String} name, {Object}params)***

```javascript
    Loader.addComponent('underscore.js', {url: 'http://yandex.st/underscore/1.6.0/underscore.js'});
```

Это позволит хранить загрузчику инфомрацию о путях по умолчанию, если в момент загрузки было передано просто короткое имя, без параметров.

Например запрос
```javascript
    Loader.load('jquery-ui.js');
```

Выполнит запрос не по относительнмоу пути согласно moduleDir, а по адресу url, который был в преописании в components

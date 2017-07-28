angular.module('app')
    .directive('dropDownTable', function () {
        return {
            link: function (scope, element) {
                var isOpen = false;
                element.bind('click', function (event) {
                    if (['input', 'button','i','span'].indexOf(event.target.tagName.toLowerCase()) != -1) return;
                    isOpen = !isOpen;
                    if (isOpen) {
                        element.addClass('open');
                    } else {
                        element.removeClass('open');
                    }
                });

            }
        };
    })
    .directive('whenScrolled', function () {
        return {
            link: function(scope, elm, attr) {
                var raw = elm[0];
                elm.bind('scroll', function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attr.whenScrolled);
                    }
                });
            }
        };
    })
    .directive('draggable', ['$document', function($document) {
        return function(scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element.css({
                position: 'relative',
                cursor: 'move'
            });

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    }])
    .directive('zoomImg', function () {
        return {
            link: function (scope, element) {
                element.bind('click', function (event) {
                    if (['img'].indexOf(event.target.tagName.toLowerCase())!=-1){
                        window.location.href = event.target.currentSrc;
                    }
                });
            }
        };
    })
    .directive('imgLoad', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.imgLoad);
                elem.on('load', function (event) {
                    scope.$apply(function() {
                        fn(scope, { $event: event });
                    });
                });
            }
        };
    }])
    .directive('ngEcharts',[function(){
        return {
            link: function(scope,element,attrs,ctrl){
                function refreshChart(){
                    var theme = (scope.config && scope.config.theme)
                        ? scope.config.theme : 'default';
                    var chart = echarts.init(element[0],theme);
                    if(scope.config && scope.config.dataLoaded === false){
                        chart.showLoading();
                    }

                    if(scope.config && scope.config.dataLoaded){
                        chart.setOption(scope.option);
                        // chart.resize();
                        window.addEventListener("resize",function () {
                            chart.resize();
                        })
                        chart.hideLoading();
                    }

                    if(scope.config && scope.config.event){
                        if(angular.isArray(scope.config.event)){
                            angular.forEach(scope.config.event,function(value,key){
                                for(var e in value){
                                    chart.on(e,value[e]);
                                }
                            });
                        }
                    }
                };

                //自定义参数 - config
                // event 定义事件
                // theme 主题名称
                // dataLoaded 数据是否加载

                scope.$watch(
                    function () { return scope.config; },
                    function (value) {if (value) {refreshChart();}},
                    true
                );

                //图表原生option
                scope.$watch(
                    function () { return scope.option; },
                    function (value) {if (value) {refreshChart();}},
                    true
                );
            },
            scope:{
                option:'=ecOption',
                config:'=ecConfig'
            },
            restrict:'EA'
        }
    }])
    .directive('infiniteScroll', ['$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {                  //接收并返回触发加载更多的距离
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {
                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();//所选中元素展示框的高度 + 滑动条向下滑动的距离
                    elementBottom = elem.offset().top + elem.height();    //页面的总长度
                    remaining = elementBottom - windowBottom;
                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) { //达到可加载距离
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            if (remaining <= 50 ) {
                                scope.loadMore();                //在此调用加载更多的函数
                            }
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);                           //监控scroll滑动则运行handler函数
                scope.$on('$destroy', function () {                      //离开页面则关闭scroll与handler的绑定
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
    }])
    .directive("judgeRoll", [function() {
        return {
            link: function(scope,element,attr){
                if(scope.$last == true){
                    var parentdiv = element.parent().parent().parent()[0];
                    if(parentdiv){
                        var tableHeight = parentdiv.scrollHeight-19;
                        var parentDivHeidth = parentdiv.offsetHeight;
                    }
                    if(tableHeight >= parentDivHeidth){
                        scope.$emit('roll');
                    }else{
                        scope.$emit('noroll');
                    }
                }
            }
        }
    }]);
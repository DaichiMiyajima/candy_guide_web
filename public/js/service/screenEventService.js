/*global candy, angular, Firebase */
'use strict';

candy.service('screenEventService', function (SCREEN) {
    //Resize for SmartPhone
    this.resizeBar = function (resize,$event) {
        if(resize == "editor-resizer" || resize == "small material-icons"){
            //bodyの高さ(window.innerHeight)
            var height = $event.originalEvent.touches[0].clientY;
            var mapHeight = height - $('.nav-wrapper').height();
            var flexBoxHeight = (window.innerHeight - $('.editor-resizer').height() - height - $('.nav-wrapper').height());
            //Topを超えたときの処理
            if((flexBoxHeight + $('.editor-resizer').height() + $('.nav-wrapper').height() + $('.messageInputArea').height())  > window.innerHeight){
                mapHeight = 0;
                flexBoxHeight = window.innerHeight - ($('.editor-resizer').height());
            }
            //Bottomを超えたときの処理
            if((window.innerHeight - height - $('.editor-resizer').height()) < $('.messageInputArea').height()){
                mapHeight = window.innerHeight - $('.editor-resizer').height() - $('.nav-wrapper').height() - $('.messageInputArea').height();
                flexBoxHeight = $('.messageInputArea').height();
            }
            return {mapHeight,flexBoxHeight};
        }
    }
    //Resize for PC
    this.resizeBarPc = function (resize,$event) {
        if((resize == "editor-resizer" || resize == "small material-icons") && $event.which == 1){
            //bodyの高さ(window.innerHeight)
            var height = $event.clientY;
            var mapHeight = height - $('.nav-wrapper').height();
            var flexBoxHeight = (window.innerHeight - $('.editor-resizer').height() - height - $('.nav-wrapper').height());
            //Topを超えたときの処理
            if((flexBoxHeight + $('.editor-resizer').height() + $('.nav-wrapper').height() + $('.messageInputArea').height()) > window.innerHeight){
                mapHeight = 0;
                flexBoxHeight = window.innerHeight - ($('.editor-resizer').height());
            }
            //Bottomを超えたときの処理
            if((window.innerHeight - height - $('.editor-resizer').height()) < $('.messageInputArea').height()){
                mapHeight = window.innerHeight - $('.editor-resizer').height() - $('.nav-wrapper').height() - $('.messageInputArea').height();
                flexBoxHeight = $('.messageInputArea').height();
            }
            return {mapHeight,flexBoxHeight};
        }
    }
    //Onfocus Textarea
    this.onFocus = function () {
        //only for iphone or ipad
        if(navigator.userAgent.indexOf("iPad") > 1 || navigator.userAgent.indexOf("iPhone") > 1){
            $('.messageInputAreaDiv').css('height', 130 + "px");
            if($('.flex-box').height() < $('.messageInputArea').height()){
                var mapHeight = window.innerHeight - $('.editor-resizer').height() - $('.messageInputArea').height() - $('.nav-wrapper').height();
                var flexBoxHeight = $('.messageInputArea').height() + $('.editor-resizer').height();
                $('#candy_map_tab').css('min-height', mapHeight + "px");
                $('#candy_map_tab').css('max-height', mapHeight + "px");
                $('.flex-box').css('min-height', flexBoxHeight + "px");
                $('.flex-box').css('max-height', flexBoxHeight + "px");
            }
        }
    }

    //Onfocus Textarea
    this.onBlur = function () {
        $('.messageInputAreaDiv').css('height', SCREEN.messageInputHeight + "px");
    }
})
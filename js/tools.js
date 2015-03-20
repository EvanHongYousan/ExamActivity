/**
 * Created by yantianyu on 2015/3/17.
 */
var JSNativeBridge = (function(){
    var _handler = null;
    function _send(id, content) {
        uplusInterface.postWebpageMessage(id, encodeURIComponent(JSON.stringify(!content ? '' : content)));
    }

    function _receive(msg, msg_content) {
        _handler(msg, msg_content);
    }

    function _addHandler(handler) {
        _handler = handler;
    }

    return {
        send: function(id, content) {
            _send(id, content);
        },

        receive: function(msg_id, msg_content) {
            if(msg_content==''||msg_content=="null"){
                msg_content=null;
            }
            try {
                _receive(msg_id, JSON.parse(decodeURIComponent(msg_content)));
            } catch(e) {
                alert("decodeURIComponent()调用异常");
            }
        },
        postNativeMessage: function() {
            JSNativeBridge.receive.apply(this, arguments);
        },

        init: function(handler) {
            if(!window.uplusInterface) {
                uplusInterface = {};
                uplusInterface.postWebpageMessage = function(id, content) {
                    var temp=window.location.href.split("&msg_id")[0];
                    window.location.href =temp + '&msg_id=' + id + '&msg_content=' + content;
                }
            }
            _addHandler(handler);
        }
    }
}());
var tools = {
    // 激活当前一个的class共用方法
    activeOne : function(one, all, active) {
        for (var i = 0; i < all.length; i++) {
            all[i].className = '';
        }
        one.addClass(active);
    },

    getUserAgent: function() {
        function isIOS() {
            return /iphone/i.test(userAgent) || /ipod/i.test(userAgent) || /ipad/i.test(userAgent);
        }
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('micromessenger') > 0) {
            return 'weixin' + (isIOS() ? '_ios' : '');
        } else if (userAgent.indexOf('android') > 0) {
            return 'android';
        } else if (isIOS()) {
            return 'ios';
        }
        return 'pc';
    },

    isMomoClient: function() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        return /uplusandroid/i.test(userAgent) || /uplusiphone/i.test(userAgent);
    },

    getParameter: function() {
        var parameter = null;
        items = window.location.search.substring(1).split('&');
        for(var i = 0; i < items.length; i++) {
            item = items[i];
            if(item && item.length > 0) {
                parts = item.split('=');
                if(parts.length != 2) continue;
                if(parts[0] == 'parameter') {
                    parameter = JSON.parse(decodeURIComponent(parts[1]));
                }
            }
        }
        return parameter;
    },

    isOlderVersion: function() {
        return !common.getParameter();
    }

};

var navbar = (function(){
    function showSrlCard(){
        $(".serialCard").animate({
            "top":50+parseInt($(".navbar").css("top"))+"px"
        },500,'ease-out');
        $(".mask").show().animate({
            "opacity":"0.5"
        });
    }
    function hideCard(){
        $(".serialCard").animate({
            "top":"-900px"
        },500,'ease-in');
        $(".mask").animate({
            "opacity":"0"
        },500,'ease-out',function(){
            $(".mask").hide();
        });
    }
    function showDwnCard(){
        $(".navbar").animate({
            "top":"72px"
        },500,'ease-out',function(){
            $(".download_info").animate({
                "top":"0"
            });
        });
        $("body").css({
            "padding-top":"122px"
        });
    }
    function hideDwnCard(){
        $(".download_info").animate({
            "top":"-100px"
        },500,'ease-out',function(){
            $(".navbar").animate({
                "top":"0"
            });
        });
        $("body").css({
            "padding-top":"50px"
        });
    }
    return {
        preQueEv:function(){
            $(".navbar .preQue").click(function(){
                location.href = globaldata.preQueURL;
            });
        },
        nextQueEv:function(){
            $(".navbar .nextQue").click(function(){
                location.href = globaldata.nextQueURL;
            });
        },
        navBtnEv:function(){
            $(".navBtn").click(function(){
                showSrlCard();
            });
        },
        maskEv:function(){
            $(".mask").click(function(){
                hideCard();
            });
            $(".mask").on("touchmove",function(){
                return false;
            });
        },
        srlCardEv:function(){
            $(".serialCard").on("touchmove",function(){
                return false;
            });
        },
        dwnlEv:function(){
//            if($(".questionType").attr("type") == 4 || $(".questionType").attr("type") == 5){
//                return;
//            }
            $(".dwnlScler")[0].onscroll = function() {
                if (document.body.scrollTop < 5) {
                    if($(".navbar").css("top") == "0" || $(".navbar").css("top") == "0px"){
                        showDwnCard();
                    }
                }else {
                    if($(".download_info").css("top") == "0" || $(".download_info").css("top") == "0px"){
                        hideDwnCard();
                    }
                }
            }
        },
        init:function(){
            navbar.preQueEv();
            navbar.nextQueEv();
            navbar.navBtnEv();
            navbar.maskEv();
            navbar.srlCardEv();
            //avbar.dwnlEv();
        }
    };
})();
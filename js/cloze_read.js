var cfg, common, ev, main, data, rightScore=0,//rightSelectedIndex, userSelectedIndex
isAnalyse = false;
cfg = {
    style : {
        // 正确错误的样式
        wrong : 'selectWrong',// 'color:#fff;background:#f05836;box-shadow:inset
        // 1px 1px 1px #cc6633',
        right : 'selectRight',// 'color:#fff;background:#4cae68;box-shadow:inset
        // 1px 1px 1px #339966',
        iptWrong : {
            'borderColor' : '#323232',
            'color' : '#f05836'
        },
        iptRight : {
            'borderColor' : '#4cae68',
            'color' : '#1d4b2a'
        },
        active : 'active'
    }
};

common = {
    // 激活当前一个的class共用方法
    activeOne : function(one, all, active) {
        for (var i = 0; i < all.length; i++) {
            all[i].className = '';
        }
        one.addClass(active);
        $(".underline > span").eq($(".questions > section").not(".none").index()).attr("class","finished activeMark");
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
    }
};
ev = {
    init : function() {
        ev.liClick();
        ev.buttonClick();
        ev.spanClick();
        ev.questionSwitch();
        ev.accordion();
        ev.initDownload();
    },

    initDownload : function() {
        var downloadUrl = 'http://dl.ztmomo.com/app/ztmomo/android/028/ztmomo.apk';
        if (common.getUserAgent() == 'weixin_ios') {
            downloadUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.mainbo.uplus";
        } else if (common.getUserAgent() == 'ios') {
            downloadUrl = 'https://itunes.apple.com/cn/app/zhen-ti-mo-mo/id899192770?l=zh&ls=1&mt=8';
        } else if (common.getUserAgent() == 'weixin') {
            $(".download_info").before('<p style="text-align: center;color:#2ac99a;">请在【浏览器中打开】下载</p>');
        }
        $(".download").bind("click", function() {
            window.location.href = downloadUrl;
        });
    },
    // 返回图片结果
    initImg : function() {
        $('body').delegate('img', 'click', function() {
            var _this = this;
            var imgFile = this.src;
            if (!this.show) {
                if (imgFile.indexOf('file://') == 0) {
                    imgFile = imgFile.substr('file://'.length);
                }
                ;

                if (imgFile.indexOf('?')) {
                    imgFile = imgFile.split('?')[0]
                }
                ;
                // 防止快速重复点击img
                this.show = 1;
                main.opt&&main.opt.zoomImg&&main.opt.zoomImg(imgFile);
                setTimeout(function() {
                    _this.show = 0;
                }, 2000)
            }
        })
    },
    // 手风琴
    accordion : function() {
        $('.accordion h4 p').bind('click', function() {
            // this.classList.toggle('p_hover');
            var _this = $(this);
            _this.toggleClass('p_hover');
            $(this.parentNode.nextElementSibling).toggle();
        });
        // 用户点击最后一个选项卡的时候要展示其选项卡下所有内容，否则用户不知道下面有东西;
        // TODO这个因为一个元素绑定了两事件，所以在FF内核中可能存在执行顺序问题
        $(".accordion").last().find("h4 p").bind(
            "click",
            function() {
                !$(this).hasClass("p_hover")
                && (document.body.scrollTop = 10000000000000);
            })
    },
    liClick : function(arg) {
        function fn(ev) {
            var _this=this;
            if (isAnalyse) {
                return;
            }
            ;
            main.makeResult($(this), ev);
            setTimeout(function(){
                $(_this).parents(".content").parent().triggerHandler("swipeLeft");
            },500);
            //main.analysis();
        }
        ;
        if (arg) {
            $('.answer li').unbind('click', fn);
        } else {
            $('.answer li').bind('click', fn);
        }
    },
    buttonClick:function(){
        $("#submit").click(function(){
            main.analysis();
            $("article.page, .questions.page").hide();
            $(".submitDiv").remove();
            $(".serialNumStrip").hide();
            $(".cheerDiv").show();
            $(".cheerDiv p").html("你答对了"+rightScore+"道题");
        });
        $("#showAnalysis").click(function(){
            $("article.page, .questions.page").show();
            $("section.submitDiv").addClass("none");
            $(".serialNumStrip").show();
            $(".questions.page section").eq(0).removeClass("none");
            $(".cheerDiv").addClass("none");
            main.focusBlank(0);
        });
    },

    spanClick:function(){
        $("#reload").click(function(){
            window.location.reload();
        });
        $(".underline > span").click(function(){
            main.focusBlank($(".underline > span").index(this));
            $(".questions > section").addClass("none");
            $(".questions > section").eq($(".underline > span").index(this)).removeClass("none").css({
                'opacity':'0'
            }).animate({
                'opacity':'1'
            },500,'ease-out');
        });
    },
//    questionSwitch:function(){
//        var moveStart= 0,moveEnd=0,distance=0;
//        $(".questions > section").on("touchstart",function(e){
//            moveStart=e.touches[0].clientX;
//            moveEnd=moveStart;
//        }).on("touchmove",function(e){
//            moveEnd=e.touches[0].clientX;
//            if(Math.abs(moveEnd-moveStart)<50){
//                return;
//            }
//            $(this).css({
//                "position":"relative",
//                "left":(moveEnd-moveStart)+"px"
//            });
//        }).on("touchend",function(e){
//            distance=moveEnd-moveStart;
//            if(Math.abs(distance)>100){
//                $(this).css({
//                    'position':'static',
//                    'left':'0'
//                });
//                if(distance>0){
//                    if($(this).prev().length>0) {
//                        $(this).addClass("none").prev().removeClass("none").css({
//                            'opacity':'0'
//                        }).animate({
//                            'opacity':'1'
//                        },500,'ease-out');
//                        main.focusBlank($(".questions > section").index($(this).prev()[0]));
//                    }
//                }else{
//                    if($(this).next().length>0) {
//                        $(this).addClass("none").next().removeClass("none").css({
//                            'opacity':'0'
//                        }).animate({
//                            'opacity':'1'
//                        },500,'ease-out');
//                        main.focusBlank($(".questions > section").index($(this).next()[0]));
//                    }
//                }
//            }else{
//                $(this).animate({
//                    'left':'0'
//                },200,'ease-out',function(){
//                    //回调函数。animate方法没给回调函数传参数。
//                });
//            }
//            moveStart=0;
//            moveEnd=0;
//        });
//    }

    questionSwitch:function(){
        $(".questions > section").on("swipeLeft",function(){
            if($(this).next().length <= 0){
                return;
            }
            $(this).addClass("none").next().removeClass("none").css({
                'opacity':'0'
            }).animate({
                'opacity':'1'
            },500,'ease-out');
            main.focusBlank($(".questions > section").index($(this).next()[0]));
        }).on("swipeRight",function(){
            if($(this).prev().length <= 0){
                return;
            }
            $(this).addClass("none").prev().removeClass("none").css({
                'opacity':'0'
            }).animate({
                'opacity':'1'
            },500,'ease-out');
            main.focusBlank($(".questions > section").index($(this).prev()[0]));});
    }

};
main = {
    // 美化Dom
    rangeDom : function() {
        var a = $('#topic_header'), b = a.next();
        b && a.prependTo(b);
        $('input').before('<div class="height0"></div>');

        if (main.is_analysis) {
            // 清除在答题解析里面头部和尾部的多余P标签
            var aDiv = $('.contentInfo .accordion div');
            aDiv.forEach(function(e) {
                    try {
                        var text = $(e).text().trim();
                        if (text === "null" || text == "")
                            $(e).closest(".accordion").hide();
                    } catch (e) {
                    }
                    var aP = $(e).find('p');
                    for (var i = aP.length - 1; i >= 0; i--) {
                        if (aP[i].innerHTML === ''
                            || aP[i].innerHTML === '&nbsp;') {
                            aP[i].style.display = 'none'
                        } else {
                            break;
                        }
                    };
                });
            aDiv
                .forEach(function(e) {
                    var aP = $(e).find('p');
                    for (var i = 0; i < aP.length; i++) {
                        if (aP[i].innerHTML === ''
                            || aP[i].innerHTML === '&nbsp;') {
                            aP[i].style.display = 'none'
                        } else {
                            break;
                        }
                    }
                });
        }

    },
    // 调整图片大小
    resizeImg : function() {
        function Img(aObj, callback) {
            this.obj = aObj;
            this.callback = callback;
        }
        ;
        Img.prototype = {
            loadImg : function() {
                var _this = this;
                $.each(_this.obj, function(i, e) {
                    if (i == 0) {
                        return
                    };
                    //console.log(e.complete)
                    if(e.complete)return _this.callback(e)
                    e.onload = function() {
                        _this.callback(e);
                    };
                });
            }
        };

        (new Img($('img'), function(e) {
            var h = parseInt(window.getComputedStyle(e, null).height);
            e.style.position = 'static';
            e.style.height = (h / 2 + 4) + "px";
            e.style.width = "auto";
        })).loadImg();
    },
    // 获取用户选择
    makeResult : function(target, ev) {
        var rightJson = '', index, right;
        common.activeOne(target.find('a'), target.parent().find('a'), 'active');
    },

    analysis : function() {
        isAnalyse=true;
        $(".questions > section").each(function(){

            var rightSelectedIndex=$(this).find('.answer ul li.right').index();
            var userSelectedIndex=$(this).find('.active').parents('li').index();

            var right = null;

            if(userSelectedIndex == rightSelectedIndex && rightSelectedIndex != -1){
                right = true;
                rightScore++;
                $(".underline > span").eq($(".questions > section").index(this)).attr("class","SelectRight")
            }else {
                right = false;
                $(".underline > span").eq($(".questions > section").index(this)).attr("class","SelectWrong")
            }

            $(this).find(".answer li a").each(function(i, e) {
                if (i == rightSelectedIndex) {
                    $(e)[0].className = cfg.style.right;
                }
                if (!right && i == userSelectedIndex) {
                    $(e)[0].className = cfg.style.wrong;
                }
            });

            $(this).find('.accordion > article > div').each(function(i, e) {
                if (e.innerHTML == '') {
                    $(e).closest('.accordion').remove();
                }
            });

            $(this).find(".none").removeClass("none");

        });
        $('.answer li').unbind();
    },

    focusBlank:function(index){
        if($(".questionType").attr("type")=="4"){ //questionType为4表明这是阅读理解题,则文章部分没有必要滑动
            return;
        }
        $(".underline > span").removeClass("Active").removeClass("activeMark");
        if(!isAnalyse && !$(".underline > span").eq(index).hasClass("finished")){
            $(".underline > span").eq(index).attr("class","Active");
        }else{
            $(".underline > span").eq(index).addClass("activeMark");
        }

        if(index < $(".underline > span").length) {
            $(".serialNumStrip span.curQueNum").text(index + 1);
        }

        var pageOffset=$("article.page section.content").offset().top;
        var spanOffset=$(".underline > span").eq(index).offset().top;
        //alert(spanOffset-pageOffset);
        $("article.page").scrollTo({
            endY: spanOffset-pageOffset-15-$(".download_info").height(),        //15 是 .question 带的 15px margin
            duration: 250,
            callback: function() {
            }
        });
    },

    // 入口
    load : function() {
        main.rangeDom();
        //main.showQuestion();

        main.focusBlank(0);
        if($(".questionType").attr("type")=="4"){ //questionType为4表明这是阅读理解题,去除序号
            $(".serialNumStrip span").css("opacity","0");
        }else {
            $(".serialNumStrip .queLen").text($(".underline > span").length);
        }

        ev.init();

        main.resizeImg();
        ev.initImg();
        window.onload = function() {
        };
    }
};

$(function(){
    main.load();
});
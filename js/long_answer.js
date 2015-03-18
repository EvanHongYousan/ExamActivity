var cfg, common, ev, main, data, rightSelectedIndex, userSelectedIndex
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
        for (var i = 0; i < all.length; i++)
            all[i].className = '';
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
    }
};
ev = {
    init : function() {
        ev.showAnylysisPClick();
        ev.accordion();
        ev.initDownload();
    },

    initDownload : function() {
        if(tools.isMomoClient()){
            $(".download_info").hide();
            return;
        }
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
    showAnylysisPClick:function(){
        $(".showAnalysis span").click(function(){
            $(".contentInfo").removeClass("none");
            $(".showAnalysis").addClass("active");
            $(".showAnalysis p").text("题目解析");
        });
    }

};
main = {
    // 判断显示界面
    judge : function() {
        try {
            var aIpt = [], eTag = $(".questionType"), sType = eTag.attr("type")
                .trim();
            // 判断如果是填空题的话
            switch (sType) {
                case '0':
                    main.problemType = 0; // 单选题
                    break;
                case '1':
                    main.problemType = 1; // 填空题
                    $('.answer').hide(); // 填空题必须隐藏答案
                    break;
                case '2':
                    main.problemType = 2; // 阅读题
                    break;
            }
            ;
        } catch (e) {
        }
    },
    // 美化Dom
    rangeDom : function() {
        var a = $('#topic_header'), b = a.next();
        b && a.prependTo(b);
        $('input').before('<div class="height0"></div>');

        if (main.is_analysis) {
            // 清除在答题解析里面头部和尾部的多余P标签
            var aDiv = $('.contentInfo .accordion div');
            aDiv
                .forEach(function(e) {
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
                    }
                    ;
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
        $('img').each(function(index, elem) {
            if(/images/.test($(this).attr("src"))){
                return;
            }
            var img = new Image();
            img.onload = function() {
                elem.style.position = 'static';
                elem.style.height = (img.height / 2 + 4) + 'px';
                delete img;
            }
            img.src = elem.src;
        })
    },
    // 获取用户选择
    makeResult : function(target, ev) {
        var rightJson = '', index, right;
        // 正确的索引
        rightSelectedIndex = $('.answer ul li.right').index();// $('.answer ul
        // li').toArray().map(function(e){
        // return
        // $(e).is('.right')});
        // $('body')[0].innerHTML += ($('a.active').closest('li').index()
        // +'_'+rightSelectedIndex)
        // main.gestureGuide();
        // 用户选择的索引
        userSelectedIndex = target.index();// $('.answer ul li span
        // :first-child').toArray().map(function(e){
        // return $(e).is('.active')})
        common.activeOne(target.find('a'), $('.answer').find('a'), 'active');
    },

    analysis : function() {
        $("#real_type").css("background", "red");
        $(".contentInfo").css("opacity",1).css("position","static");
        isAnalyse = true;
        var right = userSelectedIndex == rightSelectedIndex ? true : false;
        $(".answer li a").each(function(i, e) {
            if (i == rightSelectedIndex) {
                $(e)[0].className = cfg.style.right;
            }
            if (!right && i == userSelectedIndex) {
                $(e)[0].className = cfg.style.wrong;
            }
        });

        // 如果结果展示的内容为空，那就不显示
        $('.accordion > article > div').each(function(i, e) {
            if (e.innerHTML == '') {
                $(e).closest('.accordion').remove();
            }
        });
        $('.questionExplain').show();
    },
    // 入口
    load : function() {
        main.judge();
        main.rangeDom();
        ev.init();
        navbar.init();
        main.resizeImg();
        ev.initImg();
        window.onload = function() {
        };
    }
};
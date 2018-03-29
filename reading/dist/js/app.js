$(function(){
    var isTemplate = '0'; //默认为用户上传图片
    var mySwiper = new Swiper ('.swiper-container', {
        direction : 'vertical',
        loop: false,
        effect : 'fade',
        fade:{
            crossFade: true
        },
        //onlyExternal : true,
        //lazyLoading : true,
        //lazyLoadingInPrevNext : true,
        //lazyLoadingInPrevNextAmount : 3,
        onInit: function(swiper) {
            swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAnimate(swiper); //初始化完成开始动画
           
        },
        onTransitionEnd: function(swiper){ 
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
            if(swiper.activeIndex === 1 || swiper.activeIndex === 2 || swiper.activeIndex === 3){
                mySwiper.unlockSwipeToNext();
            }
            if(swiper.activeIndex === 4){
                mySwiper.lockSwipeToNext();
            }
            if(swiper.activeIndex > 1){
                $('.js-hand').hide();
            }else{
                $('.js-hand').addClass('handUpOut').removeClass('handLeft handLeftOut').show();
            }
            if(swiper.activeIndex === 2){
                $('.js-hand').removeClass('handUpOut').addClass('handLeft handLeftOut').show();
                mySwiper.lockSwipes();
                i=4;
                // turnBook();
            }
            // if(swiper.activeIndex === 5){
            //     mySwiper.lockSwipeToNext();
            // }
        } 
    });
    // mySwiper.slideTo(4, 1000, true);
    /* 图片预览转化为base64位 */
    function getImgBase64(img, callback) {
        var reader = new FileReader();
        reader.addEventListener('load', function(event){
            callback&&callback(reader.result);
        });
        reader.readAsDataURL(img);
    }
    function jugeImg(img){
        var type = img.type,
            size = img.size
            acceptType = "image/gif, image/jpeg, image/png";
        if(!acceptType.match(type)){
            alert('图片格式不对，支持jpg、gif、png');
            return;
        }
        if(size>1024*1024*40){
            alert('图片大小不能超过40MB');
            return;
        }
        getImgBase64(img,function(result){
            // $('#preMyImg').attr("src",result);
            // $('.js-modal-layer').removeClass('hide');
            showEdit(result);
        })
    }
    function loadImage(url, callback) { 
        var img = new Image(); 
        img.src = url; 
        img.onload = function(){ //图片下载完毕时异步调用callback函数。 
            callback.call(img); // 将callback函数this指针切换为img。 
        }; 
    } 
    function uploadImg(pic){
        var myForm = document.getElementById('myForm');
        var formData = new FormData(myForm);
        var txtarea = encodeURI($.trim($('#userInput').val()));
        // if(isTemplate === '0'){
        //     formData.append("userPic",$('#myImg').get(0).files[0]);
        // }
        // if(isTemplate === '1'){
        //     formData.append("userPic","gan1.jpg");
        // }
        if(txtarea === ''){
            showError('请输入您的寄语');
            return;
        }
        // formData.append("isTemplate",isTemplate);
        // formData.append("userText",txtarea);
        formData.append("fileType","1");
        // console.log(formData.get("userPic"),formData.get("userText"),formData.get("templateId"))
        $.ajax({
            type:'post',
            data:formData,
            url:'http://node.ulibuy.com/api/generateCard/'+txtarea,
            dataType:'json',            
            processData: false,
            contentType: false,
            beforeSend:function(){
                $('.js-loading').show();
            },
            complete:function(){
                // $('.js-loading').hide();
            },
            success:function(result){
                if(result && result.file!=''){
                    $('.js-buildImg').attr('src',result.file)
                                     .on('load',function(){
                                        $('.js-modal-layer').fadeOut(300);
                                        $('.js-loading').hide();
                    
                                        $('.js-rebuildBtn,.js-shareBtn').show();
                                        $('.js-tmplBtn,.js-uploadBtn').hide();
                                     });
                    
                    shareWx();
                }else{
                    alert("网络错误");
                }
            },
            error:function(error){
                alert("网络错误");
            }
        })
    }
    function shareWx(){
        wx.onMenuShareTimeline({
            title: $("meta[property='share-title']").attr("content"),
            link: $("meta[property='share-link']") ? $("meta[property='share-link']").attr("content") : location.href,
            imgUrl: $('.js-buildImg').attr('src'),
            cancel:function(){
                
            },
            success:function(){
                
            }
        });
        wx.onMenuShareAppMessage({
            title:  $("meta[property='share-title']").attr("content"),
            desc: $("meta[property='share-desc']").attr("content"),
            link: $("meta[property='share-link']") ? $("meta[property='share-link']").attr("content") : location.href,
            imgUrl: $('.js-buildImg').attr('src'),
            type: '',
            dataUrl: '',
            cancel:function(){
                
            },
            success:function(){
               
            }
        });
    }
    function getPicName(src){
       var len = src.length;
       var id = src.substring(14,len);
        $('#templateId').val(id);
    }
    var i=4; //保存翻页个数
    function turnBook(){
        var mybody = document.getElementById('book');
        var startX, startY, moveEndX, moveEndY, X, Y;
        var b=$('#book');
        var s=b.find('li');
        var flag = false;
        var timer1,timer2,timer3,timer4,timer5;
        var turnleft = function(){
            if(i>=1){
                i--;
                s.eq(i).css({"transform":"rotateY(-140deg)","transition":"3s"});           
                if(i<1){
                    i=0;
                }
                if(i === 2){
                    //去掉箭头
                    $('.js-hand').hide(); 
                }
            }
        }
        // timer1 = setInterval(function(){
        //     turnleft();
        //     if(i===0){
        //         mySwiper.unlockSwipes();
        //         mySwiper.slideTo(3,800,true);
        //     }
        // },5000);
        mybody.addEventListener('touchstart', function(e) {
            clearInterval(timer1);
            e.preventDefault();
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }, false);
        mybody.addEventListener('touchend', function(e) {
            e.preventDefault();
            moveEndX = e.changedTouches[0].pageX;
            moveEndY = e.changedTouches[0].pageY;
            X = moveEndX - startX;
            Y = moveEndY - startY;
            if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
                if(i===1){
                    clearTimeout(timer5)
                }
                if(i<=3){
                    s.eq(i).css({"transform":"rotateY(0deg)","transition":"3s"});           
                    i++;
                    if(i>3){
                        i=4;
                    }
                }
            }
            else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
                turnleft()
            }
            else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
                // alert("向下");
            }
            else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
                // alert("向上");
            }
            else{
                // alert("没滑动");
            }
            if(i === 0){
                timer5 = setTimeout(function(){
                    mySwiper.unlockSwipes();
                    mySwiper.slideTo(3,1000,false);
                },800)
            }
        });
        // s.eq(0).on('touchend',function(){
        //     console.log(111)
            
        // });
        
    }
    turnBook();
    // getDirection();
    //查看他人寄语
    $('.js-seeOthersBtn').on('click',function(){
        $('.js-moreWish-layer').fadeIn(500)
    })
    //获得更多他人寄语
    var wishFlag = true, pageNo=1, pageSize=8, wishList={};
    function getMoreWish(){
        var $wishLayer = $('.js-moreWish-layer');
        var $pDoc = $wishLayer.find('.picList');
        var $win = $wishLayer.find('.picBx');
        var pH = $pDoc.height();
        var wH = $win.height();
        $win.on("scroll",function(){
            var sTop = $(this).scrollTop();
            if(sTop+wH >= pH-1){
                if(wishFlag){
                    wishAjax();
                }
            }
        })
    }
    getMoreWish();
    wishAjax();
    var $zoomImg = $('.js-zoomImg');
    $('.js-moreWish-layer').on('click','.item',function(){
        var $this = $(this);
        var thisSrc = $this.find('img').attr('src');
        $zoomImg.find('img').attr('src',thisSrc);
        $zoomImg.fadeIn(500);
    });
    $zoomImg.on('click',function(event){
        if($(event.target).hasClass('js-zoomImg')){
            $zoomImg.fadeOut(300);
        }
    })
    function wishAjax(){
        $.ajax({
            type:'get',
            url:'http://node.ulibuy.com/api/cardList',
            data:{"pageNo":pageNo++,"pageSize":pageSize},
            dataType:'json',
            success:function(result){
                var rData = result.data;
                var rLen = rData.length;
                if(result && rLen !==0){
                    renderList(result.data);
                    $('.js-currentNo').fadeIn(500).find('span').html(result.num+100);
                }
                if(rLen === 0){
                    wishFlag = false;
                }
            },
            error:function(result){
                alert("网络错误")
            }
        })
    }
    function renderList(arr){
        var htm = '';
        $.each(arr,function(i,val){
            htm += '<div class="item"><img src="'+val+'"></div>'
        });
        $('.js-moreWish-layer').find('.picList').append(htm);
    }
    //分享
    $('.js-shareBtn').on('click',function(){
        shareWx();
        $('.js-share-layer').fadeIn(500);
    })
    $('.js-share-layer').on('click',function(){
        $('.js-share-layer').fadeOut(300);
    })
    //上传图片
    $('#myImg').on('change',function(event){
        // mySwiper.unlockSwipeToNext();
        $('#templateId').val("");   
        var imgFiles = event.target.files;
        if(imgFiles){
            jugeImg(imgFiles[0]);
        }
    })
    //确定生成图片
    $('.js-sureBtn').on('click',function(){
        uploadImg();
    })
    //返回
    $('.js-backBtn').on('click',function(){
        $('.js-modal-layer').fadeOut(300);
    })
    //选择模板图片
    $('.tmplBtn').on('click',function(){
        // mySwiper.unlockSwipeToNext();
        // mySwiper.slideNext();
        showTmpl(13); 
        $('.js-tmpl-layer').fadeIn(500);
    })
    //添加模板图片
    function showTmpl(k){
        var tHtml = '';
        for(var i=1; i<k; i++){
            tHtml += '<div class="item"><img src="./images/temp/gan'+i+'.jpg" data-name="gan'+i+'"></div>';
        }
        $('.js-tmpl-layer .js-picList').html(tHtml);
    }
    //返回
    $('.js-goBackBtn').on('click',function(){
        $('.modal-layer').fadeOut(500);
        // $('.js-seeOthersBtn,.js-shareBtn').hide();
        // $('.js-tmplBtn,.js-uploadBtn').show(); 
    }) 
    //写寄语
    $('.js-wishBtn').on('click',function(){
        mySwiper.slideNext();
        $('.js-rebuildBtn,.js-shareBtn').hide();
        $('.js-tmplBtn,.js-uploadBtn').show();
    })
    //重新制作
    $('.js-rebuildBtn').on('click',function(){
        $('.js-rebuildBtn,.js-shareBtn').hide();
        $('.js-tmplBtn,.js-uploadBtn').show();
    })
    //选中某个模板
    $('.js-picList').on('click','.item',function(){
        var sel = $(this).find('img').attr('src');
        showEdit(sel);
        getPicName(sel);
    })
    //卡片编辑弹框
    function showEdit(src){
        $('#preMyImg').attr("src",src).on('load',function(){
            $('.modal-layer').hide();
            $('.js-modal-layer').fadeIn(500);
        });
    }
    //错误提示
    function showError(txt){
        var $layer = $('.js-error-layer');
        var $msg = $layer.find('.tip');
        $msg.html(txt);
        $layer.fadeIn(500);
        setTimeout(function(){
            $layer.fadeOut(500);
        },1000)
    }
    //音乐播放
    function forceSafariPlayAudio() {
        audioEl.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
        audioEl.play(); // iOS 7/8 仅需要 play 一下
    }

    var audioEl = document.getElementById('bgm');
    audioEl.src = 'http://game.ulibuy.com/wish/audio/music.mp3?v=1';

    audioEl.addEventListener('loadstart', function() {
        console.log('loadstart');
    }, false);
    audioEl.addEventListener('loadeddata', function() {
        console.log('loadeddata');
    }, false);
    audioEl.addEventListener('loadedmetadata', function() {
        console.log('loadedmetadata');
    }, false);
    audioEl.addEventListener('canplay', function() {
        console.log('canplay');
    }, false);
    audioEl.addEventListener('play', function() {
        console.log('play');
        // 当 audio 能够播放后, 移除这个事件
        window.removeEventListener('touchstart', forceSafariPlayAudio, false);
    }, false);
    audioEl.addEventListener('playing', function() {
        console.log('playing');
    }, false);
    audioEl.addEventListener('pause', function() {
        console.log('pause');
    }, false);

    // 由于 iOS Safari 限制不允许 audio autoplay, 必须用户主动交互(例如 click)后才能播放 audio,
    // 因此我们通过一个用户交互事件来主动 play 一下 audio.

    window.addEventListener('touchstart', forceSafariPlayAudio, false);
    $(window).trigger('touchstart');
    $(".musicButton").on('click',function(){
        if(document.getElementById("bgm").paused){
            $(".musicButton").css({"background-image":"url('/wish/images/sound-on.png')"});
            document.getElementById("bgm").play();
        }else{
            document.getElementById("bgm").pause();
            $(".musicButton").css({"background-image":"url('/wish/images/sound-off.png')"});
        }
    });
    
});
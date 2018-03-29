$(function(){
    const clientW = $(window).width();
    const tWidth = $('#js-scrollLoop > li:first').width();
    let animationFrame = null;
    var bgLoop={
        _sx:0,
        _max:640,
        _min:-tWidth,
        _tWidth:tWidth,
        _target:'#js-scrollLoop',
        _firstChild:'#js-scrollLoop > li:first',
        _append:function(){
            $(this._target).append($(this._firstChild).clone())
        },
        _prepend:function(){
            $(this._target).prepend($(this._firstChild).clone())
        },
        _remove:function(){
            $(this._target).find('li:last').remove()
        },
        _removeB:function(){
            $(this._target).find('li:first').remove()
        },
        swipeleft:function(time){
            let timer = time||10000;
            let _this = this;
            animationFrame
            animationFrame=Math.animation(_this._sx,_this._min,function(value,isEnding){
                if(Math.ceil(value)===Math.ceil(_this._min+clientW+1)){
                    _this._append();
                }
                if(isEnding){
                    _this._sx=0;
                    _this.swipeleft(timer)
                    setTimeout(function(){
                        _this._remove()
                    },10)
                }else{
                    $(_this._target).css('transform','translateX(' + value + 'px)');
                }
            },'Linear', timer)
        },
        swiperight:function(time){
            let timer = time||10000;
            let _this = this;
            animationFrame=Math.animation(_this._min,0,function(value,isEnding){
                if(Math.ceil(value)===Math.ceil(_this._min)){
                    _this._append();
                }
                if(isEnding){
                    _this.swiperight(timer)
                    setTimeout(function(){
                        _this._remove()
                    },10)
                    
                }else{
                    $(_this._target).css('transform','translateX(' + value + 'px)');
                }
            },'Linear', timer)
        },
        init:function(){
            // swipeleft(100000)
        //    this._append();
        //    this._remove();
            // this.swiperight(10000)
        }
    }
    bgLoop.init();
    var mySwiper = new Swiper ('.swiper-container', {
        direction : 'horizontal',
        loop: true,
        effect : 'slide',
        on:{
            init: function() {
                swiperAnimateCache(this); //隐藏动画元素 
                swiperAnimate(this); //初始化完成开始动画
                // bgLoop.swipeleft(100000)
            },
            touchStart:function(event){
            },
            touchMove:function(event){
                
            },
            setTransition:function(){

            },
            transitionStart:function(){
                // bgLoop.swipeleft(10000)
            },
            transitionEnd: function(){ 
                // bgLoop.swipeleft(100000)
                swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
            } 
        }
        
    });
    mySwiper.slideTo(2, 1000, true);
    
    //生成100个星星
    function stars(num){
        var num = num?num:30;
        var shtml = '';
        for(var i=1; i<num; i++){
            shtml+='<span class="moveround'+i+'"></span>'
        }
        $('.js-stars-box').append(shtml)
    }
    stars(100);
    //监听手机滑动事件
    //背景移动
    
     
    
    
    function wTouch(){
        var target = document.getElementById("myForm");
            target.style.transition = 'all ease 0.2s';
        // $('#myForm').on('touchstart', function(ev){
        //     ev.preventDefault();
        // });
        // $('#myForm').on('touchend', function(ev){
        //     ev.preventDefault();
        // });
        touch.on('#myForm','swipeleft',function(){
            console.log(1)
        })
        touch.on('#myForm','swiperight',function(){
            console.log(2)
        })
    }
    // wTouch()
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
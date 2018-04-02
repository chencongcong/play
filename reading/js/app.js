$(function(){
    var cWidth = $(window).width(); //游览器宽度
    var bgWidth = $('.parallax-bg1 li:first').width(); 
    var diff = bgWidth - cWidth;//位移距离
    let animationFrame = null;//记录动画
    function BgLoop(time){
        this._startx=0;
        this._endx=-bgWidth;
        this._target='.parallax-bg1';
        this._speed= diff/time;
        this._timer=time;
        this._appendFlag=true; 
    }

    $.extend(BgLoop.prototype,{
        _append:function(){
            let cloneLi = $(this._target).find('li:first').clone();
            $(this._target).append(cloneLi);
            this._appendFlag=false;
        },
        _prepend:function(){
            $(this._target).prepend($(this._firstChild).clone())
        },
        _remove:function(){
            $(this._target).find('li:last').remove();
            this._appendFlag=true;
        },
        swipeleft:function(sx,ex,timer){
            let _this = this;
            if(animationFrame) cancelAnimationFrame(animationFrame());
            if(this._appendFlag)this._append();
            animationFrame=Math.animation(sx,ex,function(value,isEnding){
                //滑动效果结束，但是还没有滑到0位置
                if(isEnding&&Math.abs(value)<Math.abs(_this._endx)){
                    _this._startx = value;
                    let t = Math.abs((_this._endx-value)/_this._speed);
                    _this.swipeleft(_this._startx,_this._endx,t)
                // 到0的位置
                }else if(Math.ceil(value)===Math.ceil(_this._endx)){
                    _this._startx = 0;
                    _this.swipeleft(_this._startx,_this._endx,_this._timer)
                }else{
                    // 记录位置
                    _this._startx=value;   
                }
                // 给图像赋值
                $(_this._target).css('transform',`translate3d(${_this._startx}px,0,0)`);
            },'Linear', timer)
        },
        swiperight:function(sx,ex,timer){
            this.swipeleft(sx,ex,timer);
        },
        init:function(){
            this.swipeleft(0,-diff,this._timer) 
        }
    })
    var bgLoop = new BgLoop(10000);
    bgLoop.init();
    var swiper = new Swiper('.swiper-container', {
    speed: 600,
    parallax: false,
    loop:true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on:{
      touchStart:function(e){
        
        
      },
      touchMove:function(){
        console.log(this.touches)
      },
      touchEnd:function(e){
        // bgLoop.swipeleft(bgLoop._startx,bgLoop._endx,10000)
      }
    }
  });
    
    swiper.navigation.$nextEl.on('click',function(){
      if(animationFrame) cancelAnimationFrame(animationFrame());
        //获取改变后的位置
        let nsx = bgLoop._startx-640;
        if(nsx < bgLoop._endx-640){
            bgLoop._startx=0
            nsx=bgLoop._startx-640;
            $(bgLoop._target).css('transform',`translate3d(${bgLoop._startx}px,0,0)`);
        }
        // let nsx = Math.abs(bgLoop._startx-640)>Math.abs(bgLoop._endx)?bgLoop._endx:bgLoop._startx-640;
        
        //获取位置改变后还有多少距离
        // let ndis = Math.abs(bgLoop._endx-nsx);
        //速度不变 得到完成所需时间
        // let t = ndis/bgLoop._speed;
        bgLoop.swipeleft(bgLoop._startx,nsx,600)
    })
    swiper.navigation.$prevEl.on('click',function(){
      if(animationFrame) cancelAnimationFrame(animationFrame());
      let nsx = bgLoop._startx+640;
      if(nsx>0){
        //当向右边到0时，将整个图瞬间拉到第一张图的最右边；
        bgLoop._startx=bgLoop._endx+bgLoop._startx+640-cWidth;
        // nsx=bgLoop._endx+bgLoop._startx+640+640;
        nsx = bgLoop._startx+640
        $(bgLoop._target).css('transform',`translate3d(${bgLoop._startx}px,0,0)`);
      }
      let ndis = Math.abs(nsx);
    //   let t = ndis/bgLoop._speed;
      bgLoop.swiperight(bgLoop._startx,nsx,600)
    })
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

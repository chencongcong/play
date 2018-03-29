/*
**自定义微信分享朋友圈的内容和缩略图
**分享成功监测
*/


var appid = '',
    appsecret = '',
    nonceStr = '',
    timestamp = 0,
    signature = '',
    url = location.href,
    START,END,recordTimer,
    voice = {};
$.ajax({
    type: 'get',
    url: "http://ajaxinterface.ulibuy.com/ajax/QBYLWXGetSignature.ashx",
    data: {
        url:url
    },
    dataType: 'jsonp',
    success:function(result){
        signature = result.signature;
        appid = result.appId;
        nonceStr = result.nonceStr;
        timestamp = result.timestamp;
    }
});

var time = setInterval(function(){
    if(signature != ''){
        wx.config({
            debug: false,
            appId: appid,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList:  [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'uploadVoice',
                'downloadVoice',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice'
            ]
        });
        wx.ready(function(){
            // if(!localStorage.allowRecorder || localStorage.allowRecorder !== 'true'){
            //     wx.startRecord({
            //         success: function(){
            //             localStorage.allowRecorder = 'true';
            //             wx.stopRecord();
            //         },
            //         cancel: function () {
            //             alert('用户拒绝授权录音');
            //         }
            //     });
            // }
            // var shareTitle = ['少侠留步，助我刘备灭了曹，请你全家吃龙虾！', '快来帮我钓虾，我军粮草告急，急需小龙虾！','三国钓虾大师赛，我已经钓了'+shuliang+'只虾，快来助我！','别说话，钓我！小龙虾三国杀震惊新玩法，108元盱眙龙虾每日免费放送！']
            wx.onMenuShareTimeline({
                title:  $("meta[property='share-title']").attr("content"),
                link: $("meta[property='share-link']") ? $("meta[property='share-link']").attr("content") : location.href,
                imgUrl: $("meta[property='share-img']").attr("content"),
                cancel:function(){

                }
            });
            wx.onMenuShareAppMessage({
                title:  $("meta[property='share-title']").attr("content"),
                desc: $("meta[property='share-desc']").attr("content"),
                link: $("meta[property='share-link']") ? $("meta[property='share-link']").attr("content") : location.href,
                imgUrl: $("meta[property='share-img']").attr("content"),
                type: '',
                dataUrl: ''
            });
            //假设全局变量已经在外部定义
            //按下开始录音
            var timer = null;
            var num = 10;
            // var recording = false;
            //num ：秒
            function countNum(num){
                if(num <= 0){
                    num = 0;

                }else{
                    num--;
                }
                return num;
            }
            $('#talk_btn').on('touchstart', function(event){
                event.preventDefault();
                START = new Date().getTime();
                $('#bgm')[0].pause();
                $('.arrow-tip').addClass('hide');

                recordTimer = setTimeout(function(){
                    wx.startRecord({
                        success: function(){
                            localStorage.allowRecorder = 'true';
                            //红点闪烁
                            $('#twinkling').removeClass('hide').addClass('twinkling');
                            //跳动
                            $('#myscale').addClass('myscale');
                            //10s倒计时
                            timer = setInterval(function(){
                                num = countNum(num);
                                $('#countNum').html(num+'s');
                                if(num == 1){
                                    // wx.stopRecord({
                                    //   success: function (res) {
                                    //     voice.localId = res.localId;
                                    //     // swiper.slideNext();
                                    //     //遮罩层中间页面
                                    //     $('#opacityBg').removeClass('hide');
                                    //     alert(1);
                                    //     uploadVoice();
                                    //   },
                                    //   fail: function (res) {
                                    //     alert(2);
                                    //     // alert(JSON.stringify(res));
                                    //   }
                                    // });
                                    $('#talk_btn').trigger('touchend');
                                }
                            },1000);
                        },
                        cancel: function () {
                            alert('用户拒绝授权录音');
                        }
                    });
                },300);
            });
            //松手结束录音
            $('#talk_btn').on('touchend', function(event){
                $('#bgm')[0].play();
                event.preventDefault();
                END = new Date().getTime();
                if((END - START) < 300){
                    END = 0;
                    START = 0;
                    //小于300ms，不录音
                    clearTimeout(recordTimer);
                }else{
                    wx.stopRecord({
                      success: function (res) {
                        voice.localId = res.localId;
                        // swiper.slideNext();
                        //遮罩层中间页面
                        // alert(voice.localId);
                        $('#opacityBg').removeClass('hide');
                        // alert(3);
                        uploadVoice();
                      },
                      fail: function (res) {
                        // alert(4);
                        if(JSON.stringify(res).indexOf('tooshort')>0){
                            alert('录音时间太短啦！长按麦克风录制哦！')
                        }
                        else alert(JSON.stringify(res));
                      }
                    });
                }
                //取消红点闪烁
                $('#twinkling').addClass('hide').removeClass('twinkling');
                //取消跳动
                $('#myscale').removeClass('myscale');
                //取消倒计时
                clearInterval(timer);
                // num = 10;
                // $('#countNum').html('10s');
            });

            //上传录音
            function uploadVoice(){
                //调用微信的上传录音接口把本地录音先上传到微信的服务器
                //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
                wx.uploadVoice({
                    localId: voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: function (res) {
                        //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                        // $('#serverId').html(res.serverId);
                        $.ajax({
                            url: '/ajax/WXMediaDownload.ashx',
                            type: 'get',
                            data: {media_id:res.serverId},
                            dataType: "jsonp",
                            success: function (data) {
                                // window.location.href= res.serverId;
                                // alert(JSON.stringify(data))
                                var gender,audio;
                                var nickname = GetQueryString('nickname') || '';
                                if(data){
                                    if(data.result.indexOf('=') > 0){
                                        gender = data.result.split('=')[1];
                                    }
                                    else{
                                        gender = ['male','female'][Math.floor(Math.random()*2)];
                                    }
                                    audio = data.savepath;
                                    var goTimer = setTimeout(function(){
                                        window.location.href='./result.htm?nickname='+nickname+'&gender='+gender+'&audio='+audio;
                                    },1000);
                                }
                            },
                            error: function (xhr, errorType, error) {
                                alert(error);
                            }
                        });
                    }
                });
            }

            //注册微信播放录音结束事件【一定要放在wx.ready函数内】
            wx.onVoicePlayEnd({
                success: function (res) {
                    // stopWave();
                }
            });
        });
        clearInterval(time);
    }
}, 10);
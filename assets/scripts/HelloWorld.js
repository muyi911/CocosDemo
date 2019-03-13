// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        login: cc.Button,
        info: cc.Label,
        engine: null,
        rsp: null,
        gameID: 200978
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.login.node.on('click', this.MatchvsInit, this);
        this.engine = new window.MatchvsEngine();
        this.rsp = new window.MatchvsResponse();
        this.rsp.initResponse = this.initResponse.bind(this);
        this.rsp.registerUserResponse = this.registerUserResponse.bind(this);
        this.rsp.loginResponse = this.loginResponse.bind(this);
    },

    start() {

    },

    // update (dt) {},
    MatchvsInit() {
        var appkey = '4fd4a67c10e84e259a2c3c417b9114f4';
        var gameVersion = 1;
        this.engine.init(this.rsp, 'Matchvs', 'release', appkey, gameVersion);
    },

    initResponse: function (status) {
        if (status == 200) {
            this.labelLog('初始化成功，开始注册');
            this.engine.registerUser();
        } else {
            this.labelLog('初始化失败，错误码：' + status);
        }
    },

    registerUserResponse: function (userInfo) {
        if (userInfo.status === 0) {
            this.labelLog('注册成功，开始登录，登录ID是：' + userInfo.id + 'token是' + userInfo.token);
            this.Login(userInfo.id, userInfo.token);
        } else {
            this.labelLog('注册失败错误状态码为：' + userInfo.status);
        }
    },

    Login(userID, token) {
        var DeviceID = 'abcdef';
        this.engine.login(userID, token, DeviceID);
    },

    loginResponse: function (loginRsp) {
        if (loginRsp.status === 200) {
            this.labelLog('恭喜你登录成功，来到Matchvs的世界，你已经成功的迈出了第一步，Hello World');
        } else {
            this.labelLog('登录失败');
        }
    },

    labelLog: function (info) {
        this.info.string = '\n[LOG]：' + info;
    }


});
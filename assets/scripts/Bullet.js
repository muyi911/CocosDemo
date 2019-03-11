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
        duration: 3,
        scaleX: 0.5,
        scaleY: 0.5,
        hitRadius: 40
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
        // 获取屏幕的宽度
        // var screenWidth = this.node.parent.width;
        // var bulletWidth = this.node.width;

        // // 随机方向，小于0.5：从右向左，大于0.5：从左向右
        // var action = null;
        // if (Math.random() <= 0.5) {
        //     this.node.scaleX = this.scaleX;
        //     this.node.scaleY = this.scaleY;
        //     action = cc.moveTo(this.duration, cc.v2(-1400, 0))
        // } else {
        //     this.node.scaleX = -this.scaleX;
        //     this.node.scaleY = -this.scaleY;
        //     action = cc.moveTo(this.duration, cc.v2(1400, 0))
        // }
        // // var action = cc.moveTo(this.duration, cc.v2(-1400, 0));
        // this.node.runAction(action);
        // // this.node.scaleX = -0.5;
        // // this.node.scaleY = -0.5;
        // var animation = this.getComponent(cc.Animation);
        // animation.play('bullet');
    },

    start() {
        this.node.scaleX = -this.game.bulletdirection * this.scaleX;
        this.node.scaleY = -this.game.bulletdirection * this.scaleY;
        var action = cc.moveTo(this.duration, cc.v2(this.game.bulletdirection * (this.node.parent.width + this.node.width), -40));
        var animation = this.getComponent(cc.Animation);
        this.node.runAction(action);
        animation.play('bullet');
    },

    update(dt) {
        if (this.game.bulletdirection > 0) {
            if (this.node.x > this.node.parent.width / 2 + this.node.width) {
                this.onFlyOutOfScreen();
            }
        } else {
            if (this.node.x < -this.node.parent.width / 2 - this.node.width) {
                this.onFlyOutOfScreen();
            }
        }

        if (this.getPlayerDistance() < this.hitRadius) {
            this.onHit();
            return;
        }
    },

    onFlyOutOfScreen: function () {
        this.node.destroy();
        this.game.spawnBullet();
    },

    getPlayerDistance: function () {
        var playerPos = this.game.player.getPosition();
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onHit: function () {
        if (!this.game.overflag) {
            this.game.gameOver();
        }
    }
});
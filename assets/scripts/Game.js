// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var scoreStore = require('score');

cc.Class({
    extends: cc.Component,

    properties: {
        StarPrefab: {
            default: null,
            type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDuration: 0,
        overflag: false,
        ground: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        BulletPrefab: {
            default: null,
            type: cc.Prefab
        }

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
        this.timer = 0;
        this.starDuration = 0;
        this.score = 0;
        this.groundY = this.ground.y + this.ground.height / 2;
        this.spawnNewStar();
        this.spawnBullet();
    },

    start() {

    },

    update(dt) {
        if (this.timer > this.starDuration) {
            if (!this.overflag) {
                this.gameOver();
            }
            return;
        }
        this.timer += dt;
    },

    spawnNewStar: function () {
        var newStar = cc.instantiate(this.StarPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var node = cc.find('StarPositionNode').getComponent('StarPosition');
        var position = node.getdata();
        var newStar = cc.instantiate(this.StarPrefab);
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        var maxX = this.node.width / 2 - newStar.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;

        // 防止星星位置重叠
        if (!!position) {
            while (Math.abs(randX - position.x) <= newStar.width + 50) {
                randX = (Math.random() - 0.5) * 2 * maxX;
            }
        } else {
            position = {};
        }
        position.x = randX;
        position.y = randY;
        node.setdata(position);
        return cc.v2(randX, randY);
    },

    spawnBullet: function () {
        var newBullet = cc.instantiate(this.BulletPrefab);
        this.node.addChild(newBullet);
        newBullet.setPosition(this.getNewBulletPosition());
        newBullet.getComponent('Bullet').game = this;
    },

    getNewBulletPosition: function () {
        var newBullet = cc.instantiate(this.BulletPrefab);
        var screenWidth = this.node.width;
        var randX = 0;
        var randY = -40; // TODO 后面随机高度

        // 随机方向，小于0.5：从右向左，大于0.5：从左向右
        if (Math.random() <= 0.5) {
            this.bulletdirection = -1;
            randX = screenWidth / 2 + newBullet.width;
        } else {
            this.bulletdirection = 1;
            randX = -(screenWidth / 2 + newBullet.width);
        }
        return cc.v2(randX, randY);
    },

    gainScore: function () {
        this.score += 1;
        scoreStore.score = this.score;
        this.scoreDisplay.string = 'Score: ' + this.score;
        cc.audioEngine.setEffectsVolume(0.3);
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function () {
        this.overflag = true;
        this.player.stopAllActions();
        cc.director.loadScene('gameover');
    }

});
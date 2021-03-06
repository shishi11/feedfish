"use strict";
cc._RFpush(module, '98691dXmpBOwqyJ9EURgrAz', 'lure');
// Script\lure.js

var Game = require('Game');
cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this.anim = this.getComponent(cc.Animation);
        //向底部移动
        var target_x = this.node.x;
        var target_y = -cc.winSize.height / 2;
        //cc.log('target_x,target_y:'+target_x+','+target_y);
        var downSpeed = -30 - Math.random() * 30;
        cc.log('downspeed=' + downSpeed);
        //这种形式不对，要改一下，不能用缓动，不然有时在update时不能发现这个NODE
        var moveByLeft = cc.moveBy(1.5, cc.p(-40, downSpeed), 10);
        var moveByRight = cc.moveBy(1.5, cc.p(40, downSpeed), 10);

        this.node.runAction(cc.repeatForever(cc.sequence(moveByLeft, moveByRight)));
    },
    init: function init(x) {
        this.node.x = x; //-cc.winSize.width/2+ Math.random()*cc.winSize.width ;
        cc.log(this.node.uuid + ' is created');
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function lateUpdate(dt) {
        var self = this;
        if (this.node.y < -cc.winSize.height / 2 + 10) {
            //到底了
            cc.log(' over ' + this.node.uuid + ' this.node.y:' + this.node.y);
            self.deteriorate();
            // this.node.stopAllActions();
            // this.anim.stop();
            // //饵到底后变化
            // this.scheduleOnce(function() {
            //     let finished = cc.callFunc(function(target, ind) {
            //         // self.node.destroy();
            //         cc.find('Canvas').emit('lure_destory', {
            //             uuid: self.node.uuid
            //         });
            //     }, this, 0);
            //     let tintBy = cc.tintTo(10, 0, 0, 0);
            //     self.node.runAction(cc.sequence(tintBy, finished));

            // }, 1);
            var c = cc.find('Canvas');
            c.emit('lure_over', {
                msg: 'Hello, this is Cocos Creator' + self.node.uuid
            });
        }
        // if(this.node.y<-300 && this.node.y>-310)
        //   cc.log(this.node.uuid+'->'+this.node.y);
        this.node.y = cc.clampf(this.node.y, -cc.winSize.height / 2 + 10, cc.winSize.height / 2 - 100);
    },
    //变质过程
    deteriorate: function deteriorate() {
        var self = this;
        this.node.stopAllActions();
        this.anim.stop();
        //饵到底后变化
        this.scheduleOnce(function () {
            var finished = cc.callFunc(function (target, ind) {
                // self.node.destroy();
                cc.find('Canvas').emit('lure_destroy', {
                    uuid: self.node.uuid
                });
            }, this, 0);
            var tintBy = cc.tintTo(10, 0, 0, 0);
            self.node.runAction(cc.sequence(tintBy, finished));
        }, 1);
    },
    onCollisionEnter: function onCollisionEnter(other, self) {

        if (other.node.group === 'fishG') {
            cc.log('fish.node.group' + other.node.group);
            //碰到鱼
            this.node.stopAllActions();

            if (other.getComponent('Control').favorite) {
                this.node.dispatchEvent(new cc.Event.EventCustom('lure_eated', true));
            }

            cc.find('Canvas').emit('lure_destroy', {
                uuid: self.node.uuid
            });
        }
        if (other.node.group === 'stoneG') {
            cc.log('lure knock stone ' + other.node.group);
            //碰到障碍
            this.deteriorate();
        }
    }
});

cc._RFpop();
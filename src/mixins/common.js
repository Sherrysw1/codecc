import wepy from 'wepy';
// import {getEvents, setEvents} from '../resource/eventsBus.js';

export default class commonMixin extends wepy.mixin {
    data = {
        requestUrl: 'https://test.dykt123.com'
    }

    computed = {
    }

    onLoad() {

    }

    methods = {

    }

    toast(params) {
        if (typeof params === 'string') {
            params = {
                title: params
            };
        }
        params = Object.assign({
            icon: 'none',
            duration: 1500
        }, params);

        wx.showToast(params);
    }
    request(args, isLogin = true) {
        if (typeof args === 'string') args = { url: args };

        typeof args.data !== 'object' && (args.data = {});

        // if (isLogin) {
        //     args.data.token = wx.getStorageSync('dykt_token');
        // }

        Object.assign(args, {
            method: 'POST'
        }, args);

        return wepy.request(args).then(res => {
            if (!res || res.statusCode !== 200 ) {
                throw res;
            }
            return res.data;
        });
    }

    async checkLogin() {
        try {
            const { code } = await wepy.login();
            const res = await this.request({
                url: this.ApiUrl + '/wxLogin',
                data: {
                    js_code: code
                }
            }, false);

            // console.log(res);
            res.token && wx.setStorageSync('dykt_token', res.token);

            // not register or bind weixin account
            if (!res || res.stat !== 'ok') {
                return false;
            }
            this.$parent.globalData.userInfo = res;
            return true;
        }
        catch (e) {
            // Do something when catch error
            return false;
        }
    }
}

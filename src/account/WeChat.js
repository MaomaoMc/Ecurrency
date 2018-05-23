import React, {Component} from 'react';
import Title from '../Title';

const wechat_gzh = require("../img/wechatgzh.jpg");
const wechat = require("../img/icon_weixin.png");
class WeChat extends Component{
    render (){
        const sundryData = JSON.parse(localStorage.getItem("sundryData"));
        const wx_pic = sundryData.wx_pic;
        // const wx_kefu = sundryData.wx_kefu;
        return <div>
            <Title title = "微信客服"/>
            <div className="text_center fz_24">
                <p className="fc_white" style={{lineHeight: '.8rem'}}>
                    <img className="wechat" src={wechat} alt="" />
                    <span>JSD微信官方客服：</span>
                </p>
                <img className="weChatgzh" src={window.baseUrl + wx_pic} alt=""/>
            </div>
        </div>
    }
}

export default WeChat;
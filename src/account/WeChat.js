import React, {Component} from 'react';
import Title from '../Title';

const wechat = require("../img/icon_weixin.png");
class WeChat extends Component{
    render (){
        const sundryData = JSON.parse(localStorage.getItem("sundryData"));
        const wx_pic = sundryData.wx_pic;
        return <div>
            <Title title = "微信客服"/>
            <div className="text_center fz_24">
                <p style={{lineHeight: '.8rem'}}>
                    <img className="wechat" src={wechat} alt="" />
                    <span>E币微信官方客服：</span>
                </p>
                <img className="weChatgzh" src={window.baseUrl + wx_pic} alt=""/>
            </div>
        </div>
    }
}

export default WeChat;
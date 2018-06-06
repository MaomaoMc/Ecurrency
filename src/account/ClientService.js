import React, {Component} from 'react';
import Title from './../Title';

// const wechat_gzh = require("../img/wechatgzh.jpg");
const wechat = require("../img/icon_weixin.png");
class ClientService extends Component{
    render (){
        const sundryData = JSON.parse(localStorage.getItem("sundryData"));
        const wx_pic = sundryData.wx_pic;
        const wx_kefu = sundryData.wx_kefu;
        return <div style = {{backgroundColor: "white"}}>
            <Title title="客服中心"/>
            <div className="clientService fc_blue fz_24">
                <p>
                    <img className="wechat" src={wechat} alt=""></img>
                    <span>E币微信官方客服：</span>
                </p>
                <img className="weChatgzh" src={window.baseUrl + wx_pic} alt=""/>
                <p>
                    <span className="icon kefu"></span>
                    <span>官方微信客服</span>
                </p>
                <div dangerouslySetInnerHTML = {{__html: wx_kefu}} style = {{color: "#666"}}></div>
            </div>
        </div>
    }
}

export default ClientService;
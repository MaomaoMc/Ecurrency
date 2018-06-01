// Invite
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import QRCode from 'qrcode.react';
//引入
import copy from 'copy-to-clipboard';

import Title from './../Title';
import WarningDlg from './../WarningDlg';

const inviteImg = require("../img/inviteImg.png");
class Invite extends Component {
    constructor (props){
        super(props);
        this.state = {
            id_num: "",
            code: "",
            path: "", // 保存二维码SVG的path
            warningDlgShow: false,
            warningText: ""
        };
    }
    copy (e){
        //使用方法
        copy(e.text);
        alert("复制成功");
    }
    hanleWarningDlgTimer (){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                })
            }
        , 1000)
    }
    ajax (){
        const self = this;
        axios.post(window.baseUrl + "/home/Member/myPromote", qs.stringify({
            token: localStorage.getItem("token")
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){
                const id_num = data.data.id_num;
                self.setState({
                    id_num: id_num,
                    path: window.baseUrl + "/build/index.html#/account/register?tui_id=" + id_num
                })
            }else{  //失败
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
            }
            self.setState({
                code: code
            })
        })
    }
    componentDidMount (){
        this.ajax();
    }
    render (){
        return <div>
            <Title title="邀请好友" code = {this.state.code}/>
            <div className = "text_center">
                <img className = "mt_40" src={inviteImg} alt="" style = {{width :"2.525rem", height : "2.8rem"}}/>
            </div>
            <div className = "inviteOpt f_flex" style = {{padding: "0 .5rem"}}>
                    <p className = "fz_20">我的推荐ID</p>
                    <p className= "mt_10 mb_20">
                        <span className="inviteId">{this.state.id_num}</span>
                        <span className = "btn btn_primary" onClick = {e => {this.copy({text: this.state.id_num})}}>复制</span>
                    </p>
                    <p className = "fz_20">我的推荐链接</p>
                    <p className="mt_10 mb_20">
                        <span className="inviteLink">{this.state.path} </span>
                        <span className = "btn btn_primary"
                        onClick = {e => {this.copy({text: this.state.path})}}
                        >复制</span>
                    </p>
                <p><i className="f_lt inviteCode"></i>
                    <span className="fz_20 f_lt" style={{lineHeight: ".15rem", marginLeft: ".05rem"}}>推荐二维码</span></p>
            </div>
            <div className="text_center mt_40">
                {this.state.path !== "" ? <QRCode value = {this.state.path}/> : null}
            </div>
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText}/> : null}
        </div>
    }
}

export default Invite;
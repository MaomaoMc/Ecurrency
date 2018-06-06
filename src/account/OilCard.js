import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import ActionSheet from 'action-sheet';
import Title from './../Title';
import WarningDlg from './../WarningDlg';
import Shadow from './../Shadow';

const oilCard_pic = require("../img/icon_ykcz_nor.png");
class OilCard extends Component{
    constructor (props){
        super(props);
        this.state = {
            oil_num: "", //油卡号
            oil_name: "", //姓名
            name: "", //姓名
            type: "",  //油卡类型
            jd_num: 100, //金币
            idcard: "",
            dlgShow: false,
            pass: "",
            warningDlgShow: false,
            warningDlgText: ""
        }
    }
    handleInputChange (e){ // inpu change event
        const type = e.type;
        this.setState({
            [type]: e.value
        })
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){  //成功了 返回个人中心页面
                        window.history.back();
                    }
                })
            }
        , 1000)
    }
    renderWarning (text){
        this.setState({
            warningDlgShow: true,
            warningDlgText: text
        }, function(){
            this.hanleWarningDlgTimer()
        });
    }
    handleReChange (){ //油卡充值  打开输入支付密码的弹窗
        const state = this.state;
        const oil_num = state.oil_num;
        const oil_name = state.oil_name;  //姓名
        const type = state.type;
        const idcard = state.idcard;
        const jd_num = state.jd_num;
        if(type === ""){
            this.renderWarning("请先选择油卡类型");
            return;
        }
        if(oil_num === ""){
            this.renderWarning("油卡卡号不能为空");
            return;
        }
        if(idcard === ""){
            this.renderWarning("身份证号码不能为空");
            return;
        }
        if(oil_name === ""){
            this.renderWarning("姓名不能为空");
            return;
        }
        this.setState({
            dlgShow: true
        })
    }
    handlePwdEvent (e){  //输入交易密码
        this.setState({
            pass: e.val
        })
    }
    handlePayPwd (e){ //弹窗 取消/确定
        const type = e.type;
        if(type === "cancel"){  //取消
            this.setState({
                dlgShow: false,
                pass: ""
            })
        }else{   //如果是 确定的话  要判断支付密码是否正确了
            const state = this.state;
            const oil_num = state.oil_num;
            const oil_name = state.oil_name;  //姓名
            const type = state.type;
            const idcard = state.idcard;
            const jd_num = state.jd_num;
            const pass = state.pass;
            const self = this;
            axios.post(window.baseUrl + "/home/Member/oilCard", qs.stringify({
                token: localStorage.getItem("token"),
                oil_num: oil_num,
                oil_name: oil_name,
                type: type,
                idcard: idcard,
                jd_num: jd_num,
                pass: pass
            })).then(function(res){
                const data = res.data;
                const code = data.code;
                self.setState({
                    warningDlgShow: true,
                    warningDlgText: data.msg,
                    code: code
                }, function(){
                    this.hanleWarningDlgTimer({code: code})
                })
            })
        }
    }
   
    renderOilCardType (name, type, that){
        this.setState({
            name : name,
            type: type
        }, function(){
            that.hide();
        })
    }
    handleSltOilCardType (){  //选择油卡类型
        const self = this;
        var as = new ActionSheet({
            buttons: {
                '中石油': function(e){
                   self.renderOilCardType("中石油", "1", this)
                },
                '中石化': function(e){
                    self.renderOilCardType("中石化", "2", this)
                },
            }
        });
        as.el.css({ //抽屉菜单的样式自定义
            color: "black",
            "font-size": ".12rem"
        })
        as.show();
    }
    render (){
        return <div>
            <Title title="油卡充值" code = {this.state.code}/>
           <div className="profile text_center">
            <img src={oilCard_pic} alt=""/>
           </div>
            <ul className="lists f_flex fz_26" style={{marginTop: 0}}>
                <li onClick = {e => {
                            this.handleSltOilCardType()
                        }}>
                    <span className="f_lt fc_blue">油卡类型</span>
                    <span className="f_rt">
                        <span className="fc_white">{this.state.name}</span>
                        <span className="go_arrow" 
                       
                        ></span>
                    </span>
                </li>
                <li>
                    <span className="f_lt fc_blue">卡号</span>
                    <span className="f_rt">
                        <input className = "card_num" type="text" placeholder = "输入油卡卡号" value = {this.state.oil_num}
                         onChange = {e => {
                            this.handleInputChange({type: "oil_num", value: e.target.value})
                        }}
                        />
                    </span>
                </li>
                <li>
                    <span className="f_lt fc_blue">身份证号码</span>
                    <span className="f_rt">
                        <input className = "card_num" type="text" placeholder = "输入身份证号码" value = {this.state.idcard}
                         onChange = {e => {
                            this.handleInputChange({type: "idcard", value: e.target.value})
                        }}
                        />
                    </span>
                </li>
                <li>
                    <span className="f_lt fc_blue">姓名</span>
                    <span className="f_rt">
                        <input className = "card_num" type="text" placeholder = "输入姓名" value = {this.state.oil_name}
                         onChange = {e => {
                            this.handleInputChange({type: "oil_name", value: e.target.value})
                        }}
                        />
                    </span>
                </li>
                <li>
                    <span className="f_lt fc_blue">请输入充值E币<span className="fc_gray fz_24">（最低额度100E币）</span></span>
                    <span className="f_rt">
                        <input className="czAmount" type="text" value={this.state.jd_num} 
                        onChange = {e => {
                            this.handleInputChange({type: "jd_num", value: e.target.value})
                        }}
                        />
                    </span>
                </li>
            </ul>
            <div style={{padding: '0 .2rem'}}>
                <span className="btn btn_primary fz_26" style={{width: "100%", height: ".45rem", lineHeight: '.45rem'}}
                onClick = {e => {
                    this.handleReChange()
                }}
                >充值</span>
            </div>
            <div className={this.state.dlgShow ? "dialog dlgPayPwd" : "dialog dlgPayPwd hide"}>
                <p className="dlg_tit fc_white">输入密码</p>
                <div className="dlg_form">
                    <p className="text_center fz_24 fc_white">请输入支付密码：</p>
                    <input className="b_blue1" type="password" value = {this.state.pass} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                    <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="over_hidden" style={{padding: "0 .14rem"}}>
                        <span className="btn fz_24 fc_white f_lt" onClick = {e => {
                            this.handlePayPwd({type: "cancel"})
                        }}>取消</span>
                        <span className="btn fz_24 fc_white f_rt" onClick = {e => {
                            this.handlePayPwd({type: "confirm"})
                        }}>确定</span>
                    </div>
                </div>
            </div>
            {this.state.dlgShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningDlgText} /> : null}
        </div>
    }
}

export default OilCard;
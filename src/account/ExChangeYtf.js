import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';
import Shadow from './../Shadow';

const ytf_pic = require("../img/icon_ytf_nor.png")
class ExchangeYtf extends Component{
    constructor (props){
        super(props);
        this.state = {
            num: "",
            jd_num: 0,
            dlgShow: false,
            pass: "", //交易密码
            warningDlgShow: false,
            warningDlgText: ""
        }
    }
    handleInputChange (e){
        const type = e.type;
       this.setState({
           [type] : e.value
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
            const self = this;
            const num = this.state.num;
            const jd_num = this.state.jd_num;
            const pass = this.state.pass;
            axios.post(window.baseUrl + "/home/Member/etheric", qs.stringify({
                token: localStorage.getItem("token"),
                num: num,
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
                    self.hanleWarningDlgTimer({code: code})
                })
            })
        }
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){
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
    handleSubmit (){ //兑换
        const num = this.state.num;
        const jd_num = this.state.jd_num;
        if(num === ""){
            this.renderWarning("钱包地址不能为空");
            return;
        }
        if(jd_num === 0){
            this.renderWarning("E币数量不能为空或为0");
            return;
        }
       this.setState({
           dlgShow: true
       })
    }
    render (){
        return <div className="text_center">
        <Title title="兑换以太坊" code = {this.state.code}/>
           <div className="profile">
            <img src={ytf_pic} alt=""/>
           </div>
            <ul className="lists f_flex fz_26" style={{marginTop: 0}}>
                <li>
                    <span className="f_lt fc_blue">钱包地址</span>
                    <span className="f_rt">
                        <input className = "card_num" type="text" placeholder = "输入钱包地址" value = {this.state.num}
                         onChange = {e => {
                            this.handleInputChange({type: "num", value: e.target.value})
                        }}
                        />
                    </span>
                </li>
                <li>
                    <span className="f_lt fc_blue">请输入兑换E币</span>
                    <span className="f_rt">
                        <input className="czAmount" type="text" value = {this.state.jd_num}
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
                    this.handleSubmit()
                }}
                >兑换</span>
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

export default ExchangeYtf;
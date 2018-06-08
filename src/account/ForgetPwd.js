import React, {Component} from 'react';
import Title from '../Title';
import WarningDlg from '../WarningDlg';
import axios from 'axios';
import qs from 'qs';

const baseUrl = window.baseUrl;
class ForgetPwd extends Component {
    constructor(props){
        super(props);
        const hash = window.location.hash;
        let page_type;
        if(hash.indexOf("forgetLoginPwd") !== -1){
            page_type = 1;
        }else{
            page_type = 2;
        }
        this.state = {
            page_type: page_type,
            phone: "",
            code: "",
            pass: "",
            repass: "",
            countDown: 60,
            warningDlgShow: false,
            warningDlgText: ""
        }
    }
    handleInputChange (e){
        const type = e.type;
        const value = e.value;
        this.setState({
            [type]: value
        })
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){ //成功
                        window.history.back();
                    }
                })
            }
        , 1000)
    }
    checkMobile (phone){ //手机号码验证
        if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone))){ 
         return false; 
        } else{
          return true;
        }
      }
      resendCode (){  //60s倒计时 重新发送验证码
        let countDown = this.state.countDown;
        let timer;
        const self = this;
        if(countDown !== 0){  //倒计时没结束
             timer = setInterval(
                function () {
                    countDown--;
                    if(countDown === 0){
                        clearInterval(timer);
                    }
                    self.setState({
                        countDown: countDown
                    })
                }
            , 1000)
        }
    }
    passValidate (e){
        const value = e.value;
        const page_type = this.state.page_type;
        if(page_type === 2){ //交易密码
            if(value.length < 6){
                this.setState({
                    warningDlgShow: true,
                    warningDlgText: "交易密码不能小于6位"
                }, function(){
                    this.hanleWarningDlgTimer()
                })
                return;
            } 
        }
        
        if(!(/^[A-Za-z0-9]+$/.test(value))){  //密码只能是6位数 的字母加数字
            this.setState({
                warningDlgShow: true,
                warningDlgText: "密码只能是字母或数字组成"
            }, function(){
                this.hanleWarningDlgTimer()
            })
            return;
        }
    }
    handleSendCode (){  //获取验证码
        const self = this;
        const phone = this.state.phone;
        const countDown = this.state.countDown;
        if(countDown < 60 && countDown > 0){  //正在倒计时就不要再让点击了
            return;
        }
        if(!this.checkMobile(phone)){
            this.setState({
                warningDlgShow: true,
                warningDlgText: "请输入正确的手机号码",
            }, function(){
                self.hanleWarningDlgTimer()
            });
            return;
          }
        axios.post(window.baseUrl + "/home/Login/send", qs.stringify({
            token: localStorage.getItem("token"),
            phone: phone
        })).then(function(res){
            const data = res.data;
            const data_code = data.code;
            if(data_code === 1){  //发送成功 开始倒计时
                self.setState({
                    countDown: 60
                }, function(){
                    self.resendCode();
                })
                
            }
           self.setState({
               warningDlgShow: true,
               warningDlgText: data.msg,
             data_code: data_code
           }, function(){
               self.hanleWarningDlgTimer()
           })
        })
    }
    submit (){  //提交
        const self = this;
        const page_type = this.state.page_type;
        const phone = this.state.phone;
        const code = this.state.code;
        const pass = this.state.pass;
        const repass = this.state.repass;
        let paramStr;// = page_type === 1 ? "forgotPass" : "forgetTrading";
        let config;// = page_type === 1 ? {} : {token: localStorage.getItem("token")}
        if(page_type === 1){
            paramStr = "/Login/forgotPass"
            config = {
                phone: phone,
                code: code,
                pass: pass,
                repass: repass,
            }
        }else{
            paramStr = "/Member/forgetTrading";
            config = {
                token: localStorage.getItem("token"),
                phone: phone,
                code: code,
                pass: pass,
                repass: repass,
            }
        }
        axios.post(baseUrl + "/home" + paramStr, qs.stringify(config), {
            transformRequest: [(data) => data],
            headers: {}
        }).then(function(res){
            const data = res.data;
            const page_code = data.code;
            self.setState({
                warningDlgShow: true,
                warningDlgText: data.msg
            }, function(){
                self.hanleWarningDlgTimer({code: page_code})
            })
        })
    }
    render (){
        const countDown = this.state.countDown;
        const page_type = this.state.page_type;
        return <div>
             <Title title={this.state.page_type === 1 ? "忘记登录密码" : "忘记交易密码"} code = {this.state.code}/>
            <div className="account_form fz_26">
                <div>
                    <label>手机号：</label>
                    <input type="text" name="" placeholder="手机号：" value = {this.state.phone} onChange = {e => {
                        this.handleInputChange({type: "phone", value: e.target.value})
                    }}/>
                </div>
                <div style={{borderColor: 'transparent'}}>
                    <div className="f_lt" style={{width: '2.24rem', margin: "0"}}>
                        <label style={{width: "30%"}}>验证码：</label>
                        <input className="code" type="text" placeholder="验证码：" value = {this.state.code}  style={{width: "70%"}}  onChange = {e => {
                        this.handleInputChange({type: "code", value: e.target.value})
                    }}/>
                    </div>
                    <span className={countDown > 0 && countDown < 60 ? "sendMessage btn btn_default fz_26" : "sendMessage btn btn_primary fz_26"} onClick = {e => {
                        this.handleSendCode()
                    }}>{countDown > 0 && countDown < 60 ? countDown + "s后重新发送" : countDown === 0 ? "重新发送" : "获取验证码"}</span>
                </div>
                <div>
                    <label>新密码：</label>
                    <input type="password" placeholder="新密码：" maxLength = {page_type === 2 ? "6" : ""} value = {this.state.pass} onChange = {e => {
                        this.handleInputChange({type: "pass", value: e.target.value})
                    }} onBlur = {e => {
                        this.passValidate({type: "repass", value: e.target.value})
                    }}/>
                </div>
                <div>
                    <label>重复密码：</label>
                    <input type="password" placeholder="重复密码：" maxLength = {page_type === 2 ? "6" : ""} value = {this.state.repass} onChange = {e => {
                        this.handleInputChange({type: "repass", value: e.target.value})
                    }} onBlur = {e => {
                        this.passValidate({type: "repass", value: e.target.value})
                    }}/>
                </div>
                
                <span className="btn btn_primary login_btn h_80 fz_26 f_lt mt_50" style={{width: '100%'}}
                    onClick={e => {
                        this.submit({})
                }}>提交</span>
            </div>
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningDlgText} /> : null}
        </div>
    }
}

export default ForgetPwd;
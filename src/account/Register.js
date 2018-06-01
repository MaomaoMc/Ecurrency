import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from '../WarningDlg';
class Register extends Component {
    constructor (props){
        super(props);
        
        let tui_id = "";
        const hash = window.location.hash;
        if(hash.indexOf("tui_id") !== -1){
            tui_id = hash.substring(hash.indexOf("tui_id") + 7);
        }
        this.state = {
            phone: "",
            code: "", //验证码
            l_pass: "",
            rl_pass: "",
            t_pass: "",  //交易密码
            rt_pass: "",  //重复交易密码
            tui_id: tui_id, //推荐人ID
            data_code: "", //接口返回的code  例如10002  1 等
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
    checkMobile (phone){ //手机号码验证
        if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone))){ 
         return false; 
        } else{
          return true;
        }
      }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){ //注册成功
                        window.history.back();
                    }
                })
            }
        , 1000)
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
    handleSendCode (){  //发送验证码
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
    passValidate (e){
        const value = e.value;
        const type = e.type;
        if(type !== "l_pass" && type !== "rl_pass"){ //如果不是登录密码 而是交易密码的话
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
    register () {  //注册
        const self = this;
        const phone = this.state.phone;
        const code = this.state.code;
        const l_pass = this.state.l_pass;
        const rl_pass = this.state.rl_pass;
        const t_pass = this.state.t_pass;
        const rt_pass = this.state.rt_pass;
        const tui_id = this.state.tui_id;
        if(!this.checkMobile(phone)){
            this.setState({
                warningDlgShow: true,
                warningDlgText: "请输入正确的手机号码",
            }, function(){
                self.hanleWarningDlgTimer()
            });
            return;
          }
          axios.post(window.baseUrl + "/home/Login/register", qs.stringify({
            token: localStorage.getItem("token"),
            phone: phone,
            code: code,
            l_pass: l_pass,
            rl_pass: rl_pass,
            t_pass: t_pass,
            rt_pass: rt_pass,
            tui_id: tui_id
          })).then(function(res){
              const data = res.data;
              const data_code = data.code;
              self.setState({
                  warningDlgShow: true,
                  warningDlgText: data.msg,
                data_code: data_code
              }, function(){
                  self.hanleWarningDlgTimer({code: data_code})
              })
          })
    }
    render (){
        const countDown = this.state.countDown;
        return <div>
            <Title title="注册页面" code = {this.state.data_code}/>
            <div className="logo"></div>
            <p className="fz_30 text_center">创建账户</p>
            <div className="primary_form" style={{width: '3.392rem', margin: '0 auto'}}>
                <input type="text" placeholder="手机号：" value = {this.state.phone} onChange = {e => {
                    this.handleInputChange({type: "phone", value: e.target.value})
                }}/>
                <div>
                    <input className="code" type="text" placeholder="验证码：" value = {this.state.code} onChange = {e => {
                    this.handleInputChange({type: "code", value: e.target.value})
                }}/>
                    <span className={countDown > 0 && countDown < 60 ? "sendMessage btn btn_default fz_26" : "sendMessage btn btn_primary fz_26"} onClick = {e => {
                        this.handleSendCode()
                    }}>{countDown > 0 && countDown < 60 ? countDown + "s后重新发送" : countDown === 0 ? "重新发送" : "发送短信"}</span>
                </div>
                <input type="password" placeholder="创建密码：" value = {this.state.l_pass} onChange = {e => {
                    this.handleInputChange({type: "l_pass", value: e.target.value})
                }} onBlur = {e => {
                    this.passValidate({type: "l_pass", value: e.target.value})
                }}/>
                <input type="password" placeholder="重复确认密码：" value = {this.state.rl_pass} onChange = {e => {
                    this.handleInputChange({type: "rl_pass", value: e.target.value})
                }} onBlur = {e => {
                    this.passValidate({type: "rl_pass", value: e.target.value})
                }}/>
                <input type="password" placeholder="创建交易密码：" maxLength = "6" value = {this.state.t_pass} onChange = {e => {
                    this.handleInputChange({type: "t_pass", value: e.target.value})
                }} onBlur = {e => {
                    this.passValidate({type: "t_pass", value: e.target.value})
                }}/>
                <input type="password" placeholder="重复交易密码：" maxLength = "6" value = {this.state.rt_pass} onChange = {e => {
                    this.handleInputChange({type: "rt_pass", value: e.target.value})
                }} onBlur = {e => {
                    this.passValidate({type: "rt_pass", value: e.target.value})
                }}/>
                {window.location.hash.indexOf("tui_id") !== -1 ? <input type="text" placeholder="推荐人手机号或ID：" readOnly="true" defaultValue= {this.state.tui_id} />
                 : <input type="text" placeholder="推荐人ID：" value = {this.state.tui_id} onChange = {e => {
                    this.handleInputChange({type: "tui_id", value: e.target.value})
                }}/>}
                
                <span className="btn btn_primary login_btn h_80 fz_26 f_lt mt_50" style={{width: '100%'}}
                onClick={e => {
                    this.register({})
                }}>注册</span>
                <span className="back_login f_lt block fc_gray fz_28 mt_50" style={{width: '100%'}}>
                    <Link to="/">返回登录页面</Link></span>
                    {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningDlgText}/> : null}
            </div>
        </div>
    }
}

export default Register;
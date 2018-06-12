import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import './../css/css/account.css';
import axios from 'axios';
import qs from 'qs';
import Title from './../Title';
import MachineM from '../machineMarket/index';
import ForgetPwd from './ForgetPwd';
import WarningDlg from './../WarningDlg';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      logined: false,
      keepPwd: false,
      phone: localStorage.getItem("phone") || "",
      l_pass: "",
      warningDlgShow: false,
      warningText: ""
    };
  }
  changeInputVal = (obj) => { //input change事件
    var name = obj.name, 
        val = obj.val;
      if(name === "phone"){
        this.setState({
          phone: val
        })
      }
      if(name === "l_pass"){
        this.setState({
          l_pass: val
        })
      }
  }
  keepPwdEvent (){ //记住密码--> 转变为记住手机号吗
    const keepPwd = this.state.keepPwd;
    const phone = this.state.phone;
    this.setState({
      keepPwd: !keepPwd
    }, function(){
      localStorage.setItem("phone", phone);
    })
  }
  checkMobile (phone){ //手机号码验证
    if(!(/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(phone))){ 
     return false; 
    } else{
      return true;
    }
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
  login = (e) => { //登录
    const phone = this.state.phone;
    const l_pass = this.state.l_pass;
    if(!this.checkMobile(phone)){
      alert("请输入正确的手机号码");
    }
    axios.post(window.baseUrl + '/home/Login/login', qs.stringify({
      phone: phone,
      l_pass: l_pass
    })).then(re=>{
      const data = re.data;
      if(data.code === -3){ //登录失败
        this.setState({
            warningDlgShow: true,
            warningText: "登录失败，请确认账号密码是否正确",
        }, function(){
          this.hanleWarningDlgTimer()
      })
      } 
       if(data.code === 1){  //登录成功
        localStorage.setItem("logined", true);
        localStorage.setItem("token", data.data.token);
        this.setState({
          logined: true
        }, function(){
          this.getSundry(data.data.token);
        })
       } else {
        this.setState({
          warningDlgShow: true,
          warningText: data.msg,
      }, function(){
          this.hanleWarningDlgTimer()
      })
      }
    })
  }
  getSundry (token) { //一些杂项的数据
    axios.post(window.baseUrl + "/home/Login/getSundry", qs.stringify({
      token: token,
    })).then(re=>{
      const data = re.data;
      const code = re.code;
     if(data.code === 1){ //成功
      localStorage.setItem("sundryData", JSON.stringify(data.data));  //后面的页面时不时要用到的 先存着
     } else {
        this.setState({
          warningDlgShow: true,
          warningText: data.msg,
      }, function(){
          this.hanleWarningDlgTimer()
      })
     }
    })
  }
  render() {
    if(this.state.logined) {
      return (
       <Redirect to="/machineMarket"/>
      )
     }
    return (
      <div>
        <Title title="登录页面"/>
        <div className="logo"></div>
        <div className="over_hidden primary_form" style={{width: '3.392rem', margin: '0 auto'}}>
            <div style={{padding: '0 .15rem'}}>
              <input className="h_80" type="text" placeholder="手机号" name="phone" value={this.state.phone}
              onChange={e => {
                this.changeInputVal({'name': e.target.name, 'val': e.target.value})
              }} />
              <input className="h_80 mt_50" type="password" placeholder="请输入密码" name="l_pass" value={this.state.l_pass}
              onChange={e => {
                this.changeInputVal({'name': e.target.name, 'val': e.target.value})
              }} />
              <div className="f_lt mt_50" style={{width: '100%', lineHeight: '.15rem'}}>
                <span>
                  <span className="keepPwd fz_30 fc_white f_lt"
                    onClick = {e => {
                      this.keepPwdEvent()
                    }}
                  >{this.state.keepPwd ? <span>√</span> : null}</span>
                  <label className="fz_26 fc_blue f_lt ml_10">记住手机号</label>
                </span>
                <Link to = "/account/forgetLoginPwd"><span className="fz_26 fc_blue f_rt">忘记密码？</span></Link>
              </div>
              <span className="btn btn_primary login_btn h_80 fz_26 f_lt mt_50" style={{width: '100%'}}
              onClick={e => {
                this.login({})
              }}>登录</span>
              <Link to="/account/register">
                <span className="btn register_btn h_80 fz_26 f_lt" style={{width: '100%', marginTop: '.67rem', color: 'white'}}>注册</span>
              </Link>  
              </div>    
        </div>
        {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
      </div>
    );
  }
}

export default Login;
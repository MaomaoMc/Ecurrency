import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';

class ChangePwd extends Component {
    constructor (props){
        super(props);
        const hash = window.location.hash;
        let type , title;
        if(hash.indexOf("changeLoginPwd") !== -1){
            type = "1";
            title = "修改登录密码";
        }else{
            type = "2";
            title = "修改交易密码";
        }
        this.state = {
            type: type,  //1 -修改登录密码 2 - 修改交易密码
            oldpass: "",
            pass: "",
            repass: "",
            title: title,
            code: "",
            warningDlgShow: false,
            warningText: ""
        }
    }
    handleInputChange (e){  //input change event
        const type = e.type;
        const val = e.val;
        this.setState({
            [type]: val
        })
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
    passValidate (e){
        const type = this.state.type;
        const value = e.value;
        if(type === 2){ //修改交易密码
            if(value.length < 6){
                this.setState({
                    warningDlgShow: true,
                    warningText: "交易密码不能小于6位"
                }, function(){
                    this.hanleWarningDlgTimer()
                })
            } 
        }
        
        if(!(/^[A-Za-z0-9]+$/.test(value))){  //密码只能是6位数 的字母加数字
            this.setState({
                warningDlgShow: true,
                warningText: "密码只能是字母或数字组成"
            }, function(){
                this.hanleWarningDlgTimer()
            })
        }
    }
    submit() {  //提交
        const state = this.state;
        const type = state.type;
        const oldpass = state.oldpass;
        const pass = state.pass;
        const repass = state.repass;
        const self = this;
        axios.post(window.baseUrl + "/home/Member/editPass", qs.stringify({
            token: localStorage.getItem("token"),
            type: type,
            oldpass: oldpass,
            pass: pass,
            repass: repass
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            self.setState({
                warningDlgShow: true,
                warningText: data.msg,
                code: code
            }, function(){
                this.hanleWarningDlgTimer()
            })
        })
    }
    render() {
        const type = this.state.type;
        return <div>
            <Title title={this.state.title} code = {this.state.code} />
            <div className="account_form fz_26">
                <div>
                    <label>旧密码：</label>
                    <input type="password" name="" maxLength = {type === "2" ? "6" : ""} placeholder="请输入旧密码" value = {this.state.oldpass}
                    onChange = {e => {
                        this.handleInputChange({type: "oldpass", val: e.target.value})
                    }} onBlur = {e => {
                        this.passValidate({value: e.target.value})
                    }}
                    />
                </div>
                <div>
                    <label>新密码：</label>
                    <input type="password" placeholder="请输入新密码" maxLength = {type === "2" ? "6" : ""} value = {this.state.pass}
                    onChange = {e => {
                        this.handleInputChange({type: "pass", val: e.target.value})
                    }} onBlur = {e => {
                        this.passValidate({value: e.target.value})
                    }}
                    />
                </div>
                <div>
                    <label>重复密码：</label>
                    <input type="password" placeholder="请确认新密码" maxLength = {type === "2" ? "6" : ""} value = {this.state.repass} 
                    onChange = {e => {
                        this.handleInputChange({type: "repass", val: e.target.value})
                    }} onBlur = {e => {
                        this.passValidate({value: e.target.value})
                    }}
                    />
                </div>

                <span className="btn btn_primary login_btn h_80 fz_26 f_lt mt_50" style={{ width: '100%' }}
                    onClick={e => {
                        this.submit({})
                    }}>提交</span>
            </div>
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default ChangePwd;
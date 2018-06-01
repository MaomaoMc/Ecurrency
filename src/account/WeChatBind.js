import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';

class WeChatBind extends Component{
    constructor (props){
        super(props);
        this.state ={
            wx_num: "",  //账号
            warningDlgShow: false,
            warningText: ""
        }
    }
    handleInputChange (e){
        const type = e.type;
        const value = e.val;
        if(type === "wx_num"){
            this.setState({
                wx_num: value
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
    submit (){ //提交
        const self = this;
        const wx_num = this.state.wx_num;
        axios.post(window.baseUrl + "/home/Member/bindWxNum", qs.stringify({
            token: localStorage.getItem("token"),
            wx_num: wx_num
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            self.setState({
                warningDlgShow: true,
                warningText: data.msg,
                code: code
            }, function(){
                self.hanleWarningDlgTimer({code: code});
            })
        })
    }
    render (){
        return <div>
            <Title title="微信绑定" code = {this.state.code}/>
            <div className="account_form fz_26">
                <div>
                    <label>账号：</label>
                    <input type="text" name="" placeholder="请输入微信账号" value = {this.state.wx_num}
                    onChange = {e => {
                        this.handleInputChange({type: "wx_num", val: e.target.value})
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

export default WeChatBind;
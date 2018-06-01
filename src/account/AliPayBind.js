import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';

class AliPayBind extends Component{
    constructor (props){
        super(props);
        this.state ={
            zfb_num: "",  //账号
            warningDlgShow: false,
            warningText: ""
        }
    }
    handleInputChange (e){
        const type = e.type;
        const value = e.val;
        if(type === "zfb_num"){
            this.setState({
                zfb_num: value
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
        const zfb_num = this.state.zfb_num;
        axios.post(window.baseUrl + "/home/Member/bindZfbNum", qs.stringify({
            token: localStorage.getItem("token"),
            zfb_num: zfb_num
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            self.setState({
                warningDlgShow: true,
                warningText: data.msg,
                code: code
            }, function(){
                this.hanleWarningDlgTimer({code: code})
            })
        })
    }
    render (){
        return <div>
            <Title title="支付宝绑定" code = {this.state.code}/>
            <div className="account_form fz_26">
                <div>
                    <label>账号：</label>
                    <input type="text" name="" placeholder="请输入支付宝账号" value = {this.state.zfb_num}
                    onChange = {e => {
                        this.handleInputChange({type: "zfb_num", val: e.target.value})
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

export default AliPayBind;
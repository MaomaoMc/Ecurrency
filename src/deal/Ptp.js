import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import WarningDlg from './../WarningDlg';
import Shadow from './../Shadow';

class Ptp extends Component {
    constructor (props){
        super(props);
        this.state = {
            buy_num: "",
            price: "",
            num: "",
            dlgShow: false,  //交易密码弹窗
            warningDlgShow: false,
            warningText: ""
        }
    }
    handleInputChange (e){
        const type = e.type;
        const val = e.value;
        this.setState({
            [type]: val
        })
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                   if(obj && obj.code === 1){
                       window.location.reload();
                   }
                })
            }
        , 1000)
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
            const pass = this.state.pass;
            const token = localStorage.getItem("token");
            const buy_num = this.state.buy_num;
            const price = this.state.price;
            const num = this.state.num;
            const self = this;
            axios.post(window.baseUrl + "/home/Trade/faceTrade", qs.stringify({
                token : token,
                buy_num: buy_num,
                price: price,
                num: num,
                pass: pass  //交易密码
            })).then(function(res){
                const data = res.data;
                const code = data.code;
                self.setState({
                    dlgShow: false,
                    pass: "",
                    warningDlgShow: true,
                    warningText: data.msg,
                    code: code
                }, function(){
                    self.hanleWarningDlgTimer({code: code})
                });
            })
        }
    }
    handleSell (){  //卖出
        this.setState({
            dlgShow: true
        })
    }
    render(){
        if(this.state.code > 10000){  //token 过期
            window.tokenLoseFun();
            return (
                <Redirect to="/"/>
            )
        }
        return <div> 
            <div className="ptpFrom mt_20">
                <ul className="f_flex">
                    <li>
                        <span>ID</span>
                        <input type="text" placeholder = "请输入买家的ID号" value = {this.state.buy_num}
                        onChange = {e => {
                            this.handleInputChange({type: "buy_num", value: e.target.value})
                        }}
                        />
                    </li>
                    <li>
                        <span>数量</span>
                        <input type="text" placeholder = "请输入售出的数量" value = {this.state.num}
                         onChange = {e => {
                            this.handleInputChange({type: "num", value: e.target.value})
                        }}
                        />
                    </li>
                    <li>
                        <span>约定价</span>
                        <input type="text" placeholder = "请输入约定价格" value = {this.state.price}
                         onChange = {e => {
                            this.handleInputChange({type: "price", value: e.target.value})
                        }}
                        />
                    </li>
                </ul>
                <p className="fz_18 fc_blue mt_10">*交易手续费20%；如转入100E币，系统将扣120E币。</p>
                <span className="btn btn_primary" style = {{height: ".35rem", lineHeight: ".35rem", width: "1.5rem",
                 display: "block", margin: ".2rem auto"}}
                onClick = {e => {
                    this.handleSell()
                }}>卖出</span>
            </div>
            <div className={this.state.dlgShow ? "dialog dlgPayPwd" : "dialog dlgPayPwd hide"}>
                <div className="dlg_form">
                    <p className="text_center fz_32">请输入支付密码：</p>
                    <input type="password" value = {this.state.pass} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                    <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="optWrap f_flex">
                        <span className="btn fz_32 f_lt" style = {{color: "#e73b38"}} onClick = {e => {
                            this.handlePayPwd({type: "cancel"})
                        }}>取消</span>
                        <span className="btn fz_32 f_rt" onClick = {e => {
                            this.handlePayPwd({type: "confirm"})
                        }}>确定</span>
                    </div>
                </div>
            </div>
            {this.state.dlgShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default Ptp;
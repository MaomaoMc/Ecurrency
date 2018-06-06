import React, {Component} from 'react';
import {Link,Redirect} from 'react-router-dom';
import axios from "axios";
import qs from "qs";
import Shadow from './../Shadow';
import WarningDlg from './../WarningDlg';

const tabs = [
    {
        type: "1",
        text: "我的买单"
    },
    {
        type: "2",
        text: "我的卖单"
    }
]
class DealRecords extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          dlgShow: false,
          shadowShow: false,
            tabIndex: 0,
            type: 1,  //我的买单 还是卖单
            dealRecords: [],  
          trade_id: "",  //确认收付款的时候需要的
          trade_type: "", ///确认收付款的时候需要的  是付款还是收款
          tradePassPwd: "",
          code: "",
          msgDlgShow: false,  //买卖家信息弹窗 
          msgDlgData: {},
          warningDlgShow: false,
          warningText: ""
        };
      }
    hanleTabEvent (e){ //我的买单 我的卖单 切换
        const tabIndex = e.tabIndex;
        this.setState({
            tabIndex: tabIndex,
            type: tabIndex + 1
        }, function(){
            this.fetchDealRecords();
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
    handleMoneyEvent (e){  //确认付款 收款
        const trade_id = e.trade_id;
        const trade_type = e.type;
        this.setState({
            dlgShow: true,
            shadowShow: true,
            trade_id: trade_id,
            trade_type: trade_type,
        })
    }
    handlePwdEvent (e){  //支付密码
        const value = e.val;
        this.setState({
            tradePassPwd: value
        })
    }
    handlePayPwd (e){ //弹窗 取消/确定
        const type = e.type;
        if(type === "cancel"){  //取消
            this.setState({
                dlgShow: false,
                shadowShow: false
            })
        }else{   //如果是 确定的话  要判断支付密码是否正确了
            const self = this;
            const trade_id = this.state.trade_id;
            const trade_type = this.state.trade_type;
            const tradePassPwd = this.state.tradePassPwd;
            axios.post(window.baseUrl + "/home/Trade/" + trade_type, qs.stringify({
                token: localStorage.getItem("token"),
                trade_id: trade_id,
                pass: tradePassPwd
            })).then(re => {
                const data = re.data;
                const code = data.code;
                if(code === 1){ //购买成功
                    this.setState({
                        dlgShow: false,
                        shadowShow: false
                    })
                }
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg,
                    tradePassPwd: "",
                    code: code
                }, function(){
                    self.hanleWarningDlgTimer({code: code})
                })
            })
        }
       
    }

    fetchDealRecords (){  //我的卖单 我的买单的 数据
        const type = this.state.type;
        const self = this;
        axios.post(window.baseUrl + "/home/Member/myTradeList", qs.stringify({
            token: localStorage.getItem("token"),
            type: type
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){
                self.setState({
                    dealRecords: data.data
                })
            }else{
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
    showBuyerSellerMsg (e){  //买卖家信息
        const id = e.id;
        const type = this.state.type;
        const self = this;
        let paramsStr1 = "", paramsStr2 = "";
        if(type === 1){ //我的买单
            paramsStr1 = "getSellMsg";
            paramsStr2 = "sell_id";
        }else{  //我的卖单
            paramsStr1 = "getBuyMsg";
            paramsStr2 = "buy_id";
        }
        axios.post(window.baseUrl + "/home/Member/" + paramsStr1 + "?" + paramsStr2 + "=" + id , qs.stringify({
            token: localStorage.getItem("token")
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){
                self.setState({
                    msgDlgData: data.data,
                    msgDlgShow: true,
                    shadowShow: true
                })
            }else{
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
            }
        })
    }
    componentDidMount (){
        this.fetchDealRecords();
    }
    render(){
        const self = this;
        const dealRecords = this.state.dealRecords;
        const type = self.state.type; //买单  还是  卖单
        const msgDlgData = this.state.msgDlgData;  //买卖家弹窗信息
        if(this.state.code > 10000){  //token 过期
            window.tokenLoseFun();
            return (
                <Redirect to="/"/>
            )
        }
        return <div>
            <div className="dealRecords">
                <ul className="tabs f_flex">
                    {
                        tabs.map(function(tab, i){
                            return <li key = {i} className = {self.state.tabIndex === i ? "active" : ""}>
                                <a onClick = {e => {
                                    self.hanleTabEvent({tabIndex: i})
                                }}>{tab.text}</a>
                            </li>
                        })
                    }
                </ul>
                <div style = {{ width: "94%", height: "1.62rem", marginTop: ".1rem", overflowY: "auto", position: "absolute", top: ".4rem"}}>
                    <ul className = "records f_flex">
                    {
                        dealRecords.length > 0 && dealRecords.map(function(record, i){
                            const status_msg = record.status_msg;
                            return <li key = {i}>
                                <a onClick = {e => {
                                    self.showBuyerSellerMsg({id: type === 1 ? record.sell_id : record.buy_id})
                                }}>
                                    <p className = "fz_20 over_hidden"><span className = "f_lt fc_blue">单号 ：{record.trade_num}</span>
                                        <span className = "f_rt">{status_msg}</span></p>
                                    <p className = "fz_20">{type === 1 ? "卖家ID ：" + record.sell_msg : "买家ID：" + record.buy_msg}</p>
                                    <p className = "fz_20">挂卖{record.num}E币，单价{record.price}元</p>
                                    <p className = "fz_20">总价{parseFloat(record.num * record.price).toFixed(2)}</p>
                                </a>
                                {type === 1 && status_msg === "已付币" ? <span className="btn fz_20" onClick = { e => {
                                    self.handleMoneyEvent({trade_id: record.trade_id, type: "maskSetMoney"})
                                }}>确认付款</span> : null}
                                {type === 2 && status_msg === "已付款" ? <span className="btn fz_20" onClick = { e => {
                                    self.handleMoneyEvent({trade_id: record.trade_id, type: "maskGetMoney"})
                                }}>确认收款</span> : null}
                            </li>
                        })
                    }
                    </ul>
                    {/* <div className="loadMore fz_12 fc_gray text_center mt_20" ref="wrapper"
             onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isLoadingMore ? "没有更多数据了" : "加载更多"}</div> */}
                </div>
               
            </div>
            <div className={this.state.dlgShow ? "dialog dlgPayPwd" : "dialog dlgPayPwd hide"}>
                <div className="dlg_form">
                    <p className="text_center fz_32 mb_10">请输入支付密码：</p>
                    <input type="password" value = {this.state.tradePassPwd} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                    <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="optWrap f_flex">
                        <span className="btn fz_32 f_lt" style = {{color: "#e73b38"}} onClick = {e => {
                            self.handlePayPwd({type: "cancel"})
                        }}>取消</span>
                        <span className="btn fz_32 f_rt" onClick = {e => {
                            self.handlePayPwd({type: "confirm"})
                        }}>确定</span>
                    </div>
                </div>
            </div>
            <div className={this.state.msgDlgShow ? "dialog dlgMsg" : "dialog dlgMsg hide"}>
                <div style = {{paddingTop: ".2rem"}}>
                    <p className="dlg_tit fz_32 text_center">{type === 1 ? "卖家信息" : "买家信息"}</p>
                    <a className="btn_close fz_32" style = {{top: ".1rem", right: ".05rem"}} onClick = {e => {
                        self.setState({msgDlgShow: false, shadowShow: false})
                    }}>X</a>
                    <div style={{padding: '.1rem .5rem'}}>
                        <ul className="f_flex fz_24">
                            <li>姓名：{msgDlgData.name}</li>
                            <li>手机号：{msgDlgData.phone}</li>
                            <li>微信账号：{msgDlgData.wx_num}</li>
                            <li>支付宝账号：{msgDlgData.zfb_num}</li>
                            <li>银行卡名称：{msgDlgData.bank_name}</li>
                            <li>银行卡账号：{msgDlgData.bank_num}</li>
                        </ul>
                    </div>
                </div>
            </div>
            {this.state.shadowShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default DealRecords;
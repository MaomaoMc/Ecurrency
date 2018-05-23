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
            <div className="dealRecords b_blue1">
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
                <div style = {{height: "1.62rem", marginTop: ".4rem", overflowY: "auto"}}>
                    <ul className = "records f_flex">
                    {
                        dealRecords.length > 0 && dealRecords.map(function(record, i){
                            const status_msg = record.status_msg;
                            return <li key = {i}>
                                <a onClick = {e => {
                                    self.showBuyerSellerMsg({id: type === 1 ? record.sell_id : record.buy_id})
                                }}><p className = "fz_20 over_hidden"><span className = "f_lt fc_blue">单号 ：{record.trade_num}</span>
                                    <span className = "f_rt fc_white">{status_msg}</span></p>
                                <p className = "fc_white fz_20">{type === 1 ? "卖家ID ：" + record.sell_msg : "买家ID：" + record.buy_msg}</p>
                                <p className = "fc_white fz_20">挂卖{record.num}JSD，单价{record.price}元，总价{parseFloat(record.num * record.price).toFixed(2)}</p>
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
                <p className="dlg_tit fc_white">输入密码</p>
                <div className="dlg_form">
                    <p className="text_center fz_24 fc_white">请输入支付密码：</p>
                    <input className="b_blue1" type="password" value = {this.state.tradePassPwd} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                    <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="over_hidden" style={{padding: "0 .14rem"}}>
                        <span className="btn fz_24 fc_white f_lt" onClick = {e => {
                            self.handlePayPwd({type: "cancel"})
                        }}>取消</span>
                        <span className="btn fz_24 fc_white f_rt" onClick = {e => {
                            self.handlePayPwd({type: "confirm"})
                        }}>确定</span>
                    </div>
                </div>
            </div>
            <div className={this.state.msgDlgShow ? "dialog dlgZtMessage" : "dialog dlgZtMessage hide"}>
                <p className="dlg_tit fc_white">{type === 1 ? "卖家信息" : "买家信息"}</p>
                <a className="btn_close" onClick = {e => {
                    self.setState({msgDlgShow: false, shadowShow: false})
                }}></a>
                <div style={{padding: '.25rem'}}>
                    <ul className="f_flex">
                        <li style={{lineHeight: ".3rem"}}>姓名：{msgDlgData.name}</li>
                        <li style={{lineHeight: ".3rem"}}>手机号：{msgDlgData.phone}</li>
                        <li style={{lineHeight: ".3rem"}}>微信账号：{msgDlgData.wx_num}</li>
                        <li style={{lineHeight: ".3rem"}}>支付宝账号：{msgDlgData.zfb_num}</li>
                    </ul>
                </div>
            </div>
            {this.state.shadowShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default DealRecords;
import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from "axios";
import qs from 'qs';
import Tab from './../Tab';
import Title from './../Title';
import WarningDlg from './../WarningDlg';
import Shadow from './../Shadow';
import './../css/css/machineM.css'; //机市css

const baseUrl = window.baseUrl;
class MachineM extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            token: "",
            id: "",
            buyMinerSuccess: false,  //购买矿机是否成功  成功的话跳转到我的矿机页面去
            shadowShow: false,
            dlgShow: false,
            warningDlgShow: false,
            warningText: "", //警告文字
            tradePassPwd: "",
            code: ""
        };
      }
    handlePwdEvent (e){  //交易密码
        this.setState({
            tradePassPwd: e.val
        })
    }
    handleBayEvent (e){  //购买矿机
        this.setState({
            dlgShow: true,
            shadowShow: true,
            id: e.id
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
    handleDlgEvent (e){  //取消购买 或者确定购买
        const type = e.type;
        const token = this.state.token;
        const id = this.state.id;
        const tradePassPwd = this.state.tradePassPwd;
        if(type === "cancel"){  //取消
            this.setState({
                dlgShow: false,
                shadowShow: false,
                id: ""
            })
        }else{  //如果是 确定的话  
            const self = this;
            axios.post(baseUrl + "/home/Index/buyMill", qs.stringify({
                token: token,
                id: id,
                pass: tradePassPwd
            })).then(re => {
                const data = re.data;
                const code = data.code;
                if(code === 1){ //购买成功 购买矿机成功的话跳转到 我的矿机页面
                    this.setState({
                        dlgShow: false,
                        shadowShow: false,
                        tradePassPwd: "",
                        buyMinerSuccess: true
                    })
                }else if(code === -3){//如果jsd余额不足
                    this.setState({
                        dlgShow: false,
                        shadowShow: false,
                        warningDlgShow: true,
                        warningText: "JSD不足",
                        tradePassPwd: ""
                    }, function(){
                        this.hanleWarningDlgTimer()
                    })
                }else{  //不管有什么弹出来 万一失败了 用户好知道
                    this.setState({
                        warningDlgShow: true,
                        warningText: data.msg
                    }, function(){
                        this.hanleWarningDlgTimer()
                    })
                }
            })
             
        }
    }
    ajax (){
        const token = localStorage.getItem("token");
        const self = this;
        axios.post(baseUrl + "/home/Index/millShop", qs.stringify({
            token: token,
          })).then(re=>{
            const data = re.data;
            const code = data.code;
           if(code === 1){ //成功
            self.setState({
                data: data.data,
                token: token
            })
           } else {
            this.setState({
                warningDlgShow: true,
                warningText: data.msg
            }, function(){
                this.hanleWarningDlgTimer();
            })
           }
           self.setState({
            code: code
           })
        })
    }
    componentDidMount (){
        this.ajax();
    }
    render(){
        const self = this;
        const data = this.state.data;
        if(this.state.buyMinerSuccess){ // 购买矿机成功的话跳转到 我的矿机页面
            return <Redirect to = "/account/myMineral"/>
        }
        return <div>
            <Title  title="机市" code = {this.state.code}/>
            <div style={{padding: '0 .11rem 2rem'}}>
                {
                     data.length > 0 && data.map(function (item, i) {
                        return <div key={i} className="item">
                            <div className="goodPic f_lt" style={{backgroundImage: "url(" + baseUrl + item.pic + ")"}}></div>
                            <div className="goodItem f_rt">
                                <h6 className="fz_30 fc_blue">{item.name}</h6>
                                <div>
                                    <div className="f_lt fz_22">
                                        <p>算力：{item.force}</p>
                                        <p>运行周期：{item.time}</p>
                                        <p>收益总量：{item.earning}</p>
                                    </div>
                                    <div className="cart fz_26" onClick = { e => {
                                            self.handleBayEvent({id: item.id})
                                        }}>
                                        <i className="cart_icon"></i>
                                       <span> {item.price} JSD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className={this.state.dlgShow ? "dialog dlgPayKj" : "dialog dlgPayKj hide"}>
                <p className="dlg_tit fc_white">购买矿机</p>
                <div className="dlg_form">
                    <input className="b_blue1 mt_40 fc_white" type="password" placeholder = "请输入交易密码" 
                    value = {this.state.tradePassPwd} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                     <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="over_hidden" style={{padding: "0 .14rem"}}>
                        <span className="btn fz_24 fc_white f_lt" onClick = {e => {
                            self.handleDlgEvent({type: "cancel"})
                        }}>取消</span>
                        <span className="btn fz_24 fc_white f_rt" onClick = {e => {
                            self.handleDlgEvent({type: "confirm"})
                        }}>确定</span>
                    </div>
                </div>
            </div>
            {this.state.shadowShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
            <Tab />
        </div>
    }
}

export default MachineM;
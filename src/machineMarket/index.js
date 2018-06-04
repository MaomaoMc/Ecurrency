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
            data: [],  //矿机列表
            jfData: [], //积分的列表
            opt_type: "",
            jf_poor: false, //积分不足
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
            id: e.id,
            opt_type: "buyMill"
        })
    }
    handleJfBayEvent (e){  //积分购买矿机
        this.setState({
            dlgShow: true,
            shadowShow: true,
            id: e.id,
            opt_type: "jf_buyMill"
        })
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){ //购买成功 购买矿机成功的话跳转到 我的矿机页面
                        self.setState({
                            buyMinerSuccess: true
                        })
                    }
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
            const opt_type = this.state.opt_type;
            const paramStr = opt_type === "buyMill" ? "/home/Index/buyMill" : "/home/Index/jifenbuyMill";
            axios.post(baseUrl + paramStr, qs.stringify({
                token: token,
                id: id,
                pass: tradePassPwd
            })).then(re => {
                const data = re.data;
                const code = data.code;
                if(data.msg === "积分不足"){  //积分不足的时候 单独处理弹出一个二维码出来
                    self.setState({
                        jf_poor: true,
                        dlgShow: false,
                        shadowShow: true
                    })
                }else{
                    self.setState({
                        dlgShow: false,
                        shadowShow: false,
                        warningDlgShow: true,
                        warningText: data.msg,
                        tradePassPwd: ""
                    }, function(){
                        self.hanleWarningDlgTimer({code: code})
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
                    warningText: data.msg,
                    code: code
                }, function(){
                    this.hanleWarningDlgTimer();
                })
           }
        })
    }
    jfAjax (){
        const token = localStorage.getItem("token");
        const self = this;
        axios.post(baseUrl + "/home/Index/jifenmillShop", qs.stringify({
            token: token,
          })).then(re=>{
            const data = re.data;
            const code = data.code;
           if(code === 1){ //成功
            self.setState({
                jfData: data.data,
                token: token
            })
           } else {
                this.setState({
                    warningDlgShow: true,
                    warningText: data.msg,
                    code: code
                }, function(){
                    this.hanleWarningDlgTimer();
                })
           }
        })
    }
    componentDidMount (){
        this.ajax();
        this.jfAjax();
    }
    render(){
        const self = this;
        const data = this.state.data;
        const jfData = this.state.jfData;
        if(this.state.buyMinerSuccess){ // 购买矿机成功的话跳转到 我的矿机页面
            return <Redirect to = "/account/myMineral"/>
        }
        return <div>
            <Title  title="机市" code = {this.state.code}/>
            <div className = "pb_100" style = {{marginBottom: ".2rem"}}>
                <p style = {{fontSize: ".2rem", fontWeight: 600, textIndent: ".2rem", margin: ".1rem 0"}}>积分矿机</p>
                <div>
                {
                    jfData.length > 0 && jfData.map(function (item, i) {
                        return <div key={i} className="item">
                            <div className="goodPic f_lt" style={{backgroundImage: "url(" + baseUrl + item.pic + ")"}}></div>
                            <div className="goodItem f_lt">
                                <h6 className="fz_30">{item.name}</h6>
                                <div>
                                    <div className="f_lt fz_22">
                                        <p>算力：{item.force}</p>
                                        <p>运行周期：{item.time}</p>
                                        <p>收益总量：{item.earning}</p>
                                    </div>
                                    <div className="cart fz_26" onClick = { e => {
                                            self.handleJfBayEvent({id: item.id})
                                        }}>
                                        <i className="cart_icon"></i>
                                    <span> {item.money} 积分</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
                </div>
                <p style = {{fontSize: ".2rem", fontWeight: 600, textIndent: ".2rem", margin: ".1rem 0"}}>矿机列表</p>
                {
                     data.length > 0 && data.map(function (item, i) {
                        return <div key={i} className="item">
                            <div className="goodPic f_lt" style={{backgroundImage: "url(" + baseUrl + item.pic + ")"}}></div>
                            <div className="goodItem f_lt">
                                <h6 className="fz_30">{item.name}</h6>
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
                                       <span> {item.price} E币</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
                
            </div>
            {this.state.jf_poor ? <div style = {{width: "2.5rem", height: "2.3rem", backgroundColor: "white", position: "fixed", top: "50%", left: "50%",
            marginTop: "-1rem", marginLeft: "-1rem",zIndex: 100}}>
                <p className = "fz_32 text_center" style = {{marginTop: ".35rem"}}>积分不足, 请扫描二维码重新支付</p>
                <p className = "text_center">
                    <img style = {{width: "1.2rem", height: "1.2rem"}} src = {window.baseUrl + JSON.parse(localStorage.getItem("sundryData")).wx_pic} alt = ""/>
                </p>
                <span className = "fz_32" style = {{displa: "block", width: ".2rem", height: ".2rem", position: "absolute", top: ".1rem", right: ".1rem"}}
                onClick = {e => {
                    this.setState({
                        jf_poor: false,
                        shadowShow: false,
                        tradePassPwd: ""
                    })
                }}>X</span>
            </div> : null}
            <div className={this.state.dlgShow ? "dialog dlgPayKj" : "dialog dlgPayKj hide"}>
                <div className="dlg_form">
                    <p className = "fz_32">确认购买当前矿机？</p>
                    <input className="mt_20" type="password" placeholder = "请输入交易密码" 
                    value = {this.state.tradePassPwd} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                     <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="optWrap f_flex">
                        <span className="fz_32 f_lt" style = {{color: "#e73b38"}} onClick = {e => {
                            self.handleDlgEvent({type: "cancel"})
                        }}>取消</span>
                        <span className="fz_32 f_rt" onClick = {e => {
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
import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
//引入
import copy from 'copy-to-clipboard';

import Tab from './../Tab';
import Title from './../Title';
import Shadow from './../Shadow';
import WarningDlg from './../WarningDlg';
import './../css/css/mineralPool.css';

const pic_toux = require("../img/pic_toux.png");
class MineralPool extends Component {
    constructor (props){
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            code: "",
            force: 0, //算力
            num: 0, //总矿工数
            tabIndex: 0,
            orePoolTuiAjaxed: false,  //是否已经请求过
            orePoolTeamAjaxed: false,
            mineralItems: [],
            tuiItems: [],
            teamItems: [],
            dlgZtDlgShow: false,
            dlgZtMessageShow: false,
            shadowShow: false,
            dlgIdNum: "",
            dlgIdPhone: "",
            tanTuiData: {

            },
            warningDlgShow: false,
            warningText: ""
        };
    }
    handleZtDlgEvent (e){
        const type = e.type;
        if(type === "close"){
            this.setState({
                dlgZtDlgShow: false,
                shadowShow: false
            })
        }
        if(type === "open"){
            this.setState({
                dlgZtDlgShow: true,
                shadowShow: true
            }, function(){
                this.tanTuiMsgAjax()
            })
        }
    }
    handleMessageDlg (e){
        const type = e.type;
        const id = e.id;
        const phone = e.phone;
        if(type === "close"){
            this.setState({
                dlgZtMessageShow: false,
                shadowShow: false
            })
        }
        if(type === "open"){
            this.setState({
                dlgZtMessageShow: true,
                shadowShow: true,
                dlgIdNum: id,
                dlgIdPhone: phone
            })
        }
    }
    handleDealTab (e){ //tab切换
        const type = e.type;
        let tabIndex = 0;
        if(type === "tui"){ //直推
            tabIndex = 0;
        }
        if(type === "team"){ //团队
            tabIndex = 1;
        }
        this.setState({
            tabIndex: tabIndex
        }, function(){
            this.orePoolItemsAjax();
        })
        
    }
    copy (e){
        //使用方法
        copy(e.text);
        alert('复制成功');
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
    orePoolAjax (){  //总览的数据获取
        const baseUrl = window.baseUrl;
        const token = this.state.token;
        const self = this;
        axios.post(baseUrl + "/home/Trade/orePool", qs.stringify({
            token: token
        })).then(res => {
            const data = res.data;
            const code = data.code;
            if(code === 1){  //成功
                this.setState({
                    force: data.data.force, //算力
                    num: data.data.num, //总矿工数
                })
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
           }
            self.setState({
                code: data.code
            })
        })
    }
    orePoolItemsAjax (){  //直推、团队下面的明细列表的数据获取
        const baseUrl = window.baseUrl;
        const token = this.state.token;
        const self = this;
        const extraUrl = this.state.tabIndex === 0 ? "orePoolTui" : "orePoolTeam";
        axios.post(baseUrl + "/home/Trade/" + extraUrl, qs.stringify({
            token: token
        })).then(res => {
            const data = res.data;
            const code = data.code;
            if(code === 1){  //成功
                this.setState({
                    mineralItems: data.data,
                    tuiItems: data.data
                })
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
           }
            self.setState({
                code: data.code
            });
        })
    }
    tanTuiMsgAjax (){  //点击 总矿工数的 弹窗的数据获取
        const baseUrl = window.baseUrl;
        const token = this.state.token;
        const self = this;
        axios.post(baseUrl + "/home/Trade/tanTuiMsg", qs.stringify({
            token: token
        })).then(res => {
            const data = res.data;
            const code = data.code;
            if(code === 1){  //成功
                this.setState({
                    tanTuiData: data.data
                })
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
           }
            self.setState({
                code: data.code
            });
        })
    }
    componentDidMount (){
        this.orePoolAjax();
        this.orePoolItemsAjax();
    }
    render (){
        const self = this;
        const mineralItems = this.state.mineralItems;
        const tabs = [
            {type: "tui", text: "直推"},
            {type: "team", text: "团队"},
        ];
        const tanTuiData = this.state.tanTuiData;
        return <div style={{paddingBottom: ".4rem"}}>
            <Title title="矿池" code = {this.state.code}/>
            <div style={{padding: '0 .11rem'}}>
                <div className="pool_overview f_flex">
                    <div>
                        <p className="fc_white fz_26">矿池算力（T）</p>
                        <p className="fc_gray fz_22">(截至昨天)</p>
                        <p className="fc_yellow fz_60">{this.state.force}</p>
                    </div>
                    <div onClick = {e => {
                        self.handleZtDlgEvent({type: "open"})
                    }}>
                        <p className="fc_white fz_26">总矿工数</p>
                        <p className="fc_gray fz_22">(截至昨天)</p>
                        <p className="fc_yellow fz_60">{this.state.num}</p>
                    </div>
                </div>
                <ul className="deal_tab f_flex fz_30">
                {
                    tabs.map(function(obj, i){
                        return <li key = {i} className={self.state.tabIndex === i ? "active" : ""}
                         style={{ borderTopLeftRadius: '.25rem', borderBottomLeftRadius: '.25rem'}}>
                            <a
                                onClick = {e => {
                                    self.handleDealTab({type: obj.type})
                                }}
                            ><span>{obj.text}</span></a>
                        </li>
                    })
                }
                </ul>
                <ul className="mineralItems f_flex">
                    {
                        mineralItems.length > 0 && mineralItems.map(function(item, i){
                            const pic = item.pic;
                            return <li key={i} onClick = {e => {
                                self.handleMessageDlg({type: "open", id: item.id_num, phone: item.phone})
                            }}>
                                <div className="f_flex">
                                    <div><img src={pic === "" ? pic_toux : pic} alt=""/></div>
                                    <div>
                                        <p>ID：{item.id_num}</p>
                                        <p>{item.level}</p>
                                    </div>
                                    <div>
                                        <p>算力：{item.force}</p>
                                        <p>直推：{item.tui_num}</p>
                                    </div>
                                    <div>
                                        <p>矿机：{item.count}</p>
                                        <p>团队：{item.team_num}</p>
                                    </div>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className={this.state.dlgZtDlgShow ? "dialog dlgZtMessage" : "dialog dlgZtMessage hide"}>
                <p className="dlg_tit fc_white">直推信息</p>
                <a className="btn_close" onClick = {e => {
                    self.handleZtDlgEvent({type: "close"})
                }}></a>
                <div style={{padding: '.25rem .45rem'}}>
                    <ul className="f_flex">
                        <li>
                            <span>总直推数：{tanTuiData.count}</span>
                            <span className="f_rt">入门矿工：{tanTuiData.one}</span>
                        </li>
                        <li>
                            <span>初级矿工：{tanTuiData.two}</span>
                            <span className="f_rt">中级矿工：{tanTuiData.three}</span>
                        </li>
                        <li>
                            <span>高级矿工：{tanTuiData.four}</span>
                            <span className="f_rt">顶级矿工：{tanTuiData.five}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={this.state.dlgZtMessageShow ? "dialog dlgMessage" : "dialog dlgMessage hide"}>
                <p className="dlg_tit fc_white">个人信息</p>
                <a className="btn_close" onClick = {e => {
                    self.handleMessageDlg({type: "close"})
                }}></a>
                <div style={{padding: '.25rem .35rem'}}>
                    <div>
                        <span className="label">ID</span>
                        <span className="message">{this.state.dlgIdNum}</span>
                        <span className="btn" 
                            onClick = {e => {
                                this.copy({text: this.state.dlgIdNum})
                            }}
                        >复制</span>
                    </div>
                    <div style={{marginTop: '.245rem'}}>
                        <span className="label">TEL</span>
                        <span className="message">{this.state.dlgIdPhone}</span>
                        <span className="btn"
                             onClick = {e => {
                                this.copy({text: this.state.dlgIdPhone})
                            }}
                        >复制</span>
                    </div>
                </div>
            </div>
            {this.state.shadowShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
            <Tab />
        </div>
    }
}

export default MineralPool;
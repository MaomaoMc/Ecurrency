import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Tab from '../Tab';
import Title from '../Title';
import WarningDlg from './../WarningDlg';
import PersonalData from "./PersonalData";
import Bill from "./Bill";
import ClientService from "./ClientService";
import SystemNotice from "./SystemNotice";
import SystemSet from "./SystemSet";
import MyMineral from "./MyMineral";
// import ExChangeYtf from "./ExChangeYtf";
import SwMarket from "./SwMarket";
import RobPacket from "./RobPacket";
// import LuckDial from "./LuckDial";
// import Lottery from "./Lottery";

import '../css/css/asset.css';
const accountMenus = [
    {
        pic: require("../img/icon_grzl.png"),
        link: "/account/PersonalData",
        component: PersonalData,
        text: "个人资料"
    },
    {
        pic: require("../img/icon_zdzx.png"),
        link: "/account/Bill",
        component: Bill,
        text: "账单中心"
    },
    {
        pic: require("../img/icon_kfzx.png"),
        link: "/account/service",
        component: ClientService,
        text: "客服中心"
    },
    {
        pic: require("../img/icon_xttz.png"),
        link: "/account/systemNotice",
        component: SystemNotice,
        text: "系统通知"
    },
    {
        pic: require("../img/icon_wdzd.png"),
        link: "/mineralPool",
        component: PersonalData,
        text: "我的战队"
    },
    {
        pic: require("../img/icon_xtsz.png"),
        link: "/account/systemSet",
        component: SystemSet,
        text: "系统设置"
    },
    {
        pic: require("../img/icon_wdkj_nor.png"),
        link: "/account/myMineral",
        component: MyMineral,
        text: "我的矿机"
    },
    {
        pic: require("../img/icon_qhb_nor.png"),
        link: "/account/robPacket",
        component: RobPacket,
        text: "挂红包"
    },
    {
        pic: require("../img/icon_swsc_nor.png"),
        link: "/account/swMarket",
        component: SwMarket,
        text: "商城"
    },
    // {
    //     pic: require("../img/icon_ykcz_nor.png"),
    //     picActive: require("../img/icon_ykcz_hot.png"),
    //     link: "/account/oilCard",
    //     component: OilCard,
    //     text: "油卡充值"
    // },
    // {
    //     pic: require("../img/icon_ytf_nor.png"),
    //     picActive: require("../img/icon_ytf_hot.png"),
    //     link: "/account/exchangeYtf",
    //     component: ExChangeYtf,
    //     text: "兑换以太坊"
    // },
    // {
    //     pic: require("../img/icon_xuzp_nor.png"),
    //     picActive: require("../img/icon_xuzp_hot.png"),
    //     link: "/account/luckDial",
    //     component: LuckDial,
    //     text: "幸运转盘"
    // },
    //刮刮乐先暂时不要  多出一行不好看
    // {
    //     pic: require("../img/icon_ggl_nor.png"),
    //     picActive: require("../img/icon_ggl_hot.png"),
    //     link: "/account/lottery",
    //     component: Lottery,
    //     text: "刮刮乐"
    // }
];
class Personal extends Component {
    constructor (props){
        super(props);
        this.state = {
            data: {
                total: 0,
                jd_num: 0,
                djd_num: 0,
                warningDlgShow: false,
                warningText: "",
                code: ""
            }
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
    ajax (){
        const self = this;
        axios.post(window.baseUrl + "/home/Member/myMoney", qs.stringify({
            token: localStorage.getItem("token")
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){ //成功
                self.setState({
                    data: data.data
                })  
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg,
                }, function(){
                    self.hanleWarningDlgTimer();
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
    render (){
        const data = this.state.data;
        const sundryData = JSON.parse(localStorage.getItem("sundryData"));
        return <div>
            <Title title="个人中心" code = {this.state.code}/>
           <div className="assetTotal">
            <div className = "text_center">
                <img src={window.baseUrl + sundryData.adminpic} alt=""/>
            </div>
            <ul className = "f_flex">
                <li>
                    <p className = "fc_blue">{data.money}</p>
                    <p>账户积分(E币)</p>
                </li>
                <li>
                    <p className = "fc_blue">{data.jd_num}</p>
                    <p>余额(E币)</p>
                </li>
                <li>
                    <p className = "fc_blue">{data.djd_num}</p>
                    <p>冻结(E币)</p>
                </li>
            </ul>
           </div>
           <div className="account_menus f_flex">
            {
                accountMenus.map(function(item, i){
                    return <div className="menus_item mt_50" key={i}>
                        <Link to = {item.link}>
                            <span className="icon" style={{backgroundImage: "url(" + item.pic + ")"}} activestyle={{backgroundImage: "url(" + item.picActive + ")"}}></span>
                        </Link>
                        <div className="text fz_26 mt_10">{item.text}</div>
                    </div>
                })
            }
           </div>
           {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
           <Tab />
        </div>
    }
}

export default Personal;
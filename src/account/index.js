import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Personal from './Personal';
import Login from './Login';
import Register from './Register';
import PersonalData from './PersonalData';
import Bill from './Bill';
import ClientService from './ClientService';
import SystemNotice from './SystemNotice';
import SystemSet from './SystemSet';
import WeChat from './WeChat';
import AboutJsd from './AboutJsd';
import OilCard from './OilCard';
import ExChangeYtf from './ExChangeYtf';
import SwMarket from './SwMarket';
import RobPacket from './RobPacket';
import LuckDial from './LuckDial';
import Lottery from './Lottery';
import Certify from './Certify';
import ShuaCertify from './ShuaCertify';
import ChangePwd from './ChangePwd';
import WeChatBind from './WeChatBind';
import AliPayBind from './AliPayBind';
import CreditCertify from './CreditCertify';  //银行卡认证
import ForgetPwd from './ForgetPwd';
import NounExplain from './NounExplain';
import Feedback from './Feedback';
import MyMineral from './MyMineral';
import Invite from './Invite';

class Account extends Component {
    render(){
        return <div> 
            <Switch>
                <Route path="/account/register" component = {Register} />
                <Route path="/account/personalData" component = {PersonalData} />
                <Route path="/account/invite" component = {Invite} />
                <Route path="/account/myMineral" component = {MyMineral} />
                {/* <Route path="/account/setHead" component = {SetHead} /> */}
                <Route path="/account/bill" component = {Bill} />
                <Route path="/account/service" component = {ClientService} />
                <Route path="/account/systemNotice" component = {SystemNotice} />
                <Route path="/account/systemSet/about" component = {AboutJsd} />
                <Route path="/account/systemSet/nounExplain" component = {NounExplain} />
                <Route path="/account/systemSet/feedback" component = {Feedback} />
                <Route path="/account/systemSet/wechat" component = {WeChat} />
                <Route path="/account/systemSet" component = {SystemSet} />
                <Route path="/account/oilCard" component = {OilCard} />
                <Route path="/account/exchangeYtf" component = {ExChangeYtf} />
                <Route path="/account/swMarket" component = {SwMarket} />
                <Route path="/account/robPacket" component = {RobPacket} />
                <Route path="/account/luckDial" component = {LuckDial} />
                <Route path="/account/lottery" component = {Lottery} />
                <Route path="/account/creditCertify/:type" component = {CreditCertify} />
                <Route path="/account/certify/:type" component = {Certify} />
                <Route path="/account/shuaCertify/" component = {ShuaCertify} />
                
                <Route path="/account/changeLoginPwd" component = {ChangePwd} />
                <Route path="/account/changeTradePwd" component = {ChangePwd} />
                <Route path="/account/forgetLoginPwd" component = {ForgetPwd} />
                <Route path="/account/forgetTradePwd" component = {ForgetPwd} />
                <Route path="/account/weChatBind" component = {WeChatBind} />
                <Route path="/account/aliPayBind" component = {AliPayBind} />
                <Route path="/" component = {localStorage.getItem("logined") === "true" ? Personal : Login} />
            </Switch>
        </div>
    }
}

export default Account;
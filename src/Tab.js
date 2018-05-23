import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './css/css/common.css';
import './css/css/tab.css';

class Tab extends Component {
    render(){
        const hash = window.location.hash;
        const machineMarketIndex = hash.indexOf("machineMarket");
        const mineralPoolIndex = hash.indexOf("mineralPool");
        const dealIndex = hash.indexOf("deal");
        return <div>
            <ul className="tabUl">
                <li className={machineMarketIndex !== -1 ? "active" : ""}>
                    <Link to="/machineMarket"><span className = "icon js_icon"></span><span>机市</span></Link>
                </li>
                <li className={mineralPoolIndex !== -1 ? "active" : ""}>
                    <Link to="/mineralPool"><span className = "icon kc_icon"></span><span>矿池</span></Link>
                </li>
                <li className={dealIndex !== -1 ? "active" : ""}>
                    <Link to="/deal"><span className="icon jy_icon"></span><span>交易</span></Link>
                </li>
                <li className={machineMarketIndex === -1 && mineralPoolIndex === -1 && dealIndex === -1 ?  "active" : ""}>
                    <Link to="/"><span className = "icon my_icon"></span><span>我的</span></Link>
                </li>
            </ul>
        </div>
    }
}

export default Tab;
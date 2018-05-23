import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Title from '../Title';

class SystemSet extends Component{
    constructor(props) {
        super(props);
        this.state = { 
          exitApp: false,
        };
      }
    exitApp (){ //退出程序
        window.tokenLoseFun();
        this.setState({
            exitApp: true
        })
    }
    render (){
        if(this.state.exitApp) {
            return (
                <Redirect to="/"/>
            )
        }
        return <div>
            <Title title = "系统设置"/>
            <ul className="lists f_flex fz_26" style={{marginTop: 0}}>
                <li>
                    <Link to="/account/systemSet/about">
                        <span className="f_lt fc_blue">关于JSD</span>
                        <span className="f_rt">
                            <span className="go_arrow"></span>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to = "/account/systemSet/nounExplain">
                        <span className="f_lt fc_blue">名词解释</span>
                        <span className="f_rt">
                            <span className="go_arrow"></span>
                        </span> 
                    </Link>
                </li>
                <li>
                    <Link to = "/account/systemSet/feedback">
                        <span className="f_lt fc_blue">留言反馈</span>
                        <span className="f_rt">
                            <span className="go_arrow"></span>
                        </span> 
                    </Link>
                </li>
                <li>
                    <Link to="/account/systemSet/wechat">
                        <span className="f_lt fc_blue">微信客服</span>
                        <span className="f_rt">
                            <span className="fc_white">J_SD</span>
                        </span>
                    </Link>
                </li>
                <li>
                    <span className="f_lt fc_blue">当前版本</span>
                    <span className="f_rt">
                    <span className="fc_white">1.14</span>
                    </span>
                </li>
            </ul>
            <div style={{padding: '0 .2rem'}}>
                <span className="btn btn_primary fz_26"
                 style={{width: "100%", height: ".45rem", lineHeight: '.45rem'}}
                 onClick = {e => {
                     this.exitApp()
                 }}
                >退出程序</span>
            </div>
        </div>
    }
}

export default SystemSet;
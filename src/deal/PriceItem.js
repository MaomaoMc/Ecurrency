import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import WarningDlg from './../WarningDlg';
import '../css/css/deal.css';

class PriceItem extends Component {
    constructor (props){
        super(props);
        this.state = {
            data: {},
            warningDlgShow: false,
            warningText: "",
            code: ""
        }
    }
    componentDidMount (){
        this.ajax();
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
       axios.post(window.baseUrl + "/home/Trade/tradeMsg", qs.stringify({
        token: localStorage.getItem("token")
       })).then(function(res){
           const data = res.data;
           const code = data.code;
           if(code === 1){ //成功
                self.setState({
                    data: data.data,
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
                code: code
            })
       })
    }
    render (){
        const data = this.state.data;
        if(this.state.code > 10000){  //token 过期
            return (
                <Redirect to="/"/>
            )
        }
        return <div className="priceItems f_flex">
            <div className="price">
                <span style={{fontSize: ".35rem"}}>{data.newPrice}</span>
                <span className="fz_30">&nbsp;CNY</span>
            </div>
            <div className="items fz_30">
                <p>高：{data.topPrice}</p>
                <p>量：{data.num}</p>
            </div>
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default PriceItem;
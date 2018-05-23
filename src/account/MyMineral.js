import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from '../WarningDlg';

const baseUrl = window.baseUrl;
// const token = localStorage.getItem("token");
// console.log(token, 'tokentoken')
class MyMineral extends Component  {
    constructor (props){
        super(props);
        this.state = {
            data: [],
            code: "",
            warningDlgShow: false,
            warningDlgtext: "",
        }
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
    ajax (){
        const self = this;
        console.log(localStorage.getItem("token"), 'token')
        axios.post(baseUrl + "/home/Index/myMillList", qs.stringify({
            token: localStorage.getItem("token")
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code !== 1){  //失败的话
                self.setState({
                    warningDlgShow: true,
                    warningDlgtext: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
            }else{
                self.setState({
                    data: data.data
                })
            }
            self.setState({
                code: code
            })
        })
    }
    handleUseMill (e){  //启用矿机
        const self = this;
        axios.post(baseUrl + "/home/Index/useMill", qs.stringify({
            token: localStorage.getItem("token"),
            id: e.id
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            self.setState({
                warningDlgShow: true,
                warningDlgtext: data.msg,
                code: code
            }, function(){
                self.hanleWarningDlgTimer({code: code});
            })
        })
    }
    componentDidMount (){
        this.ajax();  //获取矿机数据
    }
    render (){
        const data = this.state.data;
        const self = this;
        return <div>
            <Title title = "我的矿机" code = {this.state.code}/>
            {/* <div className = "myMineralUl"> */}
                <ul className = "myMineralUl f_flex fz_20 fc_white">
                    {data.length > 0 && data.map(function(item, i){
                        const mill = item.mill;
                        const status_msg = item.status_msg;
                        return <li key = {i}>
                            <p>{mill.name}</p>
                            <p className = "mt_20">
                                <span>价格：{mill.price} </span>
                                <span>总产值：{mill.earning} </span>
                                <span>算力：{mill.force} </span>
                                <span>周期：{mill.time}</span>
                            </p>
                            {status_msg === "未使用" ?
                            <span className = "btn active" 
                            onClick = {e => {
                                self.handleUseMill({id: item.id})
                            }}>启用</span> : <span className = "btn" >{status_msg}</span>}
                        </li>
                    })}
                </ul>
            {/* </div> */}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningDlgtext}/> : null}
        </div>
    }
}

export default MyMineral;
import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from '../WarningDlg';

const baseUrl = window.baseUrl;
const tabs = [
    {
        text: "进行中",
        type: "myMillList",
    },
    {
        text: "已停止",
        type: "myoverdueMillList",
    }
]
class MyMineral extends Component  {
    constructor (props){
        super(props);
        this.state = {
            my_data: {
                myforce: "0", //个人算力
                nhuw: "0"  //个人产量
            },
            data: [],
            type: "myMillList",  //进行中的 
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
        axios.post(baseUrl + "/home/Index/" + self.state.type, qs.stringify({
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
                if(self.state.type === "myMillList"){  // 个人算力 个人产量始终在第一个接口里面 切换的时候不会再改变的
                    self.setState({
                        my_data: {
                            myforce: data.myforce,
                            nhuw: data.nhuw
                        },
                        data: data.data
                    })
                }else{
                    self.setState({
                        data: data.data
                    })
                }
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
        const my_data = this.state.my_data;
        const self = this;
        const type = this.state.type;
        return <div>
            <Title title = "我的矿机" code = {this.state.code}/>
                <ul className = "myMineralData f_flex">
                    <li>
                        <p className = "fz_30">个人算力(T)</p>
                        <p className = "fz_50">{(my_data.myforce * 1).toFixed(2)}</p>
                    </li>
                    <li>
                        <p className = "fz_30">个人产量(E币/天)</p>
                        <p className = "fz_50">{(my_data.nhuw * 1).toFixed(2)}</p>
                    </li>
                </ul>
                <ul className = "deal_tab f_flex fz_30" style = {{marginTop: ".3rem"}}>
                    {
                        tabs.map(function(tab, i){
                            return <li key = {i} className = {self.state.type === tab.type ? "active" : ""} onClick = {e => {
                                self.setState({
                                    type: tab.type
                                }, function(){
                                    self.ajax()
                                })
                            }}>
                                <a>{tab.text}({data.length})</a>
                            </li>
                        })
                    }
                </ul>
                <table className = "normal_table mt_40">
                    <thead>
                        <tr>
                            <th>矿机</th>
                            <th>运行(天)</th>
                            <th>算力</th>
                            <th>产量</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0 && data.map(function(item, i){
                                const mill = item.mill;
                                const status_msg = item.status_msg;
                                return <tr key = {i}>
                                    <td>{mill.name}</td>
                                    <td>{item.ytime}/{mill.time}</td>
                                    <td>{mill.force}</td>
                                    <td>{item.money}</td>
                                    <td> {status_msg === "未使用" ?
                                        <span className = "btn active" 
                                        onClick = {e => {
                                            self.handleUseMill({id: item.id})
                                        }}>启用</span> : <span>{status_msg}</span>}
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningDlgtext}/> : null}
        </div>
    }
}

export default MyMineral;
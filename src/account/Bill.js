import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from './../Title';
import WarningDlg from './../WarningDlg';

const tabs = [
    {
        type: "0",
        text: "全部",
    },
    {
        type: "1",
        text: "支出",
    },
    {
        type: "2",
        text: "收入",
    },
    {
        type: "3",
        text: "收益",
    },
    {
        type: "4",
        text: "奖励",
    },
]
class Bill extends Component {
    constructor (props){
        super(props);
        this.state = {
            tabIndex: 0,
            type: 0,
            money: 0,
            data: [],  //数据
            warningDlgShow: false,
            warningText: ""
        }
    }
    handleTabSwitch (e){ //tab切换
        const tabIndex = e.tabIndex;
        this.setState({
            tabIndex: tabIndex
        }, function(){
            this.ajax(tabIndex);
        })
    }
    ajax (tabIndex){
        const self = this;
        axios.post(window.baseUrl + "/home/Member/getMyFince", qs.stringify({
            token: localStorage.getItem("token"),
            type: tabIndex || self.state.type
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){ //成功
                self.setState({
                    money: data.money,
                    data: data.data
                })
            }
            self.setState({
                code: code
            })
        })
    }
    renderMoneyType (type) {  //类型 支出 还是其他的
        console.log(type, 'type')
        let text = "";
        if(type === 1){
            text = "支出";
        }
        if(type === 2){
            text = "收入";
        }
        if(type === 3){
            text = "收益";
        }
        if(type === 4){
            text = "奖励";
        }
        return text;
    }
    componentDidMount (){
        this.ajax();
    }
    render (){
        const self = this;
        const data = this.state.data;
        const money = this.state.money;
        return <div>
            <Title title="账单中心" code = {this.state.code}/>
          <ul className="billTab f_flex">
          {
              tabs.map(function(tab, index){
                  return <li key={index} className = {self.state.tabIndex === index ? "active" : ""}>
                      <a onClick = {e => {
                          self.handleTabSwitch({tabIndex: index})
                      }}>{tab.text}</a>
                  </li>
              })
          }
          </ul>
          <p className="fc_yellow totalSum" style={{fontSize: ".395rem"}}>{money > 0 ? "+" : "-"}{this.state.money}</p>
          <ul className="billItems f_flex fz_24">
          {
              data.map(function(bill, i){
                  const type = bill.type;
                  return <li key={i}>
                    <span className="fc_blue">{bill.content}</span><br/>
                    <p className="fc_white">
                        <span className="f_lt">{bill.add_time}</span>
                        <span className="f_rt">{type === 1 ? "+" : "-"}{parseFloat(bill.money).toFixed(2)}</span>
                    </p>
                </li>
              })
          }
          </ul>
          {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default Bill;
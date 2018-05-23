import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from "axios";
import qs from "qs";
import WarningDlg from './../WarningDlg';
import Shadow from './../Shadow';

class DealItems extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          dlgShow: this.props.dlgShow || false,
          page: 1, //默认第一页
          isLoadingMore: false,
          dealItems: [],
          trade_id: "",
          tradePassPwd: "",
          code: "",
          loading: false,
          warningDlgShow: false,
          warningText: ""
        };
      }
    handleSellEvent (e) { //卖给他
        this.setState({
            dlgShow: true,
            trade_id: e.trade_id
        })
    }
    handlePwdEvent (e){  //输入交易密码
        this.setState({
            tradePassPwd: e.val
        })
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
    handlePayPwd (e){ //弹窗 取消/确定
        const type = e.type;
        if(type === "cancel"){  //取消
            this.setState({
                dlgShow: false
            })
        }else{   //如果是 确定的话  要判断支付密码是否正确了
            const self = this;
            const trade_id = this.state.trade_id;
            const tradePassPwd = this.state.tradePassPwd;
            axios.post(window.baseUrl + "/home/Trade/selljd", qs.stringify({
                token: localStorage.getItem("token"),
                trade_id: trade_id,
                pass: tradePassPwd
            })).then(re => {
                const data = re.data;
                const code = data.code;
                if(code === 1){ //购买成功
                    this.setState({
                        dlgShow: false,
                        warningDlgShow: true,
                        warningText: "购买成功",
                        tradePassPwd: ""
                    }, function(){
                        this.hanleWarningDlgTimer({code: code})
                    })
                }
                else if(code === -4){ //支付密码不正确
                    this.setState({
                        warningDlgShow: true,
                        warningText: "支付密码不正确",
                        tradePassPwd: ""
                    }, function(){
                        this.hanleWarningDlgTimer()
                    })
                }
                else if(code === -3){//如果jsd余额不足
                    this.setState({
                        dlgShow: false,
                        warningDlgShow: true,
                        warningText: "JSD余额不足",
                        tradePassPwd: ""
                    }, function(){
                        this.hanleWarningDlgTimer()
                    })
                } else{
                    self.setState({
                        warningDlgShow: true,
                        warningText: data.msg,
                        code: code
                    }, function(){
                        this.hanleWarningDlgTimer()
                    })
                }
            })
        }
       
    }
    componentDidMount (){
        this.ajax();
        const wrapper = this.refs.wrapper;
        const loadMoreDataFn = this.loadMoreDataFn;
        const that = this; // 为解决不同context的问题
        let timeCount;
        function callback() {
            const top = wrapper.getBoundingClientRect().top;
            const windowHeight = window.screen.height;
            if (top && top < windowHeight) {
                // 当 wrapper 已经被滚动到页面可视范围之内触发
                loadMoreDataFn(that);
            }
        }

        window.addEventListener('scroll', function () {
            if (this.state.isLoadingMore) {
                return ;
            }
            if (timeCount) {
                clearTimeout(timeCount);
            }

            timeCount = setTimeout(callback, 50);
        }.bind(this), false);
    }
    loadMoreDataFn(that) {
        that.setState({
            loading: true
        }, function(){
            that.ajax(that.state.page + 1); //翻页了
        })
    }
    ajax (page) {
        const self = this;
        const dealItems = this.state.dealItems;
        const type = this.props.type;
        const str = type === "kanban" ? "tradeList" : "tradeRecords";  //买家看板 还是 交易记录
        axios.post(window.baseUrl + "/home/Trade/" + str, qs.stringify({
            token: localStorage.getItem("token"),
            page: page ? page : 1,
            limit: 10  //每页显示多少条
        })).then(function(res){
            const data = res.data;
            const dataArr = data.data;
            const code = data.code;
            if(code === 1){  //成功
                if(dataArr.length === 0){ //没有数据可展示了
                    self.setState({
                        isLoadingMore: true
                    })
                }else{
                    self.setState({
                        page: page ? page : 1,
                        dealItems: dealItems.concat(data.data)
                    })
                }
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg,
                }, function(){
                    self.hanleWarningDlgTimer()
                })
            }
            self.setState({
                code: code
            })
        })
    }
    componentDidUpdate (nextProps){
        if(nextProps.type !== this.props.type){
            this.setState({
                dealItems: []
            }, function(){
                this.ajax();
            })
        }
    }
    render(){
        const self = this;
        const dealItems = this.state.dealItems;
        if(this.state.code > 10000){  //token 过期
            return (
                <Redirect to="/"/>
            )
        }
        return <div style={{paddingBottom: ".4rem"}}>
            <ul className="dealItems f_flex">
                {
                    dealItems.length > 0 && dealItems.map(function (item, i) {
                        const num = item.num;
                        const price = item.price;
                        return <li key={i} className="fz_22">
                            <p>
                                <span className="fc_blue">单号：{item.trade_num}</span>
                                <span className="f_rt fc_white">ID：{item.trade_id}</span>
                            </p>
                            <p className="fc_white text_center" style={{lineHeight: ".5rem"}}>挂卖{num}MAC，单价{price}元，总价{Math.round(parseFloat(num * price)*100)/100}</p>
                            <p className="text_center">
                                <span className="btn" onClick = { e => {
                                    self.handleSellEvent({trade_id: item.trade_id})
                                }}>卖给他</span>
                            </p>
                        </li>
                    })
                }
            </ul>
            <div className="loadMore fz_12 fc_gray text_center mt_20" ref="wrapper"
             onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isLoadingMore ? "没有更多数据了" : "加载更多"}</div>
            <div className={this.state.dlgShow ? "dialog dlgPayPwd" : "dialog dlgPayPwd hide"}>
                <p className="dlg_tit fc_white">输入密码</p>
                <div className="dlg_form">
                    <p className="text_center fz_24 fc_white">请输入支付密码：</p>
                    <input className="b_blue1" type="password" value = {this.state.tradePassPwd} 
                    onChange = {e => {
                        this.handlePwdEvent({val: e.target.value})
                    }}
                    />
                    <div className="fgtTradepass"><Link to = "/account/forgetTradePwd"><span className="fz_24 fc_blue">忘记交易密码?</span></Link></div>
                    <div className="over_hidden" style={{padding: "0 .14rem"}}>
                        <span className="btn fz_24 fc_white f_lt" onClick = {e => {
                            self.handlePayPwd({type: "cancel"})
                        }}>取消</span>
                        <span className="btn fz_24 fc_white f_rt" onClick = {e => {
                            self.handlePayPwd({type: "confirm"})
                        }}>确定</span>
                    </div>
                </div>
            </div>
            {this.state.dlgShow ? <Shadow /> : null}
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default DealItems;
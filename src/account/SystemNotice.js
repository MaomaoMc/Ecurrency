import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';

class SystemNotice extends Component{
    constructor (props){
        super(props);
        this.state = {
            data: [],
            page: 1, //默认第一页
            warningDlgShow: false,
            warningText: ""
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
    ajax (page){
        const self = this;
        const data_arr = this.state.data;
        axios.post(window.baseUrl + "/home/Member/systemInforms", qs.stringify({
            token: localStorage.getItem("token"),
            page: page || self.state.page,
            limit: 10
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            const dataArr = data.data;
            if(code === 1){  //成功
                if(dataArr.length === 0){ //没有数据可展示了
                    self.setState({
                        isLoadingMore: true
                    })
                }else{
                    self.setState({
                        page: page ? page : 1,
                        data: data_arr.concat(dataArr)
                    })
                }
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
    render (){
        const sysNotices = this.state.data;
        const self = this;
        return <div>
            <Title title = "系统通知" code = {this.state.code}/>
           <ul className="sysNotices fz_24">
           {
               sysNotices.length > 0 && sysNotices.map(function(notice, i){
                   return <li key = {i} onClick = {e => {
                        self.props.history.push("/account/systemNoticeDetail");
                        localStorage.setItem("sysNotCont", JSON.stringify(notice))
                    }}>
                        <div style = {{width: "90%", height: "90%", margin: "0 auto", overflow: "hidden"}}>
                            <p>{notice.add_time}</p>
                            <p className="fc_blue">{notice.title}</p>
                            <p dangerouslySetInnerHTML = {{__html: notice.content}}></p>
                        </div>
                   </li>
               })
           }
           </ul>
           <div className="loadMore fz_12 text_center mt_20" ref="wrapper"
             onClick={this.loadMoreDataFn.bind(this, this)}>{this.state.isLoadingMore ? "没有更多数据了" : "加载更多"}</div>
             {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default withRouter(SystemNotice);
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';

class SysNoticeDetail extends Component{
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
    render (){
        const notice = JSON.parse(localStorage.getItem("sysNotCont"))
        return <div>
            <Title title = "系统通知"/>
            <div style = {{backgroundColor: "white", lineHeight: ".3rem", padding: ".16rem"}}>
                <p className="fc_blue fz_24 text_center">{notice.title}</p>
                <p className = "fz_20 text_center">{notice.add_time}</p>
                <p className = "fz_20" style = {{textIndent: ".1rem"}} dangerouslySetInnerHTML = {{__html: notice.content}}></p>
            </div>
        </div>
    }
}

export default SysNoticeDetail;
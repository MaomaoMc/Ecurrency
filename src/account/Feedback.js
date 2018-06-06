import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from '../WarningDlg';
import Shadow from '../Shadow';

const baseUrl = window.baseUrl;
class Feedback extends Component{
    constructor (props){
        super(props);
        this.state = {
            problem: "",
            data: [], //留言记录
            detailsShow: false,
            details: {},  //留言详情
            warningDlgShow: false,
            warningDlgText: ""
        }
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){  //操作成功的话  回到个人中心页面
                        window.location.reload();
                    }
                })
            }
        , 1000)
    }
    submit (){ //提交留言反馈
        const self = this;
        const problem = this.state.problem;
        axios.post(baseUrl + "/home/Member/askService", qs.stringify({
            token: localStorage.getItem("token"),
            problem: problem
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            self.setState({
                warningDlgShow: true,
                warningDlgText: data.msg,
                code: code
            }, function(){
                self.hanleWarningDlgTimer({code: code})
            })
        })
    }
    feedbackDetails (e){  //留言的详细数据弹窗
        const item = e.item;
        this.setState({
            detailsShow: true,
            details: item
        })
    }
    ajax (){  //留言反馈记录
        const self = this;
        axios.post(baseUrl + "/home/Member/LeaveMsgList", qs.stringify({
            token: localStorage.getItem("token")
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){
                self.setState({
                    data: data.data
                })
            }else{
                self.setState({
                    warningDlgShow: true,
                    warningDlgText: data.msg,
                }, self.hanleWarningDlgTimer())
            }
            self.setState({
                code: code
            })
        })
    }
    componentDidMount (){
        this.ajax();
    }
    render (){
        const data = this.state.data;
        const self = this;
        const details = this.state.details;
        return <div>
            <Title title="留言反馈" code = {this.state.code}/>
           <div className = "feedbackWrap text_center over_hidden">
               <div>
               <textarea name="" id="" cols="30" rows="10" style={{
                   backgroundColor: "transparent"
               }} placeholder = "请输入您对E币的意见或建议：" value = {this.state.problem} onChange = {e => {
                   this.setState({
                    problem: e.target.value
                   })
               }}></textarea>
               </div>
               <span className="btn btn_primary h_80 fz_26 f_lt mt_30" style={{width: '100%', lineHeight: ".4rem"}}
              onClick={e => {
                this.submit({})
              }}>提交反馈</span>
           </div>
           <ul className="feedBackLists f_flex">{
               data.length > 0 && data.map(function(item, i){
                   return <li key = {i} className="fz_20"
                   onClick = {e => {
                       self.feedbackDetails({item: item})
                   }}
                   >
                        <p><span className="f_lt">留言时间：{item.add_time}</span><span className = "status_msg f_rt">{item.status_msg}</span></p>
                        <p>留言内容:<span>{item.problem}</span></p>
                   </li>
               })
           }</ul>
           {this.state.detailsShow ? <div className="feedback_details">
                <div>
                    <p className="fc_blue">留言时间：{details.add_time}</p>
                    <p>留言内容：{details.problem}</p>
                    <p className="fc_blue">回复时间：{details.answer_time}</p>
                    <p>回复内容：{details.answer}</p>
                </div>
                <span className="close_btn" onClick = {e => {
                    this.setState({
                        detailsShow: false
                    })
                }}>X</span>
           </div> : null}
           {this.state.detailsShow ? <Shadow /> : null}
           {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningDlgText} /> : null}
        </div>
    }
}

export default Feedback;
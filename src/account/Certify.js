import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import WarningDlg from './../WarningDlg';

const pic = require("../img/pic_morentx.png");
class Certify extends Component{
    constructor (props){
        super(props);
        this.state ={
            token: localStorage.getItem("token"),
            data: {card_num: "", username: ""}, //实名认证 已认证的返回信息
            username: "",  //姓名
            card_num: "", //身份证号码
            z_idpic: "",  //身份证正面
            f_idpic: "",  //身份证反面
            warningDlgShow: false,
            warningText: ""
        }
    }
    handleInputChange (e){
        const type = e.type;
        const value = e.val;
        this.setState({
            [type]: value
        })
    }
    hanleWarningDlgTimer (obj){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                }, function(){
                    if(obj && obj.code === 1){  //操作成功的话  回到个人中心页面
                        window.history.back();
                    }
                })
            }
        , 1000)
    }
    uploadedFile (e){ //上传身份证正反面
        const self = this;
        const type = e.type; //正面还是反面照
        const baseUrl = window.baseUrl;
        let file;
        if(type === "front_pic"){
            file = document.getElementById("front_pic").files[0];
        }else{
            file = document.getElementById("behind_pic").files[0];
        }
        // let file = document.getElementById("photo").files[0];
        let formData = new FormData()  // 创建form对象
        formData.append('pic', file)  // 通过append向form对象添加数据
        axios.post(baseUrl +  "/home/Base/uploadPic?token=" + self.state.token, formData, {
            transformRequest: [(data) => data],
            headers: {}
        }).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){ //成功
                if(type === "front_pic"){
                    self.setState({
                        z_idpic: baseUrl +  data.data
                    }, function(){  //保存图片
                        // self.setPhotoEvent()
                    })
                }else{
                    self.setState({
                        f_idpic: baseUrl +  data.data
                    }, function(){  //保存图片
                        // self.setPhotoEvent()
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
    submit (){ //提交
        const self = this;
        const username = this.state.username;
        const card_num = this.state.card_num;
        const z_idpic = this.state.z_idpic;
        const f_idpic = this.state.f_idpic;
        axios.post(window.baseUrl + "/home/Member/realName", qs.stringify({
            token: localStorage.getItem("token"),
            username: username,
            card_num: card_num,
            z_idpic: z_idpic,
            f_idpic: f_idpic
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            self.setState({
                warningDlgShow: true,
                warningText: data.msg,
                code: code
            }, function(){
                this.hanleWarningDlgTimer({code: code})
            })
        })
    }
    ajax(){
        const self = this;
        axios.post(window.baseUrl + "/home/Member/trueNamePic", qs.stringify({
            token: localStorage.getItem("token"),
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
                    warningText: data.msg,
                    code: code
                }, function(){
                    self.hanleWarningDlgTimer()
                })
            }
        })
    }
    componentDidMount(){
        const type = this.props.match.params.type;
        if(type === "authorized"){  //已认证的话 就显示认证的信息
            this.ajax();
        }
    }
    render (){
        const type = this.props.match.params.type;
        const data = this.state.data;
        return <div className="over_hidden" style={{paddingBottom: "2rem"}}>
            <Title title="实名认证" code = {this.state.code}/>
            {type === "authorized" ? 
                <div className="certify text_center fz_26">
                        <img src={pic} alt="" style={{width: ".6rem", height: ".6rem", marginTop: '.15rem'}} />
                        <p>{data.username}</p>
                        <p>{data.card_num}</p>
                </div> : 
                <div className="account_form fz_26">
                    <div>
                        <label>真实姓名：</label>
                        <input type="text" name="" placeholder="请输入真实姓名" value = {this.state.username}
                        onChange = {e => {
                            this.handleInputChange({type: "username", val: e.target.value})
                        }} 
                        />
                    </div>
                    <div>
                        <label>身份证号：</label>
                        <input type="text" placeholder="请确认身份证号" value = {this.state.card_num} 
                        onChange = {e => {
                            this.handleInputChange({type: "card_num", val: e.target.value})
                        }}
                        />
                    </div>
                        <form action="" id="card_from">
                            <p>
                                <input className="card_pic" id = "front_pic" type="file" onChange = {e => {
                                    this.uploadedFile({type: "front_pic"})
                                }}></input>
                                    <img className="card_front" src={this.state.z_idpic} alt=""/>
                                    {this.state.z_idpic !== "" ? null : <span>+身份证正面照</span>}
                            
                            </p>
                            <p>
                                <input className="card_pic" id = "behind_pic" type="file" onChange = {e => {
                                    this.uploadedFile({type: "behind_pic"})
                                }}></input>
                                <img className="card_behind" src={this.state.f_idpic} alt=""/>
                                {this.state.f_idpic !== "" ? null : <span>+身份证反面照</span>}
                            </p>
                        </form>
                <span className="btn btn_primary login_btn h_80 fz_26 f_lt mt_50" style={{ width: '95%' }}
                    onClick={e => {
                        this.submit({})
                    }}>提交</span>
            </div>
            }
           {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default Certify;
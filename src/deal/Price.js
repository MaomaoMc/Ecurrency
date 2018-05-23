import axios from 'axios';
import echarts from 'echarts';
import qs from 'qs';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import WarningDlg from './../WarningDlg';


class Price extends Component {
    constructor (props){
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            priceData: [],
            warningDlgShow: false,
            warningText: ""
        };
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
    priceAjax () { //价格折线图数据获取
        const token = this.state.token;
        const self = this;
        axios.post(window.baseUrl + "/home/Trade/priceLine", qs.stringify({
            token: token
        })).then(res => {
            const data = res.data;
            const code = data.code;
            if(code === 1){  //成功
                this.setState({
                    priceData: data.data
                }, function(){
                    this.chartLine()  //渲染图表
                })
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer()
                })
             }
            self.setState({
                code: data.code
            })
        })
    }
    formatLineDate (){
        const priceData = this.state.priceData;
        let date_arr = [] , data_arr = [];
        priceData.map(function(item, i){
            date_arr[i] = item.time.substring(5);
            data_arr[i] = item.price;
        })
        return {
            date_arr: date_arr,
            data_arr: data_arr
        }
    }
    chartLine () {
        const data = this.formatLineDate();
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('main'));
        // // 绘制图表
        myChart.setOption({
            title: {
                text: '实时价格',
                left:'left',
                textStyle:{
                    //文字颜色
                    color:'#00a8ff',
                    //字体系列
                    //字体大小
            　　　　 fontSize: ".13rem",
                 
                }
            },
            backgroundColor: "",
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
           
            toolbox: false,
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
                borderColor: "transprent"
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : data.date_arr,
                    axisLine:{
                        lineStyle:{
                            color:'#00a8ff',
                        }
                    } 
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitLine:{show: false},//去除网格线
                    axisLine:{
                        lineStyle:{
                            color:'#00a8ff',
                        }
                    } 
                }
            ],
            series : [
                {
                    // name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    areaStyle: {
                        color: ['rgba(7, 79, 155,0.3)', 'rgba(200,200,200,0.3)']
                    },
                    itemStyle : {  
                        normal : {  
                            color: "#0a236a",
                            lineStyle:{  
                                color:'#03a6d6'  
                            }  
                        }  
                    },  
                    data: data.data_arr
                }
            ]
        });
    }
    componentDidMount () {
        this.priceAjax();
    }
    render (){
        if(this.state.code > 10000){  //token 过期
            window.tokenLoseFun();
            return (
                <Redirect to="/"/>
            )
        }
        return <div>
            <div id="main" className="mt_20" style={{width: "3.35rem", height: "2.12rem", margin: "0 auto", zIndex: "98"}}></div>

            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
        </div>
    }
}

export default Price;
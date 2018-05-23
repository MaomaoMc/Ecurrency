import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class Title extends Component{
    back (){
        window.history.back();
    }
    refresh (){
        window.location.reload();
    }
    render (){
        if(this.props.code > 10000){
            window.tokenLoseFun()
            return (
                <Redirect to="/" />
            )
        }
        return  <div className="title">
            <span className="arrow back_arrow" onClick = {e => {
                this.back()
            }}></span>{this.props.title}<span className="refresh" onClick = {e => {
                this.refresh()
            }}></span>
        </div>
    }
}

export default Title;
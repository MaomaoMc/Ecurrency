import React, {Component} from 'react';

class WarningDlg extends Component{
    render (){ //JSD不足
        console.log(this.props.text, 'this.props.tex')
        return <div className = "dialog warningDlg fc_white fz_24">{this.props.text}</div>
    }
}

export default WarningDlg;
import React, {Component} from 'react';

class WarningDlg extends Component{
    render (){ 
        return <div className = "dialog warningDlg fc_white fz_24">{this.props.text}</div>
    }
}

export default WarningDlg;
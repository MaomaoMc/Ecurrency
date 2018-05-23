import React, {Component} from 'react';
import Title from '../Title';

class AboutJsd extends Component{
    render (){
        return <div>
            <Title title = "关于JSD"/>
            <p className="fc_white fz_26" style={{lineHeight: ".25rem", textIndent: '.2rem', padding: '.2rem'}}
                dangerouslySetInnerHTML = {{__html: JSON.parse(localStorage.getItem("sundryData")).about_us}} >
            </p>
        </div>
    }
}

export default AboutJsd;
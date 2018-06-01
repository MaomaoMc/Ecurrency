import React, {Component} from 'react';
import Title from '../Title';

class NewerGdNotes extends Component{
    render (){
        return <div>
            <Title title = "新手挂单须知"/>
            <p className="fz_26" style={{lineHeight: ".25rem", textIndent: '.2rem', padding: '.2rem'}}
                dangerouslySetInnerHTML = {{__html: JSON.parse(localStorage.getItem("sundryData")).new_rules}} >
            </p>
        </div>
    }
}

export default NewerGdNotes;
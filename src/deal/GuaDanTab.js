import React, {Component} from 'react';
import {Link} from 'react-router-dom';
// import GuaDan from '../guadan/index';

const newerGuad_icon = require("../img/icon_xinshou_nor.png");
const expertGuad_icon = require("../img/icon_gaoshou_nor.png");

class GuaDanTab extends Component {
    render (){
        return <div>
            <ul className="guadanTab fz_30 f_flex mt_40">
                <li>
                    <Link to="/deal/guadan/newerGuad"><img src={newerGuad_icon} alt="" /><p>新手挂单</p></Link>
                </li>
                <li>
                    <Link to="/deal/guadan/expertGuad"><img src={expertGuad_icon} alt="" /><p>高手挂单</p></Link>
                </li>
            </ul>
        </div>
    }
}

export default GuaDanTab;
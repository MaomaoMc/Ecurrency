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
                    <Link to="/deal/guadan/newerGuad"><i style = {{backgroundImage: "url(" + newerGuad_icon + ")"}}></i><p>普通挂单区</p></Link>
                </li>
                <li>
                    <Link to="/deal/guadan/expertGuad"><i style = {{backgroundImage: "url(" + expertGuad_icon + ")"}}></i><p>溢价挂单区</p></Link>
                </li>
            </ul>
        </div>
    }
}

export default GuaDanTab;
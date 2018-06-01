import React, {Component} from 'react';

import {Link} from 'react-router-dom';
import '../css/css/deal.css';


class DealTab extends Component {
    render (){
        const hash = window.location.hash;
        return <div>
            <ul className="deal_tab f_flex fz_30" style = {{marginTop: "-.55rem"}}>
                <li className={hash === '#/deal' || hash === '#/deal/price' ? 'active' : ''} style={{ borderTopLeftRadius: '.25rem', borderBottomLeftRadius: '.25rem'}}>
                    <Link to="/deal/price"><span>价格</span></Link>
                </li>
                <li className={hash.search(/ptp/) !== -1 ? 'active' : ''}>
                    <Link to="/deal/ptp"><span>点对点</span></Link>
                </li>
                <li className={hash.search(/dealItem/) !== -1 ? 'active' : ''} style={{ borderTopRightRadius: '.25rem', borderBottomRightRadius: '.25rem'}}>
                    <Link to="/deal/dealItem"><span>交易记录</span></Link>
                </li>
            </ul>
        </div>
    }
}

export default DealTab;
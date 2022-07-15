import { useContext } from 'react';
import Line from './Line';
import FrontContext from './FrontContext';

function List() {

    const {products} = useContext(FrontContext);

    return (
        <div className="card mt-4">
            <div className="card-header">
                <h2>List of Products</h2>
            </div>
            <div className="card-body">
                <ul className="list-group">
                    {
                    products ? products.map(p => <Line key={p.id} line={p}></Line>) : null
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;
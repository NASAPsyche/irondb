import React from 'react';
import DatabaseSearch from '../database-components/DatabaseSearch';
import DatabaseTable from '../database-components/DatabaseTable';
import '../styles/Database.scss'

const Database = () => {
    return (
        <div>
            <DatabaseSearch/>
            <DatabaseTable/>       
        </div>
    );
}

export default Database;
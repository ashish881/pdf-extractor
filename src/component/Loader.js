import React from 'react'
import { CircularProgress } from '@material-ui/core'

function Loader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '60%', left: '50%' }}>
            <CircularProgress />
        </div>
    )
}

export default Loader

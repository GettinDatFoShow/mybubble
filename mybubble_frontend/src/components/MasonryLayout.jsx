import React from 'react'
import Mansonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1000: 2,
    500: 1,
} 

const MasonryLayout = ({pins}) => {
    return (
        <Mansonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}> 
        {pins?.map((pin) => <Pin key={pin._id} pin={pin} className='w-max'/>  )}
        </Mansonry>
    )
}

export default MasonryLayout
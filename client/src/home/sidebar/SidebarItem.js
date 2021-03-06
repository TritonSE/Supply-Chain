import React, {useEffect, useState} from 'react';

import {AiOutlinePlusCircle, AiFillMinusCircle} from 'react-icons/ai'
import './SidebarItem.scss'

// Item component when sorting by alphabetical
// Expects item object with batches. Also supports clicking to expand
export const SidebarItemAlpha = ({item, expand}) => {
  const [expanded, setExpanded] = useState(expand);
  
  useEffect(() => {
    setExpanded(expand);
  }, [expand])

  return (
    <div className='sidebar_item_container'>
      <div className='sidebar_header' onClick={() => setExpanded(!expanded)}>
        {expanded 
          ? <AiFillMinusCircle />
          : <AiOutlinePlusCircle />
        }
        <p className='item_name'>{item.name}</p>
      </div>
      
      {expanded && 
        item.batches.map(batch => {
          return <div className="batch" key={batch.name+batch.outDate}>
            <p> {item.name} - {batch.outDate}</p>
          </div>
        })
      }
    </div>
  )
}

// Item component when sorting by expiry
// Expects an individual batch object.
export const SidebarItemExpiry = ({batch}) => {
  return (
    <div className='sidebar_item_container'>
      <div className='sidebar_header'>
        <AiOutlinePlusCircle />
        <p className='item_name'>{batch.outDate} - {batch.itemName}</p>
      </div>
    </div>
  )
}

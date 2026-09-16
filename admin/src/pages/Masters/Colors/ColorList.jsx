import React, { useEffect, useState } from 'react'
import { getColors } from '../../../apis/masterApi'

const ColorList = () => {
    const [data, setData]=useState([])
    useEffect(() => {
    const fetchColors = async () => {
        try {
            const response = await getColors();

            console.log(response.data);

            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchColors();
}, []);
  return (
    <>
    <div>ColorList</div>

    
    </>
  )
}

export default ColorList
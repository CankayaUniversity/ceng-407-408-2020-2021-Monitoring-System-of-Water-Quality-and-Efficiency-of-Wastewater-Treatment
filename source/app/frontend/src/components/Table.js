import React from 'react'
import {Table as CustomTable} from 'react-bootstrap'

const Table = (props) => {
  const { queries, data} = props
  /*
  const staticMonthArray = ["01","02","03","04","05","06","07","08","09","10","11","12", ]
  const dataMonths = ["-"]
  data.date.map(item => dataMonths.push(item.slice(5,7)))
  
 data.reading_value.map( valuearray =>{
  var counter =0
  staticMonthArray.map( (month,index) =>{
    if(dataMonths.includes(month)){
        
    }else{
       valuearray.splice(counter,0,"-")
       counter = counter +1;
    }
})

 })
 */
    return (
        
            <CustomTable responsive  bordered hover size="sm" >
  <thead>
    <tr>
      <th style={{fontWeight:"bold"}}>Bölge Adı</th>
      <th colSpan="11" style={{textAlign:"center"}}>{queries[1]}</th>
      
    </tr>
    <tr>
      <th style={{fontWeight:"bold"}}>Yer</th>
      <th colSpan="11" style={{textAlign:"center"}}>{queries[2]}</th>
      <th rowSpan="1" style={{textAlign:"center", backgroundColor:"rgba(50,150,250,1", color:"white"}}>{data[0].table_type}</th>
    </tr>
    <tr>
      <th style={{fontWeight:"bold"}}>Numune Kodu</th>
      <th colSpan="11" style={{textAlign:"center"}}>{data[0].location.numune_adi}</th>
    </tr>
    <tr>
      <th style={{fontWeight:"bold"}}>Koordinatlar</th>
      <th colSpan="11" style={{textAlign:"center"}}>{data[0].location.utm_x ? data[0].location.utm_x : "Girilmemiş" } - {data[0].location.utm_y ? data[0].location.utm_y : "Girilmemiş"}</th>
    </tr>
    <tr>
      <th style={{fontWeight:"bold", color:"black"}}>tarih</th>
      <th>Ocak {queries[4]}</th>
      <th>Şubat {queries[4]}</th>
      <th>Mart {queries[4]}</th>
      <th>Nisan {queries[4]}</th>
      <th>Mayıs {queries[4]}</th>
      <th>Haziran {queries[4]}</th>
      <th>Temmuz {queries[4]}</th>
      <th>Ağustos {queries[4]}</th>
      <th>Eylül {queries[4]}</th>
      <th>Ekim {queries[4]}</th>
      <th>Kasım {queries[4]}</th>
      <th>Aralık {queries[4]}</th>
    </tr>
  </thead>
  <tbody>
    {
      data.map (dataItem => (
          <tr>
            <td style={{fontWeight:"bold"}}>{dataItem.reading_type.name}</td>
            {
              dataItem.reading_value.map( value => (
                <td>{value}</td>
              ))
            }
        </tr>
        ) 
      )

    }
   
  </tbody>
</CustomTable>
        
    )
}

export default Table

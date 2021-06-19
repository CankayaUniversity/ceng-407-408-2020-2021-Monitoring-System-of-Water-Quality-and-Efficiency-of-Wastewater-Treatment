import React from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {Card} from "react-bootstrap";


function MapView({specificLocation, locations}) {

    return (
        <Card className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
            <Card.Title style={{textAlign:"center"}}>{`${specificLocation ? specificLocation.bolgeAdi + " - "+ specificLocation.yerAdi : "Su Kalite Numuneleri"}`}</Card.Title>
                  <MapContainer center={[39.07375, 34.88199]} zoom={6} style={{height:400, width:"100%"}}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            specificLocation ? (
                <Marker position={specificLocation?.position}>
                <Popup>
                   <p style={{margin:"0px", fontWeight:"bold"}}>{specificLocation?.bolgeAdi}</p> <br/> {specificLocation?.yerAdi}
                </Popup>
                </Marker>
            ):
            (
                (locations || []).filter( location => location.dd_east && location.dd_north).map(
                    locationItem =>(
                        <Marker position={[locationItem.dd_east, locationItem.dd_north]}>
                            <Popup>
                            {locationItem.bolge_adi} <br/> {locationItem.yer}
                            </Popup>
                        </Marker>
                    )
                )
            )
        }

      </MapContainer>              
     </Card>


    )

}

export default MapView;
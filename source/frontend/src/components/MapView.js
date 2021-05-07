import React, {Component} from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import { Row, Col, Card, Spinner,Container} from "react-bootstrap";

function MapView(props) {
    const position = [39.07375, 34.88199]
    const locations= [
        {"bolgeAdi":"Fethiye", "yeradi":"Sarısu Deresi", "position": [36.6592,29.1263]},
        {"bolgeAdi":"Köyceğiz - Dalyan", "yeradi":"Mera Drenaj Kanalı", "position": [36.9660,28.6886]},
        {"bolgeAdi":"Göcek", "yeradi":"Sarısu Deresi", "position": [38.9232,28.0518]},
        {"bolgeAdi":"GölBaşı", "yeradi":"Tez Deresi", "position": [39.7983,32.8058]},
        {"bolgeAdi":"Tuz Gölü", "yeradi":"Cihanbeyli DSİ Kanalı", "position": [38.7627,33.3486]},
        {"bolgeAdi":"Uzungöl", "yeradi":"Uzungöl içi", "position": [40.6194,40.2961]},
    ]
    return (
        <Card className='my-3 p-3' style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}}>
            <Card.Title style={{textAlign:"center"}}>{`${props.specificLocation ? props.specificLocation.bolgeAdi + " - "+ props.specificLocation.yeradi : "Su Kalite Numuneleri"}`}</Card.Title>
                  <MapContainer center={[39.07375, 34.88199]} zoom={6} style={{height:400, width:"100%"}}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            props.specificLocation ? (
                <Marker position={props.specificLocation.position}>
                <Popup>
                   {props.specificLocation.bolgeAdi} <br/> {props.specificLocation.yeradi}
                </Popup>
                </Marker>
            ):
            (
                locations.map( location => (
                    <Marker position={location.position}>
                        <Popup>
                           {location.bolgeAdi} <br/> {location.yeradi}
                        </Popup>
                    </Marker>
                ))
            )
        }
        
      </MapContainer>              
     </Card>

        
    )

}

export default MapView;
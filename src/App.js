import React, { useState } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, Autocomplete  } from '@react-google-maps/api';

import './App.css';
import logo from './logo.JPG';

const logoStyle = {
  height: '60px',
  backgroundColor: 'white'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const options = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  clickableIcons: false,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const mapContainerStyle = {
  width: '400px',
  height: '400px',
  marginTop: '0px',
  marginLeft:'30px'
};

const paraStyle={
  textAlign:"center",
  color:"blue",
  fontSize:22,
  
}

const tableStyle={
  width:'100%',
  background: '#F0F8FF',
  backdropFilter: 'blur(10px)',
  boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)',
  borderRadius: '10px', 
}

const inputFieldStyle = {
  borderRadius: '4px', 
  width: 205,
  height:25
};

const buttonStyle = {
  backgroundColor: 'darkblue',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  width: '125px',
  fontSize: '15px',
  borderRadius: '32px',
  height: '54px'
};

const App=()=>{
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originError, setOriginError] = useState('');
  const [destinationError, setDestinationError] = useState('');

  const [waypoints, setWaypoints] = useState([]);
  const [directions, setDirections] = useState('');
  const [distance, setDistance] = useState('');

  const [originAutocomplete, setOriginAutocomplete] = useState('');
  const [destinationAutocomplete, setDestinationAutocomplete] = useState('');
  const [waypointAutocomplete, setWaypointAutocomplete] = useState([]);


  const handleOriginChange=(e)=>{
    setOrigin(e.target.value);
    setOriginError('');
  }

  const handleOriginSelect=(e)=>{
    setOrigin(e);
  }

  const handleWaypoints=()=>{
    
  }

  const handleDestinationChange=(e)=>{
    setDestination(e.target.value);
    setDestinationError('');
  }

  const handleDestinationSelect=(e)=>{
    setDestination(e);
  }

  const handleCalculateClick=()=>{
    if (validateInputs()) {
      handleSubmit();
    }
  }

  const validateInputs = () => {
    let valid = true;

    if (!origin) {
      setOriginError('Please enter a valid origin');
      valid = false;
    }

    if (!destination) {
      setDestinationError('Please enter a valid destination');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = () => {
    const directionsService = new window.google.maps.DirectionsService();

    const waypointsArr = waypoints.map((waypoint) => ({
      location: waypoint.location,
      stopover: waypoint.stopover
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints: waypointsArr,
        travelMode: 'DRIVING'
      },
      (result, status) => {
        if (status === 'OK') {
          handleDirections(result);
        }
      }
    );
  };

  const handleDirections = (result) => {
    setDirections(result);
    const distance = result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000; // Calculate distance in km
    setDistance(distance);
  };

  const handleWaypointChange = (e, index) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index].location = e.target.value;
    setWaypoints(newWaypoints);
  };
  return(
    <div>
      <img style={logoStyle} src={logo}/>
      <div style={{background: '#F0F8FF'}}>
        <br/>
      <p style={paraStyle}>Let's calculate <b>distance</b> from Google maps</p>
      <table style={tableStyle}>
       
       <tr>
        <td style={{ display: 'flex',flexDirection: 'column', marginLeft:'88px'}}>
         <div>
          <label htmlFor="origin">Origin</label>
          <Autocomplete
          onLoad={(origin) => setOriginAutocomplete(origin)}
          onPlaceChanged={() => handleOriginSelect(originAutocomplete.getPlace().formatted_address)}
        >
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={handleOriginChange}
            style={inputFieldStyle}
            placeholder="Origin Location"
          />
          </Autocomplete>
          {originError && <p style={{ color: 'red' }}>{originError}</p>}
         </div>
          </td>
          </tr>

          <br/>

          <tr>
          <td style={{ display: 'flex',flexDirection: 'row', marginLeft:'88px'}}>
        <div>
          <label htmlFor="stop">Stop</label>
          
          <Autocomplete
          onLoad={(autocomplete) => setDestinationAutocomplete(autocomplete)}
          onPlaceChanged={() => handleDestinationSelect(destinationAutocomplete.getPlace().formatted_address)}
        >
          <input
            id="waypoint"
            type="text"
            value={waypoints.location}
            onChange={(e) => handleWaypointChange(e)}
            style={inputFieldStyle}
            placeholder="Waypoint Location"
          />
          </Autocomplete>
         <button onClick={handleWaypoints()} style={{marginLeft:"65px",color:'black', borderStyle:'none', background:"#F0F8FF"}}>
          (+) Add another location </button> 
        </div> 
         &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
        <button onClick={handleCalculateClick} style={buttonStyle}>
          Calculate
        </button>
        </td>
        </tr>

        <br/>  

        <tr>
          <td style={{ display: 'flex',flexDirection: 'row', marginLeft:'88px'}}>
        <div>
          <label htmlFor="destination">Destination</label>
          <Autocomplete
          onLoad={(autocomplete) => setDestinationAutocomplete(autocomplete)}
          onPlaceChanged={() => handleDestinationSelect(destinationAutocomplete.getPlace().formatted_address)}
        >
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={handleDestinationChange}
            style={inputFieldStyle}
            placeholder="Destination Location"
          />
          </Autocomplete>
          {destinationError && <p style={{ color: 'red' }}>{destinationError}</p>}
        </div> 
        </td>
        </tr>

        <br/>
      <tr>
      {distance !== null && (
      <div style={{ borderRadius:'15px', marginTop:'30px',padding:'8px', margin: "10px",width:"100%",background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(2px)',marginLeft:'85px', maxHeight:'85px',
       }}>
          <tr>
            <td><h2>  Distance</h2></td>
            <td><h1 style={{marginLeft:300,color:'#4285F4'}}>{distance} kms</h1></td> 
          </tr>
        </div>  
        )}
      
     <div style={{ borderRadius:'15px', marginTop:'30px',padding: "5px", margin: "10px",width:"90%",
       backgroundColor: '#F0F8FF',backdropFilter: 'blur(2px)',marginLeft:'85px', maxHeight:'85px', 
       }}>

        <p>The Distance between <b>{origin}</b> and <b>{destination}</b> via the selected route is <b>{distance}</b> kms.</p>
      </div> 

      <td style={{ height: '400px', width: '50%'}}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'-450px' }}>
        <div style={mapContainerStyle}>
          
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              options={options}
            >
              {directions && <DirectionsRenderer directions={directions} />}
              {waypoints.map((waypoint, index) => (
                <DirectionsService
                  key={index}
                  options={{
                    destination: waypoint.location,
                    travelMode: 'DRIVING'
                  }}
                  callback={(result, status) => {
                    if (status === 'OK') {
                      setDirections(result);
                    }
                  }}
                />
              ))}
            </GoogleMap> 
        </div>
      </div>
      </td>
      </tr>
  
   
      </table>
      </div>
    </div>
  )
}

export default App;

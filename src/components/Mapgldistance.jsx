import React, { useEffect } from 'react';
import axios from 'axios';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3JpZGhhcnZlZCIsImEiOiJjbTI0YjBwYXEwZGV4MmpxdzQwZHJubnFrIn0.DlFFI30kCvll7rbb0IR-9g';

const initialCities = [
    {
        "city": "Bangalore",
        "population": "12,476,000",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Bangalore_Skyline.jpg/240px-Bangalore_Skyline.jpg",
        "state": "Karnataka",
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    {
        "city": "Hyderabad",
        "population": "9,059,000",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Hyderabad_Skyline.jpg/240px-Hyderabad_Skyline.jpg",
        "state": "Telangana",
        "latitude": 17.385044,
        "longitude": 78.486671
    },
    {
        "city": "Mysore",
        "population": "1,020,000",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Mysore_palace_at_night.jpg/240px-Mysore_palace_at_night.jpg",
        "state": "Karnataka",
        "latitude": 12.2958,
        "longitude": 76.6393
    },
    {
        "city": "Secunderabad",
        "population": "1,700,000",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Secunderabad_Railway_Station.jpg/240px-Secunderabad_Railway_Station.jpg",
        "state": "Telangana",
        "latitude": 17.444,
        "longitude": 78.498
    },
    {
        "city": "Tumkur",
        "population": "300,000",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Tumkur_railway_station.jpg/240px-Tumkur_railway_station.jpg",
        "state": "Karnataka",
        "latitude": 13.3391,
        "longitude": 77.1017
    }
];

const Mapgldistance = () => {
    const [viewState, setViewState] = React.useState({
        latitude: 12.9716,
        longitude: 77.5946,
        zoom: 3
    });

    const [showPopup, setShowPopup] = React.useState(false);
    const [popupData, setPopupData] = React.useState({
        lat: 37.8,
        lng: -122.4,
    });

    const [toDosData, setToDosData] = React.useState([]);
    const [toDoList, setTodoList] = React.useState({});
    const [cities, setCities] = React.useState(initialCities);
    const [inputText, setInputText] = React.useState('');

    const getTodoListFun = () => {
        axios.get("https://jsonplaceholder.typicode.com/todos")
            .then((res) => {
                if (res.data.length > 0) {
                    setToDosData(res.data);
                }
            });
    }

    useEffect(() => {
        getTodoListFun();
    }, []);

    const onMoveFun = (evt) => {
        setViewState(evt.viewState);
    };

    const mapOnClickFun = (evt) => {
        const lat = evt.lngLat.lat;
        const lng = evt.lngLat.lng;
        const todoslist = toDosData[Math.floor(Math.random() * toDosData.length)];
        setPopupData({ lat, lng });
        setTodoList(todoslist);
        setShowPopup(true);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleAddCities = () => {
        try {
            const newCities = inputText.split('\n').map(line => {
                const parts = line.split(',').map(part => part.trim());
    
                // Ensure we have exactly 5 parts
                if (parts.length !== 5) {
                    throw new Error(`Invalid format for line: "${line}"`);
                }
    
                const [city, state, latitude, longitude, population] = parts;
    
                return {
                    city: city,
                    state: state,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    population: population,
                    image: '', // You can add a default image or handle image input as well
                };
            });
    
            // Check if latitude and longitude are valid numbers
            newCities.forEach(city => {
                if (isNaN(city.latitude) || isNaN(city.longitude)) {
                    throw new Error(`Invalid latitude or longitude for city: "${city.city}"`);
                }
            });
    
            // Log the new cities before updating state
            console.log("New Cities to be added:", newCities);
    
            setCities(prevCities => {
                const updatedCities = [...prevCities, ...newCities];
                console.log("Updated Cities:", updatedCities); // Log updated cities
                return updatedCities;
            });
    
            setInputText(''); // Clear the text area after adding
        } catch (error) {
            console.error("Error parsing input data:", error.message);
        }
    };
    

    return (
        <div>
            <textarea
                value={inputText}
                onChange={handleInputChange}
                rows={5}
                cols={50}
                placeholder="Paste city data here (format: city, state, latitude, longitude, population)"
            />
            <button onClick={handleAddCities}>Add Cities</button>
            <Map
                {...viewState}
                onMove={onMoveFun}
                onClick={mapOnClickFun}
                style={{ width: '100vw', height: '100vh' }}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >
                <NavigationControl />
                {cities.map((item) => (
                    <Marker key={item.city} longitude={item.longitude} latitude={item.latitude} color="red" />
                ))}
                {showPopup && (
                    <Popup longitude={popupData.lng} latitude={popupData.lat}
                        anchor="bottom"
                        onClose={() => setShowPopup(false)}>
                        <h5>TITLE: {toDoList.title}</h5>
                        <h5>USER ID: {toDoList.id}</h5>
                    </Popup>
                )}
            </Map>
        </div>
    );
}

export default Mapgldistance;

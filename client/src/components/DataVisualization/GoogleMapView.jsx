import { useState, useEffect } from "react";
import {
	APIProvider,
	Map,
	Marker,
	InfoWindow,
} from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";

const GoogleMapView = ({ mapLink, businessName }) => {
	const [showingInfoWindow, setShowingInfoWindow] = useState(false);
	const [activeMarker, setActiveMarker] = useState({});
	const [selectedPlace, setSelectedPlace] = useState({});
	const [position, setPosition] = useState({ lat: 0, lng: 0 });

	useEffect(() => {
		const coords = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
		if (coords) {
			setPosition({
				lat: parseFloat(coords[1]),
				lng: parseFloat(coords[2]),
			});
		}
	}, [mapLink]);

	const onMarkerClick = (props, marker) => {
		setSelectedPlace(props);
		setActiveMarker(marker);
		setShowingInfoWindow(true);
	};

	const onClose = () => {
		if (showingInfoWindow) {
			setShowingInfoWindow(false);
			setActiveMarker(null);
		}
	};

	return (
		<APIProvider apiKey="AIzaSyB4G2nJuXGn0tDOgaYDg8Ae3RHKxb4ZIFA">
			<Map zoom={14} center={{ lat: position.lat, lng: position.lng }}>
				<Marker
					onClick={onMarkerClick}
					name={businessName}
					longitude={position.lng}
					latitude={position.lat}
				/>
				{showingInfoWindow && (
					<InfoWindow marker={activeMarker} onClose={onClose}>
						<div>
							<h4>{selectedPlace.name}</h4>
						</div>
					</InfoWindow>
				)}
			</Map>
		</APIProvider>
	);
};

GoogleMapView.propTypes = {
	mapLink: PropTypes.string.isRequired,
	businessName: PropTypes.string.isRequired,
};

export default GoogleMapView;

import React from "react";
import MarkWrapper from "./MarkWrapper.js";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { compose } from "recompose";


// Esse componente mostra o mapa do Google Maps e seus marcadores

const MapWrapper = compose(
	withScriptjs,
	withGoogleMap
)(props =>
	<GoogleMap
		clickableIcons={false}
		defaultZoom={15}
		defaultCenter={{ lat: -22.889824, lng: -47.199121 }}
		onClick={(event) => props.pesquisaFoursquare(event.latLng, props.addlist, props.openModal)}
	>

	{props.dots.map((dot, i) => (
		<MarkWrapper
			key={i}
			dot={dot}
			selectMark={props.selectMark}
			selectedMark={props.selectedMark}
			unselectMark={props.unselectMark}
			openModalApp={props.openModalApp}
		/>
	))}

	</GoogleMap>
);

export default MapWrapper;
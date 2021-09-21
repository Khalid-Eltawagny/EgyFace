import React from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }
  props.items.map((place) => console.log(place));
  return (
    <ul className="place-list">
      {props.items.map((place, indx) => (
        <PlaceItem
          key={indx}
          id={place[0].id}
          image={place[0].image}
          title={place[0].title}
          description={place[0].description}
          address={place[0].address}
          creatorId={place[0].creator}
          coordinates={place[0].location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;

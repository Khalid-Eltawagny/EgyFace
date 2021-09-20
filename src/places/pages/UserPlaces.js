import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/use-http";
import { useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";



const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState(undefined);
  const { sendRequest, clearError, error, isLoading } = useHttpClient();
  const userId = useParams().userId;
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.placess);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;

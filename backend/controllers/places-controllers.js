const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const fs = require("fs");
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "something went wrong , couldnot find the place",
      500
    );
    return next(err);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError("Fetching places failed , please try againg later", 500)
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  res.json({
    placess: places.map((place) => {
      return place.toObject({ getters: true });
    }),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  
  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    const err = new HttpError("Creating place failed ,please try again", 500);
    return next(err);
  }

  if (!user) {
    const err = new HttpError(
      "We couldn't find a user with the provided ID.",
      500
    );
    return next(err);
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
    res.status(201).json({ place: createdPlace });
  } catch (error) {
    console.log(error);
    const err = new HttpError("Creating place failed ,please try again", 500);
    return next(err);
  }
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 423)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
    
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("couldn't update this place", 500));
  }

  if (!place) {
    return next(new HttpError("couldnot update this place", 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place", 401));
  }

  place.title = title;
  place.description = description;

  console.log(place) ; 
  try {
    await place.save();
  } catch (error) {
    console.log(error) ; 
    return next(new HttpError("Couldn't update this place", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(new HttpError("Couldn't delete this place", 500));
  }
  if (!place) {
    return next(new HttpError("Couldn't find this place"), 500);
  }

  if (place.creator.id != req.userData.userId) {
    return next(new HttpError("You are not allowed to delete this place", 403));
  }

  const path = place.image;
  try {
    const session = mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Couldn't delete this place", 500));
  }
  fs.unlink(path, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

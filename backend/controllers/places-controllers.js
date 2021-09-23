const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const fs = require("fs");
const mysql = require("mysql");
const { resolve } = require("path");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kh@lid0100123123",
  database: "places_application",
});

con.connect((err) => {
  if (err) throw new Error("Couldn't connect to the database!!");
});

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  const query = `SELECT * FROM places WHERE id = '${placeId}'`;
  con.query(query, (err, result) => {
    if (err) {
      const error = new HttpError(
        "something went wrong , couldnot find the place",
        500
      );
      return next(error);
    }
    if (result.length === 0) {
      return next(
        new HttpError("Could not find a place for the provided id.", 404)
      );
    }
    const place = result[0];
    res.json({ place });
  });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  const query = `SELECT * FROM user_places WHERE user_id = ${userId}`;
  con.query(query, async (err, result) => {
    if (err) {
      return next(
        new HttpError("Fetching places failed , please try againg later", 500)
      );
    }

    // const placesPromises = result.map((place) => {
    //   return new Promise((resolve, reject) => {
    //     const q = `SELECT * FROM places WHERE id = ${place.place_id}`;
    //     con.query(q, (err, place) => {
    //       if (err) {
    //         return next(
    //           new HttpError(
    //             "Fetching places failed , please try againg later",
    //             500
    //           )
    //         );
    //       }
    //       return resolve(place);
    //     });
    //   });
    // });

    const places = await Promise.all(
      result.map(async (place) => {
        return new Promise((resolve, reject) => {
          const q = `SELECT * FROM places WHERE id = ${place.place_id}`;
          con.query(q, (err, place) => {
            if (err) {
              return next(
                new HttpError(
                  "Fetching places failed , please try againg later",
                  500
                )
              );
            }
            return resolve(place);
          });
        });
      })
    );

    return res.json({ placess: places });
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

  const createdPlace = {
    title,
    description,
    address,
    lat: coordinates.lat,
    lng: coordinates.lng,
    image: req.file.path,
    creator: req.userData.userId,
  };

  const query = `SELECT * FROM users WHERE id = '${req.userData.userId}'`;
  const q2 = "INSERT INTO places SET ?";
  const q3 = "INSERT INTO user_places SET ?";

  con.query(query, (err, result) => {
    if (err) {
      const error = new HttpError(
        "Creating place failed ,please try again",
        500
      );
      return next(error);
    }
    console.log(req.userData) ; 
    console.log(result) ; 
    if (result.length === 0) {
      const error = new HttpError(
        "We couldn't find a user with the provided ID.",
        500
      );
      return next(error);
    }
    con.query(q2, createdPlace, (err, result) => {
      if (err) {
        return next(
          new HttpError(err.message, 500)
        );
      }
      userPlace = {
        user_id: req.userData.userId,
        place_id: result.insertId,
      };
      con.query(q3, userPlace, (err, result) => { 
        if (err) {
          return next(
            new HttpError("Creating place failed ,please try again", 500)
          );
        }
        return res.status(201).json({ place: createdPlace });
      });
    });
  });
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

  const query = `SELECT * FROM places WHERE id = ${placeId} `;
  con.query(query, (err, result__) => {
    if (err) {
      return next(new HttpError("couldn't update this place", 500));
    }
    if (result__.length === 0) {
      return next(new HttpError("couldnot update this place", 500));
    }
    if (result__[0].creator !== req.userData.userId) {
      return next(new HttpError("You are not allowed to edit this place", 401));
    }

    const q = `UPDATE places SET title = '${title}' , description = '${description}' WHERE id = ${placeId}`;

    con.query(q, (err, result) => {
      if (err) {
        return next(new HttpError("Couldn't update this place", 500));
      }
      result__[0].title = title;
      result__[0].description = description;
      return res.status(200).json({ place: result__[0] });
    });
  });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const q = `DELETE FROM places WHERE id = '${placeId}'`;
  con.query(q, (err, result) => {
    if (err) {
      return next(new HttpError("Couldn't delete this place", 500));
    }
    const q = `DELETE FROM user_places WHERE place_id = '${placeId}'`;
    con.query(q, (err, resultt) => {
      if (err) {
        return next(new HttpError("Couldn't delete this place", 500));
      }
      res.status(200).json({ message: "Deleted place." });
    });
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

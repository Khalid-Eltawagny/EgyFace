const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kh@lid0100123123",
  database: "teez_book",
});

con.connect((err) => {
  if (err) throw new HttpError("Couldn't connect to this database server", 500);
});

const getUsers = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT id,email,image,name FROM users WHERE id != ${userId}`;
  con.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return next(
        new HttpError("Something went wrong, please try agian later.", 422)
      );
    }
    res.status(200).json(result) ;  
  });
};
const getInfo = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId} `;
  con.query(query, (err, result) => {
    if (err) {
      return next(
        new HttpError("Something went wrong, please try agian later.", 422)
      );
    }
    if (result.length === 0) {
      return next(new HttpError("User not found.", 422));
    }
    const user = {
      name: result[0].name,
      email: result[0].email,
      userId: result[0].id,
      userImage: result[0].image,
    };
    res.status(200).json(user);
  });
};
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, password, email } = req.body;

  // first make sure that the email is used for the first time .
  const query = `SELECT * FROM users WHERE email = "${email}"`;
  con.query(query, async (err, result) => {
    if (err) {
      return next(
        new HttpError("Something went wrong please try again later.", 422)
      );
    }
    if (result.length !== 0) {
      return next(
        new HttpError(
          "This email is elready exists, please try another one",
          422
        )
      );
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      return next(new HttpError("Couldn't create a user.", 500));
    }

    const user = {
      name,
      password: hashedPassword,
      email,
      image:req.file.path
    };

    const query = "INSERT INTO users SET ?";

    con.query(query, user, (err, result) => {
      if (err) {
        return next(new HttpError("Couldn't create a user.", 500));
      }
      let token;
      try {
        token = jwt.sign(
          {
            userId: result.insertId,
            email,
            name,
          },
          "it is kinda funny",
          { expiresIn: "1h" }
        );
      } catch (error) {
        return next(new HttpError("Couldn't create a user.", 500));
      }
      res.status(201).json({ userId: result.insertId, email, name, token });
    });
  });
};

const signIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs,please double check them.", 500));
  }

  const { email, password } = req.body;

  // check if this email exists or not .

  const query = `SELECT * FROM users WHERE email = "${email}"`;
  con.query(query, async (err, user) => {
    if (user.length === 0) {
      return next(
        new HttpError("Sorry,there is no user with provided email.", 500)
      );
    }

    user = user[0];
    const { password: hashedPassword } = user;
    let isTrue;
    try {
      isTrue = await bcrypt.compare(password, hashedPassword);
      console.log(password);
      console.log(isTrue);
    } catch (error) {
      return next(
        new HttpError("Sorry,there is no user with provided email.", 500)
      );
    }
    if (!isTrue) {
      return next(
        new HttpError("Invalid credential,please double check the inputs.", 500)
      );
    }
    let token;
    try {
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.email,
        },
        "it is kinda funny",
        { expiresIn: "1h" }
      );
    } catch (error) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    res
      .status(200)
      .json({ userId: user.id, name: user.name, email: user.email, token });
  });
};

const getPosts = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  con.query(query, async (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    if (result.length === 0) {
      return next(new HttpError("No user found,please try again.", 500));
    }
    const name = result[0].name;
    const query = `SELECT * FROM posts where user_id = ${userId}`;
    con.query(query, async (err, result) => {
      if (err) {
        return next(
          new HttpError("Something went wrong,please try again.", 500)
        );
      }

      const promises1 = result.map((post) => {
        return new Promise((resolve, reject) => {
          const post_id = post.id;
          const query = `SELECT COUNT(*) as likes FROM likes WHERE post_id = ${post_id} `;
          con.query(query, (err, result) => {
            if (err) {
              return reject(
                next(
                  new HttpError("Something went wrong,please try again.", 500)
                )
              );
            }
            resolve(result);
          });
        });
      });
      const promises2 = result.map((post) => {
        return new Promise((resolve, reject) => {
          const post_id = post.id;
          const query = `SELECT COUNT(*) as comments FROM comments WHERE post_id = ${post_id} `;
          con.query(query, (err, result) => {
            if (err) {
              return reject(
                next(
                  new HttpError("Something went wrong,please try again.", 500)
                )
              );
            }
            resolve(result);
          });
        });
      });

      const likes = await Promise.all(promises1);
      const comments = await Promise.all(promises2);

      const posts = result.map((post, i) => {
        return {
          postId: post.id,
          ...post,
          likes: likes[i][0].likes,
          comments: comments[i][0].comments,
          name: name,
        };
      });
      console.log(posts);
      res.status(200).json(posts);
    });
  });
};
const getSinglePost = async (req, res, next) => {
  console.log(req.body);
  const { userId, postId } = req.body;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  con.query(query, async (err, result) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    if (result.length === 0) {
      return next(new HttpError("No user found,please try again.", 500));
    }
    const name = result[0].name;
    const query = `SELECT * FROM posts where id = ${postId}`;
    con.query(query, async (err, result) => {
      if (err) {
        console.log(err);

        return next(
          new HttpError("Something went wrong,please try again.", 500)
        );
      }
      const post = result[0];
      const query = `SELECT COUNT(*) as likes FROM likes WHERE post_id = ${postId} `;

      con.query(query, (err, result) => {
        if (err) {
          console.log(err);

          return next(
            new HttpError("Something went wrong,please try again.", 500)
          );
        }

        const likes = result[0].likes;

        const query = `SELECT COUNT(*) as comments FROM comments WHERE post_id = ${postId} `;
        con.query(query, (err, result) => {
          console.log(err);

          if (err) {
            returnnext(
              new HttpError("Something went wrong,please try again.", 500)
            );
          }

          const comments = result[0].comments;

          const postjson = { postId, ...post, likes, comments, name };
          // const posts = result.map((post, i) => {
          //   return {
          //     postId: post.id,
          //     ...post,
          //     likes: likes[i][0].likes,
          //     comments: comments[i][0].comments,
          //     name: name,
          //   };
          // });
          console.log(postjson);
          res.status(200).json(postjson);
        });
      });
    });
  });
};

const friendReq = async (req, res, next) => {
  const { from_user_id, to_user_id } = req.body;
  const request = { from_user_id, to_user_id };
  const query = `SELECT * FROM requests WHERE from_user_id =${from_user_id} AND to_user_id=${to_user_id}`;

  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }

    if (result.length !== 0) {
      return next(
        new HttpError("You can't send the same friend request twice.", 500)
      );
    }

    const query = `INSERT INTO requests SET ?`;
    con.query(query, request, (err, result) => {
      if (err) {
        return next(
          new HttpError("Something went wrong,please try again.", 500)
        );
      }
      res.status(201).json(result);
    });
  });
};

const getFriends = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT * FROM friends WHERE person_1_id = ${userId}`;

  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    const firendsIds = result.map((rel) => {
      return rel.person_2_id;
    });
    res.status(200).json(firendsIds);
  });
};

const getRequets = async (req, res, next) => {
  const userId = req.params.id;
  const query = `SELECT * FROM requests WHERE to_user_id = ${userId}`;

  con.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    console.log(result);
    const requestIds = result.map((request) => {
      return request.from_user_id;
    });
    res.status(200).json(requestIds);
  });
};

const acceptReq = async (req, res, next) => {
  const { person_2_id, person_1_id } = req.body;
  const rel1 = { person_1_id, person_2_id };
  const rel2 = { person_1_id: person_2_id, person_2_id: person_1_id };
  const query = `INSERT INTO friends SET ?`;

  con.query(query, rel1, (err, result) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    con.query(query, rel2, (err, result) => {
      if (err) {
        console.log(err);
        return next(
          new HttpError("Something went wrong,please try again.", 500)
        );
      }
      const query = `DELETE FROM requests WHERE from_user_id=${person_1_id} AND to_user_id=${person_2_id}`;
      con.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return next(
            new HttpError("Something went wrong,please try again.", 500)
          );
        }
        res.status(201).json(result);
      });
    });
  });
};

const declineReq = async (req, res, next) => {
  const { person_2_id, person_1_id } = req.body;
  const query = `DELETE FROM requests WHERE from_user_id=${person_1_id} AND to_user_id=${person_2_id}`;
  con.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    res.status(201).json(result);
  });
};

const unfriend = async (req, res, next) => {
  const { person_1_id, person_2_id } = req.body;
  const query = `DELETE FROM friends WHERE person_1_id = ${person_1_id} AND person_2_id = ${person_2_id}`;
  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }
    const query = `DELETE FROM friends WHERE person_1_id = ${person_2_id} AND person_2_id = ${person_1_id}`;
    con.query(query, (err, result) => {
      if (err) {
        return next(
          new HttpError("Something went wrong,please try again.", 500)
        );
      }
      res.status(201).json(result);
    });
  });
};

const isLiked = async (req, res, next) => {
  const userId = req.params.uid;
  const postId = req.params.pid;

  const query = `SELECT * FROM likes WHERE user_id = ${userId} AND post_id = ${postId}`;

  con.query(query, (err, result) => {
    if (err) {
      return next(new HttpError("Something went wrong,please try again.", 500));
    }

    if (result.length === 0) {
      return res.status(200).json({ isLiked: false });
    }

    return res.status(200).json({ isLiked: true });
  });
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.getInfo = getInfo;
exports.getPosts = getPosts;
exports.friendReq = friendReq;
exports.getFriends = getFriends;
exports.getRequets = getRequets;
exports.acceptReq = acceptReq;
exports.declineReq = declineReq;
exports.unfriend = unfriend;
exports.getSinglePost = getSinglePost;
exports.isLiked = isLiked;
exports.getUsers = getUsers ; 

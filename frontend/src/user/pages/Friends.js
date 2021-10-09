import React from "react";
import { Fragment } from "react";
import classes from "./Friends.module.css";
import { useEffect, useState } from "react";

import FriendRequestsList from "../components/FriendRequestsList";
import FriendsMenu from "../components/FriendsMenu";
import { useHttpClient } from "../../shared/hooks/use-http";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";

const Friends = () => {
  const ctx = useContext(AuthContext);
  const [friendsIds, setFriendsIds] = useState(null);
  const [requestsIds, setRequestsIds] = useState(null);
  const [friends, setFriends] = useState(null);
  const [requests, setRequests] = useState(null);
  const [dummyState, setDummyState] = useState(false);

  const refresh = () => {
    setDummyState((prev) => !prev);
  };

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // getting friends ids
  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await sendRequest(
          `http://localHost:5000/api/users/${ctx.userId}/friends`
        );
        setFriendsIds(response);
        console.log(response);
      } catch (error) {}
    };
    if (ctx.userId) {
      getFriends();
    }
  }, [ctx, dummyState]);

  // now we have friends Ids , get information about them .
  useEffect(() => {
    const getFriends = async () => {
      if (friendsIds) {
        const promises = friendsIds.map((id) => {
          return new Promise(async (resolve, reject) => {
            try {
              const info = await sendRequest(
                `http://localhost:5000/api/users/${id}/info`
              );
              return resolve(info);
            } catch (error) {
              return reject(error);
            }
          });
        });
        const info = await Promise.all(promises);
        setFriends(info);
        console.log(info);
      }
    };
    getFriends();
  }, [friendsIds]);

  //getting friend requets ids
  useEffect(() => {
    console.log("inside");
    const getRequets = async () => {
      try {
        const response = await sendRequest(
          `http://localHost:5000/api/users/${ctx.userId}/requests`
        );
        setRequestsIds(response);
      } catch (error) {
        console.log(error);
      }
    };
    if (ctx.userId) {
      getRequets();
    }
  }, [ctx, dummyState]);

  useEffect(() => {
    const getRequests = async () => {
      if (requestsIds) {
        const promises = requestsIds.map((id) => {
          return new Promise(async (resolve, reject) => {
            try {
              const info = await sendRequest(
                `http://localhost:5000/api/users/${id}/info`
              );
              return resolve(info);
            } catch (error) {
              return reject(error);
            }
          });
        });
        const info = await Promise.all(promises);
        setRequests(info);
        console.log(info);
      }
    };
    getRequests();
  }, [requestsIds]);

  return (
    <div className={classes.container}>
      <section className={classes.reqs}>
        {isLoading && !requests && <LoadingSpinner />}
        {!isLoading && requests && requests.length > 0 && (
          <FriendRequestsList requests={requests} refresh={refresh} />
        )}

        {!isLoading && requests && requests.length === 0 && (
          <h2>No friend requests.</h2>
        )}
      </section>

      <section className={classes.reqs}>
        {isLoading && !friends && <LoadingSpinner />}
        {!isLoading && friends && friends.length === 0 && <h2>No friends.</h2>}

        {!isLoading && friends && friends.length > 0 && (
          <FriendsMenu friends={friends} refresh={refresh} />
        )}
      </section>
    </div>
  );
};

export default Friends;

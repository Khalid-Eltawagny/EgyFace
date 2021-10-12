import React, { useRef, useState } from "react";

import classes from "./Search.module.css";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { AuthContext } from "../../shared/context/auth-context";
import { useContext } from "react";
import { useHttpClient } from "../../shared/hooks/use-http";

import UserSearchList from "../components/UserSearchList";

const Search = () => {
  const [users, setUsers] = useState(null);
  const [touched, setTouched] = useState(false);
  const ctx = useContext(AuthContext);
  const wordRef = useRef("");

  const onKeyStroke = async () => {
    setTouched(true);
    const userId = ctx.userId;
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/users/${userId}/getUsers`
      );
      console.log(res) ; 
      setUsers(res);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, sendRequest } = useHttpClient();
  return (
    <div className={classes.container}>
      <section className={classes.actions}>
        <label> Enter a name you want to find.</label>
        <input
          type="text"
          placeholder="Enter a name."
          className={classes.input}
          onChange={onKeyStroke}
          ref={wordRef}
        />
      </section>

      <section className={classes.users}>
        {!touched && <p></p>}
        {touched && (
          <Card>
            {touched && isLoading && <LoadingSpinner />}
            {touched && !isLoading && users && users.length > 0 && (
              <UserSearchList users={users} word={wordRef.current.value} />
            )}
            {touched && !isLoading && !users && <h2>No users found.</h2>}
            {touched && !isLoading && users && users.length === 0 && (
              <h2 style={{ textAlign: "center" }}>No users found.</h2>
            )}
          </Card>
        )}
      </section>
    </div>
  );
};

export default Search;

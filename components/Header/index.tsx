import React from "react";
import { IUser } from "../../schemas/user";
import { Button, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Link from "next/link";
import styles from "./Header.module.css";
import { useRouter } from "next/router";

interface Props {
  user: IUser;
}

const Header = (props: Props) => {
  const router = useRouter();

  const logOut = async () =>
    await fetch("/api/authenticate", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(() => router.push("/login"));

  return (
    <div className={styles.header}>
      <Link href="/">
        <h1 className={styles.title}>DigiVote</h1>
      </Link>
      {props.user && (
        <div className={styles.settings}>
          {props.user?.isBroker ? <Link href="/admin">Admin </Link> : ""}
          {props.user?.isBroker ? "Megler: " : ""}
          {props.user?.name}
          <Button variant="contained" color="primary" onClick={() => logOut()}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;

import { useState } from "react";
import "../../../assets/styles/UserRegistration.css";

const UserRegistration = ({ setUserInformation }) => {
  const [username, setUsername] = useState("");

  async function registerNewUser() {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
    setUserInformation(response);
  }

  return (
    <section className="registration-container">
      <div className="registration-card">
        <div className="name-container">
          <h2 className="name-container__name">What is your name?</h2>
        </div>
        <div className="name-input">
          <input
            type="text"
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" ? registerNewUser() : ""
            }
            value={username}
            className="name-input__input"
            autoFocus
          />
          <button
            className="name-input__submit-button"
            onClick={() => registerNewUser()}
            onKeyDown={(event) =>
              event.key === "Enter" ? registerNewUser() : ""
            }
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserRegistration;

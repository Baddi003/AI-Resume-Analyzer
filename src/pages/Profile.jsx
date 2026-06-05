import { useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Profile Page</h1>

      <h3>Name:</h3>
      <p>{user?.name}</p>

      <h3>Email:</h3>
      <p>{user?.email}</p>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>

      <br /><br />

      <button
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Go To Dashboard
      </button>

    </div>
  );
}

export default Profile;
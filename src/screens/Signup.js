  import React, { useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import Navbar from "../components/Navbar";

  export default function Signup() {
    const [credentials, setCredentials] = useState({
      name: "",
      email: "",
      password: "",
      geolocation: "",
    });
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

    const handleClick = async (e) => {
      e.preventDefault();
      try {
        let navLocation = () => {
          return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
          });
        };

        const latlong = await navLocation().then((res) => {
          const latitude = res.coords.latitude;
          const longitude = res.coords.longitude;
          return [latitude, longitude];
        });

        const [lat, long] = latlong;
        console.log(lat, long);

        const response = await fetch("http://localhost:5000/api/auth/getlocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latlong: { lat, long } }),
        });

        if (!response.ok) throw new Error("Failed to fetch location");

        const { location } = await response.json();
        console.log(location);
        setAddress(location);
        setCredentials({ ...credentials, geolocation: location });
      } catch (error) {
        console.error("Error fetching location:", error);
        alert("Failed to retrieve location. Please try again.");
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log("credentials: "+credentials.email)
        const response = await fetch("http://localhost:5000/api/auth/CreateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            location: credentials.geolocation,
          }),
        });
        
        if (!response.ok) throw new Error(`Signup failed with status ${response.status}`);

        const json = await response.json();
        console.log(json);

        if (json.success) {
          localStorage.setItem("token", json.authToken);
          navigate("/login");
        } else {
          alert("Invalid credentials. Please try again.");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("Signup failed. Please try again later.");
      }
    };

    const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
      <div
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
          backgroundSize: "cover",
          height: "100vh",
        }}
      >
        <div>
          <Navbar />
        </div>
        <div className="container">
          <form
            className="w-50 m-auto mt-5 border bg-dark border-success rounded"
            onSubmit={handleSubmit}
          >
            <div className="m-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={credentials.name}
                onChange={onChange}
                aria-describedby="emailHelp"
              />
            </div>
            <div className="m-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={credentials.email}
                onChange={onChange}
                aria-describedby="emailHelp"
              />
            </div>
            <div className="m-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <fieldset>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder='"Click below for fetching address"'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  aria-describedby="emailHelp"
                />
              </fieldset>
            </div>
            <div className="m-3">
              <button
                type="button"
                onClick={handleClick}
                name="geolocation"
                className=" btn btn-success"
              >
                Click for current Location
              </button>
            </div>
            <div className="m-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={credentials.password}
                onChange={onChange}
                name="password"
              />
            </div>
            <button type="submit" className="m-3 btn btn-success">
              Submit
            </button>
            <Link to="/login" className="m-3 mx-1 btn btn-danger">
              Already a user
            </Link>
          </form>
        </div>
      </div>
    );
  }

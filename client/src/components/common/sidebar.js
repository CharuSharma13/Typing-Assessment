import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/sidebar.css";
import Rank from "../../images/rank.svg";
import { Link } from "react-router-dom";

function Sidebar({ userData, setRank }) {
  const [values, setValues] = useState(null);
  useEffect(() => {
    const getScores = async () => {
      await axios
        .get(`/v1/stats/top-users`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setValues([...res.data]);
            sessionStorage.setItem("rank", JSON.stringify(res.data));
            sessionStorage.removeItem("userScores");
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    };

    getScores();
  }, [userData, setRank]);
  return (
    <div className="sidebar-section">
      <div className="top-users">
        <h3>Top Rated Users</h3>
        {values &&
          values.map((item, index) => {
            return (
              <Link to={`/profile?user_id=${item.user_id}`} key={index}>
                {/* {index < 3 && ( */}
                <img
                  src={Rank}
                  className={`user-rank${index + 1}`}
                  alt={`rank${index + 1}`}
                  style={{ visibility: index < 3 ? "visible" : "hidden" }}
                />
                {item.name}
                <br></br>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default Sidebar;

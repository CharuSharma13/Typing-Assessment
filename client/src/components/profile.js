import React, { useEffect, useState } from "react";
import { defaults } from "chart.js/auto";
import axios from "axios";
import "../css/profile.css";
import Sidebar from "./common/sidebar";
import { useSearchParams } from "react-router-dom";
import Avatar from "../images/default_avatar.jpg";
import Rank from "../images/rank.svg";
import Charts from "./chart";

function Profile({ userData }) {
  const [values, setValues] = useState(null);
  defaults.aspectRatio = false;
  defaults.responsive = true;
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [rank, setRank] = useState(null);
  useEffect(() => {
    const getScores = async () => {
      let scores = [];
      let pageExist = false;
      const userId =
        searchParams.get("user_id") || (userData && userData.user_id) || null;
      if (userId !== null && userData) {
        await axios
          .get(`/v1/stats?user_id=${userId}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.token,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              // localStorage.setItem("userScores", JSON.stringify(res.data));
              // localStorage.setItem("isApiCalled", 1);

              scores = res.data;

              if (scores.data[0].created_at !== null) {
                pageExist = true;
                setMessage("found");
              } else {
                setMessage("Page Not Found");
              }
            }
          })
          .catch((error) => {
            console.log(error.response);
          });
      } else {
        setMessage("Page Not Found");
      }
      if (pageExist) {
        let monthly_contribution = 0;
        const rankData = JSON.parse(sessionStorage.getItem("rank"));
        const currentMonth = new Date().getMonth() + 1;

        for (const data of scores.monthly) {
          if (data.month === currentMonth) {
            monthly_contribution = data.contribution_count;
            break;
          }
        }
        if (rankData) {
          setRank(null);

          rankData.filter((item, index) => {
            return item.user_id === userId && index < 3
              ? setRank(index + 1)
              : null;
          });
        }

        const { name, user_id, created_at, total_score, total_count } =
          scores.data[0];

        const profile_created_at = new Date(created_at);

        setValues({
          monthly: scores.monthly,
          name: name,
          user_id: user_id,
          profile_created_at: `${profile_created_at.getMonth()+1}/${profile_created_at.getFullYear()}`,
          total_score: total_score,
          total_contribution: total_count,
          monthly_contribution: monthly_contribution,
        });
      }
    };
    getScores();
  }, [searchParams, userData]);
  return (
    <div className="page profile-wrapper">
      {message === "found" ? (
        <>
          <div className="profile-section">
            <div className="user-score-info">
              <div className="user-profile-info">
                <div style={{ position: "relative" }}>
                  {rank && (
                    <img
                      className={`user-rank user-rank${rank}`}
                      src={Rank}
                      alt=""
                    />
                  )}
                  <img className="user-profile" src={Avatar} alt="avatar" />
                  <h3>{values.name}</h3>
                </div>
              </div>
              <div className="user-score_stats">
                <p>
                  Current Month Contribution Count:{" "}
                  <span>{values.monthly_contribution}</span>
                </p>
                <p>
                  Total Contribution Count:{" "}
                  <span>{values.total_contribution}</span>
                </p>
                <p>
                  Overall Average Score:{" "}
                  <span
                    style={{
                      color:
                        values.total_score > 50
                          ? "green"
                          : values.total_score > 90
                          ? "red"
                          : "#000",
                    }}
                  >
                    {Number(values.total_score).toFixed(2)}%{" "}
                  </span>
                </p>

                <div>
                  <p>
                    Registered: <span>{values.profile_created_at}</span>
                  </p>
                  {userData && values.user_id === userData.user_id && (
                    <p>
                      Email: <span>{userData.email}</span> (only visible to you)
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="user-score_chart user-score-info">
              <Charts data={values.monthly} />
            </div>
          </div>
          <Sidebar userData={userData} setRank={setRank} />
        </>
      ) : (
        <h2 className="page-not-found">{message}</h2>
      )}
      {/* </div> */}
    </div>
  );
}

export default Profile;

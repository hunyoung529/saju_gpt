"use client";
import React, { useState, useEffect, useContext } from "react";
import styles from "../pages/myfortune/myfortune.module.scss";
import { MyContext } from "../Context";

const Myfortune = function () {
  const { loginUser } = useContext(MyContext);
  const [fortuneData, setFortuneData] = useState(null);

  useEffect(() => {
    if (!loginUser) return;

    fetch(`/api/fortune?id=${loginUser.id}&type=fortuneCheck`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.fortune) {
          setFortuneData(data[0]);
        } else {
          askGptFortune();
        }
      })
      .catch((err) => console.error("Error fetching fortune:", err));
  }, [loginUser]);

  function askGptFortune() {
    fetch("/api/gptapi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gender: loginUser.gender,
        date: loginUser.date,
        calendartype: loginUser.calendartype,
        time: loginUser.time,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.fortune) {
          updateFortune(data);
        } else {
          console.error("No fortune data received from GPT API");
        }
      })
      .catch((err) => console.error("Error fetching new fortune data:", err));
  }
  function updateFortune(data) {
    fetch(`/api/fortune/${loginUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fortune: data.fortune,
        myelement: data.myelement,
        yourelement: data.yourelement,
      }),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        refreshFortune();
        console.log("Fortune updated successfully", updatedData);
      })
      .catch((err) => console.error("Failed to update fortune:", err));
  }
  function refreshFortune() {
    fetch(`/api/fortune?id=${loginUser.id}&type=fortuneCheck`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setFortuneData(data[0]);
        }
      })
      .catch((err) => console.error("Error refetching updated fortune:", err));
  }

  return (
    <div className={styles.myfortuneWrap}>
      <img src="/imges/main_angel_cut.png" alt="Main Angel" />
      <div className={styles.title}>당신의 운세</div>
      {fortuneData ? (
        <div style={{ whiteSpace: "pre-line" }}>
          <div className={styles.fortune}>{fortuneData.fortune}</div>
          <div className={styles.row}>
            <div>
              <p className={styles.eleTitle}>&lt; 나의 5행 &gt;</p>
              <p className={styles.ele}>{fortuneData.myelement}</p>
            </div>
            <div>
              <p className={styles.eleTitle}>&lt; 상대의 5행 &gt;</p>
              <p className={styles.ele}>{fortuneData.yourelement}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading fortune...</div>
      )}
    </div>
  );
};

export default Myfortune;

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import loginSt from "../pages/login/login.module.scss";
import { MyContext } from "../Context";

function Login() {
  const { setSessionId } = useContext(MyContext);
  const router = useRouter();
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [logMsg, setLogMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/member?id=${inputId}&pw=${inputPw}&type=login`
      );
      const users = await res.json();
      const user = users[0];

      if (user && user.id === inputId && user.password === inputPw) {
        sessionStorage.setItem("id", inputId);
        sessionStorage.setItem("gender", user.gender);
        setSessionId(inputId);
        router.push("/pages/checkfortune");
      } else {
        setLogMsg("입력하신 ID 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLogMsg("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={loginSt.home}>
      <img src="/imges/main.png" className={loginSt.m_img} alt="Main" />
      <div className={loginSt.login}>
        <form onSubmit={handleSubmit}>
          <p>
            <input
              type="text"
              name="id"
              placeholder="아이디를 입력하세요"
              autoComplete="off"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
            />
          </p>
          <p>
            <input
              type="password"
              name="pw"
              placeholder="비밀번호를 입력하세요"
              value={inputPw}
              onChange={(e) => setInputPw(e.target.value)}
            />
          </p>
          {logMsg && <p className={loginSt.message}>{logMsg}</p>}
          <p className={loginSt.btn}>
            <button type="submit" className={loginSt.submit}>
              로그인
            </button>
            <button
              type="button"
              onClick={() => router.push("/pages/join")}
              className={loginSt.aa}
            >
              회원가입
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

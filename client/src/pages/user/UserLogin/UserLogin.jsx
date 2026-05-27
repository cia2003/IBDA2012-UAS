import { useCallback, useState } from "react";
import styles from "./userLogin.module.css";
import { useAppContext } from "../../../hook/useContext";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "", 
    email: "",
    password: "",
  });
  const { userLogin, userRegister } = useAppContext();
  const navigate = useNavigate();

  // Handler untuk sinkronisasi input dengan state
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (state === "login") {
          const data = await userLogin(formData.email, formData.password);
          if (data) {
            navigate("/");
          }
        } else if (state === "register") {
          const registerData = await userRegister(formData);
          const loginData = await userLogin(formData.email, formData.password);

          if (loginData) {
            navigate("/");
          }
          
        }
      } catch (error) {}
    },
    [formData, state],
  );

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["auth-box"]}>
        <div className={styles["auth-header"]}>
          {state === "login" ? (
            <>
              <h2>Selamat Datang</h2>
              <p>Masuk ke akun IBDA Kost Anda</p>
            </>
          ) : (
            <>
              <h2>Buat Akun Baru</h2>
              <p>Bergabunglah dengan ribuan pengguna IBDA Kost</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {state === "login" ? (
            <>
              <div className={styles["form-group"]}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  placeholder="Masukkan password Anda"
                  required
                />
              </div>
              <button type="submit" className={styles["login-btn"]}>
                Masuk
              </button>

              <div className={styles["signup-link"]}>
                Belum punya akun?{" "}
                <span
                  onClick={() => setState("register")}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Daftar sekarang
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={styles["form-group"]}>
                <label htmlFor="firstName">Nama Depan</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  placeholder="Masukkan nama depan Anda"
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="lastName">Nama Belakang</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  placeholder="Masukkan nama belakang Anda"
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  placeholder="Buat password yang kuat"
                  required
                />
              </div>
              <button type="submit" className={styles["register-btn"]}>
                Daftar Akun
              </button>

              <div className={styles["login-link"]}>
                Sudah punya akun?{" "}
                <span
                  onClick={() => setState("login")}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Masuk di sini
                </span>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
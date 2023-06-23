import React, { useEffect, useRef, useState } from "react";
import "../../../assets/scss/custom/./Login.scss";
import AuthLayout from "../AuthLayout";
import { VerticalForm } from "../../../components";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
let currentOTPindex: number = 0;
function Otp() {
  const [otperror, setotperror] = useState(false);
  const [otperrortxt, setotperrortxt] = useState("");

  const [loadingdiv, setLoadingdiv] = useState<boolean>(false);

  // inpitfields
  const inputRef = useRef<HTMLInputElement>(null);
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const [otpIndex, setOtpIndex] = useState<number>(0);

  const navigate = useNavigate();

  const handleOtpChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOtp: string[] = [...otpValues];
    newOtp[currentOTPindex] = value.substring(value.length - 1);

    if (!value) {
      setOtpIndex(currentOTPindex - 1);
    } else {
      setOtpIndex(currentOTPindex + 1);
    }

    setOtpValues(newOtp);
  };

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPindex = index;
    if (key === "Backspace") {
      setOtpIndex(currentOTPindex - 1);
    }
  };
  const handleverify = () => {
    setLoadingdiv(true);

    var myHeaders = new Headers();
    const token: string | null = localStorage.getItem("token");
    myHeaders.append("token", token!);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      OTP: otpValues.join(""),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      // redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/signup_verify_otp`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result?.status === "success") {
          setotperror(false);
          navigate("/onboarding");
          setLoadingdiv(false);
        } else {
          setotperror(true);
          setotperrortxt(result?.msg || "Something went wrong");

          setLoadingdiv(false);
        }
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, [otpIndex]);

  return (
    <AuthLayout>
      <div className="d-flex flex-grow-1 flex-column">
        <h2 className="h1 my-2 text-sm-center">{"Enter OTP"}</h2>
        <VerticalForm onSubmit={handleverify}>
          <div className="d-flex align-items-center mb-0 mt-2 flex-grow-1 gap-1">
            {otpValues.map((item, index) => (
              <input
                key={`otp-${index}`}
                type="number"
                name={`otp${index + 1}`}
                className="form-control otp-input mr-2 spin-button-none"
                ref={index === otpIndex ? inputRef : null}
                onChange={handleOtpChange}
                value={otpValues[index]}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
              />
            ))}
          </div>
          {otperror && (
            <div className="alert alert-danger mt-2">{otperrortxt}</div>
          )}
          <button
            type="submit"
            className="mt-2 btn-sm btn-rounded waves-effect waves-light text-white align-self-center create-btn"
          >
            {loadingdiv ? (
              <Spinner animation="border" variant="warning" size="sm" />
            ) : (
              "Verify"
            )}
          </button>
        </VerticalForm>
        <div className="mt-2">
          <Button
            type="button"
            // disabled={timer > 0}
            className="btn btn-link border-0"
            style={{ background: "none", color: "blue" }}
          >
            {/* {timer > 0
                    ? `${t("Resend OTP")} (${timer}s)`
                    : t("Resend OTP")} */}
            Resend OTP
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Otp;

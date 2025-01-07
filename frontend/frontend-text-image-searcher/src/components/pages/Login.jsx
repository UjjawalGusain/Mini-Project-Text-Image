import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ENDPOINTS from "../../services/api";

function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(ENDPOINTS.USER.LOGIN, {
        username: values.username,
        password: values.password,
      });
      alert(response.data.message);
      // Store the token in localStorage or a secure cookie
      localStorage.setItem("token", response.data.token);
      navigate('/home')
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.detail || "Invalid credentials");
      } else {
        setErrorMessage("Network error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-8 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="username">
                Username
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="w-full p-2 mt-2 border rounded"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full p-2 mt-2 border rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;

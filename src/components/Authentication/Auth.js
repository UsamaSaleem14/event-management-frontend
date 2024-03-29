import { useState, useContext } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input, Button, Checkbox, message } from 'antd'
import './Auth.style.css'
import axios from 'axios'
import AuthContext from '../../context/auth-context'
import { Navigate } from 'react-router-dom'

const FormItem = Form.Item

const Auth = () => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const { token, login } = useContext(AuthContext)

  const handleSubmit = (values) => {
    if (!values.username || !values.password) {
      return
    }
    setIsLoginLoading(true)

    let body = {
      query: `
        query {
          login (email: "${values.username}", password: "${values.password}") {
            token
          }
        }
      `,
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    axios
      .post('http://localhost:8000/api', JSON.stringify(body), {
        headers: headers,
      })
      .then(async function (response) {
        setIsLoginLoading(false)
        if (response.data.errors && response.data.errors.length > 0) {
          throw new Error(response.data.errors[0].message)
        }
        if (response.data.data.login.token) {
          login(response.data.data.login.token, response.data.data.login.userId, response.data.data.login.tokenExpiration)
        }
        message.success('The request was successful.')
      })
      .catch(function (error) {
        setIsLoginLoading(false)
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          message.error(error.response.data.errors[0].message.toString())
        } else {
          message.error('An error occurred while processing the request')
        }
      })
  }

  const handleSubmitSignup = (values) => {
    if (!values.signup_username || !values.signup_password) {
      message.error('Please fill in the required fields')
      return
    }
    setIsLoading(true)

    let body = {
      query: `
        mutation {
          createUser(userInput: {email: "${values.signup_username}", password: "${values.signup_password}"}) {
            _id
            email
          }
        }
      `,
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    axios
      .post('http://localhost:8000/api', JSON.stringify(body), {
        headers: headers,
      })
      .then(async function (response) {
        setIsLoading(false)
        if (response.data.errors && response.data.errors.length > 0) {
          throw new Error(response.data.errors[0].message)
        }
        message.success('The request was successful. Please login to continue')
        setShowSignUp(false)
      })
      .catch(function (error) {
        setIsLoading(false)
        if (error) {
          message.error(error.toString())
        } else {
          message.error('An error occurred while processing the request')
        }
      })
  }

  const changeView = () => {
    setShowSignUp((prevState) => !prevState)
  }

  if (token) {
    return <Navigate to="/events" />
  }

  return (
    <>
      {!showSignUp ? (
        <div className="lItem">
          <div className="loginForm">
            <h2>Login</h2>
            <Form onFinish={handleSubmit} className="login-form">
              <FormItem name="username">
                <Input className="inputbox" prefix={<UserOutlined />} placeholder="Username" />
              </FormItem>
              <FormItem name="password">
                <Input className="inputbox" prefix={<LockOutlined />} type="password" placeholder="Password" />
              </FormItem>
              <FormItem>
                <Checkbox>Remember me</Checkbox>
                <Button type="primary" htmlType="submit" className="login-form-button" loading={isLoginLoading}>
                  Log in
                </Button>
              </FormItem>
              <p>
                Don't have an account?{' '}
                <span onClick={changeView} className="view-link">
                  Signup Here
                </span>
              </p>
            </Form>
          </div>
        </div>
      ) : (
        <div className="lItem">
          <div className="signupForm">
            <h2>Sign Up</h2>
            <Form onFinish={handleSubmitSignup} className="signup-form">
              <FormItem name="signup_username">
                <Input className="inputbox" prefix={<UserOutlined />} placeholder="Username" />
              </FormItem>
              <FormItem name="signup_password">
                <Input className="inputbox" prefix={<LockOutlined />} type="password" placeholder="Password" />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="signup-form-button" loading={isLoading}>
                  Sign Up
                </Button>
              </FormItem>
              <p>
                Already have an account?{' '}
                <span onClick={changeView} className="view-link">
                  Log in
                </span>
              </p>
            </Form>
          </div>
        </div>
      )}
    </>
  )
}

export default Auth

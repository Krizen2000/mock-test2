// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType, RegisterParams } from './types'

import { disableMock, enableMock } from 'src/@fake-db/mock'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    disableMock() // Disable Axios Mocker Adaptor
    axios
      .post('http://localhost:3120/api/login', params)
      .then(async response => {
        await enableMock() // Enable Axios Mocker Adaptor
        window.localStorage.setItem('username', response.data.username)
        window.localStorage.setItem('token', response.data.token)

        axios
          .post(authConfig.loginEndpoint, { email: 'admin@materialize.com', password: 'admin' })
          .then(async response => {
            params.rememberMe
              ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
              : null

            // const returnUrl = router.query.returnUrl

            setUser({ ...response.data.userData })
            params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null

            // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            const redirectURL = '/dashboard'

            router.replace(redirectURL as string)
          })

          .catch(err => {
            console.log('err:', err)
            if (errorCallback) errorCallback(err)
          })
      })
      .catch(err => {
        console.log('err:', err)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    disableMock() // Disable Axios Mocker Adaptor
    axios
      .post('http://localhost:3120/api/signup', params)
      .then(async response => {
        await enableMock() // Enable Axios Mocker Adaptor
        window.localStorage.setItem('username', response.data.username)
        window.localStorage.setItem('token', response.data.token)

        axios
          .post(authConfig.loginEndpoint, { email: 'admin@materialize.com', password: 'admin' })
          .then(async response => {
            window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)

            setUser({ ...response.data.userData })
            window.localStorage.setItem('userData', JSON.stringify(response.data.userData))

            const redirectURL = '/dashboard'

            router.replace(redirectURL as string)
          })

          .catch(err => {
            console.log('err:', err)
            if (errorCallback) errorCallback(err)
          })
      })
      .catch(err => {
        console.log('err:', err)
        if (errorCallback) errorCallback(err.message)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('username')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

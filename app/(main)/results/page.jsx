"use client";
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import AdminAnalyses from '../../../components/AdminAnalyses.jsx';
import UserAnalyses from '../../../components/UserAnalyses.jsx';

export default function UserFullAnalytics() {
  const [user] = useState(() => {
    const cookieUser = Cookies.get('user')
    if (cookieUser) {
      const decoded = decodeURIComponent(cookieUser)
      const parsed = JSON.parse(decoded)
      console.log(parsed.role);
      return parsed
    }
    return null
  })

  return (
    <div>
      {user.role === "admin" ? <AdminAnalyses/> : <UserAnalyses/> }
    </div>
  )
}

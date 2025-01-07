import React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import ImageContainer from '../ImageContainer/ImageContainer'
import DashboardHeader from '../headers/DashboardHeader'
import UploadButton from '../buttons/UploadButton'
function Home() {
  return (
    <div className='w-full min-h-screen relative'>
        <DashboardHeader/>
        <SearchBar/>
        <ImageContainer/>
        <UploadButton/>
    </div>
  )
}

export default Home
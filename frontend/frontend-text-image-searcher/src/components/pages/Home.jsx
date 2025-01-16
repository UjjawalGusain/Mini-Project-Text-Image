import React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import ImageContainer from '../ImageContainer/ImageContainer'
import DashboardHeader from '../headers/DashboardHeader'
import UploadButton from '../buttons/UploadButton'
import RemoveButton from '../buttons/RemoveButton'
function Home() {
  return (
    <div className='w-full min-h-screen relative'>
        <DashboardHeader/>
        <SearchBar/>
        <ImageContainer/>
        <UploadButton/>
        <RemoveButton/>
    </div>
  )
}

export default Home
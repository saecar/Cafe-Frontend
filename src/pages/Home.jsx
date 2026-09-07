import Hero from '../components/Hero'
import Divider from '../components/Divider'
import Tentang from '../components/Story'
import MenuPage from './MenuPage'

function Home() {
    return (
        <>
            <Hero />
            <Divider />
            <Tentang />
            <Divider/>
            <MenuPage/>
            <Divider />
           
        </>
    )
}

export default Home
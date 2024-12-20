import { useEffect, useState } from "react"
import { motion } from "motion/react"

import Map from "../ui/Map"

import {useUrlPosition} from "../hooks/useUrlPosition"
import { getGeocoding, getRoute } from "../services/apiGraphHopper"
import { useGeolocation } from "../hooks/useGeolocation"

function AppLayout() {
    const [start, setStart] = useState(false)
    const [geocoding, setGeocoding] = useState("")
    const [destination, setDestination] = useState([])
    const [travel, setTravel] = useState([])
    const [lat, lng] = useUrlPosition()
    const { location, isLoading } = useGeolocation({lat: 45.51, lng: -122.68})

    useEffect(() => {
        if (lat && lng) {
            setDestination([lat, lng])
        }
    }, [lat, lng])

    useEffect(() => {
        async function getGeocode() {
            if (!lat && !lng) return 

            let location = ""
            const data = await getGeocoding([lat, lng])

            location = `${data?.hits[0].name}, ${data?.hits[0].city} City, ${data?.hits[0].country}`

            setGeocoding(location)
        }

        getGeocode()
    }, [lat, lng])

    useEffect(() => {
        async function getTravelPath() {
            if (!location && !destination.length) return 

            const data = await getRoute({location: [location.lat, location.lng], destination})

            setTravel(data?.paths[0])
        }

        getTravelPath()
    }, [location, destination ])

    function handleStart() {
        setStart(true)
    }

    function formatDistance(distance) {
        return (distance / 1000).toFixed(2) + " km";
    }
    
    function formatTime(time) {
        const totalMinutes = Math.floor(time / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    console.log(travel)
    return (
        <div className="relative h-screen w-full">
            <Map destination={destination} location={location} path={travel?.points?.coordinates} isLoading={isLoading}/>
            <motion.div animate={{y: [-100, 0], opacity: [0, 1]}} transition={{duration: 0.3}} className="absolute bottom-0 h-[40%] w-full px-8 py-6 z-[400]">
                {!start ? 
                <div className="h-full w-full bg-white rounded-2xl shadow-md flex flex-col justify-center gap-4 px-6">
                    <p>To start, choose a destination.</p>
                    <input type="text" placeholder="Destination" defaultValue={geocoding} className="border-2 border-zinc-200 rounded-md text-sm p-2 focus:outline-none focus:border-zinc-800 transition duration-300" disabled/>
                    <button className="text-white bg-zinc-800 text-sm px-4 py-3 rounded-md active:bg-zinc-700 disabled:bg-zinc-400" onClick={handleStart} disabled={!destination.length}>Start</button>
                </div> : 
                <div className="h-full w-full bg-white rounded-2xl shadow-md flex justify-center gap-12 px-6">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-lg">Distance</p>
                        <p>{formatDistance(travel?.distance)}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-lg">Time</p>
                        <p>{formatTime(travel?.time)}</p>
                    </div>
                </div>}
            </motion.div>
        </div>
    )
}

export default AppLayout
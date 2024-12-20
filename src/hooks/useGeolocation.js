import { useEffect, useState } from "react";

export function useGeolocation(defaultPosition) {
    const [location, setLocation] = useState(defaultPosition)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!navigator.geolocation) return setError('Your browser does not support geolocation')

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition((location) => {
            setLocation({
                lat: location.coords.latitude, 
                lng: location.coords.longitude
            })
            setIsLoading(false)
        }, (error) => {
            setError(error.message)
            setIsLoading(false)
        })
    }, [])

    return { location, isLoading, error }
}
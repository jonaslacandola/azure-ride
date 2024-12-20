export async function getRoute({location, destination}) {
    const points = [`${location}`, `${destination}`];
    const query = new URLSearchParams({
        profile: "foot",
        locale: "en",
        instructions: "true",
        optimize: true,
        points_encoded: false,
        key: "736ed756-7473-411e-a7bd-1f40686cc523"
    });

    // Add each point parameter individually
    const route = points.forEach(point => query.append("point", point));

    const response = await fetch(`https://graphhopper.com/api/1/route?${route}&${query.toString()}`, {
        method: "GET"
    });
    const data = await response.json();

    return data;
}

export async function getGeocoding(location) {
    const query = new URLSearchParams({
        locale: "en",
        reverse: true,
        point: `${location[0]},${location[1]}`,
        limit: 1,
        key: "736ed756-7473-411e-a7bd-1f40686cc523"
    })

    const response = await fetch(`https://graphhopper.com/api/1/geocode?${query.toString()}`)
    const data = await response.json()

    return data;
}
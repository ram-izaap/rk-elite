export interface GroupOptions {
    id:string,
	user_id   : string,
    name: string,
    join_key: string,
    password: string,
    type: string,
    location_type: string,
    latitude: string,
    longitude: string,
    protection_type: string,
    created_id: string,
    updated_id: string,
    action_type:string
}

export interface GroupLists {
    user_id: string
}

export interface GroupInfo{
    id: string,
    type: string
}

export interface ExitMaps {
    userId: number,
    joinKey: string,
    type: string
}


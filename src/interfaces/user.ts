export interface UserOptions {
	username: string,
    password: string
};

export interface SignUpOptions {
	email   : string,
    password: string,
    phone_number: string,
    default_id: string,
    type: string
};

export interface changePassword {
    password: string,
    confirm_password: string
}

export interface UserInterface {
    profile: ProfileInterface,
    group: GroupInterface
};

export interface ProfileInterface {
    type ?: "USER" | "GUEST",
    id: number,
    defaultID ?: string,
    email ?: string,
    phoneNumber ?: string,
    stationID ?: string,
    password ?:string,
    deviceToken ?: string,
    profileImage ?:string
};

export interface GroupInterface {
    id: number,
    userId ?:number,
    joinKey: string,
    name: string, 
    type: string,
    address ? : string,   
    locationType: string,
    protectionType: string,
    password ?: string,
    createdID ?:number,
    updatedID ?:number,
    createdDate ?:string,
    updatedDate ?:string,
    latitude ?:string,
    longitude?:string,
    view ?: number,
    status ?: number,
    lastSeenTime ?: string,
    userType ?: string,
    markerIcon ?: string,
    currentMapJoinKey ?: string
};


export interface profileOptions {
	email   : string,
    password: string,
    phone_number: string,
    default_id: string,
    user_id: string
};

export interface positionOptions {
    userId: string,
    latitude: number, 
    longitude: number, 
    speed?: number, 
    altitude?: number, 
    accuracy?: number, 
    bearing?: number,
    type ?: string,
    locationData ?: any
}

export interface MemberInterface{
    profile: ProfileInterface,
    group: GroupInterface,
    position: positionOptions
}

export interface SearchInterFace {
    user_id: number,
    joinKey: string,
    password?: string
    
}

export interface SavedMapsInterface {
    memberCount: number,
    groupName: string,
    channelID: string,
    profileImage ?: string,
    createdBy: string,
    type:string,
    groupid:string,
    favourite?:string,
    createdDate?: string
}

export interface SavedMapsInfo {
    privateMaps: Array<SavedMapsInterface>,
    publicMaps: Array<SavedMapsInterface>
}

export interface MemberLocation {
    profile: ProfileInterface,
    group: GroupInterface,
    position: positionOptions
}

export interface CluesInterface{
    clue_name : string,
    notes : string,
    latitude : number,
    longitude : number,
    user_id : number,
    group_id : number
}

export interface UserTags {
   icon: UserTagsIcons
}

export interface UserTagsIcons {
    name: string,
    url?: string
}

export interface updateDeviceToken {
    id: number,
    device_token: string
}

import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

//rxjs
import { Observable } from 'rxjs/Observable';
//import { Subscription } from 'rxjs/Subscription';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";

//PROVIDERS
//import { AppSettingsProvider } from '../app-settings/app-settings';

//INTERFACES
import { ExitMaps } from '../../interfaces/group';
import { GroupInterface, MemberInterface, SearchInterFace, SavedMapsInterface,SavedMapsInfo} from '../../interfaces/user';

@Injectable()
export class GroupProvider {

  constructor(public http: HttpClient, 
          //    private appSettingsProvider: AppSettingsProvider
  ) {
    console.log('Hello GroupProvider Provider');
  }

  public group(group: GroupInterface,pageType:string): Observable<HttpResponse<any>> {
    let apiPath: string = 'users/groups';
    
    if(pageType == 'create' && group.id == 0){
      return this
          .http
          .put<HttpResponse<any>>(apiPath, group);
    }
    else
    {
      return this
      .http
      .post<HttpResponse<any>>(apiPath, group);
    }    
  }
  
  public getMapsByUserID(userID: any): Observable<Array<GroupInterface>> {
    let apiPath: string = 'users/groups';    
    //prepare HttpParams
    
    let httpParams: HttpParams = new HttpParams().set("id",(userID)).set("type","lists");
		return this
				.http
        .get<HttpResponse<any>>(apiPath, {params: httpParams})
        .map(resp => {
          let httpResponse: any = resp;
          let mappedGroups: Array<GroupInterface> = [];
          //prepare groups data
          for(let item of httpResponse.data){
            let group: GroupInterface = {
              id: item.id,
              userId: item.user_id,
              name: item.name,
              joinKey: item.join_key,
              type: item.type,
              locationType: item.location_type,
              protectionType: item.protection_type,
              password: item.password,
              createdID: item.created_id,
              updatedID: item.updated_id,
              createdDate: item.created_time,
              updatedDate: item.updated_time,
              latitude:'',
              longitude:''
            };
            mappedGroups.push(group);
          }
          return mappedGroups;
        });
  }

  public getMapsByGroupID(group: GroupInterface): Observable<HttpResponse<any>> {
    let apiPath: string = 'users/groups';
    
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams().set("id",group.id+"").set("type","view");

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams});
  }

 

  public getMembersByGroup(search: SearchInterFace): Observable<Array<MemberInterface>> {
    let apiPath: string = 'groups/members';    
    //prepare HttpParams
    let userID = search.user_id+'';
    let httpParams: HttpParams = new HttpParams().set("user_id",(userID)).set("join_key",search.joinKey);
		return this
				.http
        .get<HttpResponse<any>>(apiPath, {params: httpParams})
        .map(resp => {

          let httpResponse: any = resp;

          console.log(httpResponse);
          console.log(httpResponse.data);

          if(httpResponse.status == 'error'){
              //alert(httpResponse.message);
              return httpResponse;
          }
          else
          {
            
             let mappedMembers: Array<MemberInterface> = [];

              //prepare groups data
              for(let item of httpResponse.data) {
    
                let member: MemberInterface = {
    
                  profile: 
                  {
                      id: item.id,
                      defaultID: item.default_id,
                      phoneNumber: item.phone_number,
                      email: item.email,
                      type: item.type,
                      stationID: item.station_id,
                      profileImage: item.profile_image
                  },
                  group: 
                  {
                      id: item.group_id,
                      name: item.name,
                      joinKey: item.join_key,
                      type: item.group_type,
                      locationType: item.location_type,
                      protectionType: item.protection_type,
                      view: item.is_view,
                      lastSeenTime: item.lastseen,
                      status: item.status,
                      userType : item.user_type,
                      markerIcon:''
                  },
                  position: 
                  {
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                      accuracy: item.accuracy,
                      bearing: item.bearing,
                      speed: item.speed,
                      altitude: item.altitude,
                      userId: item.id
                  }
    
                };
    
                mappedMembers.push(member);
    
              }

              return mappedMembers;
          }
         
        });
  }


  public getMemberUserTagByChannelID(channel_id:any, userType:string): Observable<HttpResponse<any>> {
    let apiPath: string = 'groups/create_member_user_tag';
    console.log(channel_id);
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams().set("channel_id",channel_id+"").set("user_type",userType);

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams});
  }


  public removeMembersByUserID(search: SearchInterFace): Observable<HttpResponse<any>> {
    let apiPath: string = 'groups/members';
    
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams();

		return this
				.http
				.delete<HttpResponse<any>>(apiPath+"/"+search.user_id+"/"+"/exit", {params: httpParams});
  }
  
  
  
  public getMapsByUser(userId: any): Observable<SavedMapsInfo> {
    let apiPath: string = 'users/members';    

    //prepare HttpParams
    let httpParams: HttpParams = new HttpParams().set("user_id",userId);
		return this
				.http
        .get<HttpResponse<any>>(apiPath, {params: httpParams})
        .map(resp => {
          let httpResponse: any = resp;
          
         
          let mappedMaps: SavedMapsInfo = {privateMaps:[],publicMaps:[]};
          
          if(httpResponse.status == 'success'){

          for(let memberLists of httpResponse.members){
            
            let memberInfo: SavedMapsInterface = {
              memberCount: memberLists.members_count,
              groupName: memberLists.name,
              channelID: memberLists.join_key,
              createdBy: memberLists.default_id,
              type: memberLists.type,
              groupid: memberLists.group_id,
              favourite: memberLists.is_favourite,
              createdDate: memberLists.created_time,
              profileImage: memberLists.profile_image

            };

            if(memberLists.type == 'PRIVATE'){
              mappedMaps.privateMaps.push(memberInfo);
            }
            else
            {
              mappedMaps.publicMaps.push(memberInfo);
            }
            return mappedMaps;
          }
          
          return mappedMaps;
        }
        else
        {
          return httpResponse;
        }  

        });
  }
 
  public isValidate(search: SearchInterFace): Observable<HttpResponse<any>> {
    let apiPath: string = 'groups/is_validate';    

    let userId = search.user_id+"";

    //prepare HttpParams
    let httpParams: HttpParams = new HttpParams().set("user_id",userId).set("join_key",search.joinKey).set("password",search.password);

		return this
				.http
        .get<HttpResponse<any>>(apiPath, {params: httpParams});      
  }

  public allowDenySendNotification(search: SearchInterFace): Observable<HttpResponse<any>> {
    let apiPath: string = 'groups/allow_deny_send_request';    

    let userId = search.user_id+"";

    //prepare HttpParams
    let httpParams: HttpParams = new HttpParams().set("user_id",userId).set("join_key",search.joinKey);

		return this
				.http
        .get<HttpResponse<any>>(apiPath, {params: httpParams});      
  }

  //Exit/Clear MAPS
  public removeMembers(exitMaps:ExitMaps): Observable<HttpResponse<any>> {
    let apiPath: string = 'groups/members';
    
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams();

		return this
				.http
				.delete<HttpResponse<any>>(apiPath+"/"+exitMaps.userId+"/"+exitMaps.joinKey+"/"+exitMaps.type, {params: httpParams});
  }

 //Breadcrumbs
  public getBreadcrumbs(params:any): Observable<HttpResponse<any>> {
    let apiPath: string = 'users/breadcrumbs';
    
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams().set("id",params);

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams});
  }


  //station id update
	
  public updateStationId(joinKey:any,uid:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'groups/stationid_update';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, {joinKey,uid})
			.map(resp => {

				let httpResponse = resp;
				
				return httpResponse;
			});
  
  }

  //Select Station id
	// public selectStationId(userid:any): Observable<HttpResponse<any>> {
	
  //   let apiPath: string = 'groups/station_select';
    
	// 	//prepare HttpParams
	// 	let httpParams: HttpParams = new HttpParams().set("id",userid);

	// 	return this
	// 			.http
	// 			.get<HttpResponse<any>>(apiPath, {params: httpParams});
  
  // }
  

  /** Create Clues */
	public createClues(data:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'groups/clues_create';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, data)
			.map(resp => {

				let httpResponse = resp;
				
				return httpResponse;
			});
  
  }
  
 /** Update Favourites*/ 

  public updateFavourite(user_id:any,group_id:any): Observable<HttpResponse<any>> {
    
    let apiPath: string = 'groups/favourite_group';

    return this
    .http
    .post<HttpResponse<any>>(apiPath, {user_id,group_id});

  }


  public deleteGroups(groupid): Observable<HttpResponse<any>> {
    let apiPath: string = 'groups/delete_groups';
    
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams();

		return this
				.http
				.delete<HttpResponse<any>>(apiPath+"/"+groupid, {params: httpParams});
  }


  public deleteNotifications(notificationId): Observable<HttpResponse<any>> {
    let apiPath: string = 'notifications/notification';
    
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams();

		return this
				.http
				.delete<HttpResponse<any>>(apiPath+"/"+notificationId+"/"+"/exit", {params: httpParams});
  }

  
}



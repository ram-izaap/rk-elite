import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
//rxjs
import { Observable } from 'rxjs/Observable';
//import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { forkJoin } from "rxjs/observable/forkJoin";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/fromPromise";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

//PROVIDERS
//import { AppSettingsProvider } from '../app-settings/app-settings';

//INTERFACES
import { UserOptions, 
		SignUpOptions, 
		//profileOptions, 
		positionOptions,
		UserInterface,
		ProfileInterface,
		MemberInterface,
		updateDeviceToken
	//	GroupInterface
	 } from '../../interfaces/user';


/** 
  Generated class for the UserProvider provider.
*/

@Injectable()
export class UserProvider {
  
	// source for observable
	private authStatusSource: BehaviorSubject<boolean> = new BehaviorSubject(false);	
	// observable stream
	public authStatus$ = this
						.authStatusSource
						.asObservable();

	
	// source for observable
	public userInfoSource: BehaviorSubject<UserInterface> = new BehaviorSubject(null);
	// observable stream
	public userInfo$ = this.userInfoSource.asObservable();

	constructor(public http: HttpClient, 
			//	private appSettingsProvider: AppSettingsProvider,
				private ionicStorage: Storage,private file: File
			) {
		console.log('Hello UserProvider Provider');
	}

	/**
	 * validateUser
	 */
	public validateUser(): Promise<any> {
		return this
				.ionicStorage
				.get('userInfo')
				.then(function (savedUserInfoFromStorage) {
					console.log("GGG::", savedUserInfoFromStorage);
					return savedUserInfoFromStorage;
				});
	}

  	/**
   * login
   */

	public login(login: UserOptions): Observable<HttpResponse<any>> {

		let apiPath: string = 'users/profiles';
		
		//prepare data
		let httpParams: HttpParams = new HttpParams()
				.set("username", login.username)
				.set("password", login.password)
				.set("type", 'login');

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams})
				.map(resp => {
					
					let httpResponse: any = resp;
					if(httpResponse.status == 'success'){

						//trigger userInfo
						if(Array.isArray(httpResponse.data) && httpResponse.data.length > 0){
							let data: any = httpResponse.data[0];
							console.log(data);
							let userInfo: UserInterface = {
								profile:{
									type: data.type,
									id: data.id,
									defaultID: data.default_id,
									email: data.email,
									password: data.password,
									phoneNumber: data.phone_number,
									stationID: data.station_id,
									profileImage: data.profile_image
								},
								group: {
									id: data.group.id,
									userId: data.id,
									name: data.group.name,
									joinKey: data.group.join_key,
									type: data.group.type,
									locationType: data.group.location_type,
									protectionType: data.group.protection_type,
									password: data.group.password,
									createdID: data.group.created_id,
									updatedID: data.group.updated_id,
									createdDate: data.group.created_time,
									updatedDate: data.group.updated_time,
									latitude:'',
									longitude:'',
									currentMapJoinKey:data.group.join_key
								}
							};
							console.log("user: "+userInfo);
							this.userInfoSource.next(userInfo);
							this.ionicStorage.set("userInfo", userInfo);							
						}
						
						//trigger authstatus$
						this.authStatusSource.next(true);
					}

					return httpResponse;
				});

	}

	/**
	 * updateAuthStatus
	 */
	public updateAuthStatus(status: boolean) {
		this.authStatusSource.next(status);
	}

  	/**Signup */
  	public signup(signup: SignUpOptions): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/profiles';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, signup)
			.map(resp => {

				let httpResponse = resp;
				
				return httpResponse;
			});
  
    }

    public forgotPassword(email): Observable<HttpResponse<any>> {

		let apiPath: string = 'users/forget_password';

		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams().set("email",email);

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams});
    
	}
	
	/** ------------------ logout ----------------------
	 */
	public logout(): Promise<void> {
		return this
			.ionicStorage
			.clear()
			.then(() => {			
				//Trigger app.comonent subscription
				this.authStatusSource.next(false);

				//clear userinfo
				this.userInfoSource.next(null);
				
				return;
			});
	}; // end logout

	
	/** Profile Update */
	public updateProfile(profile:ProfileInterface):Observable<HttpResponse<any>> {

		let apiPath: string = 'users/profiles';
	
		return this
			.http
			.post<HttpResponse<any>>(apiPath, profile);

	}


	//update user device token
	public updateUserDeviceToken(user_id,device_token):Observable<HttpResponse<any>> {

		let apiPath: string = 'users/profiles';

	    let profile:ProfileInterface = {
				id: user_id,
				deviceToken: device_token
		};

		return this
			.http
			.post<HttpResponse<any>>(apiPath, profile);

	}

	//user position 

	
	public position(position: positionOptions): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/position';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, position)
			.map(resp => {

				let httpResponse = resp;
				
				return httpResponse;
			});
  
	}

	//user position update
	public userPositionUpdate(position: positionOptions): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/position';
	
		return this
		.http
		.post<HttpResponse<any>>(apiPath, position);

  
	}


	/** Select Notifications */
	public getNotifications(userid: string,joinkey: string):Observable<Array<NotificationInteface>>
	{

		let apiPath: string = 'notifications/notification';
		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams()
									 .set("id",userid)
									 .set("joinKey",joinkey);
			
		return this
						.http
						.get<HttpResponse<any>>(apiPath, {params:httpParams})
						.map(resp => {
							console.log(resp);
							let httpResponse: any  = resp,
									notifications: Array<NotificationInteface> = [];

							if(httpResponse.notification && Array.isArray(httpResponse.notification)){
								for(let item of httpResponse.notification){
									console.log(item);
									let createdDate = new Date(item.created_date);
									let attachment: AttachmentInterface = {};

									// Preparing attachment data
									let att = JSON.parse(item.attachments);
									if(att && typeof att == 'object'){
										// get file data
										if(att.file){
											let temp = att.file.split('.');
											let extension = temp[temp.length-1];
													temp = extension.split('?');
													extension = temp[0];

											attachment.file = {
													type: (['jpg', 'jpeg', 'png', 'gif'].indexOf(extension)!== -1)?'image':'document',
													url: att.file
											};
										}
										// link data
										if(att.link) {
											attachment.link = att.link;
										}

									}


									let notification: NotificationInteface = {
										notificationId : item.nid,
										defaultId : item.default_id,
										profileImage : item.profile_image,
										joinKey: item.join_key,
										senderId : item.sender_id,
										message: item.message,
										createdDate: createdDate.getTime(),
										attachment: attachment,
										//profileImage: item.profile_image,
										senderName: item.default_id
									}

									notifications.push(notification);
								}
							}

							notifications.sort(function(a, b){
								if(a.createdDate>b.createdDate) return 0;
								return 1;
							});
							
							return notifications;
						});

	}


	/** Insert Notifications */
	public Notification(data:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'notifications/send_message_group_members';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, data)
			.map(resp => {

				let httpResponse = resp;
				
				return httpResponse;
			});
  
	}


   /** Change Password */
	public changePassword(password:any,id): Observable<HttpResponse<any>> {

	 	// console.log(password);
	 	// console.log(id);

		let apiPath: string = 'users/change_password';

		//prepare HttpParams
		let httpParams: HttpParams = new HttpParams().set("password",password).set("userid",id);

		return this
				.http
				.get<HttpResponse<any>>(apiPath, {params: httpParams});
    
	}


	public removeChannel(id:any,joinkey:any): Observable<HttpResponse<any>> {
		let apiPath: string = 'users/remove';
		
			//prepare HttpParams
			let httpParams: HttpParams = new HttpParams();
	
			return this
					.http
					.delete<HttpResponse<any>>(apiPath+"/"+id+"/"+joinkey+"/"+'one', {params: httpParams});
	}


	//user position update
	public userBlock(uid:any,groupid:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/block';
	
		return this
		.http
		.post<HttpResponse<any>>(apiPath, {uid,groupid});

  
	}


	//Select Pro Plans
	public planSelect(): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/plan_select';
	
		return this
		.http
		.post<HttpResponse<any>>(apiPath, {});

  
	}


	//Pro plans Update 
	public planUpdate(promo_code:any,plan_id:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/pro_plans';
	
		return this
		.http
		.post<HttpResponse<any>>(apiPath, {promo_code,plan_id});

	}


	/** Pro Plans update to user */
	public planUpdateUser(planid:any, userid:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/plan_update_user';
	
		return this
			.http
			.put<HttpResponse<any>>(apiPath, {planid,userid})
			.map(resp => {

				let httpResponse = resp;
				
				return httpResponse;
			});
  
	}


	 /** User Plan Select */
	 public userPlanSelect(userid:any): Observable<HttpResponse<any>> {

		// console.log(password);
		// console.log(id);

	   let apiPath: string = 'users/user_plan_select';

	   //prepare HttpParams
	   let httpParams: HttpParams = new HttpParams().set("userid",userid);

	   return this
			   .http
			   .get<HttpResponse<any>>(apiPath, {params: httpParams});
   
   }


   /** Reply Notifications */
	// public notificationsReply(data:any): Observable<HttpResponse<any>> {
	
	// 	let apiPath: string = 'notifications/send_message_group_members';
	
	// 	return this
	// 		.http
	// 		.put<HttpResponse<any>>(apiPath, data)
	// 		.map(resp => {

	// 			let httpResponse = resp;
				
	// 			return httpResponse;
	// 		});
  
	// }



	public getFileInfo(fileURI: string): Promise<any> {
		console.log('check'+ fileURI);
		return new Promise((resolve, reject) => {
		  let fileName: string = fileURI.split('/').pop();
		  let directoryPath: string = fileURI.replace('/'+fileName, '');
		 console.log(fileName);
		  this.file.resolveDirectoryUrl(directoryPath).then(DirectoryEntry =>{
			console.log('DirectoryEntry', DirectoryEntry);
			this.file.getFile(DirectoryEntry, fileName, {}).then(fileEntry =>{
			  console.log('fileEntry', fileEntry);
			  fileEntry.file(file=>{
				console.log('file', file);
				resolve(file);
			  }, error => {resolve(null);});
			}, error => {resolve(null);});
		  }, error => {resolve(null);});
		});
	  }



	  //Profile image update
	public profileUpload(userId:any,imageName:any): Observable<HttpResponse<any>> {
	
		let apiPath: string = 'users/profile_image';
	
		return this
		.http
		.post<HttpResponse<any>>(apiPath, {userId,imageName});

  
	}

}

export interface NotificationInteface {
	notificationId : string,
	defaultId : string,
	profileImage? : string,
	joinKey: string,
	senderId : string,
	message: string,
	createdDate: number,
	attachment: AttachmentInterface,
	//profileImage:string,
	senderName:string
}

export interface AttachmentInterface {	
	link?: string,
	file?: {
		type: string,
		url: string
	}	
}
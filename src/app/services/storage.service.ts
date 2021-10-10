import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private http: HttpClient
  ) { }

  storeProfileData() {
    this.http.get('assets/json/profiles.json').subscribe((response) => {
      const profilesData = response;
      if (profilesData !== undefined) {
        localStorage.setItem('PROFILES', JSON.stringify(profilesData));
      }
    });
  }

  getProfileData() {
    const profilesData = localStorage.getItem('PROFILES');
    if(profilesData!==undefined) {
      return JSON.parse(profilesData);
    }
    return [];
  }
}

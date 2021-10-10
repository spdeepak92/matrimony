import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  slideOpts = {
    centeredSlides: true,
    speed: 400,
    loop: true,
    slidesPerView: Math.floor(window.innerWidth / 298),
  };
  profileData;

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.profileId) {
        this.profileData = this.storage.getProfileData().filter((profile) => profile.id === params.profileId)[0];
        console.log(this.profileData);
      }
    });
  }

  ngOnInit() {
  }

}

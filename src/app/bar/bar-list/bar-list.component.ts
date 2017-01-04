import { Component, OnInit, Input, 
          ElementRef, ViewChild }   from '@angular/core';
import { Observable }               from 'rxjs/Observable';
import { Subscription }             from 'rxjs/Subscription';

import { BarService, Bar }          from '../bar.service';
import { Auth, User }               from '../../auth.service';

@Component({
  selector: 'app-bar-list',
  templateUrl: './bar-list.component.html',
  styles: [` 
    .btn-going {
      margin-left: 15px;
      margin-top: 5px;
      height: 1.9em;
    }`]
})
export class BarListComponent implements OnInit {
  
  @ViewChild('location') 
  locationInput: ElementRef;
  
  @Input()
  public title: String = "";
  
  bars: Bar[];
  terms = 'bars';
  working = false;
  
  constructor(private barService: BarService, private auth: Auth) { }

  ngOnInit() {
    var lastLocation = localStorage.getItem('lastLocation');
    if(lastLocation && this.locationInput){
      this.locationInput.nativeElement.value = lastLocation;
      this.barService.search(this.terms, lastLocation)
        .subscribe((data) => { 
          this.bars = data; 
          var lastBar = localStorage.getItem('lastBar');
          if(lastBar){
            var bar = JSON.parse(lastBar);
            window.location.hash = bar.id;
          }
        });
    }
  }
  
  search(location: string){
    this.working = true;
    if(!location){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((pos: any) => {
          this.barService.search(this.terms, pos.coords.latitude, pos.coords.longitude)
            .subscribe((data) => { this.working = false; this.bars = data; });
        }, (err) => {
          console.log(err);
        })
      }  
    }else{
      this.barService.search(this.terms, location)
        .subscribe((data) => { this.working = false; this.bars = data; });
    }
  }
  
  attend(bar: Bar){
    localStorage.setItem('lastBar', JSON.stringify(bar));
    if(!this.auth.authenticated()){
      //if not authenticate, call Auth0 login
      this.auth.login();
    }else{
      this.working = true;
      
      //Get logged in user from WebStorage
      var strProfile = localStorage.getItem('profile');
      var lastLocation = localStorage.getItem('lastLocation');
      if(strProfile && lastLocation){
        var profile = JSON.parse(strProfile);
        var user = User.toUser(profile);
        
        this.barService.rsvp(user, this.terms, lastLocation, bar)
        .subscribe((data) => { 
          this.working = false;
          this.bars = data;
        });
      }
    }
  }
  
}

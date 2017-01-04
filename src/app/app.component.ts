import { Component, OnInit }      from '@angular/core';
import { BarService, Bar }        from './bar/bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  private title = 'NightLife Planner';
  
  constructor() { }
  
  ngOnInit() {
    
  }
  
}

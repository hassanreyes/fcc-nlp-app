import { Injectable }                         from "@angular/core";
import { Http, Response, Headers,
        RequestOptions, RequestOptionsArgs }  from "@angular/http";
import "rxjs/Rx";
import { Observable }                         from "rxjs";

import { User }                               from "../auth.service";

export class Bar {
    constructor(public name: string, public review?: string, public image_url?: string, public id?: string, public assistants: number = 0) { }
}

@Injectable()
export class BarService {
  public static BaseUrl: string = "https://camper-app-project-hassanreyes.c9users.io/bars";

  constructor(private http: Http) { }
  
  search(terms: string, loc: string, loc2?: string){
    
    console.log("searching...");
    
    let url = `${BarService.BaseUrl}/search/?term=${terms}`;
    if(loc2) url += `&latitude=${loc}&longitude=${loc2}`;
    else url += `&location=${loc}`;
    
    localStorage.setItem('lastLocation', loc);
    
    return this.http.get(url)
      .map((res: Response) => {
        let bars: Bar[] = [];
        
        bars = res.json().map((item) => {
          return new Bar(item.name, item.review, item.image_url, item.id, item.assistants);
        });
        
        return bars;
      })
      .catch((err: Response) => {
        console.log(err.json());
        return Observable.throw(err.json());
      });
  }
  
  rsvp(user: User, terms: string, location:string, bar: Bar){
    
    let url = `${BarService.BaseUrl}/rsvp`;
    const body = JSON.stringify({ user: user, bar: bar, term: terms, location: location });
    const headers = new Headers({'Content-Type': 'application/json'});
    
    return this.http.post(url, body, { headers: headers})
      .map((res: Response) => {
        let bars: Bar[] = [];
        
        bars = res.json().map((item) => {
          return new Bar(item.name, item.review, item.image_url, item.id, item.assistants);
        });
        
        return bars;
      })
      .catch((err: Response) => {
        console.log(err);
        return Observable.throw(err.json());
      });
  }
}

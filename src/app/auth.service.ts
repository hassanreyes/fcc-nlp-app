import { Injectable }             from "@angular/core";
import { Http, Response, Headers} from "@angular/http";
import { tokenNotExpired }        from "angular2-jwt";

// Avoid name not found warnings
declare var Auth0Lock: any;

export class User {
  constructor(public name: string, 
            public provider: string, 
            public provider_id: string, 
            public photo?: string, 
            public rsvps?: [any]) { }
  
  public static toUser(profile: any): User {
    return new User(profile.screen_name, 
                  profile.identities[0].provider, 
                  profile.identities[0].user_id, 
                  profile.picture);
  }
}

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock('nmoh8btIjLbulGPgPKbyIvzNuG3B89CL', 'hassanreyes.auth0.com', 
  {
      allowedConnections: ['twitter', 'facebook', 'linkedin'],
      allowSignUp: false,
      redirect: false
  });
  
  userProfile: Object;

  constructor(private http: Http) {
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult: any) => {
      console.log(authResult);
      localStorage.setItem('id_token', authResult.idToken);
      
      // Fetch profile information
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle error
          console.log(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        
        //Server SignUp
        const user = User.toUser(this.userProfile);
        const headers = new Headers({'Content-Type': 'application/json'});
        const body = JSON.stringify({ user: user });
        console.log("posting login: " + body);
        this.http.post('https://camper-app-project-hassanreyes.c9users.io/login', body, { headers: headers })
          .map((res: Response) => {
            console.log("login Response: " + res.json());
          })
      });
    });
  }

  public login(location?: string) {
    // Call the show method to display the widget.
    console.log("showing lock");
    this.lock.show({
      auth: {
        params: {location: location ? location : "" },
        redirect: false /*,
        redirectUrl: "https://camper-app-project-hassanreyes.c9users.io/login",
        responseMode: "form_post"*/
      }
    });
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
  }
}
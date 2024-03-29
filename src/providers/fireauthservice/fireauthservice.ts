import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

/*
  Generated class for the FireauthserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireauthserviceProvider {

  constructor(
    public router : Router,
    public afAuth: AngularFireAuth) 
    {
    console.log('Hello FireauthserviceProvider Provider');
  }
  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
 }

 doGoogleLogin() {
  return new Promise<any>((resolve, reject) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    this.afAuth.auth
    .signInWithPopup(provider)
    .then(res =>{
      resolve(res);
    });
  });
    }

doRegister(value) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
    .then(res => {
      resolve(res);
    }, err => reject(err));
  });
}

doLogin(value) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(value.email, value.password)
    .then(res => {
      resolve(res);
    }, err => reject(err));
  });
}

doLogout() {
  return new Promise((resolve, reject) => {
    if (firebase.auth().currentUser) {
      this.afAuth.auth.signOut();
      resolve();
    } else {
      reject();
    }
  });
}

doAuth(provider: any) {
  if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
  } else {
      this.afAuth.auth.signInWithRedirect(provider)
          .then(() => {
              return this.afAuth.auth.getRedirectResult().then(result => {
                  if (result.user) {
                    this.router.navigate(['/home']);
                  }
              }).catch(error => {
                  console.log('auth error', error);
              });
          });
  }
}
}

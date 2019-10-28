import { Component } from '@angular/core';
import {FireauthserviceProvider} from '../../providers/fireauthservice/fireauthservice';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  // moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls : ['/login.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';
  
  constructor(
     public authService : FireauthserviceProvider,
     private router: Router,
     private fb: FormBuilder,
   ) 
   {
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ngOnInit() {

  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
    .then(res => {
      this.router.navigate(['/home']);
    });
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
    .then(res => {
      this.router.navigate(['/home']);
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(['/home']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

}

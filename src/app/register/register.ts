import { Component } from '@angular/core';
import {FireauthserviceProvider} from '../../providers/fireauthservice/fireauthservice';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the RegisterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-register',
  templateUrl: '/register.html',
  styleUrls : ['/register.css']
})
export class RegisterComponent {

  text: string;
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    public authService: FireauthserviceProvider,
    private router: Router,
    private fb: FormBuilder) {
      this.createForm();
     }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
    .then(res => {
      this.router.navigate(['/home']);
    }, err => console.log(err)
    );
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
    .then(res => {
      this.router.navigate(['/home']);
    }, err => console.log(err)
    );
  }

  tryRegister(value) {
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = '';
      this.successMessage = 'Your account has been created';
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }

  goBack(){
    this.router.navigate(['/login']);
  }

}
